import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue({}); // 实现平行组件通信

new Vue({
  render: h => h(App)
}).$mount("#app");
