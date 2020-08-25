import Map from '@/components/Map/Map.vue';
import Main from '@/components/Main/Main.vue';
import Preloader from '@/components/Preloader.vue';
import Table from '@/components/Table/Table.vue';

export default {
  name: 'Home',
  components: {
    Table,
    Preloader,
    Main,
    Map,
  },
  data: (vm) => ({
    mapData: null,
    tableData: null,
    info: vm.$utils.loadJSON('main.json'),
    isLoading: true,
  }),
  methods: {
    getCircleSize(num) {
      const number = +num;
      let size = '';
      if (number >= 100 && number < 1000) {
        size = 'small';
      }
      if (number >= 1000 && number < 10000) {
        size = 'size_44';
      }
      if (number >= 10000 && number < 100000) {
        size = 'size_52';
      }
      if (number >= 100000 && number < 1000000) {
        size = 'size_60';
      }
      if (number >= 1000000 && number < 10000000) {
        size = 'size_72';
      }
      return size;
    },
    formatData(data, isMap = false) {
      if (!data) return null;

      return [...data.map((el) => ({
        ...el,
        name: el.shortname,
        data: this.formatNumbers(el.data, isMap),
      }))];
    },
    formatNumbers(data, isMap) {
      if (!data) return null;

      return Object.keys(data).reduce((obj, key) => {
        obj = {
          ...obj,
          [key]: isMap ? {
            value: data[key].toLocaleString(),
            size: this.getCircleSize(data[key]),
          } : data[key].toLocaleString(),
        };
        return obj;
      }, {});
    },
    hidePreloader() {
      this.isLoading = false;
    },
    async loadMapData() {
      const request = await this.$utils.api.get(this.info.api.map);
      if (request.status === 200) {
        return {
          ...request.data.countries,
          features: this.formatData(request.data.countries.features, true),
        };
      }
      return false;
    },
    async loadTableData() {
      const request = await this.$utils.api.get(this.info.api.table);
      if (request.status === 200) {
        return {
          date: request.data.date,
          global: this.formatNumbers(request.data.global),
          countries: this.formatData(request.data.countries),
        };
      }
      return false;
    },
    async initData() {
      const mapApi = await this.loadMapData();
      const tableApi = await this.loadTableData();
      if (tableApi && mapApi) {
        this.mapData = Object.freeze(mapApi);
        this.tableData = Object.freeze(tableApi);
      }
    },
  },
  mounted() {
    this.initData();
  },
};
