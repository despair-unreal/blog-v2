<template>
  <div class="container">
    <video class="list-background" autoplay muted loop>
      <source
        src="@/assets/images/music/music_background.mp4"
        type="video/mp4"
      />
    </video>
    <div id="mask"></div>
    <main>
      <div class="music-content">
        <div class="list-option">
          <div class="btns">
            <span
              @click="current = 0"
              :class="['option', { active: current === 0 }]"
              >播放列表</span
            >
            <span
              @click="current = 1"
              :class="['option', { active: current === 1 }]"
              >歌曲搜索</span
            >
            <span
              @click="current = 2"
              :class="['option', { active: current === 2 }]"
              >我的歌单</span
            >
            <span v-show="current === 0" @click="clearPlayList" class="other"
              >清空列表</span
            >
            <span v-show="current === 2" class="other">登录</span>
          </div>
          <div v-show="current === 0" class="show-select">
            <music-list
              @removeMusic="removeMusic"
              :listData="playList"
            ></music-list>
          </div>
          <searchMusic
            ref="searchMusic"
            v-show="current === 1"
            class="show-select"
          ></searchMusic>
          <div v-show="current === 2" class="show-select">
            1
            <!-- <music-list :list="playList"></music-list> -->
          </div>
        </div>
        <right></right>
      </div>
      <music-bar
        ref="musicBar"
        @playMusic="changeMusicState('play')"
        @stopMusic="changeMusicState('stop')"
        @pauseMusic="changeMusicState('pause')"
        @playPrevious="playPrevious"
        @playNext="playNext"
        :musicUrl="musicUrl"
        v-bind.sync="playMode"
      ></music-bar>
    </main>
  </div>
</template>

<script>
import musicBar from "../components/music/musicBar.vue";
import right from "../components/music/right.vue";
import { getDefalutPlayList } from "../api/music.js";
import { getMusicUrlAPI,cancelToken } from "../api/music.js";
import MusicList from "../components/music/musicList.vue";
import searchMusic from "../components/music/searchMusic.vue";

