<template>
  <div class="music-bar">
    <div class="play-btns">
      <i @click="$emit('playPrevious')" title="上一首" class="iconfont icon-play-previous"></i>
      <i v-show="!isPlay" @click="play" title="播放" class="iconfont icon-play"></i>
      <i v-show="isPlay" @click="pause" title="暂停" class="iconfont icon-pause"></i>
      <i @click="$emit('playNext')" title="下一首" class="iconfont icon-play-next"></i>
    </div>
    <div class="progress">
      <audio ref="music" :loop="mode === 'repeat'" @timeupdate="getCurrentTime" @canplay="play" @ended="musicEnded" :src="musicUrl.url" :type="musicUrl.type">
        <source :src="`https://music.163.com/song/media/outer/url?id=${musicUrl.id}.mp3`" type="mp3"></source>
      </audio>
      <span class="current-time">{{this.$utils.millisecondConversionTime(current.time, ["seconds","minutes"])}}</span>
      <div ref="progress" class="bar" @mousedown="adjustCurrent('bar',$event)">
        <div :style="{left: `${this.current.percent}%`}" class="point" @mousedown.stop="adjustCurrent('point',$event)"></div>
        <div :style="{width: `${this.current.percent}%`}" class="current-bar"></div>
        <div :style="{width: `${this.bufferedPercent}%`}" class="buffered-bar"></div>
      </div>
      <span>{{$utils.millisecondConversionTime(musicUrl.time, [
            "seconds",
            "minutes"
          ])}}</span>
    </div>
    <i v-for="(item,index) in modeArr" :key="item.mode" v-show="mode === item.mode" :title="item.title" :class="['iconfont',item.icon]" @click="setMode(index)"></i>
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
export default {
  props: {
    musicUrl: Object,
    isLoop: Boolean,
    mode: String,
    modeArr:Array
  },
  data() {
    return {
      isPlay: false,
      current: {
        time: 0,
        percent: 0,
        isAdjust: false,
      },
      buffered: 0,
      volumePixel: 0,
      soundsOff: false,
    };
  },
  watch: {
    // 更换歌曲后重置缓冲条和播放进度
    "musicUrl.url": function () {
      this.buffered = 0;
      this.current.time = "00:00";
    },
    // 通过计算音量条长度占比来设置音量大小
    volumePixel: function () {
      this.$refs.music.volume =
        this.volumePixel / this.$refs.volume.offsetWidth;
    },
  },
  computed: {
    // 缓冲进度百分比
    bufferedPercent: function () {
      const per = (this.buffered / this.musicUrl.time) * 100;
      return Math.max(0, Math.min(per, 100));
    },
  },
  methods: {
    // 播放音乐
    play() {
      if (this.$refs.music.paused) {
        this.$refs.music.play();
        this.$emit("playMusic");
        this.isPlay = true;
      }
    },
    // 暂停音乐
    pause() {
      if (!this.$refs.music.paused) {
        this.$refs.music.pause();
        this.$emit("pauseMusic");
        this.isPlay = false;
      }
    },
    // 更换音乐播放模式
    setMode(index) {
      // 将超过数组长度的索引值重新回到数组的起始位置
      const next = (index + 1) % this.modeArr.length;
      this.$emit("update:mode",this.modeArr[next].mode);
    },
    // 音乐播放完毕
    musicEnded() {
      this.$emit("stopMusic");
      this.isPlay = false;
    },
    // 播放时长更新回调事件
    getCurrentTime() {
      // 当前播放时长 将秒转为毫秒
      this.current.time = this.$refs.music.currentTime * 1000;
      // 没有在调整进度条
      if (!this.current.isAdjust) {
        // 计算播放时长的占比
        const per = (this.current.time / this.musicUrl.time) * 100;
        // 0<=占比<=100
        this.current.percent = Math.max(0, Math.min(per, 100));
      }
      // 当前缓冲部分
      if (this.$refs.music.buffered.length > 0 && this.bufferedPercent <= 100) {
        this.buffered = this.$refs.music.buffered.end(0) * 1000;
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
        case "bar":
          // 鼠标点击位置的长度占音量条总长度百分比
          this.volumePixel = event.offsetX;
          break;
        // 按住圆点
        case "point": {
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
            this.volumePixel = Math.max(
              0,
              Math.min(tmp, this.$refs.volume.offsetWidth)
            );
          };
          window.addEventListener("mousemove", move);
          // 解除监听
          const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
          };
          window.addEventListener("mouseup", up);
          break;
        }
      }
    },
    // 调整播放进度
    adjustCurrent(eventName, event) {
      // 点击进度条
      switch (eventName) {
        case "bar": {
          // 鼠标点击位置的长度占音乐进度条总长度百分比
          const per = event.offsetX / this.$refs.progress.offsetWidth;
          // currentTime单位为秒 this.musicUrl.time单位为毫秒
          this.$refs.music.currentTime = (this.musicUrl.time * per) / 1000;
          break;
        }
        case "point": {
          this.current.isAdjust = true;
          // 鼠标按下时的圆点位置
          const mouseX = event.clientX;
          // 鼠标按下时的播放占比
          const oldCurrent = this.current.percent;
          const move = (e) => {
            // 鼠标移动距离百分比
            const distancePer =
              ((mouseX - e.clientX) / this.$refs.progress.offsetWidth) * 100;
            // 调整距离后百分比
            const tmp = oldCurrent - distancePer;
            this.current.percent = Math.max(0, Math.min(tmp, 100));
          };
          window.addEventListener("mousemove", move);
          const up = () => {
            // 设置进度 currentTime单位为秒 this.musicUrl.time单位为毫秒 this.current.percent为百分制（没带百分号）
            this.$refs.music.currentTime =
              (this.musicUrl.time * this.current.percent) / 100000;
            // 解除监听
            this.current.isAdjust = false;
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
          };
          window.addEventListener("mouseup", up);
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
  content: "";
}
.music-bar i:hover,
.music-bar .progress:hover,
.music-bar .volume:hover {
  color: #eee;
}
</style>