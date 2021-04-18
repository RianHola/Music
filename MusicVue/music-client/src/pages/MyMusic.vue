<template>
    <div class="my-music">
        <div class="album-slide">
            <div class="album-img">
                <img :src="attachImgUrl(avator)">
            </div>
            <ul class="album-info">
                <li >昵称：{{username}}</li>
                <li >性别：{{userSex}}</li>
                <li>生日：{{birth}}</li>
                <li>故乡：{{location}}</li>
            </ul>
        </div>
        <div class="album-content">
            <div class="album-title">
                个性签名：{{introduction}}
            </div>
            <div class="song-body">
                <album-content :songList="collectList">
                    <template slot="title">
                        我的收藏
                    </template>
                </album-content>
            </div>
        </div>
    </div>
</template>

<script>
import {getUserOfId,getCollectOfUserId,songOfSongId} from '../api/index'
import {mixin} from '../mixins'
import {mapGetters} from 'vuex';
import AlbumContent from "../components/AlbumContent";

export default {
    name: 'my-music',
    mixins: [mixin],
    components:{
        AlbumContent
    },
    data(){
        return {
            avator : '',
            username: '',
            userSex: '',
            birth: '',
            location: '',
            introduction:'',
            collection: [],         //收藏的歌曲列表
            collectList: []         //收藏的歌曲列表（详情）
        }
    },
    computed: {
        ...mapGetters(['userId','id'])
    },
    mounted(){
        this.getMsg(this.userId);
        this.getCollection(this.userId);
    },
    methods:{
        getMsg(userId){
            getUserOfId(userId)
                .then(res => {
                    this.avator = res.avator;
                    this.username = res.username;
                    if(res.sex == 0){
                        this.userSex = '女';
                    }else if(res.sex == 1){
                        this.userSex = '男';
                    }
                    this.birth = this.attachBirth(res.birth);
                    this.introduction = res.introduction;
                    this.location = res.location;
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //获取我的收藏列表
        getCollection(userId){
            getCollectOfUserId(userId)
                .then(res => {
                    this.collection = res;
                    //获取收藏列表歌曲详情
                    for(let item of this.collection){
                        this.getSong(item.songId);
                    }
                })
        },
        //根据歌曲id获取歌曲详情
        getSong(songId){
            songOfSongId(songId)
                .then(res => {
                    this.collectList.push(res);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
}
</script>

<style scoped lang='scss'>
@import "../assets/css/my-music.scss";
</style>
