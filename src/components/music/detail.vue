<template>
  <div id="detail" :class="{ open: isOpen }" @transitionend="isOpen && scrollalbumName.needScroll && scrollAlbumName()">
    <background></background>
    <div class="container">
      <div class="left">
        <div :class="['left-container', { translateX: isOnlyLyric }]">
          <div class="rhyme-msg-lyric">
            <canvas ref="rhyme" class="rhyme"></canvas>
            <div class="msg-lyric">
              <div class="msg">
                <span>{{ formatTime(currentTime) }}</span>
                <h1 ref="musicName" class="text-overflow">{{ msg.name }}</h1>
                <h2 ref="artists" class="text-overflow">{{ msg.artists }}</h2>
              </div>
              <div ref="lyric" class="lyric">
                <!-- <slot name="lyric"></slot> -->
              </div>
            </div>
          </div>
          <!-- <lyric class="only-lyric"></lyric> -->
        </div>
      </div>
      <div class="middle"></div>
      <div class="right">
        <div class="cover" :style="{ backgroundImage: coverSrc }"></div>
        <div class="album">
          <div ref="albumNameContainer" class="album-name">
            <div
              :class="['album-name-container', { scrolling: scrollalbumName.isScrolling }]"
              @animationend="scrollalbumName.isScrolling = false">
              <span
                ref="albumNameRight"
                v-for="item in Number(scrollalbumName.needScroll) + 1"
                :key="item"
                @mouseenter="scrollalbumName.needScroll && scrollAlbumName()"
                >专辑&lt;{{ msg.album }}&gt;</span
              >
            </div>
          </div>
          <div class="show-controls">
            <i @click="close" class="btn-close iconfont icon-xiangshang" title="关闭"></i>
            <i
              :class="['iconfont', `${isOnlyLyric ? 'icon-lyric-mode' : 'icon-lyric-mode-close'}`]"
              :title="`${isOnlyLyric ? '关闭' : '开启'}歌词模式`"
              @click="changeView"></i>
            <div class="volume">
              <i
                v-if="!volume.soundsOff"
                title="音量"
                :class="['iconfont icon-sound-on', { drag: volume.showBar }]"
                @click="setMuted"></i>
              <i
                v-else
                title="静音"
                :class="['iconfont icon-sound-off', { drag: volume.showBar }]"
                @click="setMuted"></i>
              <div :class="['bar-container', { show: volume.showBar }]">
                <div ref="volume" class="bar" @mousedown="adjustVolume('bar', $event, 'y')">
                  <div :style="{ height: `${this.volume.percent}%` }" class="current-bar"></div>
                  <div
                    :style="{ bottom: `${this.volume.percent}%` }"
                    class="point"
                    @mousedown.stop="adjustVolume('point', $event, 'y')"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="progress">
          <div ref="progress" class="bar" @mousedown="adjustCurrent('bar', $event, 'x')">
            <div
              :style="{ left: `${this.current.percent}%` }"
              class="point"
              @mousedown.stop="adjustCurrent('point', $event, 'x')"></div>
            <div :style="{ width: `${this.current.percent}%` }" class="current-bar"></div>
            <div :style="{ width: `${this.bufferedPercent}%` }" class="buffered-bar"></div>
          </div>
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <!-- <span>{{ $parent.$parent.formatTime(currentTime) }}</span> -->
        </div>
        <div class="music-controls">
          <i
            :class="['iconfont mode', item.icon]"
            v-for="(item, index) in playMode"
            :key="item.mode"
            v-show="mode === item.mode"
            @click="setMode(index)"
            :title="item.title"></i>
          <i @click="playPrevious" title="上一首" class="iconfont icon-play-previous"></i>
          <i v-show="!isPlay" @click="play" title="播放" class="iconfont icon-play"></i>
          <i v-show="isPlay" @click="pause" title="暂停" class="iconfont icon-pause"></i>
          <i @click="playNext" title="下一首" class="iconfont icon-play-next"></i>
          <i v-show="isVerbatim" @click="setVerbatimLyric" title="逐字模式">逐字</i>
          <i v-show="!isVerbatim" @click="setVerbatimLyric" title="逐行模式">逐行</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import lyric from './lyric.vue';
