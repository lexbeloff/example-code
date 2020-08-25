import Vue from 'vue';
import VueLazyLoad from 'vue-lazyload';
import YmapPlugin from 'vue-yandex-maps';

import loadAsset from '@/utils/loadAsset';
import api from '@/utils/api';
import debounce from '@/utils/debounce';

import App from './App.vue';

Vue.use(YmapPlugin, {
  apiKey: '',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1',
});

const SocialSharing = require('@/utils/share');
const VueScrollTo = require('vue-scrollto');

Vue.use(VueLazyLoad, {
  preLoad: 1.7,
});
Vue.use(SocialSharing);
Vue.use(VueScrollTo, {
  container: 'body',
  duration: 1000,
  easing: 'ease',
  offset: 0,
  force: true,
  cancelable: true,
  x: false,
  y: true,
});

Vue.config.productionTip = false;
Vue.prototype.$utils = {
  loadAsset,
  api,
  debounce,
  loadJSON(filename) {
    return Object.freeze(require(`@/data/${filename}`));
  },
};

new Vue({
  render: (h) => h(App),
}).$mount('#app');
