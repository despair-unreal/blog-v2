import { mapMutations, mapState } from 'vuex';
import { musicPlay } from '@/mixmin/musicPlay.js';

export const musicControls = {
  mixins: [musicPlay],
  data() {
    return {
      playMode: [
        { mode: 'repeat', title: '单曲循环', icon: 'icon-repeat' },
        { mode: 'once', title: '播放一次', icon: 'icon-repeat-once' },
        { mode: 'list-loop', title: '列表循环', icon: 'icon-list-play' },
        { mode: 'random', title: '随机播放', icon: 'icon-random-play' },
      ],
      // 播放进度
      current: {
        percent: 0,
        isAdjust: false,
      },
      // 音量
      volume: {
        percent: 100,
        soundsOff: false,
        showBar:false
      },
    };
  },
  computed: {
    ...mapState(['currentTime', 'buffered','volumeLevel','soundsOff','isVerbatim']),
    // 缓冲进度百分比
    bufferedPercent() {
      const per = (this.buffered / this.musicUrlDuration) * 100;
      return this.musicUrlDuration === 0 ? 0 : Math.max(0, Math.min(per, 100));
    },
  },
  watch: {
    // 通过计算播放进度占比来设置进度条长度
    currentTime(time) {
      // 没有在调整进度条
      if (!this.current.isAdjust) {
        // 计算播放时长的占比
        const per = (time / this.musicUrlDuration) * 100;
        // 0<=占比<=100
        this.current.percent = this.musicUrlDuration === 0 ? 0 : Math.max(0, Math.min(per, 100));
      }
    },
    // 监听音量变化以同步所有组件的音量条长度
    volumeLevel(v){
      this.volume.percent = v * 100;
    },
    // 通过计算音量条长度占比来设置音量大小
    'volume.percent': function (v) {
      this.musicAudioDom.volume = v / 100;
    },
    // 同步所有组件的静音状态
    soundsOff(v){
      this.volume.soundsOff = v;
    },
    // 监听是否设置了静音同步设置到播放器
    'volume.soundsOff':function(v){
      this.musicAudioDom.muted = v;
      this.setSoundsOff(v);
    }
  },
  methods: {
    ...mapMutations([
      'setPlayMode',
      'setVolumeLevel',
      'setSoundsOff',
      'setVerbatim'
    ]),
    formatTime(time) {
      return this.$utils.millisecondConversionTime(time, ['seconds', 'minutes']);
    },
    // 设置是否静音
    setMuted() {
      this.volume.soundsOff = !this.musicAudioDom.muted;
    },
    // 更换音乐播放模式
    setMode(index) {
      // 将超过数组长度的索引值重新回到数组的起始位置
      const next = (index + 1) % this.playMode.length;
      const mode = this.playMode[next].mode;
      this.setPlayMode({ mode });
    },
    // 开启/关闭逐字模式
    setVerbatimLyric(){
      this.setVerbatim(!this.isVerbatim);
    },
    // 播放状态下暂停音乐
    pause() {
      !this.musicAudioDom.paused && this.musicAudioDom.pause();
    },
    // 播放上一首歌曲
    playPrevious() {
      if (this.getCurrentMusicIndex > 0) this.setCurrentMusic({ type: 'decrement' });
      // 当前播放位置在第一首时，下一首设置为最后一首歌曲
      else if (this.getCurrentMusicIndex === 0)
        this.setCurrentMusic({ type: 'setValue', id: this.playMusicList[this.getPlayListLastIndex].id });
    },
    // 调整音量 
    adjustVolume(eventName, event,direction,singleUpEvent=null) {
      const fullPixel = direction === 'x' ? this.$refs.volume.offsetWidth : this.$refs.volume.offsetHeight;
      switch (eventName) {
        // 点击音量条
        case 'bar': {
          // 鼠标点击位置的长度占音量条总长度百分比
          this.volume.percent = this.getClickBarPercent(event,direction,fullPixel);
          this.setVolumeLevel(this.volume.percent / 100);
          break;
        }
        // 按住圆点
        case 'point': {
          const upEvent = ()=>{
            singleUpEvent && singleUpEvent();
            this.volume.showBar = false;
            this.setVolumeLevel(this.volume.percent / 100);
          };
          this.volume.showBar = true;
          this.dragPoint({event,direction, fullPixel, obj:this.volume,upEvent});
          break;
        }
      }
    },
    // 调整播放进度
    adjustCurrent(eventName, event,direction) {
      const fullPixel = direction === 'x' ? this.$refs.progress.offsetWidth : this.$refs.progress.offsetHeight;
      // 音频就绪
      if (this.musicAudioDom.readyState >= 3) {
        // 点击进度条
        switch (eventName) {
          case 'bar': {
            const per = this.getClickBarPercent(event,direction, fullPixel) / 100;
            // currentTime单位为秒 this.musicUrlDuration单位为毫秒
            this.musicAudioDom.currentTime = (this.musicUrlDuration * per) / 1000;
            break;
          }
          case 'point': {
            const upEvent = () => {
              // 设置进度 currentTime单位为秒 this.musicUrlDuration单位为毫秒 this.current.percent为百分制（没带百分号）
              this.musicAudioDom.currentTime = (this.musicUrlDuration * this.current.percent) / 100000;
              this.$bus.$emit('timeChange');
            };
            this.dragPoint({event,direction, fullPixel, obj:this.current, upEvent, flag:true});
            break;
          }
        }
      }
    },
    // 点击进度条
    getClickBarPercent(event,direction, fullPixel) {
      const mouseSitePixel = direction === 'x' ? event.offsetX : (fullPixel - event.offsetY);
      const per = (mouseSitePixel / fullPixel) * 100;
      // 0<=占比<=100
      return Math.max(0, Math.min(per, 100));
    },
    // 拖拽进度点
    dragPoint({event,direction, fullPixel, obj, upEvent = null, flag = false} = {}) {
      flag && (obj['isAdjust'] = true);
      // 获取鼠标位置
      const mouseSite = (event)=>{
        return direction === 'x' ? event.clientX : event.clientY;
      };
      // 鼠标按下时的圆点位置
      const oldSite = mouseSite(event);
      // 鼠标按下时的播放占比
      const oldCurrent = obj['percent'];
      const move = (e) => {
        const newSite = mouseSite(e);
        const distance = direction === 'x' ? oldSite - newSite : newSite - oldSite;
        // 鼠标移动距离百分比
        const distancePer = (distance / fullPixel) * 100;
        // 调整距离后百分比
        const tmp = oldCurrent - distancePer;
        obj['percent'] = Math.max(0, Math.min(tmp, 100));
      };
      window.addEventListener('mousemove', move);
      const up = () => {
        // 处理事件
        upEvent && upEvent();
        // 解除监听
        flag && (obj['isAdjust'] = false);
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
      };
      window.addEventListener('mouseup', up);
    },
  }
};
