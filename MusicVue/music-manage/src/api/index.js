import {get,post} from "./http"

//判断管理员是否登录成功
export const getLoginStatus = (params) => post(`admin/login/status`,params);

//查询歌手
export const getAllSinger = () => get(`singer/allSinger`);

//添加歌手
export const setSinger = (params) => post(`singer/add`,params);

