<template>
  <div class="container">
    <background></background>
    <main>
      <div id="list">
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
      </div>
    </main>
  </div>
</template>

<script>
import musicBar from '../components/music/musicBar.vue';
import right from '../components/music/right.vue';
import playList from '../components/music/playList.vue';
import searchMusic from '../components/music/searchMusic.vue';
import { mapMutations, mapGetters } from 'vuex';
import Background from '../components/music/background.vue';

export default {
  components: {
    musicBar,
    right,
    playList,
    searchMusic,
    Background,
  },
  data() {
    return {
      current: 0,
      backgroundSrc: '',
      bgLoad: false,
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
        this.backgroundSrc = `url(${src})`;
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
    }
  },
};
</script>

<style scoped>
.container {
  position: relative;
  height: 100vh;
  width: 100vw;
  user-select: none;
  overflow: hidden;
}
main{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#mask {
  opacity: 0.4;
  z-index: 2;
}
@media (max-width: 520px) {
  #list {
    padding: 80px 20px 15px 20px !important;
  }
}
#list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding: 80px 25px 25px 25px;
  width: 100%;
  height: 100%;
  color: rgba(238, 238, 238, 0.6);
  overflow: hidden;
  z-index: 3;
}
#list .music-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  overflow: hidden;
}
#list .music-content .list-option {
  flex: 1;
  display: flex;
  flex-direction: column;
}
#list .music-content .list-option .btns .option {
  display: inline-block;
  margin-right: 8px;
  padding: 0 23px;
  line-height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
}
#list .music-content .list-option .btns .other {
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
#list .music-content .list-option .btns .option.active,
#list .music-content .list-option .btns .option:hover {
  color: #eee;
  border: 1px solid #eee;
}

#list .music-content .list-option .btns .other:hover {
  color: #eee;
}
#list .music-content .list-option .show-select {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-top: 10px;
  overflow: hidden;
}
</style>