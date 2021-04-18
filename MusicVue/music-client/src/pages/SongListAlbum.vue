<template>
    <div class="song-list-album">
        <div class="album-slide">
            <div class="album-img">
                <img :src="attachImgUrl(tempList.pic)">
            </div>
            <div class="album-info">
                <h2>简介：</h2>
                <span>
                    {{tempList.introduction}}
                </span>
            </div>
        </div>
        <div class="album-content">
            <div class="album-title">
                <p>{{tempList.title}}</p>
            </div>
            <div class="album-score">
                <div>
                    <h3>歌单评分</h3>
                    <div>
                        <el-rate v-model="average" disabled></el-rate>
                    </div>
                </div>
                <span>{{average*2}}</span>
                <div>
                    <h3>评价</h3>
                    <div @click="setRank">
                        <el-rate v-model="rank" allow-half show-text></el-rate>
                    </div>
                </div>
            </div>
            <div class="songs-body">
                <album-content :songList="listOfSongs">
                    <template slot="title">
                        歌单
                    </template>
                </album-content>
                <comment :playId="songListId" :type="1"></comment>
            </div>

        </div>
    </div>
</template>

<script>
import {mixin} from '../mixins/index';
import {ListSongDetail,songOfSongId,setRank,getRankOfSongListId} from '../api/index';
import {mapGetters} from 'vuex';
import AlbumContent from "../components/AlbumContent";
import Comment from '../components/Comment';


export default {
    name: 'song-list-album',
    mixins: [mixin],
    computed: {
        ...mapGetters(['listOfSongs','tempList','logIn','userId']),
    },
    components: {AlbumContent,Comment},
    data() {
        return {
            songList: [],   //当前页面需要展示的歌曲列表
            songListId: '', //前面传来的歌单id
            average: 0,     //平均分
            rank: 0         //提交评价的分数
        }
    },
    created() {
        this.songListId = this.$route.params.id;
        this.getSongId();
        this.getRank(this.songListId);
    },
    methods: {
        //获取当前歌单的歌曲列表
        getSongId(){
            ListSongDetail(this.songListId)
                .then(res => {
                    for(let item of res){
                        this.getSongList(item.songId)
                    }
                    this.$store.commit('setListOfSong',this.songList);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //根据歌曲id获取歌曲信息
        getSongList(id){
            songOfSongId(id)
                .then(res => {
                    this.songList.push(res);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //获取歌单评分
        getRank(id){
            getRankOfSongListId(id)
                .then(res => {
                    this.average = res/2;
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //提交歌单评分
        setRank(){
            if(this.logIn){
                let _this = this;
                let params = new URLSearchParams();
                params.append('songListId',this.songListId);
                params.append('consumerId',this.userId);
                params.append('score',this.rank*2);
                setRank(params)
                    .then(res => {
                        if(res.code == 1){
                            _this.notify('评价成功','success');
                            this.getRank(this.songListId);
                        }else{
                            _this.notify('评价失败','error');
                        }
                    })
                    .catch(err => {
                        _this.notify('您已经评价过了','error');
                    })
            }else{
                this.rank = null;
                this.notify('尚未登录','warning');
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "../assets/css/song-list-album.scss";
</style>