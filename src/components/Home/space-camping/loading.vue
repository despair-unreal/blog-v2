<template>
  <div id="container">
    <spaceCamping :class="{show:showCrowdLoading}"></spaceCamping>
    <crowdLoading :class="{show:showCrowdLoading}" ref="crowdLoading" @overLoading="overLoading"></crowdLoading>
    <crowdmask ref="crowdMask" @overLoading="overLoading"></crowdmask>
  </div>
</template>

<script>
import crowdLoading from "./loading/crowd-loading.vue";
import crowdmask from "./mask/crowd-mask.vue";
import spaceCamping from './space-camping/space-camping.vue';

export default {
  name: "loading",
  components: {
    crowdmask,
    crowdLoading,
    spaceCamping
  },
  data() {
    return {
      crowdMaskFlag :false,
      crowdLoadingFlag :false,
      showCrowdLoading:false,
      overLoadingcount: 0,
    };
  },
  methods: {
    initStageAndDpr: (ctx, dpr, canvas, stage) => {
      // 初始化舞台大小
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      // 处理设备分辨率dpr
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;
      ctx.scale(dpr, dpr);
    },
    overLoading: function (name) {
      let crowdMaskEnd = false;
      switch (name) {
        case "crowdMask":
          this.crowdMaskFlag = true;
          break;
        case "crowdLoading":
          this.crowdLoadingFlag = true;
          break;
        case "crowdMaskEnd":
          crowdMaskEnd = true;
          break;
      }
      //两个canvas的第一帧都绘制完毕
      if(this.crowdMaskFlag && this.crowdLoadingFlag){
        this.showCrowdLoading = true;
      }
      //遮罩动画绘制完毕
      if(crowdMaskEnd && this.showCrowdLoading){
        this.$emit("overLoading");
      }
    }
  }
};
</script>
<style scoped>
#container > *:not(:last-child){
  opacity: 0;
}
.show{
  opacity: 1 !important;
}
</style>