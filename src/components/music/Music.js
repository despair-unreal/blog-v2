import { getMusicUrlAPI, cancelToken, getMusicLyricAPI, getMusicDetailAPI } from '../../api/music.js';

export class Music {
  constructor(vue) {
    this.utils = vue.$utils;
    this.cancel = null;
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
    return list.length === 0 ? '' : 'complete';
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
    const key = ['id', 'name', 'duration', 'artists', 'album'];
    const obj = {};
    arr.forEach((value, index) => {
      obj[key[index]] = value;
    });
    return obj;
  }
  // 获取歌曲链接、详情(为了拿封面链接)和逐字歌词数据
  async getMusicUrlAndLyric(id, needApi = ['url', 'lyric', 'detail']) {
    // 在发起本次请求之前cancel存储的会是上次请求的取消方法
    // 使用 CancelToken.source 工厂方法创建 cancel token并保存取消请求的方法
    const source = cancelToken.source();
    const token = source.token;
    this.cancel = source.cancel;
    // api列表
    const apiList = new Map([
      ['url', () => getMusicUrlAPI({ id }, { cancelToken: token })],
      ['lyric', () => getMusicLyricAPI({ id }, { cancelToken: token })],
      ['detail', () => getMusicDetailAPI({ ids: id }, { cancelToken: token })],
    ]);
    // 加入请求列表并记录请求名称，发起请求
    const taskList = needApi.map((apiName) => apiList.get(apiName));
    const taskResult = await Promise.allSettled(taskList.map((task) => task()));
    // 处理请求结果
    const getLyric = (obj)=>{
      // 逐字歌词 || 标准歌词（逐行） || 中文翻译歌词
      const objLyric = {
        'yrc':obj.value.yrc?.lyric,
        'lrc':obj.value.lrc?.lyric,
        'tlyric':obj.value.tlyric?.lyric
      };
      const lyric = Object.keys(objLyric).reduce((lyric,key) =>{
        return objLyric[key] ? {...lyric, [key] : objLyric[key]} : lyric;
      },{});
      return lyric;
    };
    // api对应数据
    const apiValue = new Map([
      // 歌曲链接
      ['url', (obj)=>obj.value.data],
      // 歌词
      ['lyric', (obj)=>getLyric(obj)],
      // 歌曲详情
      ['detail', (obj)=>obj.value.songs],
    ]);
    const result = taskResult.reduce((result,obj,index)=>{
      const apiName = needApi[index];
      if (obj.status === 'fulfilled') {
        obj.value = apiValue.get(apiName)(obj);
      }
      return {...result,[apiName]:obj};
    },{});
    return Promise.resolve(result);
  }
}
