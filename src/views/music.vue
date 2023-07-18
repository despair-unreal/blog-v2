<template>
  <div class="container">
    <div class="bg-container">
      <video class="list-background" poster="@/assets/images/music/music_background.jpg" autoplay muted loop>
        <source src="@/assets/images/music/music_background.mp4" type="video/mp4" />
      </video>
      <div ref="cover" :class="['list-background',{hide:!bgLoad}]" />
      <div id="mask"></div>
    </div>
    <main>
      <div class="music-content">
        <div class="list-option">
          <div class="btns">
            <span @click="current = 0" :class="['option', { active: current === 0 }]">播放列表</span>
            <span @click="current = 1" :class="['option', { active: current === 1 }]">歌曲搜索</span>
            <span @click="current = 2" :class="['option', { active: current === 2 }]">我的歌单</span>
            <span v-show="current === 0" @click="clearPlayList" class="other">清空列表</span>
            <span v-show="current === 0" @click="$refs.playList.setDefalutPlayList()" class="other">重载播单</span>
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
        <right></right>
      </div>
      <music-bar></music-bar>
    </main>
  </div>
</template>

<script>
import musicBar from '../components/music/musicBar.vue';
import right from '../components/music/right.vue';
import playList from '../components/music/playList.vue';
import searchMusic from '../components/music/searchMusic.vue';
import { mapMutations, mapGetters } from 'vuex';

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
      bgLoad:false
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
        // 等加载完背景在显示
        await this.$utils.loadImg(src);
        this.$refs.cover.style.backgroundImage = `url(${src})`;
        this.bgLoad = true;
      }
    },
  },
  methods: {
    // 清空播放列表
    ...mapMutations(['setPlayMusicList', 'setCurrentMusic']),
    // 清空列表
    clearPlayList() {
      this.setPlayMusicList({ musicList: [] });
      this.setCurrentMusic({ type: 'setValue', id: null });
    },
  },
};
</script>

<style scoped>
.container {
  position: relative;
  height: 100vh;
  width: 100vw;
  user-select: none;
}
.bg-container {
  background-image: url(~@/assets/images/music/music_background.jpg);
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
.bg-container,
.list-background {
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
  filter: blur(18px);
  z-index: 1;
}
div.list-background {
  transform: scale(1.5);
  transition: all 0.6s;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
}
div.list-background.hide {
  opacity: 0;
}
@keyframes bg {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
  flex: 1;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  overflow: hidden;
}
main .music-content .list-option {
  flex: 1;
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