import Vue from 'vue';
import './plugins/vuetify';
import VueRouter from 'vue-router';
import App from './App.vue';
import store from './store';
import Main from './components/MainComponent.vue';
import MoviesList from './components/MoviesList.vue';
import MovieDetails from './components/MovieDetails.vue';
import Favourites from './components/Favourites.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Main,
    children: [
      { path: '/', component: MoviesList },
      { path: '/favourites', component: Favourites },
      { path: '/details', component: MovieDetails },
    ],
  },
];

const router = new VueRouter({ routes });

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
  router,
}).$mount('#app');
