import MarkerClusterer from '@google/markerclusterer';
import Vue from 'vue';
const GoogleMapsLoader = require('google-maps');
import vueTooltip from './tooltip/map-tooltip';

require('./map.scss');
require('./map-marker.scss');

const template = require('./map.pug');

function CustomMarker(
	map,
	marker
) {
	this.div = null;
	this.map = map;
	this.icon = marker.icon;
	this.iconActive = marker.iconActive;
	this.coords = marker.coords;
	this.type = marker.type;
	this.infoWindow = marker.infoWindow;
	this.id = marker.id;
	this.mainMarker = this.type === 'main';
	this.tooltipContent = marker.tooltip;
	this.tooltipSlider = null;
	this.isVisible = true;
	const self = this;
	this.mapWrapper = document.querySelector('.map');
	this.draw = () => {
		const overlayProjection = this.getProjection();
		const position = overlayProjection.fromLatLngToDivPixel(this.coords);
		this.div.style.left = `${position.x - (this.div.clientWidth / 2)}px`;
		this.div.style.top = `${position.y - (this.div.clientWidth / 1.5)}px`;
		if (this.type === 'main') {
			this.div.style.top = `${position.y - this.div.clientWidth}px`;
		}
	};
	this.onAdd = () => {
		const div = document.createElement('div');
		div.classList.add('map-marker');
		if (this.type) {
			div.setAttribute('data-type', this.type);
			if (this.mainMarker || this.type === 'default') {
				div.classList.add('map-marker--main');
			}
		}
		div.innerHTML = `<div class='map-marker__ico'></div>`;
		this.markerIco = div.querySelector('.map-marker__ico');
		if (this.icon) {
			this.markerIco.innerHTML = `<img src="${this.icon}" data-pin="${this.icon}" data-active="${this.iconActive}" alt="${this.type ? this.type : ''}">`;
			this.markerIcoImg = this.markerIco.querySelector('img');

			if (this.type !== 'default' && !this.mainMarker) {
				this.markerIco.classList.add('map-marker__ico--svg');
			}
		}

		if (this.tooltipContent) {
			div.insertAdjacentHTML('beforeend', '<div class="map-tooltip"></div>');
			this.tooltip = div.querySelector('.map-tooltip');
			const config = Object.assign({}, vueTooltip, {
				name: 'vueTooltip',
				el: this.tooltip,
				propsData: {
					info: this.tooltipContent,
				},
			});
			this.tooltipVue = new Vue(config);
			this.tooltipVue.$nextTick(() => {
				const tooltipClose = this.tooltipVue.$el.querySelector('.map-tooltip__close');
				tooltipClose.addEventListener('click', () => {
					this.closeTooltip();
				});
			});
		}

		if (this.infoWindow) {
			div.insertAdjacentHTML('beforeend', `<div class="map-marker__infowindow">${this.infoWindow}</div>`);
			this.infoWindowWrp = div.querySelector('.map-marker__infowindow');
		}

		this.markerIco.addEventListener('click', (e) => {
			e.preventDefault();

			if (this.tooltip) this.openTooltip()
			if (this.infoWindowWrp) this.toggleInfo();
		});

		this.div = div;
		const panes = this.getPanes();
		panes.overlayMouseTarget.appendChild(this.div);
	};

	this.setMap(map);

	this.toggleInfo = (open = true) => {
		if (open) {
			this.div.classList.add('map-marker--open-info');
		} else this.div.classList.remove('map-marker--open-info');
	};

	this.openTooltip = () => {
		this.div.classList.add('map-marker--open');
		this.tooltipVue.open();
		this.markerIcoImg.src = this.markerIcoImg.dataset.active;
		this.map.setCenter(this.coords);
		this.tooltipVue.$nextTick(() => {
			if (this.tooltipVue.$el.offsetHeight > this.mapWrapper.offsetHeight) {
				this.tooltipVue.initScrollBar(this.mapWrapper);
			}
		});
	};

	this.closeTooltip = () => {
		this.div.classList.remove('map-marker--open');
		this.markerIcoImg.src = this.markerIcoImg.dataset.pin;
		this.tooltipVue.close();
	};

	this.getPosition = () => this.coords;
	this.setVisible = (visible = true) => {
		if (!this.mainMarker) {
			if (visible) {
				this.div.style.display = null;
			} else this.div.style.display = 'none';
			this.isVisible = visible;
		}
	};
	this.getVisible = () => this.isVisible;
	this.remove = () => {
		this.removedChild = this.div.parentElement.removeChild(this.div);
		this.removedChild = null;
	};
}

