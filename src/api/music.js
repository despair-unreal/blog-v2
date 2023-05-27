import { musicService } from './base.js'
import axios from 'axios';

// 获取歌单歌曲
export const getDefalutPlayList = params => musicService.get('/playlist/track/all', params);
// 获取搜索歌曲
export const getSearchList = params => musicService.get('/search', params);
// 获取歌曲URL
export const cancelToken = axios.CancelToken;
export const getMusicUrlAPI = (params,cancelToken) => musicService.get('/song/url',params,cancelToken);