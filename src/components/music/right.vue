<template>
  <div>
    <div class="right">
      <div class="info">
        <div class="disc-cover">
          <div :class="['CD', { rotate: isPlay }]">
            <img class="disc" src="~@/assets/images/music/placeholder_disk_play_song.png" />
            <img
              ref="cover"
              :class="['cover', { hidden: hiddenCover }]"
              @error="$refs.cover.src = ''"
              @load="hiddenCover = false"
              :src="cover || ''" />
          </div>
          <img :class="['needle', { playNeedle: isPlay }]" src="~@/assets/images/music/needle-ip6.png" />
          <img
            ref="bag"
            :class="['bag', { hidden: hiddenCover }]"
            @error="$refs.bag.src = ''"
            @load="hiddenCover = false"
            :src="cover || ''" />
        </div>
        <p v-if="msg.name">歌曲名：{{ msg.name }}</p>
        <p v-if="msg.artists">歌手名：{{ msg.artists }}</p>
        <p v-if="msg.album">专辑名：{{ msg.album }}</p>
      </div>
      <div class="lyric" ref="lyric">
        <div class="no-lyric" v-show="!lyric">暂无歌词</div>
        <div ref="container" class="container" v-show="lyric">
          <div
            ref="line"
            v-for="([time, line], lineIndex) in showLyric"
            :key="lineIndex"
            :style="getLineStyle(lineIndex)"
            :class="['line', { active: activeLine === lineIndex }]">
            <!-- 逐字yrc -->
            <div ref="yrcLine" v-if="typeof line === 'object'">
              <span
                :ref="lineIndex === activeLine && 'activeWord'"
                :class="['word', { active: lineIndex === activeLine }, { stop: lineIndex === activeLine && !isPlay }]"
                :style="[
                  { animationDuration: `${lineIndex === activeLine ? duration : 0}ms` },
                  { animationDelay: `${lineIndex === activeLine ? delay : 0}ms` },
                ]"
                v-for="([{ wordTime, duration, delay }, word], wordIndex) in line"
                :key="wordIndex"
                >{{ word }}</span
              >
            </div>
            <!-- 逐行lrc -->
            <div v-else>
              {{ line }}
            </div>
            <div v-if="lyric.tlyric && lineTimes.lrc" class="translate-line">
              {{ lyric.tlyric.get(lineTimes.lrc[lineIndex]) }}
            </div>
          </div>
        </div>
      </div>
      <div class="other">
        本页面接口源自<a href="https://github.com/Binaryify/NeteaseCloudMusicApi">NeteaseCloudMusicApi</a>
      </div>
    </div>
    <detail :cover="cover" :msg="msg">
      <template v-slot:lyric>
        <div v-if="lineTimes.lrc" v-html="$refs.line[activeLine].innerHTML"></div>
      </template>
    </detail>
  </div>
</template>

<script>
import detail from './detail.vue';
import { mapGetters, mapState, mapMutations } from 'vuex';
import { Music } from './Music.js';

