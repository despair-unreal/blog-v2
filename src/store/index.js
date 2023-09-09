import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    currentMusicId: null, // 播放id
    currentTime: 0,       // 播放进度
    playMusicList: [],    // 播放列表
    mode: 'list-loop',    // 播放模式
    isVerbatim:true,      // 是否逐字
    isPlay: false,        // 播放状态
    buffered: 0,          // 缓冲进度
    volumeLevel:1,        // 音量大小
    soundsOff:false,      // 是否静音
    infoData: [],         // 文章标签分类数据
  },
  getters: {
    // 当前播放音乐信息
    getCurrentMusic(state, getters) {
      return state.playMusicList && state.playMusicList[getters.getCurrentMusicIndex];
    },
    // 当前播放音乐索引
    getCurrentMusicIndex(state) {
      return state.playMusicList && state.playMusicList.findIndex((value) => value.id === state.currentMusicId);
    },
    // 列表最后一个索引
    getPlayListLastIndex(state) {
      return state.playMusicList && state.playMusicList.length - 1;
    },
  },
  mutations: {
    // 设置侧边栏的文章标签分类数据
    setInfoData(state, payload) {
      // state是必须默认参数
      state.infoData = payload.infoData;
    },
    // 更改播放模式
    setPlayMode(state, payload) {
      state.mode = payload.mode;
    },
    // 设置是否开启逐字歌词
    setVerbatim(state, verbatim){
      state.isVerbatim = verbatim;
    },
    // 设置音量
    setVolumeLevel(state, volumeLevel){
      state.volumeLevel = volumeLevel;
    },
    setSoundsOff(state, soundsOff){
      state.soundsOff = soundsOff;
    },
    // 更改播放状态
    setPlayState(state, isPlay) {
      state.isPlay = isPlay;
    },
    // 更新当前播放时间
    setCurrentTime(state, time) {
      state.currentTime = time;
    },
    // 更新缓冲进度
    setBuffered(state, buffered) {
      state.buffered = buffered;
    },
    // 更改当前播放音乐（index）
    setCurrentMusic(state, payload) {
      switch (payload.type) {
        case 'increment':
          state.currentMusicId = state.playMusicList[this.getters.getCurrentMusicIndex + 1].id;
          break;
        case 'decrement':
          state.currentMusicId = state.playMusicList[this.getters.getCurrentMusicIndex - 1].id;
          break;
        case 'setValue':
          state.currentMusicId = payload.id;
          break;
      }
    },
    // 修改当前播放音乐状态
    setCurrentMusicState(state, payload) {
      state.playMusicList[this.getters.getCurrentMusicIndex].musicState = payload.state;
    },
    // 新增键值对
    addPropertyToCurrentMusic(state, payload) {
      Vue.set(state.playMusicList[this.getters.getCurrentMusicIndex], payload.key, payload.value);
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
      state.playMusicList.splice(this.getters.getCurrentMusicIndex + 1, 0, item);
    },
  },
});

export default store;
