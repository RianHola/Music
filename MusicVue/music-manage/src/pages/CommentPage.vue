<template>
    <div class="table">
        <div class="crumbs">
            <i class="el-icon-tickets">评论信息</i>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" size='mini' placeholder='请输入歌曲名' class="handle-input"></el-input>
            </div>
        </div>
        <el-table size='mini' ref="multipleTable" border style="width:100%" height="420px" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="name" label="用户名" align="center"></el-table-column>
            <el-table-column prop="content" label="评论内容" align="center"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
            
            </el-table-column>
        </el-table>
        
        <el-dialog title="删除用户的评论" :visible.sync="deleteVisible" width="400px" center>
            <div align="center">删除后不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button size="mini" @click="deleteVisible = false">取消</el-button>
                <el-button size="mini" @click="deleteRow">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="批量删除用户的评论" :visible.sync="allDeleteVisible" width="400px" center>
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
import {getUserOfId,getCommentOfSongListId,deleteComment} from '../api/index';

export default {
    name: 'comment-page',
    mixins:[mixin],
    data() {
        return{
            deleteVisible: false,   //删除单个用户评论弹窗是否显示
            allDeleteVisible: false,    //批量删除用户评论弹窗是否显示
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
        this.getData();
    },
    methods:{
        //查询该歌单所有的评论
        getData(){
            this.tempData = [];
            this.tableData = [];
            getCommentOfSongListId(this.id).then(res => {
                for (let item of res) {
                    this.getUsers(item.userId,item);
                }
            });
        },

        //根据用户id查询用户对象，放到tableDate和tempData里面
        getUsers(id,item){
            getUserOfId(id).then(res => {
                let obj = item;
                obj.name = res.username;
                this.tempData.push(obj);
                this.tableData.push(obj);
            })
            .catch(err => {
                console.log(err);
            })
        },

        //添加歌曲前，根据歌曲Id获取歌曲
        getSongId(){
            let _this = this;
            var songOfName = _this.registerForm.singerName + "-" + _this.registerForm.songName;
            songOfSongName(songOfName).then(res => {
                if (!res[0]) {
                    this.notify('添加失败,这首歌不存在','error');
                } else {
                    _this.addSong(res[0].id);
                }
                
            })
        },

        //删除一条收藏的歌曲
        deleteRow(){
            deleteComment(this.idx)
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