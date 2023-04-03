<template>
  <div id="container" @mousewheel="stopPropagation">
    <spaceCamping
      :class="{ hide: hide.spaceCamping }"
      :start="start"
    ></spaceCamping>
    <crowdLoading
      :class="{ hide: hide.crowdLoading }"
      @startRender="startRender"
      @completeCrowdLoading="completeCrowdLoading"
    ></crowdLoading>
    <crowdmask
      :class="{ hide: hide.crowdMask }"
      ref="crowdMask"
      @overCrowdMask="overCrowdMask"
    ></crowdmask>
  </div>
</template>

<script>
import crowdLoading from "./loading/crowd-loading.vue";
import crowdmask from "./mask/crowd-mask.vue";
import spaceCamping from "./space-camping/space-camping.vue";

export default {
  name: "loading",
  components: {
    crowdmask,
    crowdLoading,
    spaceCamping,
  },
  data() {
    return {
      hide: { spaceCamping: true, crowdLoading: false, crowdMask: false },
      start: { compile: false, render: false },
    };
  },
  activated() {
    //模型已经加载完毕
    if (this.start.render) {
      this.$emit("overLoading");
    }
  },
  methods: {
    stopPropagation: () => {
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
    //开始渲染模型
    startRender: function () {
      this.start.render = true;
      setTimeout(() => {
        this.$refs.crowdMask.openMask();
      }, 1000);
    },
    //要先等crowdLoading绘制完第一帧再把遮罩收起来
    completeCrowdLoading: function () {
      this.$refs.crowdMask.closeMask();
    },
    //每次遮罩动画绘制完毕都会触发此事件
    overCrowdMask: function () {
      //模型还没开始渲染
      if (!this.start.render) {
        //开始模型场景等的初始化预编译
        this.start.compile = true;
        this.hide.spaceCamping = false;
      } else {
        //模型已经开始渲染
        //把loading页和遮罩页隐藏起来
        const obj1 = this.hide;
        Object.keys(obj1).forEach((key) => {
          if (key !== "spaceCamping") obj1[key] = true;
        });
        this.$emit("overLoading");
      }
    },
  },
};
</script>
<style scoped>
/* #container{
  pointer-events:none;
} */
#container > *:last-child {
  transition: all 0.5s linear;
}
.hide {
  opacity: 0 !important;
}
</style>