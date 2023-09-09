<template>
  <div ref="bgContainer" class="bg-container">
    <video
      :class="['list-background', { hide: bgLoad }]"
      poster="@/assets/images/music/music_background.jpg"
      autoplay
      muted
      loop>
      <source src="@/assets/images/music/music_background.mp4" type="video/mp4" />
    </video>
    <canvas ref="bgCanvas" class="bg-canvas"></canvas>
    <!-- :style="bgCanvas.newImg && `backgroundImage:url(${bgCanvas.newImg.src})`"-->
    <div id="mask"></div>
  </div>
</template>

<script>
import anime from 'animejs';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      backgroundSrc: '',
      bgLoad: false,
      bgCanvas: {
        resizeObserver: null,
        width: 0,
        height: 0,
        context: null,
        scale: 1.5,
        duration: 800,
        oldImg: null,
        newImg: null,
      },
    };
  },
  computed: {
    ...mapGetters(['getCurrentMusic']),
    background() {
      return this.getCurrentMusic?.cover || '';
    },
  },
  watch: {
    async background(src) {
      if (src) {
        const newImg = await this.$utils.loadImg(src);
        this.bgLoad && (this.bgCanvas.oldImg = this.bgCanvas.newImg);
        this.bgCanvas.newImg = newImg;
        this.bgCanvas.oldImg
          ? this.alternateImage(this.bgCanvas.oldImg, this.bgCanvas.newImg)
          : (this.bgCanvas.context.drawImage(newImg, ...this.getDrawImageCoverParameter(newImg)), (this.bgLoad = true));
      }
    },
  },
  methods: {
    // 获取图片以cover形式绘制到画布上的所需参数
    getDrawImageCoverParameter(img) {
      // drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
      // 参数sx, sy分别表示源图片被截取部分左上角顶点的横、纵坐标
      // 参数sw, sh 分别表示源图片被截取部分的宽、高
      // 参数 dx, dy, dw, dh 分别表示切片后将要在画布上绘制的左上角顶点坐标及绘制的宽高
      // 首先分别计算画布和图片的宽高比
      const canvasRatio = this.bgCanvas.width / this.bgCanvas.height;
      const imgRatio = img.width / img.height;
      const dw = this.bgCanvas.width,
        dh = this.bgCanvas.height,
        dx = 0,
        dy = 0;
      let sx, sy, sw, sh;
      if (imgRatio <= canvasRatio) {
        sw = img.width;
        sh = sw / canvasRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
      } else {
        sh = img.height;
        sw = sh * canvasRatio;
        sx = (img.width - sw) / 2;
        sy = 0;
      }
      return [sx, sy, sw, sh, dx, dy, dw, dh];
    },
    alternateImage(oldImg, newImg) {
      const gradient = {
        newImgAlpha: 0,
      };
      anime({
        targets: gradient,
        oldImgAlpha: 0,
        newImgAlpha: 1,
        duration: this.bgCanvas.duration,
        easing: 'linear',
        update: () => {
          if (this.bgCanvas.newImg !== newImg) return;
          this.bgCanvas.context.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
          this.bgCanvas.context.globalAlpha = 1;
          this.bgCanvas.context.drawImage(oldImg, ...this.getDrawImageCoverParameter(oldImg));
          this.bgCanvas.context.globalAlpha = gradient.newImgAlpha;
          this.bgCanvas.context.drawImage(newImg, ...this.getDrawImageCoverParameter(newImg));
        },
      });
    },
  },
  mounted() {
    // 获取画布dom并获取画笔、放大画笔
    const bgCanvasDom = this.$refs.bgCanvas;
    // const dpr = window.devicePixelRatio;
    this.bgCanvas.context = bgCanvasDom.getContext('2d');
    // 监听容器大小变化动态设置canvas画布的大小
    this.bgCanvas.resizeObserver = new ResizeObserver((entries) => {
      const { inlineSize, blockSize } = entries[0].devicePixelContentBoxSize[0];
      bgCanvasDom.width = this.bgCanvas.width = inlineSize;
      bgCanvasDom.height = this.bgCanvas.height = blockSize;
      this.bgLoad &&
        this.bgCanvas.context.drawImage(this.bgCanvas.newImg, ...this.getDrawImageCoverParameter(this.bgCanvas.newImg));
      // this.bgCanvas.context.scale(dpr,dpr);
    });
    this.bgCanvas.resizeObserver.observe(this.$refs.bgContainer, { box: 'device-pixel-content-box' });
  },
  beforeDestroy() {
    this.bgCanvas.resizeObserver.disconnect();
  },
};
</script>

<style scoped>
.hide {
  opacity: 0;
}
.bg-container {
  background-image: url(~@/assets/images/music/music_background.jpg);
  background-size: cover;
  background-position: center;
  filter: blur(20px);
  /* 去白边 */
  transform: scale(1.1);
}
.bg-container,
.list-background,
.bg-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.list-background {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  transition: all 0.8s;
}

#mask {
  position: absolute;
  opacity: 0.4;
  z-index: 2;
}
</style>