import Vue from 'vue';
import Axios from 'axios';
import PerfectScrollbar from 'perfect-scrollbar';
import Cookies from 'js-cookie';
import VueBus from '../../base/script/v-bus';

const GoogleMapsLoader = require('google-maps');

export default class Buy {
	constructor(parent) {
		this.parent = parent;
		GoogleMapsLoader.KEY = 'AIzaSyCmrATEGKc63ywaHY3-VZLhbfMZscLuIUs';
		GoogleMapsLoader.LANGUAGE = 'RU';
		GoogleMapsLoader.REGION = 'RU';
		if (window.INIT && window.INIT.buyPage) this.initVue();
	}

	initVue() {
		const mapStyle = [
			{
				featureType: 'administrative',
				elementType: 'geometry.fill',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'administrative',
				elementType: 'labels.text',
				stylers: [
					{
						visibility: 'on',
					},
					{
						color: '#8e8e8e',
					},
				],
			},
			{
				featureType: 'administrative',
				elementType: 'labels.text.fill',
				stylers: [
					{
						color: '#7f7f7f',
					},
				],
			},
			{
				featureType: 'administrative',
				elementType: 'labels.text.stroke',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'administrative.country',
				elementType: 'geometry.stroke',
				stylers: [
					{
						color: '#bebebe',
					},
				],
			},
			{
				featureType: 'administrative.province',
				elementType: 'geometry.stroke',
				stylers: [
					{
						visibility: 'on',
					},
					{
						color: '#cbcbcb',
					},
					{
						weight: '0.69',
					},
				],
			},
			{
				featureType: 'administrative.locality',
				elementType: 'geometry',
				stylers: [
					{
						visibility: 'simplified',
					},
				],
			},
			{
				featureType: 'landscape',
				elementType: 'all',
				stylers: [
					{
						color: '#e4e4e4',
					},
				],
			},
			{
				featureType: 'poi',
				elementType: 'all',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'road',
				elementType: 'all',
				stylers: [
					{
						saturation: -100,
					},
					{
						lightness: 45,
					},
					{
						visibility: 'simplified',
					},
				],
			},
			{
				featureType: 'road',
				elementType: 'geometry.stroke',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'road',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'road.highway',
				elementType: 'all',
				stylers: [
					{
						visibility: 'simplified',
					},
					{
						color: '#dadada',
					},
				],
			},
			{
				featureType: 'road.highway',
				elementType: 'labels',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'road.highway',
				elementType: 'labels.text',
				stylers: [
					{
						visibility: 'simplified',
					},
				],
			},
			{
				featureType: 'road.arterial',
				elementType: 'all',
				stylers: [
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'road.arterial',
				elementType: 'labels.text',
				stylers: [
					{
						visibility: 'simplified',
					},
				],
			},
			{
				featureType: 'road.arterial',
				elementType: 'labels.icon',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'road.local',
				elementType: 'all',
				stylers: [
					{
						visibility: 'simplified',
					},
				],
			},
			{
				featureType: 'road.local',
				elementType: 'geometry',
				stylers: [
					{
						color: '#eeeeee',
					},
				],
			},
			{
				featureType: 'road.local',
				elementType: 'labels.text',
				stylers: [
					{
						visibility: 'simplified',
					},
				],
			},
			{
				featureType: 'transit',
				elementType: 'all',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'all',
				stylers: [
					{
						color: '#cbcbcb',
					},
					{
						visibility: 'on',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'geometry.fill',
				stylers: [
					{
						color: '#d9d9d9',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'geometry.stroke',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'water',
				elementType: 'labels.text',
				stylers: [
					{
						visibility: 'simplified',
					},
				],
			},
		];
		new Vue({
			el: this.parent,
			data() {
				return {
					activeTab: 'map',
					info: window.INIT.buyPage,
					cities: [],
					products: [],
					filter: {},
					list: [],
					selected: false,
					markers: [],
					openedSelect: null,
				};
			},
			methods: {
				openPopup() {
					if (window.popupBid) window.popupBid.open();
				},
				changeTab(val) {
					this.activeTab = val;
				},
				districtSelect(value, text) {
					this.setSelect('district', value, text);
					this.updateCities(value);
				},
				citySelect(value, text) {
					this.setSelect('city', value, text);
					this.updateProducts(value);
				},
				updateCities(param) {
					let district = parseFloat(Cookies.get('district_id')) || 41;
					const city = parseFloat(Cookies.get('city_id')) || 202;
					if (param) {
						if (typeof param === 'object') district = param.value;
						if (param.length !== 0 && typeof param === 'string') district = parseFloat(param);
						if (param.length !== 0 && typeof param === 'number') district = param;
					}

					Axios.get(this.citiesURL, {
						params: {
							district,
							city,
						},
					}).then((response) => {
						this.cities = [];
						this.$set(this, 'cities', [...response.data]);
						this.cities.forEach((el) => {
							el.selected = el.value === city;
						});
						const selectedCity = this.cities.find(el => el.selected);
						if (!selectedCity) this.cities[0].selected = true;
						this.$set(this.filter, 'city', Object.assign({}, this.cities.find(el => el.selected)));

						this.updateProducts(this.filter.city.value);
					});
				},
				updateProducts(city) {
					Axios.get(this.productsURL, {
						params: {
							city,
						},
					}).then((resp) => {
						this.$set(this, 'products', [...resp.data]);
						const productOption = this.products.find(el => el.selected);
						if (!productOption) this.products[0].selected = true;
						this.$set(this.filter, 'product', Object.assign({}, this.products.find(el => el.selected)));

						this.$nextTick(this.submitForm());
					});
				},
				submitForm() {
					const filter = {};
					Object.keys(this.filter).forEach((key) => {
						filter[`${key}`] = this.filter[`${key}`].value;
					});
					Axios.get(this.action, {
						params: {
							filter,
						},
					}).then((response) => {
						this.list = response.data;
						[this.selected] = this.list;
						this.renderMarkers();
					});
				},
				renderMarkers() {
					if (this.google && this.gmap) {
						this.clearMarkers();

						this.list.forEach((element, index) => {
							const coords = new this.google.maps.LatLng(...(element.coords.split(',').map(item => parseFloat(item))));
							element.marker = new this.google.maps.Marker({
								position: coords,
								map: this.gmap,
								icon: element.icon,
							});
							this.bounds.extend(coords);
							this.gmap.fitBounds(this.bounds);
							if (index > 0) element.marker.setOpacity(0.6);
							this.markers.push(element.marker);
						});

						if (this.markers.length > 1) {
							this.markers.forEach((marker, index) => {
								marker.addListener('click', () => {
									this.markers.forEach(mark => mark.setOpacity(0.6));
									marker.setOpacity(1);
									this.selected = this.list[index];
								});
							});
						}

						if (this.markers.length === 1) this.gmap.setZoom(15);
					}
				},
				clearMarkers() {
					if (this.markers.length !== 0) {
						this.markers.forEach(marker => marker.setMap(null));
						this.markers = [];
						this.bounds = new this.google.maps.LatLngBounds();
					}
				},
				initSelects() {
					const selects = Array.from(this.$el.querySelectorAll('.buy-sidebar__select'));
					if (selects.length !== 0) {
						selects.forEach((select) => {
							select.name = select.getAttribute('name');
							const ps = select.querySelector('.ps');
							if (ps) {
								select.scrollbar = new PerfectScrollbar(ps, {
									wheelPropagation: false,
									suppressScrollX: true,
									wheelSpeed: 0.5,
								});
							}
						});
					}
					document.addEventListener('click', (e) => {
						const { target } = e;
						if (selects.length !== 0) {
							selects.forEach((select) => {
								const { name } = select;
								if (target === select || select.contains(target)) {
									this.openedSelect = this.openedSelect === name ? null : name;
									if (select.scrollbar) this.$nextTick(select.scrollbar.update());
								} else if (target !== select && this.openedSelect === name) {
									this.openedSelect = null;
								}
							});
						}
					});
				},
				setSelect(name, value, text) {
					if (!this.filter[`${name}`]) this.$set(this.filter, name, {});
					this.$set(this.filter[`${name}`], 'value', value);
					this.$set(this.filter[`${name}`], 'text', text);
				},
				initMap() {
					const centerCoords = new this.google.maps.LatLng(...(this.info.main.map.center.split(',').map(item => parseFloat(item))));
					this.gmap = new this.google.maps.Map(this.map, {
						disableDefaultUI: true,
						zoomControl: true,
						zoom: 14,
						center: centerCoords,
						styles: mapStyle,
					});
					this.gmap.setCenter(centerCoords);

					this.bounds = new this.google.maps.LatLngBounds();
					this.bounds.extend(centerCoords);
				},
			},
			created() {
				this.info.sidebar.form.fields.forEach((field) => {
					if (field.name === 'city') this.cities = [];
					if (field.options) {
						const selected = field.options.find(el => el.selected);
						this.$set(this.filter, `${field.name}`, selected);
					} else this.$set(this.filter, `${field.name}`, {});
				});
				this.action = this.info.sidebar.form.action;
				this.citiesURL = this.info.sidebar.form.citiesURL;
				this.productsURL = this.info.sidebar.form.productsURL;
			},
			mounted() {
				this.map = this.$refs.map;
				this.initSelects();

				GoogleMapsLoader.load((google) => {
					this.google = google;
					this.initMap();
				});

				VueBus.$on('selectGeo', (data) => {
					const districtObject = this.info.sidebar.form.fields.find(el => el.name === 'district');
					if (districtObject) {
						districtObject.options.forEach((option) => {
							option.selected = false;
						});
						const district = districtObject.options
							.find(el => parseFloat(el.value) === parseFloat(data.district));
						if (district) {
							district.selected = true;
							this.$set(this.filter, 'district', Object.assign({}, district));
							this.updateCities(this.filter.district);
						} else {
							this.updateCities();
						}
					}
				});
			},
		});
	}
}
