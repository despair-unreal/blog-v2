// 公共请求接口
import {Request} from "../utils/request.js"

// 创建axios实例对象  instance
// music页面接口
export const musicService = new Request({
    baseURL: "https://netease-cloud-music-api-despair-unreal.vercel.app/",
    timeout: 5000
})