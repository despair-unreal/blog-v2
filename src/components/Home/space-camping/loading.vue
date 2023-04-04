<template>
  <div id="container" @mousewheel="stopPropagation">
    <spaceCamping :class="{ hide: hide.spaceCamping }" :start="start" />
    <crowdLoading
      v-if="!hide.loading"
      :class="{ hide: hide.loading }"
      @startRender="startRender"
      @completeCrowdLoading="completeCrowdLoading"
    />
    <img
      id="crowdMask"
      :class="[mask, 'absoluteFullScreen']"
      @transitionend="crowdMaskEnd"
      src="~@/assets/images/bg.png"
    />
  </div>
</template>

<script>
import crowdLoading from "./crowd-loading/crowd-loading.vue";
import spaceCamping from "./space-camping/space-camping.vue";

export default {
  name: "loading",
  components: {
    crowdLoading,
    spaceCamping,
  },
  data() {
    return {
      hide: { spaceCamping: true, loading:false },
      start: { compile: false, render: false },
      showMask: true
    };
  },
  activated() {
    //模型已经加载完毕
    if (this.start.render) {
      this.$emit("overLoading");
    }
  },
  computed: {
    mask: function () {
      return {
        openMask: this.showMask,
        closeMask: !this.showMask,
        hide: this.hide.loading,
      };
    },
  },
  methods: {
    //阻止向上冒泡
    stopPropagation: () => {
      event.stopPropagation();
    },
    openMask: function () {
      this.showMask = true;
    },
    closeMask: function () {
      this.showMask = false;
    },
    //开始渲染模型
    startRender: function () {
      this.start.render = true;
      setTimeout(() => {
        this.openMask();
      }, 1000);
    },
    //要先等crowdLoading绘制完第一帧再把遮罩收起来
    completeCrowdLoading: function () {
      this.closeMask();
    },
    //每次遮罩动画绘制完毕都会触发此事件
    crowdMaskEnd: function () {
      //模型还没开始渲染
      if (!this.start.render) {
        //开始模型场景等的初始化预编译
        this.start.compile = true;
        this.hide.spaceCamping = false;
      } else if(!this.hide.loading){
        //模型已经开始渲染
        //把loading页和遮罩页隐藏起来
        this.hide.loading = true;
        this.$emit("overLoading");
      }
    }
  },
};
</script>
<style scoped>
.hide {
  opacity: 0 !important;
}
#crowdMask {
  pointer-events: none;
  transition: clip-path 1s linear, opacity 0.5s linear;
}
.openMask {
  clip-path: circle(70% at center);
}
.closeMask {
  clip-path: circle(0 at center);
}
</style>