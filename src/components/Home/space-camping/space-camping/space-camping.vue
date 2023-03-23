<template>
  <canvas class="absoluteFullScreen" ref="spaceCamping"></canvas>
</template>

<script>
import { CreateModel } from "./CreateModel.js";

export default {
  name: "spaceCamping",
  props:["start"],
  data(){
    return{
      canvas:null,
      createModel:null
    }
  },
  activated() {
    //this.$emit("overLoading");
  },
  mounted() {
    this.canvas = this.$refs.spaceCamping;
    //this.$emit("overLoading");
  },
  watch:{
    "start.startcompile":function(){
        this.createModel = createModel(this.canvas);
    },
    "start.startrender":function(){
        this.createModel.startRenderFlag = this.start.startrender;
    },
    "createModel.loaded":function(){
      const loaded = this.createModel.loaded;
      this.$bus.$emit('loaded',loaded);
    }
  }
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
    showStats:true
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
</style>
