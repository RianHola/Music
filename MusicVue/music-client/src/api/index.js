import Axios from "axios";
import {get,post} from "./http"

//==================歌手相关==================
//查询歌手
export const getAllSinger = () => get(`singer/allSinger`);

//查询根据性别查询歌手
export const getSingerOfSex = (sex) => get(`singer/singerOfSex?sex=${sex}`);

//=====================歌曲相关=====================
//根据歌手id查询歌曲
export const songOfSingerId = (id) =>get(`song/singer/detail?singerId=${id}`);

//根据歌曲ID查询歌曲对象
export const songOfSongId = (id) =>get(`song/detail?songId=${id}`);

//根据歌曲名模糊搜索歌曲
export const likeSongOfName = (keywords) =>get(`song/likeSongOfName?songName=${keywords}`);

//=====================歌单相关=====================
//查询歌单
export const getAllSongList = () => get(`songList/allSongList`);

//返回包含标题的歌单列表
export const getSongListOfLikeTitle = (keywords) => get(`songList/likeTitle?title=${keywords}`);

//根据风格查询相对应的歌单
export const getSongListOfStyle = (style) => get(`/songList/likeStyle?style=${style}`);

//=====================歌单的歌曲相关=====================
//根据歌单ID查询歌单的歌曲
export const ListSongDetail = (songListId) => get(`listSong/detail?songListId=${songListId}`);

//=====================用户相关=====================
//查询用户
export const getAllConsumer = () => get(`consumer/allConsumer`);
//注册用户
export const signUp = (params) => post(`consumer/add`,params);
//登录用户
export const loginIn = (params) => post(`consumer/login`,params);
//根据用户Id查询用户信息
export const getUserOfId = (id) =>get(`consumer/selectByPrimaryKey?id=${id}`);
//修改用户信息
export const updateConsumer = (params) => post(`consumer/update`,params);

//==========================下载音乐======================
export const download = (url) => Axios({
    method: 'get',
    url: url,
    responseType: 'blob'
});

//==================评价=====================
//提交评分
export const setRank = (params) => post(`/rank/add`,params);

//获取指定歌单平均分
export const getRankOfSongListId = (songListId) => get(`/rank?songListId=${songListId}`);

//==================评论=====================
//提交评论
export const setComment =  (params) => post(`/comment/add`,params);

//点赞
export const setLike =  (params) => post(`/comment/like`,params);

//返回当前歌单或歌曲的评论
export const setAllComment =  (type,id) => {
    if(type == 0){          //歌曲评论
        return get(`/comment/commentOfSongId?songId=${id}`);
    }else{
        return get(`/comment/commentOfSongListId?songListId=${id}`);
    }
}

//=================收藏相关==========================
//新增收藏
export const setCollect =  (params) => post(`/collect/add`,params);

//删除收藏
export const delCollect = (userId,songId) => get(`/collect/delete?userId=${userId}&songId=${songId}`);

//查询所有收藏
export const getAllCollect = () => get(`/collect/allCollect`);

//查询某个用户的收藏列表
export const getCollectOfUserId = (id) => get(`/collect/collectOfUserId?userId=${id}`);

    