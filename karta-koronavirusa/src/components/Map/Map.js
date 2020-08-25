import { loadYmap } from 'vue-yandex-maps';
import SvgEl from '@/core/SvgEl.vue';
import './map-marker.scss';
import './map-tooltip.scss';

export default {
  name: 'Map',
  components: {
    SvgEl,
  },
  props: {
    info: {
      type: Object,
      required: true,
      default: null,
    },
  },
  data: () => ({
    activeFilter: 'confirmed',
    isFullscreen: false,
    currentZoom: null,
    filter: Object.freeze([
      {
        text: 'Заболели',
        value: 'confirmed',
      },
      {
        text: 'Умерли',
        value: 'deaths',
      },
      {
        text: 'Вылечились',
        value: 'recovered',
      },
    ]),
    labelStates: Object.freeze({
      confirmed: [
        {
          zoom: '0_4',
          value: 100000,
        },
        {
          zoom: 5,
          value: 10000,
        },
        {
          zoom: 6,
          value: 1000,
        },
        {
          zoom: '7_23',
          value: 1,
        },
      ],
      deaths: [
        {
          zoom: '0_4',
          value: 10000,
        },
        {
          zoom: 5,
          value: 1000,
        },
        {
          zoom: 6,
          value: 100,
        },
        {
          zoom: '7_23',
          value: 1,
        },
      ],
      recovered: [
        {
          zoom: '0_4',
          value: 10000,
        },
        {
          zoom: 5,
          value: 1000,
        },
        {
          zoom: 6,
          value: 100,
        },
        {
          zoom: '7_23',
          value: 1,
        },
      ],
    }),
    tooltipOpened: false,
  }),
  computed: {
    regions() {
      return this.info;
    },
  },
  methods: {
    loadJS(url, onLoad) {
      const scriptTag = document.createElement('script');
      document.head.appendChild(scriptTag);
      scriptTag.src = url;
      if (onLoad) {
        scriptTag.onload = onLoad;
      }
    },
    getLabelsScript() {
      if (window.ymaps) {
        this.loadJS(
          'https://yastatic.net/s3/mapsapi-jslibs/area/0.0.1/util.calculateArea.min.js',
        );
        this.loadJS(
          'https://yastatic.net/s3/mapsapi-jslibs/polylabeler/1.0.2/polylabel.min.js',
          this.loadMap,
        );
      }
    },
    getLabelLayout(feature) {
      let renderCircle = '';

      if (feature.data) {
        const stat = feature.data[this.activeFilter];
        const circleClass = stat.size ? `map-marker__circle--${stat.size}` : '';
        renderCircle = `
          <div class="map-marker__circle map-marker__circle--${this.activeFilter} ${circleClass}">
              <span>${stat.value}</span>
          </div>
        `;
      }

      return `
        <div class="map-marker">
          ${renderCircle}
          <div class="map-marker__text">${feature.name}</div>
        </div>
      `;
    },
    getHintLayout(feature) {
      const renderData = feature.data ? `
        <div class="map-tooltip__data">
          <div class="map-tooltip__data-row">
            <span>Заболели:&nbsp;</span>
            <span>${feature.data.confirmed.value}</span>
          </div>
          <div class="map-tooltip__data-row">
            <span>Вылечились:&nbsp;</span>
            <span>${feature.data.recovered.value}</span>
          </div>
          <div class="map-tooltip__data-row">
            <span>Умерли:&nbsp;</span>
            <span>${feature.data.deaths.value}</span>
          </div>
        </div>
      ` : '';
      return ymaps.templateLayoutFactory.createClass(`
        <div class="map-tooltip">
          <div class="map-tooltip__title">${feature.name}</div>
          ${renderData}
        </div>
      `, {
        getShape() {
          const el = this.getElement();
          let result = null;
          if (el) {
            const firstChild = el.querySelector('.map-tooltip');
            result = new ymaps.shape.Rectangle(
              new ymaps.geometry.pixel.Rectangle([
                [0, 0],
                [firstChild.offsetWidth, firstChild.offsetHeight],
              ]),
            );
          }
          return result;
        },
      });
    },
    getLabelDotLayout(feature) {
      return `
        <div class="map-marker">
          <div class="map-marker__circle map-marker__circle--dot
           ${feature.data ? `map-marker__circle--${this.activeFilter}` : ''}"></div>
        </div>
      `;
    },
    getLabelVisibility(feature, num) {
      let template = 'none';
      if (feature.data) {
        template = 'dot';
        const stat = feature.data[this.activeFilter];
        const numStat = +(stat.value.replace(/\s/g, ''));
        if (numStat >= num) {
          template = 'label';
        }
      }
      return template;
    },
    getLabelOptions(feature) {
      return {
        labelLayout: this.getLabelLayout(feature),
        hintLayout: this.getHintLayout(feature),
        labelDotLayout: this.getLabelDotLayout(feature),
        labelForceVisible: this.labelStates[this.activeFilter].reduce((obj, elem) => {
          obj[elem.zoom] = this.getLabelVisibility(feature, elem.value);
          return obj;
        }, {}),
      };
    },
    loadMap() {
      ymaps.ready(['polylabel.create']).then(() => {
        this.yMap = new ymaps.Map(this.$refs.map, {
          center: [50, 10],
          zoom: 5,
          controls: [],
          type: null,
        }, {
          suppressMapOpenBlock: true,
          minZoom: 2,
          maxZoom: 7,
          restrictMapArea: [
            [86, -179],
            [-70, 179],
          ],
        });
        this.currentZoom = this.yMap.getZoom();
        this.yMap.events.add('boundschange', (e) => {
          this.currentZoom = e.get('newZoom');
        });

        this.fullscreenControl = new ymaps.control.FullscreenControl();
        this.yMap.controls.add(this.fullscreenControl, {
          visible: false,
        });

        const pane = new ymaps.pane.StaticPane(this.yMap, {
          zIndex: 100,
          css: {
            width: '100%', height: '100%', backgroundColor: '#EBF3FF',
          },
        });
        this.yMap.panes.append('background', pane);

        this.objectManager = new ymaps.ObjectManager();

        this.initLabels();
      });
    },
    initLabels() {
      const options = {
        labelDefaults: 'light',
        fillColor: '#a6c5dd',
        strokeColor: 'rgba(255, 255, 255, 0.8)',
        openHintOnHover: false,
        cursor: 'grab',
        labelCursor: 'pointer',
        labelDotCursor: 'pointer',
        labelPermissibleInaccuracyOfVisibility: 20,
      };

      this.regionsLabels = [...this.regions.features.map((feature) => {
        feature.options = {
          ...options,
          ...this.getLabelOptions(feature),
        };
        return feature;
      })];
      this.objectManager.add(this.regionsLabels);

      // eslint-disable-next-line new-cap
      const polylabel = new ymaps.polylabel.create(this.yMap, this.objectManager);

      // Подписываемся на события подписей.
      const events = window.innerWidth <= 1279 ? ['labelclick']
        : ['labelmouseenter', 'labelmouseleave'];
      this.objectManager.events.add(events, (event) => {
        const polygon = this.objectManager.objects.getById(event.get('objectId'));
        const state = polylabel.getLabelState(polygon);
        const centerProj = this.yMap.options.get('projection')
          .toGlobalPixels(state.get('center'), this.yMap.getZoom());
        if (event.get('type') === events[0]) {
          if (!this.objectManager.objects.hint.isOpen(polygon.id)) {
            this.objectManager.objects.hint.open(polygon.id, centerProj);
          }
        } else {
          this.objectManager.objects.hint.close();
        }
      });
      const debouncedHide = this.$utils.debounce(() => {
        this.tooltipOpened = false;
      }, 300);
      this.yMap.events.add(['hintopen', 'hintclose'], (event) => {
        if (window.innerWidth <= 1023) {
          if (event.get('type') === 'hintclose') {
            debouncedHide();
          } else {
            this.tooltipOpened = true;
          }
        }
      });

      this.yMap.geoObjects.add(this.objectManager);
      this.$emit('mapLoaded');
      document.addEventListener('click', (e) => {
        const { target } = e;
        const clickOutsideMap = target !== this.$el && !this.$el.contains(target);
        if (clickOutsideMap) {
          this.objectManager.objects.hint.close();
        }
      });
    },
    updateLabels() {
      this.objectManager.objects.each((polygon) => {
        this.objectManager.objects.setObjectOptions(polygon.id, {
          ...this.getLabelOptions(polygon),
        });
      });
    },
    toggleFullscreen() {
      if (this.isFullscreen) {
        this.fullscreenControl.exitFullscreen();
        this.isFullscreen = false;
      } else {
        this.fullscreenControl.enterFullscreen();
        this.isFullscreen = true;
      }
    },
    zoomMap(param) {
      this.yMap.setZoom(this.yMap.getZoom() - (param ? -1 : 1));
      this.currentZoom = this.yMap.getZoom();
    },
    setFilter(btn) {
      if (this.activeFilter !== btn.value) {
        this.activeFilter = btn.value;
        this.updateLabels();
      }

      window.dataLayer.push({
        event: 'passEventToGa',
        eventCategory: 'Спецпроект',
        eventAction: 'Карта коронавируса_кнопки',
        eventLabel: btn.text,
        eventValue: 1,
      });
    },
    controlClass(btn) {
      if (this.currentZoom) {
        const range = {
          /* eslint-disable */
          min: this.yMap.zoomRange._zoomRange[0],
          max: this.yMap.zoomRange._zoomRange[1],
          /* eslint-enable */
        };
        return this.currentZoom === range[btn] ? 'map__control--disabled' : '';
      }
      return '';
    },
  },
  async mounted() {
    await loadYmap({ ...this.settings });
    this.getLabelsScript();
    this.debounceZoom = this.$utils.debounce(this.zoomMap, 300);
  },
};
