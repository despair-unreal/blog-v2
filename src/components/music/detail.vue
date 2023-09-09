<template>
  <div id="detail" :class="{ open: isOpen }" @transitionend="isOpen && scrollalbumName.needScroll && scrollAlbumName()">
    <background></background>
    <div class="container">
      <div class="left">
        <div class="rhyme"></div>
        <div class="msg">
          <span>{{ formatTime(currentTime) }}</span>
          <h1>{{ msg.name }}</h1>
          <h2>{{ msg.artists }}</h2>
          <div class="lyric">
            <slot name="lyric"></slot>
          </div>
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
                ref="albumName"
                v-for="item in Number(scrollalbumName.needScroll) + 1"
                :key="item"
                @mouseenter="scrollalbumName.needScroll && scrollAlbumName()"
                >专辑&lt;{{ msg.album }}&gt;</span
              >
            </div>
          </div>
          <div class="show-controls">
            <i @click="close" class="btn-close iconfont icon-xiangshang" title="关闭"></i>
            <i class="iconfont icon-lyric-mode" title="歌词模式"></i>
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
import Background from './background.vue';
import { musicControls } from '@/mixmin/musicControl.js';
import { mapState } from 'vuex';

export default {
  mixins: [musicControls],
  components: {
    Background,
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
      scrollalbumName: {
        isScrolling: false,
        needScroll: false,
      },
    };
  },
  computed: {
    ...mapState(['mode']),
    // 动态设置css变量并且开启让专辑名滚动的动画，加了节流
    // 这个css变量是用来设置需要平移的距离和滚动的动画时间
    scrollAlbumName() {
      const handler = () => {
        this.$refs.albumNameContainer.style.setProperty('--scroll-width', this.$refs.albumName[0].offsetWidth);
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
    'msg.album'() {
      // 更换歌曲后
      this.$nextTick(() => {
        // 先重置是否滚动专辑名的标志
        this.scrollalbumName.isScrolling = false;
        this.scrollalbumName.needScroll = false;
        // 判断专辑名是否超过容器宽度
        // 如果超出了容器宽度更换歌曲后先触发一次专辑名滚动（前提是打开了详情页）
        const albumName = this.$refs.albumName[0];
        if (albumName.offsetWidth > this.$refs.albumNameContainer.clientWidth) {
          this.scrollalbumName.needScroll = true;
          this.isOpen && this.scrollAlbumName();
        }
      });
    },
  },
  methods: {
    // 关闭详情页并移除专辑名的滚动动画
    close() {
      this.isOpen = false;
      this.scrollalbumName.isScrolling = false;
    },
  },
  created() {
    this.$bus.$on('openDetail', () => (this.isOpen = true));
  },

  beforeDestroy() {
    this.$bus.$off('openDetail');
  },
};
</script>

<style scoped>
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
  width: 100%;
  height: 100%;
  /* padding: 80px 25px 25px 25px; */
  padding: 80px 10% 40px 10%;
  z-index: 3;
}
.container .middle {
  height: 100%;
  width: 8%;
  flex-shrink: 0;
}
.container .left {
  flex: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: left;
}
.container .left .rhyme {
  flex: 1;
}
.container .left .msg {
  min-height: 50%;
  width: 100%;
}
.container .left .msg span {
  font-size: 22px;
}
.container .left .msg h1 {
  font-size: 70px;
  line-height: 1.2;
}
.container .left .msg h2 {
  font-weight: normal;
  font-size: 34px;
  line-height: 1.2;
}
.container .left .msg .lyric {
  margin: 50px 0 60px 0;
  font-size: 20px;
  font-style: italic;
  line-height: 1.4;
}
.container .right {
  flex: 1.4;
  height: 100%;
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
  text-align: center;
}
.container .right .music-controls {
  display: flex;
  align-items: center;
  justify-content: center;
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