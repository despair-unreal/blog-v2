import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    currentMusicIndex: null,
    playMusicList: [],
    infoData: [],
  },
  getters: {
    // 当前播放音乐信息
    getCurrentMusic(state) {
      return state.playMusicList[state.currentMusicIndex];
    },
    // 列表最后一个索引
    getPlayListLastIndex(state){
      return state.playMusicList.length - 1;
    }
  },
  mutations: {
    // 设置侧边栏的文章标签分类数据
    setInfoData(state, payload) {
      // state是必须默认参数
      state.infoData = payload.infoData;
    },
    // 更改当前播放音乐（index）
    setCurrentMusic(state, payload) {
      switch (payload.type) {
        case 'increment':
          state.currentMusicIndex++;
          break;
        case 'decrement':
          state.currentMusicIndex--;
          break;
        case 'setValue':
          state.currentMusicIndex = payload.index;
          break;
      }
    },
    // 修改当前播放音乐状态
    setCurrentMusicState(state, payload) {
      state.playMusicList[state.currentMusicIndex].musicState = payload.state;
    },
    // 修改播放列表
    setPlayMusicList(state, payload) {
      state.playMusicList = payload.musicList;
    },
    // 添加歌曲到当前播放歌曲的下一位
    addMusicToList(state, payload) {
      const item = payload.item;
      // 判断播放列表是否已存在该歌曲并记录其位置
      let isExist = state.playMusicList.findIndex((value) => value.id === item.id);
      // 若播放列表已经存在该歌曲，将其移动到当前播放歌曲位置的下一位
      if (isExist !== -1) {
        state.playMusicList.splice(isExist, 1);
      }
      state.playMusicList.splice(state.currentMusicIndex + 1, 0, item);
    },
  },
});

export default store;
