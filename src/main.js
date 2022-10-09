import Vue from 'vue'
import App from './App.vue'
import moment from 'moment';
import io from 'socket.io-client';


Vue.config.productionTip = false

Vue.prototype.$moment = moment;

Vue.prototype.$socket = io(`http://localhost:${process.env.VUE_APP_SOCKET_PORT}`);

new Vue({
  render: h => h(App),
}).$mount('#app')
