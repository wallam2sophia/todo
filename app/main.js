import Vue from 'vue'
import App from './App'
import { getJSON, postJSON } from "./utils/request.js"
import Notify from './wxcomponents/vant-weapp/notify/notify.js';
Vue.config.productionTip = false
Vue.prototype.getJSON = getJSON
Vue.prototype.postJSON = postJSON
Vue.prototype.Notify = Notify
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
