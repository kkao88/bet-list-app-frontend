require('../node_modules/dialog-polyfill/dialog-polyfill.css');

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css';
import App from './App.vue'

import MainComponent from './components/Main.vue';
import EventEntry from './components/EventEntry.vue';
import MassEventEntry from './components/MassEventEntry.vue';

Vue.use(VueRouter);
Vue.use(VueMaterial);

Vue.config.productionTip = false;

const routes = [
    { path: '/', component: MainComponent },
    { path: '/cfbTab', name: 'cfbTab', component: MainComponent },
    { path: '/nflTab', name: 'nflTab', component: MainComponent },
    { path: '/otherTab', name: 'otherTab', component: MainComponent },
    { path: '/new', name: 'new', component: EventEntry },
    { path: '/edit/:id', name: 'edit', component: EventEntry },
    { path: '/massEventEntry', name: 'massEventEntry', component: MassEventEntry },
];

const router = new VueRouter({
    routes // short for `routes: routes`
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
