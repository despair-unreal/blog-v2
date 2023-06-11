<template>
  <div class="music-bar">
    <div class="play-btns">
      <i @click="playPrevious" title="上一首" class="iconfont icon-play-previous"></i>
      <i v-show="!isPlay" @click="play" title="播放" class="iconfont icon-play"></i>
      <i v-show="isPlay" @click="pause" title="暂停" class="iconfont icon-pause"></i>
      <i @click="playNext" title="下一首" class="iconfont icon-play-next"></i>
    </div>
    <div class="progress">
      <audio ref="music" @error="musicError" @play="setPlay(true)" @pause="setPlay(false)" :loop="playMode.mode === 'repeat'" :src="musicUrl.url" :type="musicUrl.type" @timeupdate="getCurrentTime" @canplay="canplay" @ended="musicEnded">
        <source :src="`https://music.163.com/song/media/outer/url?id=${musicUrl.id}.mp3`" type="mp3"></source>
      </audio>
      <span class="current-time">{{this.$utils.millisecondConversionTime(current.time, ["seconds","minutes"])}}</span>
      <div ref="progress" class="bar" @mousedown="isCanPlay && adjustCurrent('bar',$event)">
        <div :style="{left: `${this.current.percent}%`}" class="point" @mousedown.stop="isCanPlay && adjustCurrent('point',$event)"></div>
        <div :style="{width: `${this.current.percent}%`}" class="current-bar"></div>
        <div :style="{width: `${this.bufferedPercent}%`}" class="buffered-bar"></div>
      </div>
      <span>{{$utils.millisecondConversionTime(musicUrl.time, [
            "seconds",
            "minutes"
          ])}}</span>
    </div>
    <i v-for="(item,index) in playMode.modeArr" :key="item.mode" v-show="playMode.mode === item.mode" :title="item.title" :class="['iconfont',item.icon]" @click="setMode(index)"></i>
    <div class="volume">
      <i v-if="!soundsOff" title="音量" class="iconfont icon-sound-on" @click="setMuted"></i>
      <i v-else title="静音" class="iconfont icon-sound-off" @click="setMuted"></i>
      <div ref="volume" class="bar" @mousedown="adjustVolume('bar',$event)">
        <div :style="{left: `${this.volumePixel}px`}" class="point" @mousedown.stop="adjustVolume('point',$event)"></div>
        <div :style="{width: `${this.volumePixel}px`}" class="current-bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';

