import Vue from 'vue';
import Router from 'vue-router';
import Diet from '@/components/Diet';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Diet',
      component: Diet,
    },
  ],
});
