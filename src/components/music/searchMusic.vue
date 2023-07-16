<template>
  <div>
    <div class="search">
      <input type="text" v-model="searchKeywords" placeholder="搜索..." @keyup.enter="search" />
      <div class="btns">
        <i class="iconfont icon-close" @click="searchKeywords = ''"></i>
        <i class="iconfont icon-search" @click="search"></i>
      </div>
    </div>
    <music-list @loadingMore="loadingMore" :listData="searchList"></music-list>
  </div>
</template>

<script>
import MusicList from './musicList.vue';
import { getSearchList } from '../../api/music.js';
import { Music } from './Music.js';

export default {
  components: {
    MusicList,
  },
  data() {
    return {
      searchList: {
        name: 'searchList',
        musicList: [],
        status: '',
        hasMore: true,
        loadingMore: false,
      },
      searchKeywords: '',
      page: 0,
      utils: new Music(this),
    };
  },
  methods: {
    // 获取搜索歌曲
    getSearchListAPI() {
      const keywords = this.searchKeywords;
      const offset = this.page * 30;
      return getSearchList({ keywords, offset });
    },
    async getSearchList() {
      try {
        // const { songs: data, hasMore } = await this.getSearchListAPI().result;
        const {
          result: { songs: data, hasMore },
        } = await this.getSearchListAPI();
        let result = [];
        // 歌曲数据
        if (data) {
          const needKeys = ['id', 'name', 'duration', { artists: 'name' }, { album: 'name' }];
          // 准备替换属性名
          const keyReplace = this.utils.setKeyReplace(['id', 'name', 'duration', 'artists.name', 'album.name']);
          // 整理处理获取到歌曲数据
          const musicList = this.utils.setMusicData(data, needKeys, keyReplace);
          // 是否有更多歌曲未展示
          this.searchList.hasMore = hasMore;
          // 搜索完成
          result = musicList;
        }
        return Promise.resolve(result);
      } catch (error) {
        console.error(error);
        return Promise.reject('error');
      }
    },
    // 获取搜索数据
    async search() {
      if (this.searchKeywords.trim().length !== 0) {
        try {
          this.searchList.status = 'loading';
          this.page = 0;
          this.searchList.musicList = await this.getSearchList();
          this.searchList.status = this.utils.setListStatus(this.searchList.musicList);
        } catch (error) {
          this.searchList.status = 'error';
        }
      }
    },
    // 加载更多数据
    async loadingMore() {
      if (this.searchList.hasMore) {
        this.searchList.loadingMore = true;
        // 当前搜索歌曲页数
        this.page++;
        let moreData = [];
        try {
          moreData = await this.getSearchList();
          this.searchList.loadingMore = false;
        } catch (error) {
          console.log('无法加载更多数据，请重试', error);
        }
        // 把数据按id去重
        this.searchList.musicList = this.$utils.filterArrayByKey([...this.searchList.musicList, ...moreData], 'id');
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
