import Qs from "qs";
import axios from "axios";
export class Request{
    constructor(cfg){
        // 创建实例
        this.instance = axios.create(cfg);
        // 请求拦截器
        this.instance.interceptors.request.use(config =>{
            return config;
        },error => {
            return Promise.reject(error);
        })
        // 响应拦截器
        this.instance.interceptors.response.use(response =>{
            if(response.status !== 200) return Promise.reject(response.data);
            return response.data;
        },error =>{
            if(axios.isCancel(error))
                return Promise.reject('请求被取消');
            else if(error.code === 'ECONNABORTED' || error.message.indexOf('timeout') !== -1)
                return Promise.reject('请求超时');
            else if(error.response){
                const msg = error.response.data.message;
                if(msg) console.log(msg);
                // 状态码
                const status = error.response.status;
                if(status === 404)
                    return Promise.reject(status);
            }
            else if(error.message === "Network Error"){
                return Promise.reject("接口连接异常 Network Error");
            }
            else{
                return Promise.reject(error);
            }
        })
    }
    get(url,params,otherCfg){
        return this.instance.get(url,{
            params,...otherCfg
        });
    }
    // 表单格式的数据
    post(url,data){
        return this.instance.post(url,Qs.stringify(data));
    }
    // json格式的数据
    postJSON(url,data){
        return this.instance.post(url,data);
    }
}
