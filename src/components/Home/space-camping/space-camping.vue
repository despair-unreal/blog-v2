<template>
  <canvas ref="spaceCamping"></canvas>
</template>

<script>
import { CreateModel } from "./CreateModel.js";

export default {
  name: "spaceCamping",
  activated() {
    //this.$emit("overLoading");
  },
  mounted() {
    const canvas = this.$refs.spaceCamping;
    createModel(canvas);
    //this.$emit("overLoading");
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
}
</script>

<style scoped>
</style>
