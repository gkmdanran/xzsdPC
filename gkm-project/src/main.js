// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import Vuex from 'vuex'

Vue.use(Vuex)

Vue.prototype.$http=axios
Vue.prototype.$http.defaults.baseURL = '/api'

Vue.config.productionTip = false
Vue.use(ElementUI);
/* eslint-disable no-new */
import { Message } from 'element-ui';

axios.interceptors.request.use(config=>{
  if(window.sessionStorage.getItem('xzsdtoken')){
    config.headers.Authorization=window.sessionStorage.getItem('xzsdtoken')
    
  }
  return config
})
axios.interceptors.response.use(function (response) {
  if(response){
   
    if(response.data.code==401){
      window.sessionStorage.clear()
      router.push({
        path:'/'
      })   
      Message({
        message: '长时间未操作，请重新登录！',
        type: 'success',
        duration:800,
      });   
    }
  }
  return response;
},
function (error) {
  return Promise.reject(error);
}
);


Vue.filter('getFormatDate',(value) =>{
  if(value!=null){
    var year = value.substr(0, 4)
    var month = value.substr(5, 2)
    var day = value.substr(8, 2)  
    return year + "年" + month + "月" + day + "日";
  }
  

})

Vue.filter('getFormatTime',(value) =>{
  if(value!=null){
    var year = value.substr(0, 4)
    var month = value.substr(5, 2)
    var day = value.substr(8, 2)
    var hour=value.substr(11, 2)
    var minute=value.substr(14, 2)
    var second=value.substr(17, 2)
    return year + "-" + month + "-" + day + ' '+hour+":"+minute+":"+second;
  }
  

})


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