import Background from './background.vue';
import { musicControls } from '@/mixmin/musicControl.js';

export default {
  mixins: [musicControls],
  components: {
    Background/* ,lyric */
  },
  props: {
    cover: String,
    msg: Object,
  },
  data() {
    return {
      isOpen: false,
      coverSrc: '',
      showVolume: false,
      isOnlyLyric: false,
      scrollalbumName: {
        isScrolling: false,
        needScroll: false,
      },
      rhyme: {
        analyser: null,
        width: 0,
        height: 0,
        context: null,
        animationId: null,
        data: null,
      },
      resizeObserver: {},
    };
  },
  computed: {
    // 动态设置css变量并且开启让专辑名滚动的动画，加了节流
    // 这个css变量是用来设置需要平移的距离和滚动的动画时间
    scrollAlbumName() {
      const handler = () => {
        this.$refs.albumNameContainer.style.setProperty('--scroll-width', this.$refs.albumNameRight[0].offsetWidth);
        this.scrollalbumName.isScrolling = true;
      };
      return this.$utils.throttle(handler, 2000);
    },
  },
  watch: {
    async cover(src) {
      if (src) {
        await this.$utils.loadImg(src);
        this.coverSrc = `url(${src})`;
      }
    },
    'msg.name'() {
      this.$refs.musicName.style.fontSize = '';
      this.$nextTick(() => {
        this.adjustTextSize(this.$refs.musicName, 2, 12, 1);
      });
    },
    'msg.artists'() {
      this.$refs.artists.style.fontSize = '';
      this.$nextTick(() => {
        this.adjustTextSize(this.$refs.artists, 1, 12, 1);
      });
    },
    'msg.album'() {
      // 更换歌曲后
      this.$nextTick(() => {
        // 先重置是否滚动专辑名的标志
        this.scrollalbumName.isScrolling = false;
        this.scrollalbumName.needScroll = false;
        // 判断专辑名是否超过容器宽度
        // 如果超出了容器宽度更换歌曲后先触发一次专辑名滚动（前提是打开了详情页）
        const albumName = this.$refs.albumNameRight[0];
        if (albumName.offsetWidth > this.$refs.albumNameContainer.clientWidth) {
          this.scrollalbumName.needScroll = true;
          this.isOpen && this.scrollAlbumName();
        }
      });
    },
    isPlay(v) {
      if (v) {
        this.getRhymeDataRender();
      } else cancelAnimationFrame(this.rhyme.animationId);
    },
  },
  methods: {
    // 关闭详情页并移除专辑名的滚动动画
    close() {
      this.isOpen = false;
      this.scrollalbumName.isScrolling = false;
    },
    changeView() {
      this.isOnlyLyric = !this.isOnlyLyric;
    },
    // 获取音频数据并渲染绘图
    getRhymeDataRender() {
      const bufferLength = this.rhyme.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const renderFrame = () => {
        this.rhyme.animationId = requestAnimationFrame(renderFrame);
        // 更新频率数据
        this.rhyme.analyser.getByteFrequencyData(dataArray);
        this.rhyme.context.clearRect(0, 0, this.rhyme.width, this.rhyme.height);
        // 保留每次动画的音频数据，以提供暂停音乐时绘图
        this.rhyme.data = { dataArray, bufferLength };
        this.drawRhyme('x', bufferLength, dataArray);
      };
      renderFrame();
    },
    // 绘画音频图
    drawRhyme(direction = 'x', bufferLength, dataArray) {
      // x表示横向排列
      const isXDirection = direction === 'x';
      // space:间隔长度 stretch:拉伸整体的长度或宽度的倍数
      const space = 2;
      const stretch = 1.5;
      // v1:每个矩形的长度或宽度（根据方向决定是长度还是宽度）,该值为固定值，不会随频谱变化
      const slice = ((isXDirection ? this.rhyme.width : this.rhyme.height) * 1.0) / bufferLength;
      const v1 = (slice - (space * (bufferLength - 1)) / bufferLength) * stretch;
      // 遍历数据并绘图
      const limit = isXDirection ? this.rhyme.width : this.rhyme.height;
      const ctx = this.rhyme.context;
      for (let i = 0, k = 0; i < bufferLength && k < limit; i++) {
        const data = dataArray[i] / 255;
        // v2:每个矩形的长度或宽度（根据方向决定是长度还是宽度）,该值会随频谱变化
        const v2 = data * (isXDirection ? this.rhyme.height * 0.6 : this.rhyme.width * 0.08);
        const rectWidth = isXDirection ? v1 : v2;
        const rectHeight = isXDirection ? v2 : v1;
        const x = isXDirection ? k : 0;
        const y = isXDirection ? this.rhyme.height - rectHeight : k;
        const l = 50 + data * 50;
        ctx.fillStyle = `hsl(0,0%,${l}%)`;
        ctx.fillRect(x, y, rectWidth, rectHeight);
        k += (isXDirection ? rectWidth : rectHeight) + space;
      }
    },
    // 初始化音频可视化相关设置
    initRhyme() {
      // 创建 AudioContext，关联音频输入
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      // 获取音频的频率数据（ FrequencyData ）和时域数据（ TimeDomainData ），从而实现音频的可视化
      this.rhyme.analyser = ctx.createAnalyser();
      this.rhyme.analyser.fftSize = 256;
      // 通过<audio>节点创建音频源
      const source = ctx.createMediaElementSource(this.musicAudioDom);
      // 将音频源关联到分析器
      source.connect(this.rhyme.analyser);
      // 将分析器关联到输出设备（耳机、扬声器）
      this.rhyme.analyser.connect(ctx.destination);
    },
    initCanvas() {
      const $rhyme = this.$refs.rhyme;
      const dpr = window.devicePixelRatio;
      this.rhyme.context = $rhyme.getContext('2d');
      this.resizeObserver.rhyme = new ResizeObserver((entries) => {
        const { inlineSize, blockSize } = entries[0].devicePixelContentBoxSize[0];
        $rhyme.width = this.rhyme.width = inlineSize;
        $rhyme.height = this.rhyme.height = blockSize;
        // 设置画笔
        // this.rhyme.context.scale(1.25,1.25);
        this.rhyme.context.strokeStyle = '#fff';
        this.rhyme.context.lineWidth = dpr * 2;
        // 画布大小变动并且音乐处于暂停状态时画出最后一帧音频图
        if (this.rhyme.data && !this.isPlay) {
          const { bufferLength, dataArray } = this.rhyme.data;
          this.rhyme.data && this.drawRhyme('x', bufferLength, dataArray);
        }
      });
      this.resizeObserver.rhyme.observe(this.$refs.rhyme, { box: 'device-pixel-content-box' });
    },
    // 文本溢出自动缩小字体
    adjustTextSize(target, limitLineNum, minSize, step) {
      const ctx = document.createElement('canvas').getContext('2d');
      // 等歌词出现再监听
      // console.log(this.$refs.lyric);
      const computedStyle = window.getComputedStyle(target);
      let { fontFamily, fontSize } = computedStyle;
      fontSize = Number(fontSize.slice(0, -2));
      const isOverFlowFunc = () => {
        const lineHeight = Number(computedStyle.lineHeight.slice(0, -2));
        const maxLineHeight = Math.round(lineHeight * limitLineNum);
        const overflowHeight = target.scrollHeight - Math.round(maxLineHeight);
        // console.log(overflowHeight , Math.round(lineHeight))
        return overflowHeight >= Math.round(lineHeight);
      };
      // 判断是否溢出
      let isOverFlow = isOverFlowFunc();
      // 未超出允许行数 或 已经设置过了
      if (!isOverFlow || target.style.length > 0) return;
      // 利用canvas计算文本未折行时的宽度
      ctx.font = `${fontSize}px ${fontFamily}`;
      const { width: measuredWidth } = ctx.measureText(target.innerText);
      // 应满足的能容纳文本的最大宽度与文本的实际宽度的比例
      const scale = (target.offsetWidth * limitLineNum) / measuredWidth;
      // 通过比例缩放初步计算字体大小（能满足容纳最大宽度的字体大小与原字体大小的比例应等于上面的宽度比例）
      const firstFontSize = Math.max(minSize, fontSize * scale);
      const vw = window.innerWidth / 100;
      target.style.fontSize = `${firstFontSize / vw}vw`;
      // 判断是否仍然溢出
      isOverFlow = isOverFlowFunc();
      if (!isOverFlow) return;
      // 通过循环再次缩小字号
      let finalFontSize = firstFontSize;
      while (isOverFlow && firstFontSize > minSize) {
        finalFontSize = Math.max(finalFontSize - step, minSize);
        target.style.fontSize = `${finalFontSize / vw}vw`;
        isOverFlow = isOverFlowFunc();
      }
    },
  },
  created() {
    this.$bus.$on('openDetail', () => (this.isOpen = true));
  },
  mounted() {
    this.initRhyme();
    this.initCanvas();
  },
  activated() {
    this.isPlay && this.getRhymeDataRender();
  },
  deactivated() {
    cancelAnimationFrame(this.rhyme.animationId);
  },
  beforeDestroy() {
    this.$bus.$off('openDetail');
    Object.values(this.resizeObserver).forEach((v) => {
      v.disconnect();
    });
  },
};
</script>

