<template>
  <div
    class="container"
    ref="bgImg"
    :style="bgImg.style"
    @click="currentMaskIdx = -1"
  >
    <template v-if="!showNewAvatar">
      <div
        class="upload-wrap"
        @click="handleUploadClick"
        v-if="bgImg.style == null"
      >
        <div class="btn-upload"></div>
        <p>点击上传你的头像</p>
      </div>
      <template v-else>
        <div
          @click.stop="currentMaskIdx = idx"
          @touchstart="handleTouchStart"
          @touchmove.prevent="handleMaskMove(idx, $event)"
          v-for="(item, idx) in listOfMask"
          :key="idx"
          :style="{
            transform: `translateX(${item.x}px) translateY(${item.y}px) rotate(${item.r}deg) scale(${item.s})`
          }"
          :class="
            currentMaskIdx != idx
              ? ['mask-img-wrap']
              : ['mask-img-wrap', 'active']
          "
        >
          <img
            :src="item.imgUrl"
            alt="口罩图片"
            class="mask-img"
            :width="item.width"
            :height="item.height"
          />
          <template v-if="currentMaskIdx == idx">
            <div class="btn-close" @click="handleCloseBtnClick(idx)"></div>
            <div
              class="btn-rotate-scale"
              @touchstart.stop.prevent="handleTouchStart"
              @touchmove.prevent.stop="handleRotateScale(idx, $event)"
            ></div>
          </template>
        </div>
      </template>
      <input
        type="file"
        ref="inputUpload"
        multiple
        accept="image/*"
        @change="handleChange"
        style="display: none;"
      />
    </template>
    <img
      :src="newAvatar.imgUrl"
      alt="新头像"
      :width="`${newAvatar.width}px`"
      :height="`${newAvatar.height}px`"
      v-else
    />
  </div>
</template>

<script>
import domtoimage from "dom-to-image";

export default {
  name: "ImgShow",
  data() {
    return {
      listOfMask: [],
      currentMaskIdx: 0, // 当前获得焦点的口罩图片
      // 记录一开始手指触摸的位置信息
      start: {
        x: 0,
        y: 0
      },
      // 存储背景头像图片在页面中的信息
      bgImg: {
        width: 390,
        height: 390,
        imgUrl: "",
        style: null // 已上传图片的样式
      },
      showNewAvatar: false,
      // 绘制后的新头像的数据
      newAvatar: {
        imgUrl: "",
        width: 0,
        height: 0
      }
    };
  },
  created() {
    // 点击重新上传按钮触发回调
    this.$bus.$on("reupload", () => {
      this.handleUploadClick();
    });
    // 点击选择添加口罩
    this.$bus.$on("add-image", imgUrl => {
      this.$data.listOfMask.push({
        imgUrl,
        width: 135,
        height: 135,
        x: 130, // 控制图片水平移动
        y: 50, // 控制图片垂直移动
        r: 0, // 控制图片旋转
        s: 1 // 控制图片缩放
      });
      this.$data.currentMaskIdx = this.$data.listOfMask.length - 1;
    });
    // 绘制新头像
    this.$bus.$on("draw-avatar", () => {
      this.$data.currentMaskIdx = -1;

      domtoimage.toPng(this.$refs.bgImg).then(dataUrl => {
        this.$data.bgImg.style = { height: this.$data.bgImg.width };
        this.$data.newAvatar.imgUrl = dataUrl;
        this.$data.newAvatar.width = this.$data.bgImg.width;
        this.$data.newAvatar.height = this.$data.bgImg.height;
        this.$data.showNewAvatar = true;
      });
    });
  },
  methods: {
    // 图片上传后的回调函数
    handleChange(e) {
      let file = e.target.files[0],
        fr = new FileReader();

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
        };
      };
    },
    // 隐藏input[type="file"]元素，通过.click方法触发它
    handleUploadClick() {
      this.$refs["inputUpload"].click();
    },
    // 获取触摸点移动前后的距离
    getDistance(x, y) {
      return [x - this.$data.start.x, y - this.$data.start.y];
    },
    // 更新触摸点初始位置
    updateStartPos(x, y) {
      this.$data.start.x = x;
      this.$data.start.y = y;
    },
    // 图片移动
    handleMaskMove(idx, e) {
      let touch = e.touches[0],
        [distanceX, distanceY] = this.getDistance(touch.clientX, touch.clientY),
        resultX,
        resultY,
        mask = this.$data.listOfMask[idx];

      resultX = mask.x + distanceX;
      resultY = mask.y + distanceY;

      if (
        resultX >= 0 &&
        resultX <= this.$data.bgImg.width - mask.width &&
        resultY >= 0 &&
        resultY <= this.$data.bgImg.height - mask.height
      ) {
        mask.x = resultX;
        mask.y = resultY;
      }

      // 每一次都要更新触摸点的开始位置
      this.updateStartPos(touch.clientX, touch.clientY);
    },
    // 记录开始触摸时的位置坐标
    handleTouchStart(e) {
      let touch = e.touches[0];
      this.updateStartPos(touch.clientX, touch.clientY);
    },
    // 点击关闭按钮去除mask
    handleCloseBtnClick(idx) {
      this.$data.listOfMask.splice(idx, 1);
    },
    // 控制图片进行旋转和缩放
    handleRotateScale(idx, e) {
      let touch = e.touches[0],
        [distanceX, distanceY] = this.getDistance(touch.clientX, touch.clientY),
        mask = this.$data.listOfMask[idx],
        rotateDirection =
          this.$data.start.y * touch.clientX -
          this.$data.start.x * touch.clientY;

      mask.s += (distanceX + distanceY) / 300;

      if (rotateDirection > 0) {
        mask.r -= Math.abs(distanceY);
      } else if (rotateDirection < 0) {
        mask.r += Math.abs(distanceY);
      }

      this.updateStartPos(touch.clientX, touch.clientY);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 390px;
  background: rgb(240, 243, 245);
  position: relative;
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

.mask-img-wrap {
  position: absolute;
  left: 0;
  top: 0;

  .btn-close {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: absolute;
    left: -8px;
    top: -8px;
    background-image: url("../assets/img/btn-close.svg");
    background-color: #ffe411;
    background-size: contain;
  }
  .btn-rotate-scale {
    width: 16px;
    height: 16px;
    position: absolute;
    right: -8px;
    bottom: -8px;
    background-image: url("../assets/img/btn-rotate-scale.svg");
    background-color: #ffe411;
    background-size: contain;
    overscroll-behavior: contain;
  }
}
.mask-img {
  object-fit: contain;
}

.active {
  border: 2px dashed #ffe411;
}
</style>