export default {
  components: {
    detail,
  },
  data() {
    return {
      timeChange: false,
      activeLine: 0,
      translateY: 30,
      scrollTop: 0,
      hiddenCover: true,
      utils: new Music(this),
    };
  },
  computed: {
    ...mapGetters(['getCurrentMusic']),
    ...mapState(['currentMusicId', 'currentTime', 'isPlay', 'isVerbatim']),
    msg() {
      const { name = '', artists = '', album = '' } = this.getCurrentMusic || {};
      return { name, artists, album };
    },
    cover() {
      return this.getCurrentMusic?.cover || '';
    },
    lyric() {
      this.$nextTick(() => {
        // 滚动到歌词最上方的位置并记录坐标
        const scrollTop = -this.$refs.container.clientHeight + this.$refs.lyric.clientHeight;
        this.$refs.lyric.scrollTop = scrollTop;
        this.scrollTop = this.$refs.lyric.scrollTop;
      });
      // lyric.yrc || lyric.lrc
      return this.getCurrentMusic?.lyric || '';
    },
    // 显示的歌词
    showLyric() {
      if (this.lyric) return this.isVerbatim ? this.lyric.yrc || this.lyric.lrc : this.lyric.lrc;
      else return '';
    },
    lineTimes() {
      // 歌词每行时间数组
      const { yrc = '', lrc = '' } = this.lyric;
      if (yrc || lrc) {
        const obj = {};
        yrc && (obj['yrc'] = [...yrc.keys()]);
        lrc && (obj['lrc'] = [...lrc.keys()]);
        return obj;
      } else return '';
    },
  },
  watch: {
    async currentMusicId(id) {
      console.log('change id');
      this.reset();
      // 取消前一次未完成的请求
      this.utils.cancel && this.utils.cancel();
      if(!id) return;
      // 请求列表
      const task = [];
      !this.getCurrentMusic?.cover && task.push('detail');
      !this.getCurrentMusic?.lyric && task.push('lyric');
      // 获取封面和歌词的数据
      const data = await this.utils.getMusicUrlAndLyric(id, task);
      // 封面
      if(data.detail){
        const detail = data.detail.value || data.detail.reason;
        this.setCover(detail, data.detail.status);
      }
      // 歌词
      if(data.lyric){
        const lyric = data.lyric.value || data.lyric.reason;
        this.setLyric(lyric, data.lyric.status);
      }
    },
    activeLine(activeLine) {
      if (this.$refs.line) {
        let y = this.$refs.line[0].clientHeight;
        if (activeLine > 1) {
          // 计算换播放行时，每行歌词应移动的距离
          // 保持播放行前面有一行半的歌词存在
          const pre2Dom = this.$refs.line[activeLine - 2];
          y = -(pre2Dom.offsetTop + pre2Dom.clientHeight / 2);
        } else y = 30;
        this.translateY = y;
        // 保持歌词滚动位置
        this.$refs.lyric.scroll({
          top: this.scrollTop,
          behavior: 'smooth',
        });
      }
    },
    currentTime(time) {
      // 获取下一播放行坐标
      if (this.lineTimes?.lrc) {
        const lineIndex = this.lineTimes.lrc.findIndex((value, index) => {
          return time < value && index !== 0;
        });
        // 找不到说明播到最后一行了
        this.activeLine = (lineIndex === -1 ? this.lineTimes.lrc.length : lineIndex) - 1;
        // 调了进度条，并且歌词为逐字歌词
        if (this.timeChange && this.lyric.yrc) {
          this.timeChange = false;
          const line = this.lyric.yrc.get(this.lineTimes.yrc[this.activeLine]);
          if (typeof line === 'object') {
            const activeWords = [...line.keys()];
            // 计算播放到哪个字
            const wordIndex = activeWords.findLastIndex((value) => {
              return time >= value.wordTime;
            });
            // 获取更新后的 DOM并执行修改动画参数的函数
            wordIndex !== -1 &&
              this.$nextTick(() => {
                // 暂时移除动画
                this.$refs.activeWord.forEach((el) => {
                  el.classList.remove('active');
                });
                // 触发重绘让移除生效
                void this.$refs.activeWord[0].offsetWidth;
                setStyle();
              });
            // 根据播放进度修改动画进度
            const setStyle = () => {
              this.$refs.activeWord.forEach((el, index) => {
                // 播放过的字
                let animationDuration = '0ms';
                let animationDelay = '0ms';
                if (wordIndex === index) {
                  // 正在播放的字
                  const activeWord = activeWords[index];
                  animationDelay = `-${time - activeWord.wordTime}ms`;
                  animationDuration = `${activeWords[index].duration}ms`;
                } else if (wordIndex < index) {
                  // 等待播放的字
                  animationDelay = `${activeWords[index].delay - (time - this.lineTimes.yrc[this.activeLine])}ms`;
                  animationDuration = `${activeWords[index].duration}ms`;
                }
                el.style.animationDelay = animationDelay;
                el.style.animationDuration = animationDuration;
                // 把动画添加回来播放动画
                el.classList.add('active');
              });
            };
          }
        }
      }
    },
  },
  methods: {
    ...mapMutations(['addPropertyToCurrentMusic']),
    // 给每一行歌词加样式
    getLineStyle(index) {
      // 只给播放行前5行和后7行加上延迟
      let delay = (index - (this.activeLine - 3)) * 0.12;
      (index < this.activeLine - 6 || index > this.activeLine + 7) && (delay = 0);
      return [{ transform: `translateY(${this.translateY}px)` }, { transitionDelay: `0s, 0s, 0s, ${delay}s` }];
    },
    reset() {
      // 封面路径变动，重新获取图片，暂时隐藏以免图裂
      this.hiddenCover = true;
      // 重置歌词滚动高亮进度
      this.activeLine = 0;
      this.$refs.lyric.scrollTop = 0;
    },
    // 处理获取到的封面链接数据并记录
    setCover(detail, status) {
      if (status === 'fulfilled') {
        const filterData = this.$utils.filterObjectInArray(detail, [{ al: 'picUrl' }]);
        const cover = filterData[0].al.picUrl;
        this.addPropertyToCurrentMusic({ key: 'cover', value: cover });
      }
    },
    // 处理获取到的歌词数据并记录
    setLyric(allLyric, status) {
      if (status === 'fulfilled') {
        const { yrc, lrc, tlyric } = allLyric;
        // 处理歌词数据
        const getLyric = new Map([
          ['yrc', yrc ? () => this.analysisLyric(yrc, 'yrc') : ''],
          ['lrc', lrc ? () => this.analysisLyric(lrc) : ''],
          ['tlyric', tlyric ? () => this.analysisLyric(tlyric) : ''],
        ]);
        // 记录数据
        const lyric = {};
        for (const [key, value] of getLyric) {
          value && (lyric[key] = value());
        }
        Object.keys(lyric).length !== 0 && this.addPropertyToCurrentMusic({ key: 'lyric', value: lyric });
      }
    },
    // 解析歌词行
    getLine(lyric, type) {
      const lrc = (value) => {
        // 捕获时间和歌词行
        const msg = value.match(/\[(?<min>\d{2}):(?<sec>\d{2}).(?<ms>\d+)\](?<line>[\w\W]+)/);
        if (!msg) return;
        const { min, sec, ms, line } = msg.groups;
        // 转换为毫秒
        const time = (Number(min) * 60 + Number(sec)) * 1000 + Number(ms);
        return { time, line };
      };
      const yrc = (value) => {
        // 先捕获行开始时间和行内所有歌词
        const msg = value.match(/\[(?<time>\d+),(\d+)\](?<line>[\w\W]+)/);
        if (!msg) return;
        const time = msg.groups.time;
        // 再把歌词分成时间+字的分组
        const verbatim = msg.groups.line.match(/\((\d+,\d+,\d+)\)([\w\W]+?)(?=\(\d+,\d+,\d+\)|$)/g);
        const line = new Map();
        // 遍历行内所有字，捕获字开始时间、持续时间、字
        verbatim.reduce((preDuration, v) => {
          const msg = v.match(/\(((?<wordTime>\d+),(?<duration>\d+),\d+)\)(?<word>[\w\W]+)/);
          const { wordTime, duration, word } = msg.groups;
          line.set({ wordTime: Number(wordTime), duration: Number(duration), delay: preDuration }, word);
          // 计算下一个字的高亮动画延迟时间：前面的字的动画执行时间累加
          const delay = preDuration + Number(duration);
          return delay;
        }, 0);
        return { time: Number(time), line };
      };
      const fn = new Map([
        ['lrc', () => lrc(lyric)],
        ['yrc', () => yrc(lyric)],
      ]);
      return fn.get(type)();
    },
    // 解析歌词
    analysisLyric(lyric, type = 'lrc') {
      const data = new Map();
      lyric.split('\n').forEach((value) => {
        try {
          // 作词作曲
          const msg = JSON.parse(value);
          const artists = msg.c
            .map((obj) => {
              return obj.tx;
            })
            .join('');
          const time = Number(msg.t);
          data.has(time) ? data.set(time, data.get(time) + `\n${artists}`) : data.set(time, artists);
        } catch (error) {
          // 歌词
          if (value) {
            const result = this.getLine(value, type);
            if (!result) return;
            const { time, line } = result;
            data.set(time, line);
          }
        }
      });
      return data;
    },
  },
  created() {
    // 监听是否调了进度条
    this.$bus.$on('timeChange', () => {
      this.timeChange = true;
    });
  },
  beforeDestroy() {
    this.$bus.$off('timeChange');
  },
};
</script>

