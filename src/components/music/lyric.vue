<template>
  <div class="lyric" ref="lyric">
    <div class="no-lyric" v-show="!lyric">暂无歌词</div>
    <div ref="container" class="container" v-show="lyric">
      <div ref="phantom" class="phantom-area"></div>
      <div ref="content" class="content-area">
        <div
          ref="line"
          v-for="([time, line], lineIndex) in renderLyric"
          :key="lineIndex"
          :style="getLineStyle(lineIndex)"
          :class="['line', { active: activeLine === lineIndex }]">
          <!-- 逐字yrc -->
          <div ref="yrcLine" v-if="typeof line === 'object'">
            <span
              :ref="lineIndex === activeLine && 'activeWord'"
              :class="['word', { active: lineIndex === activeLine }, { stop: lineIndex === activeLine && !isPlay }]"
              :style="[{ '--wordDuration': `${duration}ms` }, { '--wordDelay': `${delay}ms` }]"
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
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      // showLyric:null,
      timeChange: false,
      activeLine: 0,
      translateY: 30,
      scrollTop: 0,
      position:[],
      start:0,
    };
  },
  computed: {
    ...mapGetters(['getCurrentMusic','getCurrentMusicIndex']),
    ...mapState(['currentMusicId', 'currentTime', 'isPlay', 'isVerbatim']),
    lyric(){
      return this.getCurrentMusic?.lyric || null;
      /* this.$nextTick(() => {
        // 滚动到歌词最上方的位置并记录坐标
        const scrollTop = -this.$refs.container.clientHeight + this.$refs.lyric.clientHeight;
        this.$refs.lyric.scrollTop = scrollTop;
        this.scrollTop = this.$refs.lyric.scrollTop;
      }); */
      // lyric.yrc || lyric.lrc
    },
    // 显示的歌词
    showLyric() {
      return this.lyric ? (this.isVerbatim ? this.lyric.yrc || this.lyric.lrc : this.lyric.lrc) : null;
    },
    renderEndItem(){
      if(this.showLyric?.size <= 0 || !this.showLyric) return 0;
      let endPos = this.start;
      // 视口高度
      const viewPortHeight = this.$refs.lyric.clientHeight;
      // 记录从start位置开始的dom节点总高度
      let contentTotalHeight = this.position[endPos].height;
      // 通过统计累计节点高度来计算end位置坐标(累计高度超过视口高度时)
      while (contentTotalHeight < viewPortHeight) {
        endPos++;
        contentTotalHeight += this.position[endPos].height;
      }
      // 如果使用的是数组的slice方法包头不包尾,需要+1来获得预期元素数量
      // 由于存在在某个元素位置开区间滚动的情况（此时该元素不会完全移出视口），因此要再+1来渲染下一个元素以占满视口区域
      return endPos + 1;
    },
    renderLyric(){
      if(this.showLyric?.size <= 0 || !this.showLyric) return null;
      // 用以缓冲的数量
      const cacheCount = 5;
      const start = Math.max(0,this.start - cacheCount);
      const end = Math.min(this.position.length,this.renderEndItem + cacheCount);
      const renderData = new Map();
      let i = 0;
      this.showLyric.forEach((value,key)=>{
        if(i <= end && i >= start){
          renderData.set(key,value);
        }
        i++;
      });
      return renderData;
    },
    lineTimes() {
      if(!this.lyric) return null;
      // 每行歌词时间
      const { yrc = '', lrc = '' } = this.lyric;
      if (yrc || lrc) {
        const obj = {};
        yrc && (obj['yrc'] = [...yrc.keys()]);
        lrc && (obj['lrc'] = [...lrc.keys()]);
        return obj;
      } else return null;
    },
    temp(){
      if(!this.getCurrentMusic) return null;
      return JSON.parse(JSON.stringify(this.getCurrentMusic));
    }
  },
  watch: {
    currentMusicId() {
      // 重置歌词滚动高亮进度
      this.activeLine = 0;
      this.$refs.lyric.scrollTop = 0;
    },
    getCurrentMusic:{
      handler(v){
        console.log(this.temp,v)
      },
      deep:true
    },
    'getCurrentMusic.lyric'(v){
      console.log('this is lyric',v)
    },/*  */
    /* lyric(v){
      console.log(v)
      // value && (this.showLyric = this.isVerbatim ? value.yrc || value.lrc : value.lrc);
    }, */
    showLyric(){
      // console.log('this is showlyric')
      const size = this.showLyric?.size;
      if(size){
        const lineMaybeHeight = 100;
        for(let i = 0;i<size;i++){
          this.position.push({
            index:i,
            startPos:lineMaybeHeight * i,
            endPos:lineMaybeHeight * i + lineMaybeHeight,
            height:lineMaybeHeight
          });
        }
      }
    },
    renderLyric(data){
      // console.log(data)
      this.$nextTick(()=>{
        this.updateHeightAndPos(data);
      })
    },
    activeLine(activeLine) {
      if (this.$refs.line) {
        // let y = this.$refs.line[0].clientHeight;
        if (activeLine > 1) {
          // 计算换播放行时，每行歌词应移动的距离
          // 保持播放行前面有一行半的歌词存在
          // const pre2Dom = this.$refs.line[activeLine - 2];
          // y = -(pre2Dom.offsetTop + pre2Dom.clientHeight / 2);
        }/*  else y = 30; */
        // console.log(y)
        // this.translateY = y;
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
                el.style['--wordDelay'] = animationDelay;
                el.style['--wordDuration'] = animationDuration;
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
    // 给每一行歌词加样式
    getLineStyle(index) {
      // 只给播放行前5行和后7行加上延迟
      let delay = (index - (this.activeLine - 3)) * 0.12;
      (index < this.activeLine - 6 || index > this.activeLine + 7) && (delay = 0);
      return [{ '--translateY': `${this.translateY}px` }, { '--delay': `${delay}s` }];
    },
    updateHeightAndPos(data){
      console.log(data,JSON.stringify(data));
    }
  },
  updated(){
    // console.log(1)
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
.lyric {
  display: flex;
  flex-direction: column-reverse;
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

.lyric .container .line {
  font-weight: bold;
  padding: 6px 0;
  filter: blur(0.8px);
  /* filter: blur(4px);   duration: 500ms*/
  will-change: transform, font, color, filter;
  transition: color 0.5s, filter 1.6s, font 1s, transform 0.5s;
  transition-timing-function: cubic-bezier(0.46, 0, 0.07, 1);
  white-space: pre-line;
  transform: translateY(var(--translateY));
  transition-delay: 0s, 0s, 0s, var(--delay);
}
.lyric .container .line:not(.active) span.word {
  --wordDuration: 0ms !important;
  --wordDelay: 0ms !important;
}
.lyric .container .line span.word {
  background-size: 0%;
  background-color: rgba(238, 238, 238, 0.6);
  background-image: radial-gradient(#eee, rgba(238, 238, 238, 0.6));
  background-repeat: no-repeat;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-stroke: thin;
  animation-duration: var(--wordDuration);
  animation-delay: var(--wordDelay);
}
.lyric .container .line span.word.active {
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
.lyric .container .line span.word.active.stop {
  animation-play-state: paused;
}
.lyric .container .line .translate-line {
  line-height: 1.4;
  font-weight: normal;
  font-size: 0.9em;
}
.lyric .container .line.active {
  color: #eee;
  filter: none;
  font-size: 1.15em;
}
.lyric .container {
  position: relative;
}
.lyric .container .phantom-area{
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}
.lyric .container .content-area{
}
</style>