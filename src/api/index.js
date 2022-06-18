// 此文件为请求接口的方法

import axios from 'axios';
// 接口地址
import base from './base'

// 请求方法
const api = {
    getInfo(){
        return axios.get(); // 此处不做数据的解析
    }
};
export default api;