export default template({
	data() {
		return {
			mapStyles: [
				{
					featureType: 'all',
					elementType: 'labels.text.fill',
					stylers: [{
						saturation: 36,
					},
						{
							color: '#333333',
						},
						{
							lightness: 40,
						},
					],
				},
				{
					featureType: 'all',
					elementType: 'labels.text.stroke',
					stylers: [{
						visibility: 'on',
					},
						{
							color: '#ffffff',
						},
						{
							lightness: 16,
						},
					],
				},
				{
					featureType: 'all',
					elementType: 'labels.icon',
					stylers: [{
						saturation: '-100',
					}, ],
				},
				{
					featureType: 'administrative',
					elementType: 'geometry.fill',
					stylers: [{
						color: '#ffffff',
					},
						{
							lightness: 20,
						},
					],
				},
				{
					featureType: 'administrative',
					elementType: 'geometry.stroke',
					stylers: [{
						color: '#d2d2d2',
					},
						{
							lightness: 17,
						},
						{
							weight: 1.2,
						},
					],
				},
				{
					featureType: 'landscape',
					elementType: 'geometry',
					stylers: [{
						saturation: '-100',
					},
						{
							gamma: '1.90',
						},
					],
				},
				{
					featureType: 'poi',
					elementType: 'geometry',
					stylers: [{
						color: '#f5f5f5',
					},
						{
							lightness: 21,
						},
					],
				},
				{
					featureType: 'poi',
					elementType: 'labels.icon',
					stylers: [{
						visibility: 'off',
					}, ],
				},
				{
					featureType: 'poi.government',
					elementType: 'labels.icon',
					stylers: [{
						visibility: 'on',
					}, ],
				},
				{
					featureType: 'poi.medical',
					elementType: 'labels.icon',
					stylers: [{
						visibility: 'on',
					}, ],
				},
				{
					featureType: 'poi.park',
					elementType: 'geometry',
					stylers: [{
						lightness: 21,
					},
						{
							gamma: '0.45',
						},
					],
				},
				{
					featureType: 'poi.place_of_worship',
					elementType: 'labels.icon',
					stylers: [{
						visibility: 'on',
					}, ],
				},
				{
					featureType: 'poi.school',
					elementType: 'labels.icon',
					stylers: [{
						visibility: 'on',
					}, ],
				},
				{
					featureType: 'poi.sports_complex',
					elementType: 'labels.icon',
					stylers: [{
						visibility: 'on',
					}, ],
				},
				{
					featureType: 'road',
					elementType: 'labels.icon',
					stylers: [{
						visibility: 'off',
					},
						{
							saturation: '-100',
						},
					],
				},
				{
					featureType: 'road.highway',
					elementType: 'geometry.fill',
					stylers: [{
						color: '#ffffff',
					},
						{
							lightness: 17,
						},
					],
				},
				{
					featureType: 'road.highway',
					elementType: 'geometry.stroke',
					stylers: [{
						color: '#ffffff',
					},
						{
							lightness: 29,
						},
						{
							weight: 0.2,
						},
					],
				},
				{
					featureType: 'road.arterial',
					elementType: 'geometry',
					stylers: [{
						color: '#ffffff',
					},
						{
							lightness: 18,
						},
					],
				},
				{
					featureType: 'road.local',
					elementType: 'geometry',
					stylers: [{
						color: '#ffffff',
					},
						{
							lightness: 16,
						},
					],
				},
				{
					featureType: 'transit',
					elementType: 'geometry',
					stylers: [{
						color: '#dfdfdf',
					},
						{
							lightness: 19,
						},
					],
				},
				{
					featureType: 'transit',
					elementType: 'labels.icon',
					stylers: [{
						visibility: 'on',
					},
						{
							saturation: '-100',
						},
					],
				},
				{
					featureType: 'water',
					elementType: 'geometry',
					stylers: [{
						saturation: '-85',
					},
						{
							lightness: '39',
						},
					],
				},
				{
					featureType: 'water',
					elementType: 'labels.icon',
					stylers: [{
						saturation: '-100',
					}, ],
				}
			],
			clusterStyles: [{
				url: '/assets/svg/map/cluster.svg',
				textColor: '#fff',
				textSize: '14',
				width: 47,
				height: 47,
				backgroundPosition: '-2px -1px',
			}],
			markers: [],
			gmap: null,
			google: null,
		}
	},
	methods: {
		initMap(google) {
			CustomMarker.prototype = new google.maps.OverlayView();
			this.centerCoords = new google.maps.LatLng(...(this.info.center.split(',').map(item => parseFloat(item))));

			this.gmap = new google.maps.Map(this.map, {
				disableDefaultUI: true,
				clickableIcons: false,
				zoom: this.info.zoom ? this.info.zoom : 14,
				center: this.centerCoords,
				styles: this.mapStyles,
				disableDoubleClickZoom: true,
				fullscreenControl: true,
				zoomControl: true
			});
			this.gmap.setCenter(this.centerCoords);

			this.bounds = new google.maps.LatLngBounds();
			this.bounds.extend(this.centerCoords);

			if (this.info.markers && this.info.markers.length > 0) {
				this.updateMarkers(this.info.markers);
			}
		},
		addCluster(markers) {
			let tmpMarkers = markers ? markers : this.markers;
			tmpMarkers = tmpMarkers.filter(marker => marker.type !== 'main');
			this.markersClusters = new MarkerClusterer(this.gmap, tmpMarkers, {
				styles: this.clusterStyles,
			});
		},
		updateCluster() {
			this.visibleMarkers = this.markers.filter(marker => marker.getVisible());
			if (this.visibleMarkers.length !== 0) {
				if (this.markersClusters) {
					this.markersClusters.clearMarkers();
					this.markersClusters = null;
				}

				if (this.visibleMarkers.length > 1) {
					this.bounds = new this.google.maps.LatLngBounds();
					this.visibleMarkers.forEach((marker) => {
						this.bounds.extend(marker.coords);
					});
					this.gmap.fitBounds(this.bounds);
				}
				this.gmap.setCenter(this.visibleMarkers[0].coords);

				this.addCluster(this.visibleMarkers);
			}
		},
		addMarker(marker) {
			marker.coords = new this.google.maps.LatLng(...(marker.coords).split(',').map(item => parseFloat(item)));
			const curMarker = new CustomMarker(
				this.gmap,
				marker,
			);
			this.markers.push(curMarker);
		},
		updateMarkers(markers) {
			if (this.google) {
				this.removeMarkers();

				if (markers.length !== 0) {
					this.bounds = new this.google.maps.LatLngBounds();
					markers.forEach((marker) => {
						this.addMarker(marker);
					});
					if (this.markers.length === 1) {
						this.gmap.setCenter(this.markers[0].coords);
					} else if (this.markers.length >= 2) {
						this.markers.forEach(marker => this.bounds.extend(marker.coords));
						this.gmap.fitBounds(this.bounds);
						this.addCluster();
					}

					this.google.maps.event.addDomListener(this.map, 'click', (e) => {
						const {
							target
						} = e;
						this.markers.forEach((marker) => {
							if (target !== marker.div && !marker.div.contains(target)) {
								if (marker.tooltip) marker.closeTooltip();
								if (marker.infoWindow) marker.toggleInfo(false);
							}
						});
					});
				}
			}
		},
		removeMarkers() {
			if (this.markers.length !== 0) {
				this.markers.forEach(marker => marker.setMap(null));
				this.markers = [];
				this.markersClusters.clearMarkers();
				this.markersClusters = null;
			}
		},
	},
	mounted() {
		this.map = this.$el;
		GoogleMapsLoader.KEY = 'AIzaSyCmrATEGKc63ywaHY3-VZLhbfMZscLuIUs';
		GoogleMapsLoader.LANGUAGE = 'RU';
		GoogleMapsLoader.REGION = 'RU';
		GoogleMapsLoader.VERSION = 3.36;
		GoogleMapsLoader.load((google) => {
			this.google = google;
			this.initMap(google);
		});
	},
	props: ['info', 'className'],
});
