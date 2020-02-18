<template>
  <div
    class="container"
    ref="bgImg"
    :style="bgImg.style"
    @click="notEditable--"
  >
    <div class="upload-wrap" @click="handleUploadClick" v-show="!isShowBgImg">
      <div class="btn-upload"></div>
      <p>点击上传你的头像</p>
      <input
        type="file"
        ref="inputUpload"
        multiple
        accept="image/*"
        @change="handleImgUploadChange"
        style="display: none;"
      />
    </div>
    <MaskEdit :not-editable="notEditable" :is-show-bg-img="isShowBgImg" />
    <img
      class="new-avatar"
      :src="newAvatar.imgUrl"
      alt="新头像"
      :width="newAvatar.width"
      :height="newAvatar.height"
      v-show="isShowNewAvatar"
    />
  </div>
</template>

<script>
import MC from "mcanvas";
import MaskEdit from "./MaskEdit";

export default {
  name: "ImgShow",
  data() {
    return {
      isShowBgImg: false, // 判断是否显示背景图片
      // 存储背景头像图片在页面中的信息
      bgImg: {
        width: 390,
        height: 390,
        imgUrl: null,
        style: null // 已上传图片的样式
      },
      notEditable: 0, // 用来设置点击背景图片后，口罩编辑样式失效
      isShowNewAvatar: false, // 判断是否显示新的合成头像
      // 绘制后的新头像的数据
      newAvatar: {
        imgUrl: null,
        width: 390,
        height: 390
      }
    };
  },
  components: {
    MaskEdit
  },
  created() {
    // 点击重新上传按钮触发回调
    this.$bus.$on("reupload", () => {
      this.$data.isShowNewAvatar = false;
      this.$data.isShowBgImg = false;
      this.$children[0].$data.listOfMask = [];
      this.handleUploadClick();
    });
    // 绘制新头像
    this.$bus.$on("draw-avatar", () => {
      if (this.$data.isShowBgImg) {
        let listOfMask = this.$children[0].listOfMask,
          mc = new MC({
            width: this.$data.bgImg.width,
            height: this.$data.bgImg.height
          }),
          // canvas设置背景图初始化
          mypromise = mc.background(this.$data.bgImg.imgUrl, {
            left: 0,
            top: 0,
            type: "contain"
          });

        // 往canvas添加口罩图片
        listOfMask.forEach(item => {
          mypromise = mypromise.add(item.imgUrl, {
            width: item.width,
            height: item.height,
            pos: {
              x: item.x,
              y: item.y,
              scale: item.s,
              rotate: item.r
            }
          });
        });
        mypromise.draw({
          type: "png",
          quality: 1,
          success: base64 => {
            this.$data.newAvatar.imgUrl = base64;
            this.$data.newAvatar.width = this.$data.bgImg.width;
            this.$data.newAvatar.height = this.$data.bgImg.height;
            this.$data.isShowNewAvatar = true;
            this.$data.bgImg.style = { height: this.$data.bgImg.height };
            this.$bus.$emit("draw-success");
          }
        });
      } else {
        this.$bus.$emit("show-toast", "请先上传图片!");
      }
    });
  },
  methods: {
    // 图片上传后的回调函数
    handleImgUploadChange(e) {
      let file = e.target.files[0],
        fr = new FileReader();

      // 判断当前是否显示了合成头像，如果是则屏蔽掉
      if (this.$data.isShowNewAvatar) this.$data.isShowNewAvatar = false;
      // 判断是否是图片还是其它文件
      if (!/image.*/.test(file.type)) {
        return false;
      }

      fr.readAsDataURL(file);
      fr.onload = e => {
        let img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          // 计算图片显示出来的高度
          let height = img.height * (this.$refs.bgImg.offsetWidth / img.width);

          this.$data.bgImg.height = height;
          this.$data.bgImg.width = this.$refs.bgImg.offsetWidth;
          this.$data.bgImg.imgUrl = e.target.result;
          this.$data.bgImg.style = {
            backgroundImage: `url(${e.target.result})`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            height: `${height}px`
          };
          this.$data.isShowBgImg = true;
        };
      };
    },
    // 隐藏input[type="file"]元素，通过.click方法触发它
    handleUploadClick() {
      this.$refs["inputUpload"].click();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 390px;
  background: rgb(240, 243, 245);
  position: relative;
  overflow: hidden;
}

.upload-wrap {
  width: 150px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.btn-upload {
  width: 93px;
  height: 64px;
  background: url("../assets/img/upload.png") center;
  margin: 0 auto;
  margin-bottom: 10px;
}

.new-avatar {
  position: absolute;
  left: 0%;
  top: 0%;
}
</style>
