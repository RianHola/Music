<template>
    <div class="singer">
        <ul class="singer-header">
            <li v-for="(item,index) in singerSex" :key="index" @click="handleChangeView(item.sex)" :class="{active:item.sex==activeName}">
                {{item.sex}}
            </li>
        </ul>
        <content-list :contentList="data"></content-list>
        <div class="pagination">
            <el-pagination 
                @current-change="handleCurrentChange"
                background
                layout="total,prev,pager,next"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="albumDatas.length"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import ContentList from '../components/ContentList';
import {getAllSinger,getSingerOfSex} from '../api/index'
import {mixin} from '../mixins';
import {singerSex} from '../assets/data/singerSex';

export default {
  components: { ContentList },
    name: 'singer',
    mixins:[mixin],
    components:{
        ContentList
    },
    data(){
        return {
            albumDatas: [],      //歌手数据
            pageSize: 15,        //页面大小，一页15条数据
            currentPage: 1,      //当前页
            singerSex: [],        //性别
            activeName:'全部歌手'           //当前性别
        }
    },
    computed: {
        //计算当前页的数据
        data(){
            return this.albumDatas.slice((this.currentPage-1)*this.pageSize,this.pageSize*this.currentPage)
        }
    }, 
    watch:{
        $route(){
         this.getSongList();
        }
    },
    mounted(){
        this.getSinger();
        this.singerSex = singerSex;
    },
    methods: {
        getSinger(){
            getAllSinger()
                .then(res => {
                    this.currentPage = 1;
                    this.albumDatas = res;
                })
        },
        //获取当前页
        handleCurrentChange(val){
            this.currentPage = val;
        },
        //根据性别显示对应的歌单
        handleChangeView(sex){   
            this.albumDatas = [];
            this.activeName = sex;
            if(sex == '全部歌手'){
                this.getSinger();
            }else{
                this.getSingerOfSex(this.getSex(sex));
            }
        },

        //根据性别查询对应的歌单
        getSingerOfSex(sex){
            getSingerOfSex(sex)
                .then(res => {
                    this.currentPage = 1;
                    this.albumDatas = res;
                })
        },

        //获取性别代号
        getSex(sex){
            if(sex == '女歌手'){
                return 0
            }else if(sex == '男歌手'){
                return 1
            }else if(sex == '组合歌手'){
                return 2
            }else if(sex == '不明'){
                return 3
            }
        }
    }
}
</script>

<style scoped lang='scss'>
@import "../assets/css/singer.scss";
</style>