<template>
  <music-list :listData="playList"></music-list>
</template>

<script>
import MusicList from './musicList.vue';
import { getDefalutPlayList } from '../../api/music.js';
import { Music } from './Music.js';
import { mapState,mapMutations } from 'vuex';

export default {
  components: {
    MusicList,
  },
  data() {
    return {
      utils: new Music(this)
    };
  },
  computed: {
    ...mapState({ current: 'currentMusicIndex',musicList:'playMusicList' }),
    playList: {
      get: function () {
        return {
          name: 'playList',
          status: 'loading',
          musicList: this.musicList
        };
      },
      set: function (newValue) {
        this.playList.status = newValue;
      },
    },
  },
  watch: {
    'playList.musicList':function(value){
      this.playList.status = this.utils.setListStatus(value);
    }
  },
  mounted() {
    this.getDefalutPlayList().then( value => this.setPlayMusicList({musicList: value}) );
  },
  methods: {
    ...mapMutations(['setPlayMusicList']),
    // 获取默认歌单歌曲
    getDefalutPlayListAPI() {
      const id = 8179708364;
      return getDefalutPlayList({ id });
    },
    // 获取默认播放列表的歌曲数据
    async getDefalutPlayList() {
      try {
        const { songs:data } = await this.getDefalutPlayListAPI();
        let result;
        if (data) {
          const needKeys = ['id', 'name', 'dt', { ar: 'name' }, { al: ['picUrl', 'name'] }];
          // 准备替换属性名
          const keyReplace = this.utils.setKeyReplace(['id', 'name', 'dt', 'ar.name', 'al.name', 'al.picUrl']);
          // 整理处理获取到歌曲数据
          const musicList = this.utils.setMusicData(data, needKeys, keyReplace);
          // 获取完成
          result = musicList;
        }else{
          result = [];
        }
        return Promise.resolve(result);
      } catch (error) {
        console.error(error);
        return Promise.resolve('error');
      }
    },
  },
};
</script>

<style>
</style>