<template>
  <div id="container" @mousewheel="stopPropagation">
    <spaceCamping :start="start"></spaceCamping>
    <crowdLoading :class="{hide:hideCrowdLoading}" @startRender="startRender" @overLoading="overLoading"></crowdLoading>
    <crowdmask :class="{hide:hideCrowdMask}" ref="crowdMask" @overLoading="overLoading"></crowdmask>
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
      hideCrowdLoading:true,
      hideCrowdMask:false,
      start:{startcompile:false,startrender:false},
      loaded:0
    };
  },
  methods: {
    stopPropagation:()=>{
      //阻止向上冒泡
      event.stopPropagation();
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
    startRender:function(){
      //开始渲染模型
      this.start.startrender = true;
      setTimeout(() => {
        this.$refs.crowdMask.openMask();
      }, 1000);
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
        this.hideCrowdLoading = false;
      }
      //遮罩动画绘制完毕
      if(crowdMaskEnd){
        //模型已经开始渲染
        if(this.start.startrender){
          this.hideCrowdLoading = true;
          this.hideCrowdMask = true;
          this.$emit("overLoading");
        }
        //crowdLoading的第一帧都绘制完毕
        if(!this.hideCrowdLoading){
          //开始模型场景等的初始化
          this.start.startcompile = true;
        }
      }
    }
  }
};
</script>
<style scoped>
/* #container{
  pointer-events:none;
} */
#container > *:last-child{
  transition: all 0.5s linear;
}
.hide{
  opacity: 0 !important;
}
</style>