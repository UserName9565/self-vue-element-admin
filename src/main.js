import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import vuescroll from 'vuescroll';
import '@/styles/index.scss' // global css
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import App from './App'
import store from './store'
import router from './router'
import agUtil from './utils/common'
import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import elementUIVerify from 'element-ui-verify'
import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}
Vue.prototype.agUtil = agUtil

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(elementUIVerify)
// Vue.use(vuescroll) //滚动条
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
