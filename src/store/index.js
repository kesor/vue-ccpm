import Vue from 'vue';
import Vuex from 'vuex';
import tasklist from './modules/tasklist';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tasklist,
  },
});
