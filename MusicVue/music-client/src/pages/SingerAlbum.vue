<template>
    <div  class="singer-album">
        <div class="album-slide">
            <div class="singer-img">
                <img :src="attachImgUrl(tempList.pic)">
            </div>
            <ul class="info">
                <li v-if="singer.sex==0||singer.sex==1">{{attachSex(singer.sex)}}</li>
                <li>生日：{{attachBirth(singer.birth)}}</li>
                <li>故乡：{{singer.location}}</li>
            </ul>
        </div>
        <div class="album-content">
            <div class="intro">
                <h2>{{singer.name}}</h2>
                <span>{{singer.introduction}}</span>
            </div>
            <div class="content">
                <album-content :songList="listOfSongs">
                    <template slot="title">
                        歌曲
                    </template>
                </album-content>
            </div>
        </div>
    </div>
</template>

<script>
import {mixin} from '../mixins/index';
import {mapGetters} from 'vuex';
import {songOfSingerId} from '../api/index';
import AlbumContent from "../components/AlbumContent";
import Comment from '../components/Comment';

export default {
    name: 'singer-album',
    mixins: [mixin],
    computed: {
        ...mapGetters([
            'listOfSongs',      //当前播放列表
            'tempList',         //当前歌手对象
            'logIn',            //是否登录
            'userId'            //用户ID
        ]),
    },
    components: {AlbumContent,Comment},
    data() {
        return {
            singerId: '', //前面传来的歌手id
            singer: {}      //当前歌手信息
        }
    },
    created() {
        this.singerId = this.$route.params.id;
        this.singer = this.tempList;
        console.log(this.singer);
        this.getSongId();
    },
    methods: {
        //根据歌手ID查询歌曲歌曲列表
        getSongId(){
            songOfSingerId(this.singerId)
                .then(res => {
                    this.$store.commit('setListOfSong',res);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //获取性别
        attachSex(val){
            if(val == 0){
                return '女'
            }else if(val == 1){
                return '男'
            }else{
                return ''
            }
        }
    }

}
</script>

<style scoped lang="scss">
@import "../assets/css/singer-album.scss";
</style>