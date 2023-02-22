<template>
  <canvas ref="crowdLoading" class="c"></canvas>
</template>

<script>
import anime from "animejs";
import { Person } from "./person.js";
import crowdImg from "@/assets/images/crowd-loading/crowd-big.png";
import crowdBackground from "@/assets/images/crowd-loading/crowd-background.jpg";


let canvas,ctx,that;
const dpr = window.devicePixelRatio;
const stage = { width: 0, height: 0 };
export default {
  mounted: function () {
    this.$nextTick(() => {
      that = this;
      canvas = this.$refs.crowdLoading;
      ctx = canvas.getContext("2d");
      init();
    });
  },
};

let allPeople = [];
let availablePeople = [];
let crowd = [];
let img;
let bgImg;
const config = {
  src: crowdImg,
  rows: 7,
  cols: 15,
};

function getAllPeople() {
  const { rows, cols } = config;
  const sw = img.naturalWidth / cols;
  const sh = img.naturalHeight / rows;

  const people = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sx = col * sw;
      const sy = row * sh;
      people.push(new Person([img, sx, sy, sw, sh, 0, 0, sw, sh]));
    }
  }
  return people;
}

function animPerson() {
  // 随机选择一个person
  const randomIndex = anime.random(0, availablePeople.length - 1);
  const person = availablePeople.splice(randomIndex, 1)[0];
  // 给person加上起始位置和动画
  person.setPos(stage);
  person.walk(() => {
    // person动画完成之后，从crowd删除，重新放回availablePeople容器，供下次使用
    crowd.splice(crowd.indexOf(person), 1);
    person.firstRenderFlag = false;
    availablePeople.push(person);
    animPerson();
  });
  // 放到人群里去渲染
  crowd.push(person);
  // 从上到下渲染，避免错乱
  crowd.sort((a, b) => a.anchorY - b.anchorY);
  return person;
}
function startHandle() {
  availablePeople = [...that.$utils.objDeepClone(allPeople)];
  [...availablePeople].forEach(() => {
    animPerson();
  });
}

function resize() {
  that.$parent.initStageAndDpr(ctx, dpr, canvas, stage);
  // 重置人群
  crowd.forEach((person) => person.kill());
  availablePeople.length = 0;
  crowd.length = 0;

  startHandle();
}

function render() {
  ctx.clearRect(0, 0, stage.width, stage.height);
  that.$parent.drawFullImg(bgImg,ctx,stage);
  crowd.forEach((person) => person.render(ctx));
  requestAnimationFrame(render);
}

async function init() {
  const bgSrc = crowdBackground;
  [{value:img},{value:bgImg}] = await Promise.allSettled([
    that.$utils.loadImg(config.src),
    that.$utils.loadImg(bgSrc)
  ])
  allPeople = getAllPeople();
  resize();
  
  window.addEventListener("resize", resize);

  render();
}
</script>

<style scoped>
</style>