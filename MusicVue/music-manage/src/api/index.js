import {get,post} from "./http"

//判断管理员是否登录成功
export const getLoginStatus = (params) => post(`admin/login/status`,params);

//==================歌手相关==================
//查询歌手
export const getAllSinger = () => get(`singer/allSinger`);

//添加歌手
export const setSinger = (params) => post(`singer/add`,params);

//修改歌手
export const updateSinger = (params) => post(`singer/update`,params);

//删除歌手
export const delSinger = (id) => get(`singer/delete?id=${id}`);

//=====================歌曲相关=====================
//根据歌手id查询歌曲
export const songOfSingerId = (id) =>get(`song/singer/detail?singerId=${id}`);

//修改歌曲信息
export const updateSong = (params) => post(`song/update`,params);

//删除歌曲
export const delSong = (id) => get (`song/delete?id=${id}`);

//根据歌曲ID查询歌曲对象
export const songOfSongId = (id) =>get(`song/detail?songId=${id}`);

//根据歌曲名获取歌曲对象
export const songOfSongName = (songName) =>get(`song/songOfSongName?songName=${songName}`);

//查询所有歌曲
export const getAllSong = () =>get(`song/allSong`);

//=====================歌单相关=====================
//查询歌单
export const getAllSongList = () => get(`songList/allSongList`);

//添加歌单
export const setSongList = (params) => post(`songList/add`,params);

//修改歌单
export const updateSongList = (params) => post(`songList/update`,params);

//删除歌单
export const delSongList = (id) => get(`songList/delete?id=${id}`);

//=====================歌单的歌曲相关=====================
//根据歌单ID查询歌单的歌曲
export const ListSongDetail = (songListId) => get(`listSong/detail?songListId=${songListId}`);

//歌单增加歌曲
export const setListSongListAdd = (params) => post(`listSong/add`,params);

//删除歌曲
export const delListSong = (id,songListId) => get(`listSong/delete?songId=${id}&songListId=${songListId}`);

//=====================用户相关=====================
//查询用户
export const getAllConsumer = () => get(`consumer/allConsumer`);

//添加用户
export const setConsumer = (params) => post(`consumer/add`,params);

//修改用户
export const updateConsumer = (params) => post(`consumer/update`,params);

//删除用户
export const delConsumer = (id) => get(`consumer/delete?id=${id}`);

//根据用户Id查询用户信息
export const getUserOfId = (id) =>get(`consumer/selectByPrimaryKey?id=${id}`);

//=================收藏相关==========================
//删除收藏
export const delCollect = (userId,songId) => get(`/collect/delete?userId=${userId}&songId=${songId}`);

//查询所有收藏
export const getAllCollect = () => get(`/collect/allCollect`);

//查询某个用户的收藏列表
export const getCollectOfUserId = (id) => get(`/collect/collectOfUserId?userId=${id}`);

//==================评论=====================
//返回当前歌单的评论
export const getCommentOfSongListId =  (songListId) => get(`/comment/commentOfSongListId?songListId=${songListId}`);

//删除评论
export const deleteComment = (id) => get(`/comment/delete?id=${id}`)