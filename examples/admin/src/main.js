import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'

Vue.use(ElementUI)
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 2000 };

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
