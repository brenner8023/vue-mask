import Vue from "vue";
import AlloyFinger from "alloyfinger";
import AlloyFingerPlugin from "alloyfinger/vue/alloy_finger_vue";
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue({}); // 实现平行组件通信

Vue.use(AlloyFingerPlugin, {
  AlloyFinger
});

new Vue({
  render: h => h(App)
}).$mount("#app");
