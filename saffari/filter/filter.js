import debounce from 'lodash/debounce';
import URLSearchParams from 'url-search-params';
import vStore from '../../base/scripts/vue/v-store';
import cFilterRadio from './radio/filter-radio';
import cSelect from '../core/select/select';
import cLabel from '../core/label/label';
import cFilterRange from './range/filter-range';
import cFilterAddress from './address/filter-address';
import cAnimationHeight from '../core/animation/height/animation-height';
import cBtn from '../core/btn/btn';
import popupEvent from '../../base/scripts/popupEvent';
import filterCommon from './filterCommon';
import vueBus from '../../base/scripts/vue/v-bus';
import cHint from '../core/hint/hint';
import catalogConst from './catalog/catalog-const';

require('./filter.scss');

const template = require('./filter.pug');

export default template({
  components: {
    cFilterRadio,
    cSelect,
    cFilterRange,
    cFilterAddress,
    cAnimationHeight,
    cBtn,
    cLabel,
    cHint
  },
  mixins: [
    filterCommon,
  ],
  data() {
    return {
      activeTab: '',
      showMore: false,
      init: true,
      filter: {}
    }
  },
  watch: {
    filter: {
      handler() {
        this.submitEventDebounce();
      },
      deep: true,
    },
  },
  computed: {
    mainFields() {
      return this.showFields(this.info.tabs.find(el => el.name === this.activeTab).fields);
    },
    moreFields() {
      return this.showFields(this.info.tabs.find(el => el.name === this.activeTab).more);
    },
    visibleButtons() {
      return this.showFields(this.info.tabs.find(el => el.name === this.activeTab).popupButtons);
    },
    special() {
      const tab = this.info.tabs.find(el => el.name === this.activeTab);
      let tmp = false;
      if (tab.tags && tab.tags.special && tab.tags.special.length !== 0) {
        tmp = tab.tags.special.map((item) => {
          item.checked = this.filter && this.filter.tags ? (this.filter.tags.indexOf(item.value) !== -1) : false;
          return item;
        });
      }
      return tmp;
    },
  },
  methods: {
    openPopup(name) {
      popupEvent.openAsync('area', Object.assign({}, name, {
        tabs: this.info.tabs.find(el => el.name === this.activeTab).popupButtons
      }), '', 'popup__wrapper--area');
    },
    toggleMore() {
      this.showMore = !this.showMore;
    },
    setTag(tag) {
      if (!this.filter.tags) this.$set(this.filter, 'tags', []);
      if (tag.checked) {
        this.filter.tags.push(tag.value);
      } else {
        const index = this.filter.tags.indexOf(tag.value);
        this.filter.tags.splice(index, 1);
      }
      this.submitEventDebounce();
    },
    changeTab(val) {
      this.showMore = false;
      this.activeTab = val;

      if (val) this.updateFilter();
    },
    submitFilter() {
      if (this.init) {
        this.$emit('filterSubmit', this.info.action, this.clearFilter, true, true);
        this.init = false;
      } else this.$emit('filterSubmit', this.info.action, this.clearFilter);
    },
    setPopupFields(params) {
      this.fields.forEach((item) => {
        if (params[item]) {
          this.$set(this.filter, item, params[item]);
        } else {
          this.$delete(this.filter, item);
        }
      });
      vStore.commit('saveFilter', this.clearFilter);
    },
    updateButtonCount(type, count) {
      if (this.visibleButtons && this.visibleButtons.length !== 0) {
        const button = this.visibleButtons.find(el => el.popup === type);
        const countText = count === 'reset' ? false : count;
        if (button) this.$set(button, 'count', countText);
      }
      if (count !== 'reset') this.submitFilter();
    },
    initField(item) {
      if (item.type !== 'button') {
        if (item.type !== 'range') {
          if (item.type === 'hidden') {
            this.$set(this.filter, item.name, item.value);
          } else {
            this.updateValue(item);
          }
        }
      }
    },
  },
  created() {
    this.fields = catalogConst.fields;
    const currentTab = this.info.tabs.find((el) => el.active);
    this.activeTab = currentTab.name;
    this.submitEventDebounce = debounce(this.submitFilter, 500);
    if (this.info.params !== undefined) {
      Object.keys(this.info.params).forEach((key) => {
        this.$set(this.filter, key, this.info.params[key]);
      });
    }
    const params = new URLSearchParams(window.location.search);
    if (params.has('realty_type')) {
      this.activeTab = params.get('realty_type');
    }
    params.forEach((value, name) => {
      if (name.indexOf('[]') !== -1) {
        const tmpName = name.replace('[]', '');
        if (this.filter[tmpName] === undefined) {
          this.$set(this.filter, tmpName, []);
        }
        this.filter[tmpName].push(value);
      } else {
        this.$set(this.filter, name, value);
      }
    });
    vStore.commit('saveFilter', this.clearFilter);
    const tab = this.info.tabs.find((item) => item.name === this.activeTab);
    tab.fields.forEach((item) => {
      this.initField(item);
    });

    if (tab.more && tab.more.length !== 0) {
      tab.more.forEach((item) => {
        this.initField(item);
      });
    }
  },
  mounted() {
    vueBus.$on('setMetro', (params, count) => {
      this.setPopupFields(params);
      this.updateButtonCount('popupAreaMetro', count);
    });
    vueBus.$on('setDistrict', (params, count) => {
      this.setPopupFields(params);
      this.updateButtonCount('popupAreaDistrict', count);
    });
    vueBus.$on('setCountryCity', (params, count) => {
      this.setPopupFields(params);
      this.updateButtonCount('popupCountryCity', count);
    });
    if (this.clearFilter.metro) {
      this.updateButtonCount('popupAreaMetro', this.clearFilter.metro.length);
    }
    if (this.clearFilter.locality || this.clearFilter.transport_ring || this.clearFilter.district) {
      const count = [];
      if (this.clearFilter.locality) count.push(...this.clearFilter.locality);
      if (this.clearFilter.transport_ring) count.push(...this.clearFilter.transport_ring);
      if (this.clearFilter.district) count.push(...this.clearFilter.district);
      this.updateButtonCount('popupAreaDistrict', count.length);
    }
    if (this.clearFilter.country || this.clearFilter.city) {
      const count = [];
      if (this.clearFilter.country) count.push(...this.clearFilter.country);
      if (this.clearFilter.city) count.push(...this.clearFilter.city);
      this.updateButtonCount('popupCountryCity', count.length);
    }
  },
  props: ['info', 'className'],
});
