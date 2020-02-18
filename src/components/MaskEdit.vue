<template>
  <div v-show="listOfMask.length > 0">
    <div
      v-finger:rotate="
        editMaskIdx == idx ? handleRotateImg.bind(this, idx) : null
      "
      @touchstart="handleMaskTouchStart"
      @touchmove.stop.prevent="
        editMaskIdx == idx ? handleMaskTouchMove(idx, $event) : null
      "
      @click.stop="editMaskIdx = idx"
      v-for="(item, idx) in listOfMask"
      :key="idx"
      :style="{
        transform: `translateX(${item.x}px) translateY(${item.y}px) rotate(${item.r}deg) scale(${item.s})`
      }"
      :class="getMaskWrapClass(idx)"
    >
      <img
        :src="item.imgUrl"
        alt="口罩图片"
        class="mask-img"
        :width="item.width"
        :height="item.height"
        crossorigin="anonymous"
      />
      <div
        class="btn-close"
        @click="handleCloseBtnClick(idx)"
        v-if="editMaskIdx == idx"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MaskEdit",
  props: ["notEditable", "isShowBgImg"],
  data() {
    return {
      listOfMask: [], // 存储已添加到图片编辑区的口罩
      editMaskIdx: 0, // 当前获得编辑功能的口罩图片索引
      // 记录前一次触摸点的位置信息
      oldPos: [
        {
          x: 0,
          y: 0
        },
        // 第二个元素存储的是双指触摸时的数据
        {
          x: 0,
          y: 0
        }
      ],
      // 存储双指触摸时两个触摸点之间的距离
      oldDistance: 0
    };
  },
  watch: {
    // 点击背景图片，口罩编辑样式失效
    notEditable() {
      this.$data.editMaskIdx = -1;
    }
  },
  created() {
    // 点击选择添加口罩
    this.$bus.$on("add-mask", imgUrl => {
      if (this.isShowBgImg) {
        this.$data.listOfMask.push({
          imgUrl,
          width: 135,
          height: 135,
          x: 130, // 控制图片水平移动
          y: 50, // 控制图片垂直移动
          r: 0, // 控制图片旋转
          s: 1 // 控制图片缩放
        });
        this.$data.editMaskIdx = this.$data.listOfMask.length - 1;
      } else {
        this.$bus.$emit("show-toast", "请先上传图片!");
      }
    });
  },
  methods: {
    // 获得口罩的css类
    getMaskWrapClass(maskIdx) {
      return this.$data.editMaskIdx != maskIdx
        ? ["mask-img-wrap"]
        : ["mask-img-wrap", "edit-enable"];
    },
    // 更新触摸点初始位置
    updateOldPos(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
      this.$data.oldPos[0].x = x1;
      this.$data.oldPos[0].y = y1;
      this.$data.oldPos[1].x = x2;
      this.$data.oldPos[1].y = y2;
    },
    // 获取两点间距离
    getDistance(x1, y1, x2, y2) {
      return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
    },
    handleMaskTouchStart(e) {
      if (e.touches.length == 1) {
        let touch = e.touches[0];
        this.updateOldPos(touch.clientX, touch.clientY);
      } else {
        let [touch1, touch2] = [e.touches[0], e.touches[1]];
        // 更新距离
        this.$data.oldDistance = this.getDistance(
          touch1.clientX,
          touch1.clientY,
          touch2.clientX,
          touch2.clientY
        );
        // 更新两点的坐标数据
        this.updateOldPos(
          touch1.clientX,
          touch1.clientY,
          touch2.clientX,
          touch2.clientY
        );
      }
    },
    handleMaskTouchMove(idx, e) {
      if (e.touches.length == 1) {
        this.moveImage(idx, e.touches[0]);
      } else {
        this.scaleImage(idx, e.touches[0], e.touches[1]);
      }
    },
    // 控制图片移动
    moveImage(imgIdx, touch) {
      let [distanceX, distanceY] = [
          touch.clientX - this.$data.oldPos[0].x,
          touch.clientY - this.$data.oldPos[0].y
        ],
        mask = this.$data.listOfMask[imgIdx];

      mask.x += distanceX;
      mask.y += distanceY;

      // 每一次都要更新触摸点的开始位置
      this.updateOldPos(touch.clientX, touch.clientY);
    },
    // 控制图片缩放
    scaleImage(imgIdx, touch1, touch2) {
      let mask = this.$data.listOfMask[imgIdx],
        oldDistance = this.$data.oldDistance,
        currentDistance = this.getDistance(
          touch1.clientX,
          touch1.clientY,
          touch2.clientX,
          touch2.clientY
        ),
        distance = Math.sqrt(currentDistance) - Math.sqrt(oldDistance);

      mask.s += 0.1 * (distance / 10);

      this.$data.oldDistance = currentDistance;
    },
    // 旋转图片
    handleRotateImg(imgIdx, e) {
      e.preventDefault();
      let mask = this.$data.listOfMask[imgIdx];
      mask.r += e.angle;
    },
    // 点击关闭按钮去除mask
    handleCloseBtnClick(idx) {
      this.$data.listOfMask.splice(idx, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.mask-img-wrap {
  width: fit-content;
  height: fit-content;
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
}
.mask-img {
  object-fit: contain;
}

.edit-enable {
  outline: 2px dashed #ffe411;
}
</style>
