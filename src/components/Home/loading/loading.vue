<template>
  <div>
    <crowdLoading ref="crowdLoading" @overLoading="overLoading"></crowdLoading>
    <crowdmask ref="crowdMask" @overLoading="overLoading"></crowdmask>
  </div>
</template>

<script>
import crowdLoading from "./crowd-loading/crowd-loading.vue";
import crowdmask from "./crowd-mask/crowd-mask.vue";

export default {
  name: "loading",
  components: {
    crowdmask,
    crowdLoading,
  },
  data() {
    return {
      overLoadingcount: 0,
    };
  },
  activated(){
    if (this.overLoadingcount === 2){
      this.$refs.crowdMask.closeMask();
      this.$emit("overLoading");
    } 
  },
  methods: {
    drawFullImg: (bgImg, ctx, stage) => {
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
    overLoading: function () {
      this.overLoadingcount++;
      if (this.overLoadingcount === 2) this.$emit("overLoading");
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