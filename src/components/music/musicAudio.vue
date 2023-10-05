<template>
  <audio ref="audio" crossOrigin='anonymous' @error="musicError" @play="setPlayState(true)" @pause="setPlayState(false)" :loop="mode === 'repeat'"
       :src="musicUrl.url" :type="musicUrl.type" @timeupdate="getCurrentTime" @canplay="play" @ended="musicEnded">
    <source :src="`https://music.163.com/song/media/outer/url?id=${musicUrl.id}.mp3`" type="mp3"></source>
  </audio>
</template>

<script>
import { mapMutations } from 'vuex';
import { musicPlay } from '@/mixmin/musicPlay.js';

export default {
  mixins: [musicPlay],
  computed: {
    // 歌曲链接
    musicUrl() {
      const nullObj = {
        id: null,
        url: '',
        type: '',
        time: 0,
      };
      return this.getCurrentMusic?.urlMsg ? { ...this.getCurrentMusic.urlMsg } : nullObj;
    },
  },
  watch: {
    // 更换歌曲后
    currentMusicId: function (id) {
      this.resetBar(id);
      // 设置播放状态
      this.setPlayState(false);
      // 取消前一次未完成的请求
      this.utils.cancel && this.utils.cancel();
      // 当前获取音乐链接并记录
      !this.getCurrentMusic?.urlMsg && this.setMusicUrl(id);
    },
    isPlay(value) {
      const state = value ? 'play' : 'pause';
      // 当前播放音乐状态为非加载状态时：可以更改状态
      // 当前播放音乐状态为加载状态时：isPlay为true（播放中），可以更改状态，否则说明音乐还没有加载完毕不可更改其状态
      this.getCurrentMusic &&
        (this.getCurrentMusic.musicState !== 'loading' || state === 'play') &&
        this.setCurrentMusicState({ state });
    }
  },
  methods: {
    ...mapMutations(['setCurrentTime','setBuffered','setPlayState']),
    // 重置缓冲条和播放进度
    resetBar(id) {
      // 设置加载状态
      id && this.setMusicLoadingStatus();
      // 缓冲条
      this.setBuffered(0);
      // 进度条
      this.setCurrentTime(0);
    },
    // 播放时长更新回调事件
    getCurrentTime() {
      const musicAudioDom = this.$refs.audio;
      // 保证只在播放器播放音乐时跟进进度条的更新
      // 播放器更换链接后会设置currentTime导致在暂停状态触发timeupdate事件
      if (!musicAudioDom.paused) {
        // 获取当前播放时长 将秒转为毫秒
        this.setCurrentTime(musicAudioDom.currentTime * 1000);
        // 获取当前缓冲进度
        // 获取缓冲时间范围的数量
        const bufferedRanges = musicAudioDom.buffered.length;
        let buffered = this.buffered;
        // 遍历每个缓冲时间范围
        for (let i = 0; i < bufferedRanges; i++) {
          // 获取缓冲的起始时间和结束时间
          const startTime = musicAudioDom.buffered.start(i);
          const endTime = musicAudioDom.buffered.end(i);
          // 计算当前缓冲时间范围的时间差，并累加到总缓冲时间
          const bufferedTime = (endTime - startTime) * 1000;
          buffered += bufferedTime;
          this.setBuffered(buffered);
        }
      }
    },
    // 音乐发生错误
    musicError() {
      if (this.musicUrl.url) {
        const error = this.$refs.audio.error;
        let msg;
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            msg = '因用户终止操作而导致媒体资源加载过程中断\n(The media loading process was aborted.)';
            break;
          case error.MEDIA_ERR_DECODE:
            msg = '媒体解码过程中发生错误\n(An error occurred while decoding the media.)';
            break;
          case error.MEDIA_ERR_NETWORK:
            msg = '由于网络错误导致无法加载媒体资源\n(A network error occurred while fetching the media.)';
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            msg = '浏览器不支持所请求的媒体资源\n(The requested media resource is not supported.)';
            break;
          default:
            msg = '发生未知错误\n(An unknown error occurred.)';
            break;
        }
        window.alert(msg);
        this.musicEnded();
      }
    },
    // 音乐播放完毕/发生错误
    musicEnded() {
      // 当播放模式不为单曲循环/仅播放一次的时候，当前播放歌曲结束后根据播放模式切换下一首歌曲
      !['repeat', 'once'].includes(this.mode) && this.playNext();
    },
  }
};
</script>

<style>
</style>