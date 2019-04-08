import Vue from 'vue';
import Vuex from 'vuex';
import movies from './modules/movies';

Vue.use(Vuex);

// Easier to add new modules later than to mix it all together.
// All the current logic seems appropriate to store in the one module though.

export default new Vuex.Store({
  modules: {
    movies,
  },
});