export default {
  props: {
    musicUrlData: Array,
  },
  data() {
    return {
      isPlay: false,
      isCanPlay: false,
      volumePixel: 0,
      soundsOff: false,
      buffered: 0,
      current: {
        time: 0,
        percent: 0,
        isAdjust: false,
      },
      playMode: {
        mode: 'list-loop',
        modeArr: [
          { mode: 'repeat', title: '单曲循环', icon: 'icon-repeat' },
          { mode: 'once', title: '播放一次', icon: 'icon-repeat-once' },
          { mode: 'list-loop', title: '列表循环', icon: 'icon-list-play' },
          { mode: 'random', title: '随机播放', icon: 'icon-random-play' },
        ],
      },
    };
  },

  computed: {
    ...mapState(['playMusicList', 'currentMusicIndex']),
    ...mapGetters(['getPlayListLastIndex', 'getCurrentMusic']),
    // 缓冲进度百分比
    bufferedPercent: function () {
      const per = (this.buffered / this.musicUrl.time) * 100;
      return Math.max(0, Math.min(per, 100));
    },
    // 歌曲链接
    musicUrl: {
      get: function () {
        if (this.musicUrlData.length > 0) {
          // 提取需要的属性
          const data = this.$utils.filterObjectInArray(this.musicUrlData, ['id', 'url', 'type', 'time']);
          const { id, type, url, time } = data[0];
          // 播放歌曲
          return {
            id: id,
            type: type,
            url: url,
            time: time,
          };
        } else
          return {
            id: 0,
            url: '',
            type: '',
            time: 0,
          };
      },
      set: function (value) {
        this.musicUrl.time = value;
      },
    },
  },
  watch: {
    // 更换歌曲后修改歌曲时长，重置缓冲条和播放进度（只修改渲染出来显示的，不修改实际播放器）
    'getCurrentMusic.id': function () {
      this.isCanPlay = false;
      this.buffered = 0;
      this.current.time = 0;
      this.current.percent = 0;
      this.musicUrl.time = this.getCurrentMusic.duration;
      this.pause();
    },
    // 通过计算音量条长度占比来设置音量大小
    volumePixel: function () {
      this.$refs.music.volume = this.volumePixel / this.$refs.volume.offsetWidth;
    },
    isPlay: function () {
      this.$bus.$emit('playStateChanges', this.isPlay);
      const state = this.isPlay ? 'play' : 'pause';
      // 当前播放音乐状态为非加载状态时：可以更改状态
      // 当前播放音乐状态为加载状态时：isPlay为true（可播放），可以更改状态，否则说明音乐还没有加载完毕不可更改其状态
      (this.getCurrentMusic.musicState !== 'loading' || state === 'play') && this.setCurrentMusicState({ state });
    },
  },
  methods: {
    ...mapMutations(['setCurrentMusic', 'setCurrentMusicState']),
    // 监听设置播放器的播放状态
    setPlay(boolean) {
      this.isPlay = boolean;
    },
    // 音频就绪状态达到可以播放
    canplay() {
      this.isCanPlay = true;
      this.play();
    },
    // 播放音乐
    play() {
      if (this.isCanPlay) {
        // 初始化播放器链接
        this.musicUrl.url
          ? this.$refs.music.paused && this.$refs.music.play()
          : this.setCurrentMusic({ type: 'setValue', index: 0 });
      }
    },
    // 播放状态下暂停音乐
    pause() {
      !this.$refs.music.paused && this.$refs.music.pause();
    },
    // 音乐播放完毕/发生错误
    musicEnded() {
      // 当播放模式不为单曲循环/仅播放一次的时候，当前播放歌曲结束后根据播放模式切换下一首歌曲
      !['repeat', 'once'].includes(this.playMode.mode) && this.playNext();
    },
    // 音乐发生错误
    musicError() {
      if (this.musicUrl.url) {
        const error = this.$refs.music.error;
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
    // 播放下一首歌曲
    playNext() {
      switch (this.playMode.mode) {
        case 'once':
        case 'repeat':
        case 'list-loop': {
          // 当前播放位置在最后一首时，下一首重置到第一首歌曲
          this.currentMusicIndex < this.getPlayListLastIndex
            ? this.setCurrentMusic({ type: 'increment' })
            : this.setCurrentMusic({ type: 'setValue', index: 0 });
          break;
        }
        // 随机播放
        case 'random': {
          const index = Math.floor(Math.random() * this.getPlayListLastIndex + 1);
          this.setCurrentMusic({ type: 'setValue', index });
          break;
        }
      }
    },
    // 播放上一首歌曲
    playPrevious() {
      this.currentMusicIndex > 0 && this.setCurrentMusic({ type: 'decrement' });
      // 当前播放位置在第一首时，下一首设置为最后一首歌曲
      this.currentMusicIndex === 0 && this.setCurrentMusic({ type: 'setValue', index: this.getPlayListLastIndex });
    },
    // 更换音乐播放模式
    setMode(index) {
      // 将超过数组长度的索引值重新回到数组的起始位置
      const next = (index + 1) % this.playMode.modeArr.length;
      this.playMode.mode = this.playMode.modeArr[next].mode;
    },
    // 播放时长更新回调事件
    getCurrentTime() {
      // 保证只在播放器播放音乐时跟进进度条的更新
      // 播放器更换链接后会设置currentTime导致在暂停状态触发timeupdate事件
      if (!this.$refs.music.paused) {
        // 获取当前播放时长 将秒转为毫秒
        this.current.time = this.$refs.music.currentTime * 1000;
        // 没有在调整进度条
        if (!this.current.isAdjust) {
          // 计算播放时长的占比
          const per = (this.current.time / this.musicUrl.time) * 100;
          // 0<=占比<=100
          this.current.percent = Math.max(0, Math.min(per, 100));
        }
        // 获取缓冲时间范围的数量
        const bufferedRanges = this.$refs.music.buffered.length;
        // 遍历每个缓冲时间范围
        for (let i = 0; i < bufferedRanges; i++) {
          // 获取缓冲的起始时间和结束时间
          const startTime = this.$refs.music.buffered.start(i);
          const endTime = this.$refs.music.buffered.end(i);
          // 计算当前缓冲时间范围的时间差，并累加到总缓冲时间
          const bufferedTime = (endTime - startTime) * 1000;
          this.buffered += bufferedTime;
        }
      }
    },
    // 设置是否静音
    setMuted() {
      this.$refs.music.muted = !this.$refs.music.muted;
      this.soundsOff = this.$refs.music.muted;
    },
    // 调整音量
    adjustVolume(eventName, event) {
      switch (eventName) {
        // 点击音量条
        case 'bar':
          // 鼠标点击位置的长度占音量条总长度百分比
          this.volumePixel = event.offsetX;
          break;
        // 按住圆点
        case 'point': {
          // 鼠标按下时的圆点位置
          const mouseX = event.clientX;
          // 鼠标按下时的音量条长度
          const oldPixel = this.volumePixel;
          // 监听鼠标移动
          const move = (e) => {
            // 鼠标移动距离 正值向左移动减小音量，负值向右移动加大音量
            const distance = mouseX - e.clientX;
            const tmp = oldPixel - distance;
            // 确保this.volumePixel取值在0和offsetWidth之间
            this.volumePixel = Math.max(0, Math.min(tmp, this.$refs.volume.offsetWidth));
          };
          window.addEventListener('mousemove', move);
          // 解除监听
          const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
          };
          window.addEventListener('mouseup', up);
          break;
        }
      }
    },
    // 调整播放进度
    adjustCurrent(eventName, event) {
      // 点击进度条
      switch (eventName) {
        case 'bar': {
          // 鼠标点击位置的长度占音乐进度条总长度百分比
          const per = event.offsetX / this.$refs.progress.offsetWidth;
          // currentTime单位为秒 this.musicUrl.time单位为毫秒
          this.$refs.music.currentTime = (this.musicUrl.time * per) / 1000;
          break;
        }
        case 'point': {
          this.current.isAdjust = true;
          // 鼠标按下时的圆点位置
          const mouseX = event.clientX;
          // 鼠标按下时的播放占比
          const oldCurrent = this.current.percent;
          const move = (e) => {
            // 鼠标移动距离百分比
            const distancePer = ((mouseX - e.clientX) / this.$refs.progress.offsetWidth) * 100;
            // 调整距离后百分比
            const tmp = oldCurrent - distancePer;
            this.current.percent = Math.max(0, Math.min(tmp, 100));
          };
          window.addEventListener('mousemove', move);
          const up = () => {
            // 设置进度 currentTime单位为秒 this.musicUrl.time单位为毫秒 this.current.percent为百分制（没带百分号）
            this.$refs.music.currentTime = (this.musicUrl.time * this.current.percent) / 100000;
            // 解除监听
            this.current.isAdjust = false;
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
          };
          window.addEventListener('mouseup', up);
          break;
        }
      }
    },
  },
  mounted() {
    // 初始化设置音量条长度为100%
    this.volumePixel = this.$refs.volume.offsetWidth;
    // 获取是否静音
    this.soundsOff = this.$refs.volume.muted;
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .music-bar .volume .bar {
    display: none;
  }
}
@media (max-width: 520px) {
  .play-btns {
    order: 2;
    width: 60% !important;
  }
  .icon-repeat {
    order: 1;
  }
  .volume {
    order: 3;
  }
  .progress {
    width: 100%;
  }
  .music-bar > *:not(:first-child) {
    margin-left: 0 !important;
  }
}
.music-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  font-size: 20px;
}
.music-bar > *:not(:first-child) {
  margin-left: 20px;
}
.music-bar .play-btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 180px;
  line-height: 1;
}
.music-bar i {
  cursor: pointer;
  transition: all 0.2s;
}
.music-bar .play-btns i.icon-play,
.music-bar .play-btns i.icon-pause {
  height: 40px;
  width: 40px;
  font-size: 16px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
}
.music-bar .progress {
  display: flex;
  align-items: center;
  flex-grow: 1;
  font-size: 16px;
  user-select: none;
}
.music-bar .progress .current-time {
  min-width: 46px;
}
.music-bar .volume {
  display: flex;
  align-items: center;
}
.music-bar .volume .bar {
  width: 122px;
}
.music-bar .progress .bar {
  margin-right: 8px;
}
.music-bar .bar {
  position: relative;
  height: 2px;
  width: 100%;
  padding-right: 10px;
  margin-left: 8px;
  background: rgba(255, 255, 255, 0.15);
  /* cursor: pointer; */
}
.music-bar .bar .current-bar,
.music-bar .bar .buffered-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  width: 0;
}
.music-bar .progress .bar .buffered-bar {
  transition: all 0.2s;
}
.music-bar .bar .current-bar {
  background: rgba(255, 255, 255, 0.4);
}
.music-bar .bar .buffered-bar {
  background: rgba(255, 255, 255, 0.2);
}
.music-bar .bar .point {
  position: relative;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #eee;
  cursor: pointer;
  content: '';
}
.music-bar i:hover,
.music-bar .progress:hover,
.music-bar .volume:hover {
  color: #eee;
}
</style>