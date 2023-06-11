<template>
  <div class="content">
    <div class="header">
      <span>歌曲</span>
      <span>歌手</span>
      <span>时长</span>
    </div>
    <div v-show="list.status !== 'complete'" class="loading">
      <div v-show="list.status === 'loading'">
        <span v-for="(item, index) in 'Loading'.split('')" :key="index" :style="{ animationDelay: `${index / 5}s` }">{{
          item
        }}</span>
      </div>
      <div v-show="list.status === 'error'">
        <span v-for="(item, index) in '加载失败，请重试'.split('')" :key="index">{{ item }}</span>
      </div>
      <div v-show="list.status === ''">
        <span v-for="(item, index) in '空空如也~'.split('')" :key="index">{{ item }}</span>
      </div>
    </div>
    <ul ref="listContainer" v-show="list.status === 'complete'" class="music-list">
      <li v-for="(item, index) in list.musicList" :key="item.id">
        <span v-show="item.musicState === 'stop'" class="number">{{ index + 1 }}</span>
        <div v-show="item.musicState === 'loading'" class="number">
          <span class="loadingMusic"></span>
        </div>
        <div v-show="item.musicState === 'play'" class="number">
          <span class="playMusic"></span>
        </div>
        <div v-show="item.musicState === 'pause'" class="number">
          <i class="iconfont icon-pause"></i>
        </div>
        <div class="name">
          <span class="text-overflow">{{ item.name }}</span>
          <div class="control-btn">
            <i
              v-show="item.musicState === 'stop'"
              @click="playMusic(item, index)"
              title="播放"
              class="iconfont icon-play"></i>
            <i
              v-if="list.name !== 'playList'"
              @click="addMusicToList({ item })"
              title="下一首播放"
              class="iconfont icon-close add"></i>
            <i v-else @click="removeMusic(item.id)" title="移除" class="iconfont icon-close"></i>
          </div>
        </div>
        <span class="singer text-overflow">{{ item.artists }}</span>
        <span class="time">{{ $utils.millisecondConversionTime(item.duration, ['seconds', 'minutes']) }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  props: {
    listData: Object
  },
  data() {
    return {
      isBottomFunc: null,
      isLoading: null
    };
  },
  computed: {
    ...mapState(['playMusicList']),
    list:function(){
      return this.listData;
    }
  },
  methods: {
    ...mapMutations(['addMusicToList', 'setCurrentMusic', 'setPlayMusicList']),
    // 判断滚动是否到达底部
    isBottom() {
      const handler = () => {
        const list = this.$refs.listContainer;
        // 滚动高度 + 可视窗口高度接近于元素总高度
        if (list.scrollHeight - (list.scrollTop + list.clientHeight) <= 200) {
          this.$emit('loadingMore');
        }
      };
      return this.$utils.throttle(handler, 1000)();
    },
    // 播放歌曲
    playMusic(item, index) {
      // 该歌曲处于未加载状态
      if (item.musicState === 'stop') {
        // 设置该歌曲状态以及记录该歌曲在播放列表的播放位置
        switch (this.list.name) {
          case 'playList':
            this.setCurrentMusic({ type: 'setValue', index });
            break;
          case 'searchList':
            // 把该歌曲添加到播放列表中，位于当前播放歌曲的下一位
            this.addMusicToList({ item });
            this.setCurrentMusic({ type: 'increatment' });
            break;
        }
      }
    },
    // 从播放列表中移除歌曲
    removeMusic(id) {
      // 移除歌曲
      const newList = this.playMusicList.filter((value) => {
        return value.id !== id;
      });
      this.setPlayMusicList({ musicList: newList });
    },
  },
  mounted() {
    this.list.hasMore && this.$refs.listContainer.addEventListener('scroll', this.isBottom);
  },
  beforeDestroy() {
    this.list.hasMore && this.$refs.listContainer.removeEventListener('scroll', this.isBottom);
  } 
};
</script>

