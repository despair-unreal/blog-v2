<!-- 页面目录-->
<template>
  <div id="home" @mousewheel="changeView">
    <component
      :class="{ filter: changeFilter }"
      :is="componentArr[currentIndex]"
      @overLoading="overLoading"
    ></component>
  </div>
</template>

<script>
import sectionOne from "../components/Home/section-one.vue";
import loading from "../components/Home/loading.vue";
export default {
  name: "home",
  components: {
    sectionOne,
    loading,
  },
  data() {
    return {
      changeFilter: false,
      currentIndex: 0,
      componentArr: ["loading","sectionOne"],
      loadingFlag: false,
    };
  },
  methods: {
    //判断鼠标滚轮方向
    mouseWheelDirection: (event) => {
      let direction = event.wheelDelta > 0 ? "Up" : "Down";
      return direction;
    },
    //组件页加载完成
    overLoading: function () {
      this.loadingFlag = true;
    },
    //切换组件页
    changeView: function () {
      //当前组件页加载完成才能切换组件页
      if (this.loadingFlag) {
        //模糊遮罩的动画时间为1秒
        this.changeFilter = true;
        //定时器，1秒后执行切换组件的方法
        let timer = setTimeout(
          (event) => {
            //关闭模糊遮罩
            this.changeFilter = false;
              let direction = this.mouseWheelDirection(event);
              switch (direction) {
                case "Down":
                  if (this.currentIndex != 2) this.currentIndex += 1;
                  break;
                case "Up":
                  if (this.currentIndex != 0) this.currentIndex -= 1;
                  break;
            }
            clearTimeout(timer);
          },
          1000,
          event
        );
      }
    },
  },
  watch: {
    currentIndex() {
      this.loadingFlag = false;
    },
  },
};
</script>
<style scoped>
#home > * {
  height: 100vh;
  width: 100vw;
}
#home {
  overflow: hidden;
  background-image: url("~@/assets/images/bg.png");
  background-size: 100% 100%;
  font-size: calc(100vw / 120);
}
.filter {
  filter: blur(5px);
  transition: all 1s ease-out;
}
</style>
