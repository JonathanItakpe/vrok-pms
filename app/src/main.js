// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import toastr from 'toastr'
import lodash from 'lodash'
import moment from 'moment'

// Set up prototypes
Vue.prototype.$axios = axios
Vue.prototype.$toastr = toastr
Vue.prototype.$_ = lodash
Vue.prototype.$moment = moment

// Axios base url set up
Vue.prototype.$axios.defaults.baseURL = process.env.API_URL

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
