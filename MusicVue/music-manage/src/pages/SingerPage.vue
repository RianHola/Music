<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌手</el-button>
            </div>
        </div>
        <el-table size='mini' border style="width:100%" height="500px" :data="tableData">
            <el-table-column label="歌手图片" width="100px" center>
                <template slot-scope="scope">
                    <div class="singer-img">
                        <img :src="getUrl(scope.row.picture)" style="width:100%">
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="歌手" width="120" align="center"></el-table-column>
            <el-table-column label="性别" align="center" width="50">
                <template slot-scope="scope">
                    {{changeSex(scope.row.sex)}}
                </template>
            </el-table-column>
            <el-table-column label="生日" width="120" align="center">
                <template slot-scope="scope">
                    {{attachBirth(scope.row.birth)}}
                </template>
            </el-table-column>
             <el-table-column prop="location" label="地区" width="100" align="center"></el-table-column>
             <el-table-column label="简介" align="center">
                <template slot-scope="scope">
                    <P style="height:100px;overflow:scroll">{{scope.row.introduction}}</P>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加歌手" :visible.sync="centerDialogVisible" width="400px" center>
            <el-form :model="registerForm" ref="registerForm" label-width="80px">
                <el-form-item prop="name" label="歌手名" size="mini">
                    <el-input v-model="registerForm.name" placeholder="歌手名"></el-input>
                </el-form-item>
                <el-form-item label="性别" size="mini">
                    <el-radio-group v-model="registerForm.sex">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">组合</el-radio>
                        <el-radio :label="3">不明</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="birth" label="生日" size="mini">
                    <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.birth" style="width 100%"></el-date-picker>
                </el-form-item>
                <el-form-item prop="location" label="地区" size="mini">
                    <el-input v-model="registerForm.location" placeholder="地区"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="简介" size="mini">
                    <el-input v-model="registerForm.introduction" placeholder="简介" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
                <el-button size="mini" @click="addSinger">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getAllSinger, setSinger} from '../api/index';
import { mixin } from "../mixins";

export default {
    mixins:[mixin],
    data() {
        return{
            centerDialogVisible: false,
            registerForm:{  //添加表格
                name: '',
                sex: '',
                birth: '',
                location: '',
                introduction: ''
            },
            tableData: []
        }        
    },
    created(){
        this.getData();
    },
    methods:{
        //查询所有歌手
        getData(){
            this.tableData = [];
            getAllSinger().then(res => {
                this.tableData = res;
            });
        },

        //添加歌手
        addSinger(){
            let d = this.registerForm.birth;
            let datetime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDay();
            // console.log(datetime);
            let params = new  URLSearchParams();
            params.append('name',this.registerForm.name);           
            params.append('sex',this.registerForm.sex);
            params.append('picture','/img/singerPicture/hhhh.jpg');           
            params.append('birth',datetime);           
            params.append('location',this.registerForm.location);           
            params.append('introduction',this.registerForm.introduction);

            setSinger(params)
            .then(res => {
                if(res.code == 1){
                    this.notify('添加成功','success');
                } else {
                    this.notify('添加失败','error');
                }
            })
            .catch(err =>{
                console.log(err);
            });
            this.centerDialogVisible = false;
        }
    }
}
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}

.singer-img{
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
}
</style>