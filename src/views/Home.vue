<template>
  <div id="home" @mousewheel="getScrollDirection">
    <transition
      name="component-transition"
      mode="out-in"
      @before-leave="beforeLeave"
      @after-enter="afterEnter"
    >
      <keep-alive>
        <component
          :is="componentArr[currentIndex]"
          @overLoading="overLoading"
          ref="father"
        ></component>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import sectionOne from "../components/Home/section-one.vue";
import loading from "../components/Home/space-camping/loading.vue";

export default {
  name: "home",
  components: {
    sectionOne,
    loading,
  },
  data() {
    return {
      currentIndex: 0,
      componentArr: [ "sectionOne","loading"],
      changeViewFlag: true,
      loadingCompletedFlag: false,
    };
  },
  created(){
    this.$bus.$on("changeView",direction=>{
      this.changeView(direction);
    });
  },
  watch: {
    currentIndex: function () {
      this.loadingCompletedFlag = false;
    },
  },
  methods: {
    //当前组件页加载完成
    overLoading: function () {
      this.loadingCompletedFlag = true;
    },
    //当前组件页离开了
    beforeLeave: function () {
      this.changeViewFlag = false;
    },
    //下个组件页进来了
    afterEnter: function () {
      this.changeViewFlag = true;
    },
    //获取滚轮方向
    getScrollDirection: function () {
      let direction = this.$utils.mouseWheelDirection(event);
      this.changeView(direction);
    },
    //切换组件页
    changeView: function (direction) {
      //当前组件页加载完成才能切换组件页
      if (this.loadingCompletedFlag && this.changeViewFlag) {
        if (direction) {
          switch (direction) {
            case "Down":
              if (this.currentIndex != this.componentArr.length - 1)
                this.currentIndex += 1;
              break;
            case "Up":
              if (this.currentIndex != 0) this.currentIndex -= 1;
              break;
          }
        }
      }
    },
  },
};
</script>
<style scoped>
#home > * {
  height: 100%;
  width: 100%;
}
#home {
  height: 100vh;
  width: 100vw;
  background-image: url("~@/assets/images/bg.png");
  background-size: 100% 100%;
  overflow: hidden;
}
.component-transition-leave,
.component-transition-enter-to {
  opacity: 1;
}
.component-transition-leave-to,
.component-transition-enter {
  opacity: 0;
}
.component-transition-leave-active,
.component-transition-enter-active {
  transition: all 0.5s linear;
}
</style>
