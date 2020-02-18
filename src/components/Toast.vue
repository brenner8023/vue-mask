<template>
  <div class="toast-box">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
@keyframes anim-totast {
  0% {
    transform: translate(-50%, 50%);
  }
  100% {
    transform: translate(-50%, -50%);
  }
}
.toast-box {
  width: fit-content;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  left: 50%;
  top: 36%;
  transform: translate(-60%, -50%);
  z-index: 100;
  animation: anim-totast forwards 1s;
}
</style>
