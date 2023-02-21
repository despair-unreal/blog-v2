<!-- 加载屏 -->
<template>
  <canvas
    ref="crowd"
    class="crowd"
    :class="[defaultConfig.fixed ? 'crowd-fixed' : '']"
    :style="{ opacity: defaultConfig.opacity }"
  ></canvas>
</template>

<script>
import c0 from "@/assets/images/crowd/crowd0.png";
import c1 from "@/assets/images/crowd/crowd1.png";
import c2 from "@/assets/images/crowd/crowd2.png";
import c3 from "@/assets/images/crowd/crowd3.png";
import c4 from "@/assets/images/crowd/crowd4.png";
import c5 from "@/assets/images/crowd/crowd5.png";
import c6 from "@/assets/images/crowd/crowd6.png";
import c7 from "@/assets/images/crowd/crowd7.png";
import c8 from "@/assets/images/crowd/crowd8.png";
import c9 from "@/assets/images/crowd/crowd9.png";
import c10 from "@/assets/images/crowd/crowd10.png";
import c11 from "@/assets/images/crowd/crowd11.png";

const crowdImgs = [c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11];
let crowd = null;
let newConfig = {};
const imgInitY = 20;
const imgList = [];
const imgNum = crowdImgs.length;
const imgSet = new Set();
let ctx = null;
let animationIdx = null;
let defaultConfig = {};
export default {
  name: "crowd",
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    index: { type: String, default: "" },
    onclose: { type: Function, default: () => {} },
  },
  data() {
    return {
      newConfig: {
        config: this.config,
        index: this.index,
        onclose: this.onclose,
      },
      defaultConfig: {
        width: window.innerWidth,
        height: window.innerHeight,
        loop: true,
        pause: false,
        fixed: false,
        end: false,
        resize: false,
        opacity: 1,
        step: 2,
      },
    };
  },
  mounted: function () {
    newConfig = this.newConfig;
    defaultConfig = this.defaultConfig;
    this.$nextTick(() => {
      crowd = this.$refs.crowd;
      initCanvas();
      initImgList();
      update();
    });
    this.$emit("overLoading");
  },
  methods: {
    pause: () => {
      defaultConfig.pause = true;
    },
    resume: () => {
      defaultConfig.pause = false;
    },
    remove: () => {
      newConfig.onclose();
      cancelAnimationFrame(animationIdx);
      if (newConfig.index == "") crowd.remove();
      else document.querySelector("#" + newConfig.index).remove();
    },
  },
  watch: {
    defaultConfig: {
      handler(val) {
        if (val.end && !val.loop) {
          this.remove();
        }
      },
      deep: true
    },
  },
};
const initCanvas = function () {
  for (const key in newConfig.config) {
    defaultConfig[key] = newConfig.config[key];
  }
  crowd.width = defaultConfig.width;
  crowd.height = defaultConfig.height;
  ctx = crowd.getContext("2d");
};
const initImgList = () => {
  for (let i = 0; i < imgNum * 2; i++) {
    const img = crowdImgs[i % imgNum]; //按顺序输出0-imgNum-1的值，两遍
    const temp_img = new Image();
    temp_img.src = img;
    imgList.push({
      img: temp_img,
      step: Math.random() * defaultConfig.step + defaultConfig.step,
      step_y: Math.random() * 0.2 + 0.2,
      x: crowd.width + i * 100, //每张图片位置间隔100
      y: imgInitY,
      flag_x: i < imgNum ? true : false, //图片一组往左，一组往右
      flag_y: true,
      index: i,
    });
  }
};
const update = () => {
  if (!defaultConfig.pause) {
    render();
  }
  animationIdx = requestAnimationFrame(update);
};
const render = () => {
  ctx.clearRect(0, 0, crowd.width, crowd.height);
  ctx.beginPath();
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, crowd.width, crowd.height);
  imgList.forEach((item) => {
    if (item.img.complete) {
      if (item.x > -item.img.width) {
        //图片进入画布视野范围内
        item.x -= item.step;
        //控制item.y在0-imgInitY间浮动，让图片上下抖动
        if (item.flag_y) {
          if (item.y - item.step_y >= 0) item.y -= item.step_y;
          else item.flag_y = false;
        } else {
          if (item.y + item.step_y <= imgInitY) item.y += item.step_y;
          else item.flag_y = true;
        }
        ctx.save();
        if (item.flag_x) {
          //图像分为往右一组（翻转坐标轴），往左一组
          ctx.scale(-1, 1);
          ctx.translate(-crowd.width, 0);
        }
        ctx.drawImage(
          item.img,
          0,
          0,
          item.img.width,
          item.img.height,
          item.x,
          item.y,
          crowd.height / 2, //图像的长宽比大约为2:1
          crowd.height //高充满画布
        );
        ctx.restore();
      } else {
        imgSet.add(item.index);
        if (imgSet.size == imgNum * 2) {
          //没有图像在画布的视野范围内了
          if (defaultConfig.loop) updateImgList();
          else defaultConfig.end = true;
        } else if (imgSet.size == imgNum * 2 - 2 && !defaultConfig.loop) {
          defaultConfig.opacity = 0;
        }
      }
    }
  });
  ctx.save();
  ctx.shadowBlur = 100;
  ctx.fillStyle = "rgb(0,0,0,0.2)";
  ctx.shadowColor = "#8360c3";
  ctx.fillRect(0, 0, crowd.width, crowd.height);
  ctx.restore();
};
const updateImgList = () => {
  imgSet.clear();
  defaultConfig.end = false;
  imgList.forEach((item, index) => {
    item.step = Math.random() * defaultConfig.step + defaultConfig.step;
    item.step_y = Math.random() * 0.2 + 0.2;
    item.x = crowd.width + index * 100;
  });
};
window.addEventListener("resize", () => {
  if (defaultConfig.resize && crowd) {
    crowd.width = window.innerWidth;
    crowd.height = window.innerHeight;
  }
});
</script>
<style scoped>
.crowd {
  transition: 1s;
}
.crowd-fixed {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}
</style>