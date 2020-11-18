import '@/assets/css/main2.css'

import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import smoothscroll from 'smoothscroll-polyfill'
import App from './App.vue'
import router from './router'
import store from './store'

smoothscroll.polyfill()

Vue.use(VueAnalytics, {
    id: 'UA-172375796-1',
    router
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
