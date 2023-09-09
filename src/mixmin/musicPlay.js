import { mapMutations, mapState, mapGetters } from 'vuex';
import { Music } from '@/components/music/Music.js';

export const musicPlay = {
  data() {
    return {
      musicAudioDom: null,
      utils: new Music(this),
    };
  },
  computed: {
    ...mapState(['playMusicList', 'currentMusicId', 'mode', 'isPlay']),
    ...mapGetters(['getPlayListLastIndex', 'getCurrentMusic', 'getCurrentMusicIndex']),
    musicUrlDuration() {
      return this.getCurrentMusic?.urlMsg?.time || 0;
    }
  },
  methods: {
    ...mapMutations([
      'setCurrentMusic',
      'setCurrentMusicState',
      'setPlayMusicList',
      'addPropertyToCurrentMusic',
    ]),
    // 音频就绪/点击播放触发
    play() {
      if (this.currentMusicId) {
        if (this.getCurrentMusic.urlMsg.url)
          // 播放音乐
          this.musicAudioDom.readyState >= 3 && this.musicAudioDom.paused && this.musicAudioDom.play();
        else if (this.getCurrentMusic.musicState === 'stop') {
          // 重新获取歌曲数据
          this.setMusicLoadingStatus();
          this.setMusicUrl(this.currentMusicId);
        }
      } else if (this.playMusicList.length > 0) {
        // 初始化播放器链接
        const id = this.playMusicList[0].id;
        this.playMusicList.length > 0 && this.setCurrentMusic({ type: 'setValue', id });
      }
    },
    // 播放下一首歌曲
    playNext() {
      switch (this.mode) {
        case 'once':
        case 'repeat':
        case 'list-loop': {
          // 当前播放位置在最后一首时，下一首重置到第一首歌曲
          this.getCurrentMusicIndex < this.getPlayListLastIndex
            ? this.setCurrentMusic({ type: 'increment' })
            : this.setCurrentMusic({ type: 'setValue', id: this.playMusicList[0].id });
          break;
        }
        // 随机播放
        case 'random': {
          const index = Math.floor(Math.random() * this.getPlayListLastIndex + 1);
          this.setCurrentMusic({ type: 'setValue', id: this.playMusicList[index].id });
          break;
        }
      }
    },
    // 重置列表中所有歌曲的状态并单独给当前播放歌曲设置加载状态
    setMusicLoadingStatus() {
      const newList = this.playMusicList.map((value, index) => {
        value.musicState = index === this.getCurrentMusicIndex ? 'loading' : 'stop';
        return value;
      });
      this.setPlayMusicList({ musicList: newList });
    },
    // 获取歌曲数据
    async setMusicUrl(id) {
      try {
        const data = await this.utils.getMusicUrlAndLyric(id, ['url']);
        const value = data.url.value || data.url.reason;
        if (data.url.status === 'fulfilled') {
          const filterData = this.$utils.filterObjectInArray(value, ['id', 'url', 'type', 'time']);
          const urlData = { ...filterData[0] };
          this.addPropertyToCurrentMusic({ key: 'urlMsg', value: urlData });
        } else if (value !== '请求被取消') throw new Error(value);
      } catch (error) {
        window.alert('加载失败!' + error);
        this.setCurrentMusicState({ state: 'stop' });
      }
    }
  },
  mounted() {
    // 获取audio标签
    this.musicAudioDom = this.$root.$children[0].$refs.music.$refs.audio;
  },
};