<style scoped>
.text-overflow {
  -webkit-line-clamp: 1;
  padding-right: 10px;
}
.content {
  flex-grow: 1;
  overflow: hidden;
}
.music-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}
.music-list::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}
.music-list li,
.header {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.header {
  width: 100%;
}
.music-list li .name,
.header span:nth-child(1) {
  flex-grow: 1;
}
.header span:nth-child(1) {
  padding-left: 40px;
}
.music-list li .singer,
.header span:nth-child(2) {
  width: 25%;
}
.music-list li .time,
.header span:nth-child(3) {
  width: 60px;
}
.loading,
.music-list {
  height: calc(100% - 50px);
  overflow-y: scroll;
}
.music-list::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.music-list li .number {
  width: 30px;
  text-align: center;
}
.music-list li .number > * {
  display: inline-block;
  width: 15px;
  height: 15px;
}
.music-list li .number .loadingMusic {
  border: 1px solid transparent;
  border-color: transparent #fff transparent #fff;
  animation: rotate-loading 1.5s linear 0s infinite normal;
  transform-origin: 50% 50%;
  border-radius: 100%;
}
.music-list li .number .playMusic {
  background: url(data:image/gif;base64,R0lGODlhCgAKAIABAP///////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBAABACwAAAAACgAKAAACEIyPqcsM4GB4iM4nLc5c8wIAIfkECQQAAQAsAAAAAAoACgAAAhGMj6mrAOxMPNPVFyy+V1rvFQAh+QQJBAABACwAAAAACgAKAAACE4yPqQew0UxkDrY6L96Zb3mBYAEAIfkECQQAAQAsAAAAAAoACgAAAhSMjwiQt/YcCyvaCmfV/GZPYWFWAAAh+QQJBAABACwAAAAACgAKAAACFIyPeQDIxl6QsU1bIY5a0/15m1YAACH5BAkEAAEALAAAAAAKAAoAAAIUjI+ZAMpsYHhtVhrvy1n6bXVaVgAAIfkECQQAAQAsAAAAAAoACgAAAhOMjwCYy6aeioFOZyfEuvK8gV4BACH5BAkEAAEALAAAAAAKAAoAAAISjI+ZAGrsAlysSVuxnry+rX0FACH5BAkEAAEALAAAAAAKAAoAAAIRjI+pawDs4EsuBlsnrk3z6xUAIfkECQQAAQAsAAAAAAoACgAAAhCMj6nLCMBehOnJcC3N1vACACH5BAkEAAEALAAAAAAKAAoAAAIPjI+py50AGJTxwTrDxbwAACH5BAkEAAEALAAAAAAKAAoAAAIPjI+py+0JAIuGHoujDLkAACH5BAkEAAEALAAAAAAKAAoAAAIQjI+py+0NAIqGhmgzrvKCAgAh+QQJBAABACwAAAAACgAKAAACD4yPqcvdABg081R4Y8A6FwA7LyogIHx4R3YwMHxkNDJiOTgyYzhjM2YwYWExNzcxNDk4OTU2ZjY3ODc0MSAqLw==)
    no-repeat center/cover;
}
@keyframes rotate-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.music-list li .name {
  display: flex;
  padding-left: 10px;
}
.music-list li .name span {
  flex: 1;
}
.music-list li .name .control-btn {
  display: inline-block;
}
.music-list li .name .control-btn i {
  margin-right: 10px;
  opacity: 0;
  transition: all 0.2s;
  cursor: pointer;
}
.music-list li .name .control-btn i.icon-close.add {
  transform: rotate(45deg);
}
.music-list li:hover .name .control-btn i {
  opacity: 1;
}
.music-list li {
  transition: all 0.2s;
}
.music-list li:hover {
  color: #eee;
}
.loading {
  text-align: center;
}
.loading > div {
  position: relative;
  font-size: 18px;
  top: calc(50% - 18px);
}
.loading > div span {
  display: inline-block;
  margin: 0 5px;
}
.loading > div:first-child span {
  animation: blur-text 1.5s infinite linear alternate;
}
@keyframes blur-text {
  0% {
    filter: blur(0px);
  }
  100% {
    filter: blur(4px);
  }
}
</style>