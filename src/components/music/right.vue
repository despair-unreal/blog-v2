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
        <p v-show="msg.name">歌曲名：{{ msg.name }}</p>
        <p v-show="msg.artists">歌手名：{{ msg.artists }}</p>
        <p v-show="msg.album">专辑名：{{ msg.album }}</p>
      </div>
      <lyric class="lyric"></lyric>
      <div class="other">
        本页面接口源自<a href="https://github.com/Binaryify/NeteaseCloudMusicApi">NeteaseCloudMusicApi</a>
      </div>
    </div>
    <detail :cover="cover" :msg="msg">
      <!-- <template v-slot:lyric>
        <div v-if="lineTimes.lrc" v-html="$refs.line[activeLine].innerHTML"></div>
      </template>  -->
    </detail>
  </div>
</template>

<script>
import detail from './detail.vue';
import lyric from './lyric.vue';
import { mapGetters, mapState, mapMutations } from 'vuex';
import { Music } from './Music.js';

export default {
  components: {
    detail,lyric
  },
  data() {
    return {
      hiddenCover: true,
      utils: new Music(this),
    };
  },
  computed: {
    ...mapGetters(['getCurrentMusic']),
    ...mapState(['currentMusicId','isPlay']),
    msg() {
      const { name = '', artists = '', album = '' } = this.getCurrentMusic || {};
      return { name, artists, album };
    },
    cover() {
      return this.getCurrentMusic?.cover || '';
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
    }
  },
  methods: {
    ...mapMutations(['addPropertyToCurrentMusic']),
    reset() {
      // 封面路径变动，重新获取图片，暂时隐藏以免图裂
      this.hiddenCover = true;
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
.lyric{
  flex: 1;
  font-size: 12px;
}
</style> 