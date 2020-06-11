import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import Vuelidate from 'vuelidate'
import router from './router'
import store from './store'

Vue.use(Vuelidate)

axios.defaults.baseURL = 'https://vuejs-http-18581.firebaseio.com';
//axios.defaults.headers.common['Authorization'] = 'timothy';
//axios.defaults.headers.common['Approves'] = 'julie';
//axios.defaults.headers.get['Accepts'] = 'application/json';

// axios.interceptors.request.use(config => {
//   config.headers['authorization'] = 'okooboh'
//   console.log('REQUEST_INTERCEPTOR', config);
//   return config
// })
// axios.interceptors.response.use(res => {
//   console.log('RESPONSE_INTERCEPTOR', res);
//   return res
// })

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
