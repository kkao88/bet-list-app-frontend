require('../node_modules/dialog-polyfill/dialog-polyfill.css');

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import MainComponent from './components/Main.vue';
import EventEntry from './components/EventEntry.vue';

Vue.use(VueRouter);

Vue.config.productionTip = false;

const routes = [
    { path: '/', component: MainComponent },
    { path: '/cfbTab', component: MainComponent },
    { path: '/nflTab', component: MainComponent },
    { path: '/otherTab', component: MainComponent },
    { path: '/new', component: EventEntry }
];

const router = new VueRouter({
    routes // short for `routes: routes`
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
