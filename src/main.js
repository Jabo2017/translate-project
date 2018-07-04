// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Axios from 'Axios'

Vue.prototype.$axios = Axios

//全局配置
//Axios.defaults.baseURL = "https://api.douban.com";
Axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// 发送请求前处理request的数据
Axios.defaults.transformRequest = [function(data) {
  // Do whatever you want to transform the data
  var newData = '';
  for (var k in data) {
    newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
  }
  return newData;
}]


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
