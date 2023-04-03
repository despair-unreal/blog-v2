<template>
<transition name="container">
  <div id="container">
    <canvas class="absoluteFullScreen" ref="crowdLoading"></canvas>
    <div id="progressBar">
      <div class="bar"></div>
      <div class="loadedBar"></div>
      <p>加载中：{{showLoaded}}%</p>
    </div>
  </div>
  </transition>
</template>

<script>
import anime from "animejs";
import { Person } from "./person.js";
import crowdImg from "@/assets/images/crowd-loading/crowd-big.png";

export default {
  created(){
    //接收模型加载进度
    this.$bus.$on('loaded', res=>{this.loaded = res});
  },
  watch:{
    loaded:function(newValue,odlValue){
      //滚动的加载进度数字
      const showLoaded = anime({
        targets:this,
        showLoaded:[odlValue,newValue],
        round: 1,
        easing: 'linear'
      });
      //滚动的进度条
      const backgroundSize = anime({
        targets:"#progressBar .loadedBar",
        backgroundSize:newValue+"%",
        easing: 'linear'
      });
      //判断两个加载动画是否完成
      if(newValue === 100){
        showLoaded.complete = ()=>{
          this.completeCount++;
        }
        backgroundSize.complete = ()=>{
          this.completeCount++;
        }
      }
    },
    completeCount:function(){
      //加载动画完成后延时一秒发送开始渲染模型的信号
      if(this.completeCount === 2){
        setTimeout(() => {
          this.$emit("startRender");
        }, 1000);
      }
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      this.canvas = this.$refs.crowdLoading;
      this.ctx = this.canvas.getContext("2d");
      this.init();
    });
  },
  activated(){
    if (!this.firstRenderFlag){
      this.resize();
    }
  },
  data() {
    return {
      loaded:0,
      showLoaded:0,
      canvas: null,
      ctx: null,
      dpr: window.devicePixelRatio,
      stage: { width: 0, height: 0 },
      config: {
        src: crowdImg,
        rows: 7,
        cols: 15,
      },
      img: null,
      allPeople: [],
      availablePeople: [],
      crowd: [],
      firstRenderFlag :true,
      completeCount:0
    };
  },
  methods: {
    init: async function () {
      this.img = await this.$utils.loadImg(this.config.src);
      this.allPeople = this.getAllPeople();
      this.resize();

      window.addEventListener("resize", this.resize);
      this.render();
    },
    render: function () {
      this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
      this.crowd.forEach((person) => person.render(this.ctx));
      if (this.firstRenderFlag) {
        this.firstRenderFlag = false;
        this.$emit("completeCrowdLoading");
      }
      requestAnimationFrame(this.render);
    },
    getAllPeople: function () {
      const { rows, cols } = this.config;
      const sw = this.img.naturalWidth / cols;
      const sh = this.img.naturalHeight / rows;

      const people = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const sx = col * sw;
          const sy = row * sh;
          people.push(new Person([this.img, sx, sy, sw, sh, 0, 0, sw, sh]));
        }
      }
      return people;
    },
    resize: function () {
      this.$parent.initStageAndDpr(this.ctx, this.dpr, this.canvas, this.stage);
      // 重置人群
      this.crowd.forEach((person) => person.kill());
      this.availablePeople.length = 0;
      this.crowd.length = 0;

      this.startHandle();
    },
    startHandle: function () {
      this.availablePeople = [...this.$utils.objDeepClone(this.allPeople)];
      [...this.availablePeople].forEach(() => {
        this.animPerson();
      });
    },
    animPerson: function () {
      // 随机选择一个person
      const randomIndex = anime.random(0, this.availablePeople.length - 1);
      const person = this.availablePeople.splice(randomIndex, 1)[0];
      // 给person加上起始位置和动画
      person.setPos(this.stage);
      person.walk(() => {
        // person动画完成之后，从crowd删除，重新放回availablePeople容器，供下次使用
        this.crowd.splice(this.crowd.indexOf(person), 1);
        person.firstRenderFlag = false;
        this.availablePeople.push(person);
        this.animPerson();
      });
      // 放到人群里去渲染
      this.crowd.push(person);
      // 从上到下渲染，避免错乱
      this.crowd.sort((a, b) => a.anchorY - b.anchorY);
      return person;
    },
  },
};

</script>

<style scoped>
#container {
  height: 100%;
  width: 100%;
  pointer-events:none;
}
.container-leave-active{
  transition: all 0.5s linear;
}
.container-leave{
  opacity: 1;
}
.container-leave-to{
  opacity: 0;
}
canvas {
  background: url("~@/assets/images/crowd-loading/crowd-background.jpg") no-repeat;
  background-size: cover;
}
#progressBar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 22px;
  border-radius: 22px;
  border: 2px solid black;
  background: transparent;
}
#progressBar p {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: bold;
}
#progressBar .loadedBar,#progressBar .bar{
  position: absolute;
  inset: 0;
  margin: 2px;
  border-radius: inherit;
}
#progressBar .loadedBar{
  margin: 2px;
  background: repeating-linear-gradient(135deg, #e73a32 0 10px, #ffe482 0 20px) no-repeat;
  background-size: 0%;
}
#progressBar .bar{
  content: "";
  background: repeating-linear-gradient(135deg, #ddd 0 10px, #eee 0 20px);
  background-size: 100%;
}
</style>