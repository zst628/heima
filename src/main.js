//导入vue
import Vue from 'vue'

//导入了App
import App from './App.vue'

//导入路由VuRouter
import VueRouter from 'vue-router'

//导入组件Vant
import Vant from 'vant'

//导入axios
import axios from "axios";

//导入组件Vant样式
import 'vant/lib/index.css'

//导入字体图标样式
import './style/index.css'

//导入组件
import test from './components/test.vue'

//导入login组件
import login from './views/login/login.vue'

//导入home组件
import home from './views/home/home.vue'

//导入searchResult组件
import searchResult from './views/searchResult/searchResult.vue'

//导入home子组件
import index from './views/home/index/index.vue'

import qa from './views/home/qa/qa.vue'

import video from './views/home/video/video.vue'

import my from './views/home/my/my.vue'

import detail from './views/detail/detail.vue'

//导入dayjs
import dayjs from 'dayjs'

//导入相对时间组件
import relativeTime from 'dayjs/plugin/relativeTime'

// 导入中文语言包
import 'dayjs/locale/zh-cn'

// 全局使用语言包
dayjs.locale('zh-cn')

//使用这个插件
dayjs.extend(relativeTime)

//使用dayjs
// console.log('------------------ dayjs 的使用 ---------------------');
//使用这个相对时间的插件
// dayjs.extend(relativeTime)
// var time = '2020-07-24T15:54:18'
//格式化时间
// var newTime = dayjs(time).format('YYYY-MM-DD hh:mm:ss')
// console.log(newTime);
// 得到相对时间
// var mytime = dayjs().from(dayjs(time))
//将语言转为中文
// console.log(mytime);
// console.log('------------------ dayjs 的使用 ---------------------');

//定义一个过滤器用来将绝对时间转化为相对时间
Vue.filter('mytime', function (value) {
  //value 就是使用过滤器的字符
  // 使用dayjs 将value 从绝对时间转化为相对时间
  return dayjs().from(dayjs(value))
})

//使用VueRouter
Vue.use(VueRouter)

// 使用 vant
Vue.use(Vant)

//定义路由
const routes = [
  { path: '/test', component: test },
  { path: '/login', component: login },
  {
    path: '/home', component: home, children: [
      { path: '/index', component: index },
      { path: '/qa', component: qa },
      { path: '/video', component: video },
      { path: '/my', component: my },
    ]
  },
  { path: '/detail', component: detail },
  { path: '/searchResult', component: searchResult },
]

//定义一个router对象
const router = new VueRouter({
  routes
})

//将axios挂载到vue的原型中
Vue.prototype.$http = axios

//创建一个vue实例
new Vue({
  render: h => h(App),//将App组件渲染到vue实例中
  //挂载路由
  router
}).$mount('#app')