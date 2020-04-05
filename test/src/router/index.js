import Vue from 'vue';
import Router from 'vue-router';
import Main from '../components/Main/Main.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'main',
      component: Main,
    },
  ],
});
