<template>
  <music-list :listData="playList"></music-list>
</template>

<script>
import MusicList from './musicList.vue';
import { getDefalutPlayList } from '../../api/music.js';
import { Music } from './Music.js';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    MusicList,
  },
  data() {
    return {
      utils: new Music(this),
      status: 'loading',
    };
  },
  computed: {
    ...mapState({ musicList: 'playMusicList' }),
    playList: {
      get:function(){
        return {
          name: 'playList',
          status: this.status,
          musicList: this.musicList
        };
      }
    },
  },
  watch: {
    musicList: function (value) {
      this.status = this.utils.setListStatus(value);
    },
  },
  created() {
    this.setDefalutPlayList();
  },
  methods: {
    ...mapMutations(['setPlayMusicList']),
    // 加载默认播单
    async setDefalutPlayList() {
      try {
        this.status = 'loading';
        const value = await this.getDefalutPlayList();
        // 组合原播放列表的数据
        if (Array.isArray(value)) {
          const filteredArray = this.$utils.filterArrayByKey([...this.musicList, ...value], 'id');
          this.setPlayMusicList({ musicList: filteredArray });
        }
      } catch (error) {
        this.status = 'error';
      }
    },
    // 获取默认歌单歌曲
    getDefalutPlayListAPI() {
      const id = 8179708364;
      return getDefalutPlayList({ id });
    },
    // 获取默认播放列表的歌曲数据
    async getDefalutPlayList() {
      try {
        const { songs: data } = await this.getDefalutPlayListAPI();
        let result = [];
        if (data) {
          const needKeys = ['id', 'name', 'dt', { ar: 'name' }, { al: 'name' }];
          // 准备替换属性名
          const keyReplace = this.utils.setKeyReplace(['id', 'name', 'dt', 'ar.name', 'al.name']);
          // 整理处理获取到歌曲数据
          const musicList = this.utils.setMusicData(data, needKeys, keyReplace);
          // 获取完成
          result = musicList;
        }
        return Promise.resolve(result);
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    },
  },
};
</script>

<style>
</style>