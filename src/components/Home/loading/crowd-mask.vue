<template>
  <canvas ref="canvas" style="display:none"></canvas>
</template>

<script>
//import anime from "animejs";
import bg from "@/assets/images/bg.png";

let canvas, ctx, that, bgImg;
let stage = { width: 0, height: 0 };
const dpr = window.devicePixelRatio;

export default {
  mounted: function () {
    this.$nextTick(() => {
      that = this;
      canvas = this.$refs.canvas;
      ctx = canvas.getContext("2d");
      init();
    });
  },
};

async function init() {
  bgImg = await that.$utils.loadImg(bg);

  const resize = that.$parent.initStageAndDpr(ctx, dpr, canvas, stage);
  window.addEventListener("resize", resize);

  render();
}

function render() {
  //当圆的直径等于矩形的对角线长度，则圆刚好可以覆盖矩形
  //利用勾股定理求出stage的对角线长度
  const d = Math.sqrt(Math.pow(stage.width, 2) + Math.pow(stage.height, 2));
  const r = d / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(stage.width / 2, stage.height / 2, r, 0, 2 * Math.PI);
  ctx.clip();
  that.$parent.drawFullImg(bgImg, ctx, stage);
  /* ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillRect(0, 0, stage.width, stage.height); */
  ctx.restore();
}
</script>

<style scoped>
</style>