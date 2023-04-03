<template>
  <div id="container">
    <canvas class="absoluteFullScreen" ref="spaceCamping"></canvas>
    <div id="main">
      <div class="name">BAI<br />KONG</div>
      <div class="info">
        <div :class="[{hide:current!=0},'description']">
          <div class="content">
            你好啊！我是<span>白空</span>一条摆烂躺平的<span>咸鱼</span>，喜欢<span>游戏</span>、<span>睡觉</span>&<span>动漫</span>.
          </div>
          <div class="sub-title">01 - info</div>
          <a @click="changeDescription">Next</a>
        </div>
        <div :class="[{hide:current!=1},'description']">
          <div class="content">
            本网站正在建设中，欢迎反馈错误. 如果本站内容帮助到了你，也欢迎留言.
          </div>
          <div class="sub-title">02 - more</div>
          <a @click="changeDescription">Next</a>
        </div>
      </div>
      <div class="latest-news">
        <h2>LATEST NEWS</h2>
        <div class="news">
          <a href="#">
            <span>父子组件的生命周期渲染顺序问题</span>
            <img src="@/assets/images/bg.png" onerror="this.style.display='none'" />
          </a>
          <a href="#">
            <span
              >父子组件的生命周期渲染顺序问题父子组件的生命周期渲染顺序问题父子组件的生命周期渲染顺序问题父子组件的生命周期渲染顺序问题父子组件的生命周期渲染顺序问题父子组件的生命周期渲染顺序问题父子组件的生命周期渲染顺序问题父子组件的生命周期渲染顺序问题</span
            >
            <img src="" onerror="this.style.display='none'" />
          </a>
          <a href="#">
            <span>父子组件的生命周期渲染顺序问题</span>
            <img src="" onerror="this.style.display='none'"  />
          </a>
        </div>
      </div>
      <div id="prev-page" class="iconfont icon-shangfan" @click="changeView"></div>
    </div>
  </div>
</template>

<script>
import { CreateModel } from "./CreateModel.js";

export default {
  name: "spaceCamping",
  props: ["start"],
  data() {
    return {
      canvas: null,
      createModel: null,
      current:0,
      maxCurrent:1
    };
  },
  activated(){
    //恢复模型的渲染
    if(this.createModel)
      this.createModel.startRenderFlag = true;
  },
  deactivated(){
    //暂停模型的渲染
    this.createModel.startRenderFlag = false;
  },
  mounted() {
    this.canvas = this.$refs.spaceCamping;
  },
  methods:{
    changeDescription:function(){
      if(this.current === this.maxCurrent)
        this.current = 0;
      else
        this.current++;
    },
    changeView:function(){
      this.$bus.$emit("changeView", "Up");
    }
  },
  watch: {
    "start.compile": function () {
      this.createModel = createModel(this.canvas);
    },
    "start.render": function () {
      this.createModel.startRenderFlag = this.start.render;
    },
    "createModel.loaded": function () {
      const loaded = this.createModel.loaded;
      this.$bus.$emit("loaded", loaded);
    },
  },
};

function createModel(canvas) {
  //初始化
  const createModel = new CreateModel(canvas);
  const initParams = {
    bg: "src/assets/images/bg.png",
    cameraParams: {
      fov: 30,
      near: 0.1,
      far: 1000,
      //aspect
      position: {
        x: 1.52,
        y: 0.363,
        z: 3.355,
      },
    },
    renderParams: {
      toneMapping: "ReinhardToneMapping",
      toneMappingExposure: 1.8,
      // toneMappingExposure: 1.5,
      outputEncoding: "",
    },
    LightParams: {
      pointLightParams: {
        color: 0xff725c,
        intensity: 1.5,
        distance: 100,
        decay: 0.3,
        position: {
          x: 0.048,
          y: 0.225,
          z: 0.522,
        },
      },
      ambientlightParams: {
        color: 0x2a2140,
        intensity: 1,
      },
    },
    showStats: false,
  };
  createModel.init(initParams);

  //导入模型
  const seneUrl = "/models/space_camping/scene.glb";
  createModel.setModels(seneUrl);

  //后期处理
  const unrealBloomPassParams = {
    //strength : 0.58
    strength: 1,
    //radius, threshold
  };
  createModel.initEffect(unrealBloomPassParams);

  //渲染
  createModel.animate();

  window.addEventListener("resize", createModel.resize.bind(createModel));
  return createModel;
}
</script>

<style scoped>
.hide{
  display: none;
}
#main {
  height: 50%;
  width: calc(100% - 80px);
  position: absolute;
  left: 40px;
  bottom: 60px;
  color: white;
  user-select: none;
  pointer-events:none;
}
#main .name {
  font-size: 77px;
  line-height: 1;
}

#main .info{
  width: 25%;
  position: absolute;
  bottom: 0;
  line-height: 1.4;
  pointer-events:auto;
}
#main .info .description .content {
  font-size: 18px;
  letter-spacing: 1px;
  opacity: 0.8;
  font-weight: 400;
  margin-bottom: 40px;
  margin-top: 40px;
}
#main .info .description .content span {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 70%,
    rgba(160, 216, 120, 0.5) 70% 90%,
    rgba(255, 255, 255, 0) 90%
  );
}
#main .info .description .content span,
#main .info .description a {
  border-radius: 5px;
  cursor: pointer;
  padding: 0 3px;
  transition: background 0.5s;
}
#main .info .description .content span:hover,
#main .info .description a:hover {
  background: #797979;
}
#main .info .description .sub-title,
#main .info a {
  font-size: 15px;
  letter-spacing: 4px;
  font-weight: 700;
}
#main .info .description .sub-title {
  display: inline-block;
}
#main .info .description a {
  margin-left: 25px;
}

#main .latest-news {
  position: absolute;
  width: 20%;
  height: 100%;
  top: 0;
  right: 0;
  line-height: 2;
  display: flex;
  flex-direction: column;
}
#main .latest-news h2 {
  font-size: 15px;
  font-weight: normal;
  opacity: 0.6;
  margin-bottom: 20px;
}
#main .latest-news .news {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
  justify-content: space-between;
}
#main .latest-news .news a {
  padding: 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  width: 80%;
  height: 80px;
  margin-bottom: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  pointer-events:auto;
}
#main .latest-news .news a:nth-child(2) {
  margin-left: auto;
}
#main .latest-news .news img {
  margin-left: 6px;
  max-width: 40%;
  height: 100%;
  background: black;
  object-fit: cover;
}
#main .latest-news .news span {
  max-height: 100%;
  line-height: 1.4;
  flex-grow: 1;
  color: white;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
#prev-page{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid white;
  cursor: pointer;
  position: absolute;
  right: 0;
  bottom: 0;
  pointer-events:auto;
}
#prev-page::before{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
</style>
