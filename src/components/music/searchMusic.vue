<template>
  <div>
    <div class="search">
      <input
        type="text"
        v-model="searchList.searchKeywords"
        placeholder="搜索..."
        @keyup.enter="search"
      />
      <div class="btns">
        <i
          class="iconfont icon-close"
          @click="searchList.searchKeywords = ''"
        ></i>
        <i class="iconfont icon-search" @click="search"></i>
      </div>
    </div>
    <music-list
      @loadingMore="loadingMore"
      :listData="searchList"
    ></music-list>
  </div>
</template>

<script>
import MusicList from "../music/musicList.vue";
import { getSearchList } from "../../api/music.js";

export default {
  components: {
    MusicList,
  },
  data() {
    return {
      searchList: {
        name:"searchList",
        musicList: [],
        status: "",
        needMore: true,
        searchKeywords: "",
        page: 0,
      },
    };
  },
  methods: {
    // 获取搜索歌曲
    getSearchListAPI() {
      const keywords = this.searchList.searchKeywords;
      const offset = this.searchList.page * 30;
      return getSearchList({ keywords, offset });
    },
    async getSearchList() {
      try {
        const { result } = await this.getSearchListAPI();
        // 歌曲数据
        const oldData = result.songs;
        const needKeys = ["id", "name", "duration", { artists: "name" }, { album:{artist:"img1v1Url"}}];
        // 提取需要的属性
        const needData = this.$utils.filterObjectInArray(oldData, needKeys);
        // 准备替换属性名
        const keyReplace = this.$parent.setKeyReplace(["id","name","duration","artists.name","album.artist.img1v1Url"]);
        // 统一属性名
        const newData = this.$utils.listDataFormat(needData, keyReplace);
        // 加上音乐状态的属性
        const musicList = this.$parent.setMusicState(newData);
        // 是否有更多歌曲未展示
        this.searchList.hasMore = result.hasMore;
        // 搜索完成
        this.searchList.status = "complete";
        return musicList;
      } catch (error) {
        console.log(error);
        this.searchList.status = this.$parent.catchError(error);
        return [];
      }
    },
    // 获取搜索数据
    async search() {
      if (this.searchList.searchKeywords.trim().length !== 0) {
        this.searchList.status = "loading";
        this.searchList.musicList = await this.getSearchList();
      }
    },
    // 加载更多数据
    async loadingMore() {
      if (this.searchList.hasMore) {
        // 当前搜索歌曲页数
        this.searchList.page++;
        const moreData = await this.getSearchList();
        const tmp = [...this.searchList.musicList, ...moreData];
        // 把数据按id去重
        this.searchList.musicList = this.$utils.filterArrayByKey(tmp, "id");
      }
    },
  },
};
</script>

<style scoped>
.search {
  position: relative;
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.15);
}
.search input {
  width: 100%;
  height: 30px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.6);
  outline: none;
  padding: 0 15px;
  color: #eee;
}
.search input::placeholder {
  color: rgba(238, 238, 238, 0.6);
}
.search .btns {
  display: inline-block;
  position: absolute;
  top: 0;
  transform: translateX(-120%);
  font-size: 20px;
  line-height: 50px;
  opacity: 1;
  transition: all 0.2s;
}
.search input:placeholder-shown + .btns {
  opacity: 0;
}
</style>