<style scoped>
.right {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
  margin-left: 10px;
  text-align: center;
}
@media (max-width: 960px) {
  .right {
    display: none;
  }
}
.other {
  font-size: 12px;
}
.info .disc-cover {
  position: relative;
  width: 246px;
  height: 172px;
  margin: 0 auto;
  margin-bottom: 15px;
}

.info .disc-cover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 129px;
  display: block;
  background: radial-gradient(50px at right, transparent 50%, rgba(255, 255, 255, 0.1) 50%);
  height: 100%;
  width: 43px;
  z-index: 2;
}
.info .disc-cover::after {
  content: '';
  position: absolute;
  display: block;
  background: rgba(255, 255, 255, 0.1);
  height: 100%;
  width: 129px;
}

.info .disc-cover img[src=''],
.info .disc-cover img:not([src]) {
  opacity: 0;
}
.info .disc-cover img.bag {
  display: inline-block;
  position: absolute;
  top: 6px;
  left: 6px;
  object-fit: cover;
  height: calc(100% - 12px);
  width: 162px;
}

.info .disc-cover .CD {
  position: absolute;
  top: 6px;
  left: 86px;
  height: calc(100% - 12px);
  border-radius: 50%;
  animation: rotate 22s linear infinite;
  animation-play-state: paused;
}
.info .disc-cover .CD.rotate {
  animation-play-state: running;
}
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
.info .disc-cover img.disc {
  height: 100%;
  border-radius: 50%;
}
.info .disc-cover img.bag,
.info .disc-cover img.cover {
  transition: opacity 0.2s;
}
.info .disc-cover img.hidden {
  opacity: 0;
  transition: none;
}
.info .disc-cover img.cover {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 118px;
  width: 118px;
  border-radius: 50%;
  object-fit: cover;
  transform: translate(-50%, -50%);
}

