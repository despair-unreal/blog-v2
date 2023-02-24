<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import bg from "@/assets/images/bg.png";
import { Circle } from "./circle.js";

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
let maskCircle, renderId;
async function init() {
  bgImg = await that.$utils.loadImg(bg);

  const resize = that.$parent.initStageAndDpr(ctx, dpr, canvas, stage);
  window.addEventListener("resize", resize);

  drawCircle(true);
}
function render() {
  ctx.clearRect(0, 0, stage.width, stage.height);
  maskCircle.render(stage, ctx, that, bgImg);
  renderId = requestAnimationFrame(render);
}
function drawCircle(intoLoadingFlag) {
  //当圆的直径等于矩形的对角线长度，则圆刚好可以覆盖矩形
  //利用勾股定理求出stage的对角线长度
  const diameter = Math.sqrt(
    Math.pow(stage.width, 2) + Math.pow(stage.height, 2)
  );
  const radius = diameter / 2;

  let startR = radius;
  let endR = 0;
  if (intoLoadingFlag === false) {
    startR = 0;
    endR = radius;
  }
  
  maskCircle = new Circle(startR, endR);
  maskCircle.setAnime(() => cancelAnimationFrame(renderId));
  render();
}


</script>

<style scoped>
</style>