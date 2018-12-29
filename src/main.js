import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'vuetify/dist/vuetify.min.css'
import 'vuetify/dist/vuetify.min.js'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

Vue.use(Vuetify)

Vue.use(VueAxios, axios)

import Home from './components/Home.vue'

const routes = [{
    path: '/home',
    name: 'home',
    component: Home,
    alias: ''
}]

const router = new VueRouter({
    routes
})

new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
