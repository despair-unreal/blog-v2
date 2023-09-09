<template>
  <div class="music-bar">
    <div class="play-btns">
      <i @click="playPrevious" title="上一首" class="iconfont icon-play-previous"></i>
      <i v-show="!isPlay" @click="play" title="播放" class="iconfont icon-play"></i>
      <i v-show="isPlay" @click="pause" title="暂停" class="iconfont icon-pause"></i>
      <i @click="playNext" title="下一首" class="iconfont icon-play-next"></i>
    </div>
    <div class="progress">
      <span class="current-time">{{ formatTime(currentTime) }}</span>
      <div ref="progress" class="bar" @mousedown="adjustCurrent('bar', $event,'x')">
        <div
          :style="{ left: `${this.current.percent}%` }"
          class="point"
          @mousedown.stop="adjustCurrent('point', $event,'x')"></div>
        <div :style="{ width: `${this.current.percent}%` }" class="current-bar"></div>
        <div :style="{ width: `${this.bufferedPercent}%` }" class="buffered-bar"></div>
      </div>
      <span>{{ formatTime(musicUrlDuration) }}</span>
    </div>
    <i class="iconfont icon-xiangshang" @click="$bus.$emit('openDetail')" title="纯净"></i>
    <i
      :class="['iconfont', item.icon]"
      v-for="(item, index) in playMode"
      :key="item.mode"
      v-show="mode === item.mode"
      :title="item.title"
      @click="setMode(index)"></i>
    <i v-show="isVerbatim" class="btn-verbatim" @click="setVerbatimLyric">逐字</i>
    <i v-show="!isVerbatim" class="btn-verbatim" @click="setVerbatimLyric">逐行</i>
    <div class="volume">
      <i v-if="!volume.soundsOff" title="音量" :class="['iconfont icon-sound-on',{drag:volume.showBar}]" @click="setMuted"></i>
      <i v-else title="静音" :class="['iconfont icon-sound-off',{drag:volume.showBar}]" @click="setMuted"></i>
      <div ref="volume" class="bar" @mousedown="adjustVolume('bar', $event,'x')">
        <div
          :style="{ left: `${volume.percent}%` }"
          class="point"
          @mousedown.stop="adjustVolume('point', $event,'x')"></div>
        <div :style="{ width: `${volume.percent}%` }" class="current-bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { musicControls } from '@/mixmin/musicControl.js';

export default {
  mixins: [musicControls]
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
  font-style: normal;
}
.music-bar i.btn-verbatim{
  font-size: 16px;
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
  width: 100px;
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
  pointer-events:none;
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
.music-bar i.drag,
.music-bar i:hover,
.music-bar .progress:hover,
.music-bar .volume:hover {
  color: #eee;
}
</style>