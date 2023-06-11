import { getMusicUrlAPI, cancelToken, getMusicLyricAPI } from '../../api/music.js';

export class Music {
  constructor(vue) {
    this.utils = vue.$utils;
    this.cancel = [];
  }
  // 整理处理获取到歌曲数据
  setMusicData(oldData, needKeys, keyReplace) {
    // 提取需要的属性
    const needData = this.utils.filterObjectInArray(oldData, needKeys);
    // 统一属性名
    const newData = this.utils.listDataFormat(needData, keyReplace);
    // 加上音乐状态的属性
    const musicList = this.addMusicState(newData);
    return musicList;
  }
  setListStatus(list) {
    let status;
    if (Array.isArray(list)) {
      status = list.length === 0 ? '' : 'complete';
    } else status = 'error';
    return status;
  }
  // 给列表的每条数据加上表示音乐状态的属性
  addMusicState(data) {
    return data.map((value) => {
      value.musicState = 'stop';
      return value;
    });
  }
  // 设置统一要放入歌曲列表的数据对象的键名
  setKeyReplace(arr) {
    const key = ['id', 'name', 'duration', 'artists', 'album', 'cover'];
    const obj = {};
    arr.forEach((value, index) => {
      obj[key[index]] = value;
    });
    return obj;
  }
  // 获取歌曲链接播放歌曲
  async getMusicUrlAndLyric(id) {
    try {
      // 在发起本次请求之前isLoading存储的会是上次请求的取消方法
      this.cancel.forEach((value) => {
        value && value('取消上次请求');
      });
      // 使用 CancelToken.source 工厂方法创建 cancel token并保存取消请求的方法
      const urlSource = cancelToken.source();
      const lyricSource = cancelToken.source();
      this.cancel.push(urlSource.cancel, lyricSource.cancel);
      // 发起请求 歌曲链接和逐字歌词
      const urlApi = () => getMusicUrlAPI({ id }, { cancelToken: urlSource.token });
      const lyricApi = () => getMusicLyricAPI({ id }, { cancelToken: lyricSource.token });
      const apiTaskList = [urlApi, lyricApi];
      const [url, lyric] = await Promise.allSettled(apiTaskList.map((task) => task()));
      let urlData, lyricData;
      // 歌曲链接
      if (url.status === 'fulfilled') {
        urlData = url.value.data || [];
      } else throw new Error(url.reason);
      // 逐字歌词
      if (lyric.status === 'fulfilled') {
        // 双语歌词 || 歌词
        lyricData = lyric.value.yrc?.lyric || lyric.value.lrc?.lyric || '';
      } else throw new Error(lyric.reason);
      return Promise.resolve({ urlData, lyricData });
    } catch (error) {
      if(error.message !== '请求被取消'){
        window.alert(`加载失败，请重试！${error}`);
        // 恢复为未加载状态
        return Promise.resolve('error');
      }
    }
  }
}
