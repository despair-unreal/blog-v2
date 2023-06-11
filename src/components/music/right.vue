<template>
  <div class="right">
    <div class="info">
      <div class="disc-cover">
        <div :class="['CD',{'rotate':play}]">
           <img
            class="disc"
            src="~@/assets/images/music/placeholder_disk_play_song.png"
          />
            <img
            ref="cover"
            class="cover"
            @error="coverError($refs.cover)"
            @load="load($refs.cover)"
            :src="msg.cover || ''"
            />
        </div>
        <img :class="['needle',{'playNeedle':play}]" src="~@/assets/images/music/needle-ip6.png" />
        <img ref="bag" class="bag" @error="coverError($refs.bag)" @load="load($refs.bag)" :src="msg.cover || ''"></img>
      </div>
      <p v-if="msg.name">歌曲名：{{msg.name}}</p>
      <p v-if="msg.artists">歌手名：{{msg.artists}}</p>
      <p v-if="msg.album">专辑名：{{msg.album}}</p>
    </div>
    <div class="lyric">
      <span>暂无歌词</span>
    </div>
    <div class="other">
      本页面接口源自<a href="https://github.com/Binaryify/NeteaseCloudMusicApi"
        >NeteaseCloudMusicApi</a
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    musicLyricData: String,
  },
  data() {
    return {
      play: false,
    };
  },
  computed: {
    ...mapGetters(['getCurrentMusic']),
    msg() {
      const { name = '', artists = '', album = '', cover = '' } = this.getCurrentMusic || {};
      return { name, artists, album, cover };
    },
    lyric: function () {
      const tmp = this.musicLyricData.split('\n').map((value) => {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      });
      console.log(tmp);
      // console.log(this.lyric);
      return tmp;
    }
  },
  watch: {
    // 封面路径变动，重新获取图片
    'msg.cover': function () {
      this.$refs.cover.style.opacity = 0;
      this.$refs.bag.style.opacity = 0;
    }
  },
  methods: {
    // 图片加载完成
    load(el) {
      el.style.opacity = 1;
    },
    // 图片加载错误
    coverError(el) {
      el.src = '';
    },
  },
  created() {
    // 监听是否有在播放音乐
    this.$bus.$on('playStateChanges', (state) => (this.play = state));
  },
  beforeDestroy() {
    this.$bus.$off('playStateChanges');
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
.info .disc-cover img.bag,
.info .disc-cover img.cover,
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
  flex-grow: 1;
}
.lyric > span {
  position: relative;
  top: calc(50% - 10px);
}
</style>