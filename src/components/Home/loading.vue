<template>
  <!--<crowd :config="config"></crowd>-->
  <div>
    <crowdLoading></crowdLoading>
    <crowdmask></crowdmask>
  </div>
</template>

<script>
import crowdLoading from "./loading/crowd-loading/crowd-loading.vue";
import crowdmask from "./loading/crowd-mask.vue";

export default {
  name: "loading",
  components: {
    crowdmask,
    crowdLoading,
  },
  methods: {
    drawFullImg: (bgImg, ctx, stage) => {
      //ctx.drawImage(bgImg,stage.width,stage.width);
      const width = bgImg.naturalWidth;
      const height = bgImg.naturalHeight;
      ctx.drawImage(
        bgImg,
        0,
        0,
        width,
        height,
        0,
        0,
        stage.width,
        stage.height
      );
    },
    initStageAndDpr: (ctx, dpr, canvas, stage) => {
      // 初始化舞台大小
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      // 处理设备分辨率dpr
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;
      ctx.scale(dpr, dpr);
    },
  },
};
</script>
<style scoped>
canvas {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>