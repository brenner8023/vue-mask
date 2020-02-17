<template>
  <div id="app">
    <ImgShow />
    <ImgEdit />
  </div>
</template>

<script>
import ImgShow from "./components/ImgShow.vue";
import ImgEdit from "./components/ImgEdit.vue";
import * as faceapi from "face-api.js";

export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    ImgEdit,
    ImgShow
  },
  created() {
    // this.init();
    document.body.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault(); // 阻止默认的处理方式(阻止下拉滑动的效果)
      },
      { passive: false }
    ); // passive 参数不能省略，用来兼容ios和android
  },
  methods: {
    async init() {
      await faceapi.nets.ssdMobilenetv1.load("@/assets/weights");
    },
    handleReupload() {
      this.$data.isReupload++;
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/reset.scss";

#app {
  max-width: 750px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px auto;
  padding: 0 14px;
}

.btn {
  width: 110px;
  height: 44px;
  line-height: 44px;
  border-radius: 10px;
  box-shadow: 0 0 10px #ccc;
}
</style>
