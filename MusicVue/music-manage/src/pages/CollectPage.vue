<template>
    <div class="table">
        <div class="crumbs">
            <i class="el-icon-tickets">收藏歌曲信息</i>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" size='mini' placeholder='请输入歌曲名' class="handle-input"></el-input>
            </div>
        </div>
        <el-table size='mini' ref="multipleTable" border style="width:100%" height="420px" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="name" label="歌手-歌名" align="center"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        
        <el-dialog title="删除收藏的歌曲" :visible.sync="deleteVisible" width="400px" center>
            <div align="center">删除后不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button size="mini" @click="deleteVisible = false">取消</el-button>
                <el-button size="mini" @click="deleteRow">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="批量删除收藏的歌曲" :visible.sync="allDeleteVisible" width="400px" center>
            <div align="center">批量删除后不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button size="mini" @click="allDeleteVisible = false">取消</el-button>
                <el-button size="mini" @click="allDelete">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { mixin } from "../mixins/index";
import {songOfSongId,delCollect,getCollectOfUserId} from '../api/index';

export default {
    name: 'collect-page',
    mixins:[mixin],
    data() {
        return{
            deleteVisible: false,   //删除单个歌手弹窗是否显示
            allDeleteVisible: false,    //批量删除歌手弹窗是否显示
            tableData: [],
            tempData: [],
            select_word: '',
            idx: -1,             //当前选择项
            multipleSelection: [],   //多选打勾项
            id: ''                  //用户id
        }        
    },
    watch:{
        //搜索框里面内容发生变化时，搜索结果的table列表内容也会跟着改变
        select_word: function(){
            if(this.select_word == ''){
                this.tableData = this.tempData;
            }else{
                this.tableData = [];
                for(let item of this.tempData){
                    if(item.name.includes(this.select_word)){
                        this.tableData.push(item);
                    }
                }
            }
        }
    },
    created(){
        this.id = this.$route.query.id;
        console.log(this.$route.query.id);
        this.getData();
    },
    methods:{
        //查询该用户所有收藏的歌曲
        getData(){
            this.tempData = [];
            this.tableData = [];
            getCollectOfUserId(this.id).then(res => {
                for (let item of res) {
                    this.getSong(item.songId);
                }
            });
        },

        //根据歌曲id查询歌曲对象，放到tableDate和tempData里面
        getSong(id){
            songOfSongId(id).then(res => {
                this.tempData.push(res);
                this.tableData.push(res);
            })
            .catch(err => {
                console.log(err);
            })
        },
        
        //删除一条收藏的歌曲
        deleteRow(){
            delCollect(this.id,this.idx)
            .then(res => {
                if(res){
                    this.getData();
                    this.notify('删除成功','success');
                } else {
                    this.notify('删除失败','error');
                }
            })
            .catch(err =>{
                console.log(err);
            });
            this.deleteVisible = false;
        },
        
    }
}
</script>

<style scoped>
.table {
    overflow: hidden;
}

.handle-box{
    margin-bottom: 5px;
}

.handle-input{
    width: 300px;
    display: inline-block;
}
</style>