<style scoped>
.text-overflow {
  word-break: normal;
}
#detail {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  transition: transform 0.6s;
  overflow: hidden;
  z-index: 9;
}
#detail.open {
  transform: translateY(-100%);
}

.container {
  position: relative;
  display: flex;
  width: 80%;
  height: 100%;
  margin: auto;
  z-index: 3;
}

.container .middle {
  height: 100%;
  width: 8%;
  flex-shrink: 0;
}
.container .left {
  flex: 2;
  width: 54%;
  height: 100%;
  overflow: hidden;
}
.container .left .left-container.translateX {
  transform: translateX(-100%);
}
.container .left .left-container {
  display: flex;
  transition: all 0.6s;
}
.container .left .left-container > div,
.container .left .left-container {
  height: 100%;
  width: 100%;
  flex-shrink: 0;
}
.container .left .left-container .rhyme-msg-lyric {
  text-align: left;
}
.container .left .left-container .only-lyric {
  /* background: black; */
  font-size: 22px;
}
.container .left .left-container .rhyme-msg-lyric .rhyme {
  height: 40%;
  width: 100%;
}
.container .left .left-container .rhyme-msg-lyric .msg-lyric {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 60%;
  width: 100%;
}
.container .left .left-container .rhyme-msg-lyric .msg-lyric .msg span {
  font-size: 22px;
}
.container .left .left-container .rhyme-msg-lyric .msg-lyric .msg h1 {
  font-size: 70px;
  line-height: 1.2;
  -webkit-line-clamp: 2;
}
.container .left .left-container .rhyme-msg-lyric .msg-lyric .msg h2 {
  font-weight: normal;
  font-size: 34px;
  line-height: 1.2;
  -webkit-line-clamp: 1;
}
.container .left .left-container .rhyme-msg-lyric .msg-lyric .lyric {
  /* margin: 50px 0 60px 0; */
  margin: 10px 0;
  font-size: 20px;
  font-style: italic;
  line-height: 1.4;
}
.container .right {
  position: relative;
  width: 38%;
  height: calc(100% - 160px);
  margin: auto 0;
  min-width: 0;
  --barColor: rgba(255, 255, 255, 0.15);
  --currentColor: rgba(255, 255, 255, 0.4);
  --pointCOlor: #eee;
}
.container .right .cover {
  height: 70%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.6s;
}
.container .right .album {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.container .right .album .album-name {
  flex: 1;
  --stopped-mask: linear-gradient(270deg, transparent, #000 15px);
  --stopped-mask-rtl: linear-gradient(-270deg, transparent, #000 15px);
  --animated-mask: linear-gradient(90deg, transparent, #000 30px, #000 calc(100% - 30px), transparent);
  white-space: nowrap;
  overflow: hidden;
  mask: var(--stopped-mask, linear-gradient(270deg, transparent 0, black 15px));
}

.container .right .album .album-name:has(.scrolling) {
  mask: var(
    --animated-mask,
    linear-gradient(90deg, transparent 0, black 30px, black calc(100% - 30px), transparent 100%)
  );
}
.container .right .album .album-name .album-name-container.scrolling {
  animation-name: scroll-album-name;
  animation-duration: calc(var(--scroll-width) / 25 * 1.25s);
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  will-change: transform;
}
@keyframes scroll-album-name {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(var(--scroll-width) * -1px));
  }
}
.container .right .album .album-name .album-name-container span {
  font-size: 20px;
  white-space: nowrap;
  padding-right: 8px;
}
.container .right .album i.btn-close {
  transform: rotateX(180deg);
}
.container .right .album .show-controls {
  padding-left: 10px;
}
.container .right .album .show-controls i {
  margin: 0 10px;
}
.container .right .album .show-controls .icon-lyric-mode.open {
  opacity: 1;
}
.container .right .album .show-controls .volume {
  display: inline-block;
  position: relative;
}
.container .right .album .show-controls .volume .bar-container {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: -106px;
  height: 100px;
  width: 100%;
  padding: 6px 0;
  border-radius: 6px;
  transition: all 0.2s ease-out 0s;
  background: var(--containerBgColor);
  --containerBgColor: rgba(0, 0, 0, 0.25);
}
.container .right .album .show-controls .volume .bar-container.show,
.container .right .album .show-controls .volume .bar-container:hover,
.container .right .album .show-controls .volume i:hover + .bar-container {
  opacity: 1;
  visibility: visible;
}
.container .right .album .show-controls .volume i.drag,
.container .right .album .show-controls .volume:has(.bar-container:hover) i {
  opacity: 1;
}
.container .right .album .show-controls .volume .bar-container::after {
  display: block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -17.6px;
  border: 8px solid transparent;
  border-top: 10px solid var(--containerBgColor);
  content: '';
}
.container .right .album .show-controls .volume .bar-container .bar {
  position: relative;
  height: 100%;
  margin: auto;
  padding-top: var(--pointHeight);
  display: flex;
  flex-direction: column-reverse;
  background: var(--barColor);
  --pointHeight: 10px;
}
.container .right .album .show-controls .volume .bar-container .bar,
.container .right .album .show-controls .volume .bar-container .bar .current-bar {
  width: 4px;
  border-radius: 4px;
}
.container .right .album .show-controls .volume .bar-container .bar .current-bar {
  position: absolute;
  bottom: 0;
  height: 80%;
  background: var(--currentColor);
  pointer-events: none;
}
.container .right .album .show-controls .volume .bar-container .bar .point {
  position: relative;
  left: 50%;
  bottom: 0%;
  transform: translateX(-50%);
  width: var(--pointHeight);
  height: var(--pointHeight);
  border-radius: 50%;
  background: var(--pointCOlor);
  cursor: pointer;
}
.container .right i {
  display: inline-block;
  cursor: pointer;
  font-size: 14px;
  font-style: normal;
  opacity: 0.38;
  transition: all 0.2s ease-out 0s;
}
.container .right i:hover {
  opacity: 1 !important;
}
.container .right .music-controls {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.container .right .music-controls i {
  margin: 0 20px;
}
.container .right .music-controls i.icon-play,
.container .right .music-controls i.icon-pause {
  font-size: 32px;
  margin: 0 4px;
  padding: 0 16px;
  opacity: 1;
}
.container .right .music-controls i.icon-play-previous,
.container .right .music-controls i.icon-play-next {
  font-size: 22px;
  opacity: 0.64;
}
.container .right .music-controls i.icon-play:hover,
.container .right .music-controls i.icon-pause:hover {
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.container .right .progress {
  width: 100%;
  margin-top: 18px;
}
.container .right .progress .bar {
  position: relative;
  height: 4px;
  width: 100%;
  padding-right: 10px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.15);
  /* cursor: pointer; */
}
.container .right .progress .bar .current-bar,
.container .right .progress .bar .buffered-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
}
.container .right .progress .bar .current-bar {
  background: var(--currentColor);
}
.container .right .progress .bar .buffered-bar {
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.2s;
}
.container .right .progress .bar .point {
  position: relative;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #eee;
  cursor: pointer;
  content: '';
}
</style>