.info .disc-cover img.needle {
  position: absolute;
  top: 14px;
  right: -72px;
  width: 58px;
  transform-origin: top center;
  transform: rotate(28deg);
  transition: all 0.4s;
}
.info .disc-cover img.playNeedle {
  transform: rotate(50deg);
}
.lyric {
  display: flex;
  flex-direction: column-reverse;
  flex: 1;
  font-size: 12px;
  margin: 20px 0 10px 0;
  overflow-y: scroll;
  mask-image: linear-gradient(
    180deg,
    hsla(0, 0%, 100%, 0) 0,
    hsla(0, 0%, 100%, 0.92) 15%,
    #fff 25%,
    #fff 75%,
    hsla(0, 0%, 100%, 0.92) 85%,
    hsla(0, 0%, 100%, 0)
  );
}

.lyric > div {
  position: relative;
  top: 0;
  flex-shrink: 0;
}
.lyric > .no-lyric {
  margin: auto 0;
}
.lyric::-webkit-scrollbar {
  display: none;
}
.lyric .placeholder {
  width: 100%;
}

.lyric .container > .line {
  font-weight: bold;
  padding: 6px 0;
  filter: blur(0.8px);
  /* filter: blur(4px);   duration: 500ms*/
  will-change: transform, font, color, filter;
  transition: color 0.5s, filter 1.6s, font 1s, transform 0.5s;
  transition-timing-function: cubic-bezier(0.46, 0, 0.07, 1);
  white-space: pre-line;
}
.lyric .container > .line span.word {
  background-size: 0%;
  background-color: rgba(238, 238, 238, 0.6);
  background-image: radial-gradient(#eee, rgba(238, 238, 238, 0.6));
  background-repeat: no-repeat;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-stroke: thin;
}
.lyric .container > .line span.word.active {
  animation-name: highLight;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
}
@keyframes highLight {
  0% {
    background-size: 0%;
  }
  100% {
    background-size: 100%;
  }
}
.lyric .container > .line span.word.active.stop {
  animation-play-state: paused;
}
.lyric .container > .line .translate-line {
  line-height: 1.4;
  font-weight: normal;
  transform: scale(0.9);
}
.lyric .container > .line.active {
  color: #eee;
  filter: none;
  font-size: 13.8px;
}
</style> 