export default {
  components: {
    musicBar,
    right,
    MusicList,
    searchMusic,
  },
  data() {
    return {
      current: 0,
      playMode:{
        mode:"repeat",
        modeArr:[
          {mode:"repeat",title:"单曲循环",icon:"icon-repeat"},
          {mode:"once",title:"播放一次",icon:"icon-repeat-once"},
          {mode:"list-loop",title:"列表循环",icon:"icon-list-play"},
          {mode:"random",title:"随机播放",icon:"icon-random-play"},
        ]
      },
      playList: {
        name: "playList",
        musicList: [],
        status: "loading",
        current: 5,
        isLoading:null,
      },
      musicUrl: {
        id: 0,
        url: "",
        type: "",
        time: 0,
      },
    };
  },
  watch: {
    // 设置歌曲状态为加载中
    "playList.current": function (value) {
      this.setMusicStateLoading(this.playList.musicList, value);
    },
  },
  methods: {
    // 处理请求响应错误
    catchError(error) {
      let result = "error";
      if (error === 404) result = 404;
      console.error(error);
      return result;
    },
    // 获取默认歌单歌曲
    getDefalutPlayListAPI() {
      const id = 8179708364;
      return getDefalutPlayList({ id });
    },
    // 获取默认播放列表的歌曲数据
    async getDefalutPlayList() {
      this.playList.musicList = await this.getDefalutPlayListAPI()
        .then((data) => {
          const oldData = data.songs;
          const needKeys = [
            "id",
            "name",
            "dt",
            { ar: "name" },
            { al: "picUrl" },
          ];
          // 提取需要的属性
          const needData = this.$utils.filterObjectInArray(oldData, needKeys);
          // 准备替换属性名
          const keyReplace = this.setKeyReplace([
            "id",
            "name",
            "dt",
            "ar.name",
            "al.picUrl",
          ]);
          // 统一属性名
          const newData = this.$utils.listDataFormat(needData, keyReplace);
          // 加上音乐状态的属性
          const musicList = this.setMusicState(newData);
          // 获取完成
          this.playList.status = "complete";
          return musicList;
        })
        .catch((error) => {
          this.playList.status = this.catchError(error);
          return [];
        });
    },
    // 给音乐列表的每条数据加上表示音乐状态的属性
    setMusicState(data) {
      return data.map((value) => {
        value.musicState = "stop";
        return value;
      });
    },
    // 设置统一要放入歌曲列表的数据对象的键名
    setKeyReplace(arr) {
      const key = ["id", "name", "duration", "artists", "cover"];
      const obj = {};
      arr.forEach((value, index) => {
        obj[key[index]] = value;
      });
      return obj;
    },
    // 重置列表中所有歌曲的状态并单独给当前播放歌曲设置加载状态
    setMusicStateLoading(list, currentMusicIndex) {
      list.forEach((value, index) => {
        list[index].musicState =
          index === currentMusicIndex ? "loading" : "stop";
      });
    },
    // 清空播放列表
    clearPlayList() {
      this.playList.musicList = [];
      this.playList.status = "";
    },
    // 从播放列表中移除歌曲
    removeMusic(data) {
      const { id, index } = data;
      // 如果移除的是当前正在播放的歌曲则先把歌曲暂停
      this.playList.current === index && this.$refs.musicBar.pause();
      // 移除歌曲
      const tmp = this.playList.musicList.filter((value) => {
        return value.id !== id;
      });
      this.playList.musicList = tmp;
    },
    // 获取歌曲链接播放歌曲
    async getMusicUrl(id) {
      try {
        // 在发起本次请求之前isLoading存储的会是上次请求的取消方法
        this.playList.isLoading && this.playList.isLoading('取消上次请求');
        // 使用 CancelToken.source 工厂方法创建 cancel token
        const source = cancelToken.source();
        this.playList.isLoading = source.cancel;
        // 发起请求
        let {data} = await getMusicUrlAPI({ id },{ cancelToken:source.token});
        // 提取需要的属性
        data = this.$utils.filterObjectInArray(data, [
          "id",
          "url",
          "type",
          "time",
        ]);
        // 播放歌曲
        ({id: this.musicUrl.id,type: this.musicUrl.type,url: this.musicUrl.url,time: this.musicUrl.time,} = data[0]);
      } catch (error) {
        if(error !== '请求被取消'){
          window.alert(`加载失败，请重试！错误：${error}`);
          // 恢复为未加载状态
          this.playList.musicList[this.playList.current].musicState = "stop";
        }
      }
    },
    // 更改当前播放的音乐状态
    changeMusicState(state){
      this.playList.musicList[this.playList.current].musicState = state;
      // 当播放模式不为单曲循环/仅播放一次的时候，当前播放歌曲结束后根据播放模式切换下一首歌曲
      if(state === 'stop' && this.playMode.mode !== 'once' && this.playMode.mode !== 'repeat')
        this.playNext();
    },
    // 播放下一首歌曲
    playNext(){
      switch (this.playMode.mode) {
        // 列表循环
        case "once":
        case "repeat":
        case "list-loop":
          // 当前播放位置在最后一首时，下一首重置到第一首歌曲
          if(this.playList.current < this.playList.musicList.length - 1)
            this.playList.current++;
          else
            this.playList.current = 0;
          break;
        // 随机播放
        case "random":
          this.playList.current = Math.floor(Math.random() * this.playList.musicList.length);
          break;
      }
      // 获取下一首歌曲链接并播放
      this.getMusicUrl(this.playList.musicList[this.playList.current].id);
    },
    // 播放上一首歌曲
    playPrevious(){
      this.playList.current >0 && this.playList.current--;
      this.getMusicUrl(this.playList.musicList[this.playList.current].id);
    }
  },
  created() {
    // 添加歌曲到当前播放歌曲的下一首
    this.$bus.$on("addMusic", (data) => {
      const { item } = data;
      let isExist = null;
      // 判断播放列表是否已存在该歌曲并记录其位置
      this.playList.musicList.forEach((value, index) => {
        if (value.id === item.id) isExist = index;
      });
      // 若播放列表已经存在该歌曲就把该歌曲从原位置移动到当前播放歌曲位置的下一位
      if (isExist !== null) this.playList.musicList.splice(isExist, 1);
      this.playList.musicList.splice(this.playList.current + 1, 0, item);
    });
  },
  mounted() {
    this.getDefalutPlayList();
  },
  beforeDestroy() {
    this.$bus.$off("addMusic");
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