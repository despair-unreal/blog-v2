<template>
  <canvas ref="crowdMask" class="absoluteFullScreen"></canvas>
</template>

<script>
import bg from "@/assets/images/bg.png";
import { Circle } from "./circle.js";

export default {
  mounted: function () {
    this.$nextTick(() => {
      this.canvas = this.$refs.crowdMask;
      this.ctx = this.canvas.getContext("2d");

      this.init();
    });
  },
  data() {
    return {
      canvas:null,
      ctx: null,
      stage: { width: 0, height: 0 },
      bgImg: null,
      dpr: window.devicePixelRatio,
      maskCircle: null,
      drawFlag: true,
      firstRenderFlag:true
    };
  },
  methods: {
    init: async function () {
      this.bgImg = await this.$utils.loadImg(bg);
      this.resize();
      window.addEventListener("resize", this.resize);

      this.closeMask();
    },
    resize: function(){
      this.$parent.initStageAndDpr(this.ctx, this.dpr, this.canvas, this.stage);
    },
    openMask: function () {
      this.drawCircle(false);
    },
    closeMask: function () {
      this.firstRenderFlag = true;
      this.drawCircle(true);
    },
    drawCircle: function (intoLoadingFlag) {
      this.drawFlag = true;
      //当圆的直径等于矩形的对角线长度，则圆刚好可以覆盖矩形
      //利用勾股定理求出stage的对角线长度
      const diameter = Math.sqrt(
        Math.pow(this.stage.width, 2) + Math.pow(this.stage.height, 2)
      );
      const radius = diameter / 2;

      let startR = radius;
      let endR = 0;
      if (intoLoadingFlag === false) {
        startR = 0;
        endR = radius;
      }

      this.maskCircle = new Circle(startR, endR);
      this.maskCircle.setAnime(() => {
        this.drawFlag = false;
      });
      this.render();
    },
    render: function () {
      // drawCircle为true时代表动画还未执行完毕
      if (this.drawFlag) {
        this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
        this.maskCircle.render(this.stage, this.ctx, this.bgImg);
        if (this.firstRenderFlag) {
          this.firstRenderFlag = false;
          this.$emit("overLoading","crowdMask");
        }
        requestAnimationFrame(this.render);
      }else{
        this.$emit("overLoading","crowdMaskEnd");
      }
    },
  },
};
</script>

<style scoped>
canvas{
  pointer-events:none;
}
</style>