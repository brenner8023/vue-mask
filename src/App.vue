<template>
  <div id="app">
    <Toast v-if="isShowToast">{{ toastMessage }}</Toast>
    <ImgShow />
    <ImgConsole />
  </div>
</template>

<script>
import ImgShow from "./components/ImgShow.vue";
import ImgConsole from "./components/ImgConsole.vue";
import Toast from "./components/Toast";
import * as faceapi from "face-api.js";

export default {
  name: "App",
  data() {
    return {
      isShowToast: false,
      toastMessage: ""
    };
  },
  components: {
    ImgConsole,
    ImgShow,
    Toast
  },
  created() {
    // this.init();
    this.$bus.$on("show-toast", message => {
      this.$data.toastMessage = message;
      this.$data.isShowToast = true;
      let timer = setTimeout(() => {
        this.$data.isShowToast = false;
        clearTimeout(timer);
      }, 1500);
    });
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
