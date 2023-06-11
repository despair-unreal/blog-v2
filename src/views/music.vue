<template>
  <div class="container">
    <video class="list-background" autoplay muted loop>
      <source src="@/assets/images/music/music_background.mp4" type="video/mp4" />
    </video>
    <div id="mask"></div>
    <main>
      <div class="music-content">
        <div class="list-option">
          <div class="btns">
            <span @click="current = 0" :class="['option', { active: current === 0 }]">播放列表</span>
            <span @click="current = 1" :class="['option', { active: current === 1 }]">歌曲搜索</span>
            <span @click="current = 2" :class="['option', { active: current === 2 }]">我的歌单</span>
            <span v-show="current === 0" @click="clearPlayList({ musicList: [] })" class="other">清空列表</span>
            <span v-show="current === 2" class="other">登录</span>
          </div>
          <div v-show="current === 0" class="show-select">
            <play-list ref="playList"></play-list>
          </div>
          <searchMusic ref="searchMusic" v-show="current === 1" class="show-select"></searchMusic>
          <div v-show="current === 2" class="show-select">
            1
            <!-- <music-list :list="playList"></music-list> -->
          </div>
        </div>
        <right :musicLyricData="musicLyric"></right>
      </div>
      <music-bar ref="musicBar" :musicUrlData="musicUrl"></music-bar>
    </main>
  </div>
</template>

<script>
import musicBar from '../components/music/musicBar.vue';
import right from '../components/music/right.vue';
import playList from '../components/music/playList.vue';
import searchMusic from '../components/music/searchMusic.vue';
import { mapMutations, mapState, mapGetters } from 'vuex';
import { Music } from '../components/music/Music.js';

export default {
  components: {
    musicBar,
    right,
    playList,
    searchMusic,
  },
  data() {
    return {
      current: 0,
      musicUrl: [],
      musicLyric: '',
      utils: new Music(this),
    };
  },
  computed: {
    ...mapState(['playMusicList', 'currentMusicIndex']),
    ...mapGetters(['getCurrentMusic']),
  },
  watch: {
    // 监听当前播放歌曲id 切歌时获取歌曲链接并且为其设置加载状态
    'getCurrentMusic.id': function () {
      // 重置列表中所有歌曲的状态并单独给当前播放歌曲设置加载状态
      const newList = this.playMusicList.map((value, index) => {
        value.musicState = index === this.currentMusicIndex ? 'loading' : 'stop';
        return value;
      });
      this.clearPlayList({ musicList: newList });
      // 获取歌曲链接和歌词 播放歌曲
      this.getMusicData();
    },
  },
  methods: {
    // 清空播放列表
    ...mapMutations({ clearPlayList: 'setPlayMusicList' }),
    ...mapMutations(['setCurrentMusicState']),
    // 获取歌曲链接和歌词 播放歌曲
    async getMusicData() {
      const data = await this.utils.getMusicUrlAndLyric(this.getCurrentMusic.id);
      if (data) {
        typeof data === 'object' && Object.keys(data).length !== 0
          ? ({ urlData: this.musicUrl, lyricData: this.musicLyric } = data)
          : this.setCurrentMusicState({ state: 'stop' });
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
  width: 100vw;
  background-image: url(~@/assets/images/music/music_background.jpg);
  background-size: cover;
  background-position: center;
  user-select: none;
}
video {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(5px);
  z-index: 1;
}
#mask {
  opacity: 0.4;
  z-index: 2;
}
@media (max-width: 520px) {
  main {
    padding: 80px 20px 15px 20px !important;
  }
}
main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding: 80px 25px 25px 25px;
  width: 100%;
  height: 100%;
  color: rgba(238, 238, 238, 0.6);
  z-index: 3;
}
main .music-content {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  overflow: hidden;
}
main .music-content .list-option {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
main .music-content .list-option .btns .option {
  display: inline-block;
  margin-right: 8px;
  padding: 0 23px;
  line-height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
}
main .music-content .list-option .btns .other {
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
main .music-content .list-option .btns .option.active,
main .music-content .list-option .btns .option:hover {
  color: #eee;
  border: 1px solid #eee;
}

main .music-content .list-option .btns .other:hover {
  color: #eee;
}
main .music-content .list-option .show-select {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-top: 10px;
  overflow: hidden;
}
</style>