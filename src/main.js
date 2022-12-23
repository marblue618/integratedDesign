import Vue from 'vue'
import App from './App.vue'
import router from './router' //引入vue-router
import ElementUI from 'element-ui';             //全局引入element
import 'element-ui/lib/theme-chalk/index.css';    //全局引入element的样式
//引入echarts
import * as echarts from 'echarts';
import '@/icons' // icon
Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);     //全局注入element
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
