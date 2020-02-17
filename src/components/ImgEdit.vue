<template>
  <div class="container">
    <ul class="things-list">
      <li
        class="things-item"
        v-for="(item, idx) in listOfThings"
        :key="item.name"
        :style="{ backgroundImage: `url(${item.imgUrl})` }"
        @click="handleSelectClick(idx)"
      ></li>
    </ul>
    <div class="btn-wrap">
      <div class="btn reupload" role="button" @click="handleReuploadClick">
        重新上传
      </div>
      <div class="btn g-avatar" role="button" @click="handleNewAvatarClick">
        生成新头像
      </div>
    </div>
  </div>
</template>

<script>
import mask1 from "@/assets/img/mask-1.png";
import mask2 from "@/assets/img/mask-2.png";
import mask3 from "@/assets/img/mask-3.png";
import mask4 from "@/assets/img/mask-4.png";
import mask5 from "@/assets/img/mask-5.png";
import mask6 from "@/assets/img/mask-6.png";
import mask7 from "@/assets/img/mask-7.png";
import glasses1 from "@/assets/img/glasses-1.png";
import glasses2 from "@/assets/img/glasses-2.png";
import clothes from "@/assets/img/clothes.png";

export default {
  name: "ImgEdit",
  data() {
    return {
      // 存储口罩护目镜防护服图片的信息
      listOfThings: [
        {
          name: "mask-1",
          imgUrl: mask1
        },
        {
          name: "mask-7",
          imgUrl: mask7
        },
        {
          name: "glasses-1",
          imgUrl: glasses1
        },
        {
          name: "glasses-2",
          imgUrl: glasses2
        },
        {
          name: "mask-5",
          imgUrl: mask5
        },
        {
          name: "mask-6",
          imgUrl: mask6
        },
        {
          name: "mask-2",
          imgUrl: mask2
        },
        {
          name: "mask-3",
          imgUrl: mask3
        },
        {
          name: "mask-4",
          imgUrl: mask4
        },
        {
          name: "clothes",
          imgUrl: clothes
        }
      ]
    };
  },
  methods: {
    // 通知父组件点击了重新上传按钮
    handleReuploadClick() {
      this.$bus.$emit("reupload");
    },
    // 点击物品图片进行选择
    handleSelectClick(idx) {
      this.$bus.$emit("add-image", this.$data.listOfThings[idx].imgUrl);
    },
    handleNewAvatarClick() {
      this.$bus.$emit("draw-avatar");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.things-list {
  width: 100%;
  height: 80px;
  overflow-x: scroll;
  display: flex;
  align-items: center;
  margin: 20px auto;
}

.things-item {
  flex: 0 0 72px;
  height: 72px;
  box-shadow: 0 0 6px #ccc;
  margin-right: 10px;
  background-color: #ccc;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.btn-wrap {
  display: flex;
  justify-content: space-around;
}

.reupload {
  background: rgb(35, 197, 177);
  color: #fff;
}

.g-avatar {
  background: rgb(255, 228, 17);
}
</style>
