<template>
    <div class="table">
        <div class="crumbs">
            <i class="el-icon-tickets">歌曲信息</i>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" size='mini' placeholder='请输入歌曲名' class="handle-input"></el-input>
                <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌曲</el-button>
            </div>
        </div>
        <el-table size='mini' ref="multipleTable" border style="width:100%" height="420px" :data="data" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="歌曲图片" width="100px" center>
                <template slot-scope="scope">
                    <div class="song-img">
                        <img :src="getUrl(scope.row.pic)" style="width:100%">
                    </div>
                    
                    <div class="play" @click="setSongUrl(scope.row.url,scope.row.name)">
                        <div v-if="toggle == scope.row.name">
                            <svg class="icon">
                                <use xlink:href="#icon-zanting"></use>
                            </svg>
                        </div>
                        <div v-if="toggle != scope.row.name">
                            <svg class="icon">
                                <use xlink:href="#icon-bofanganniu"></use>
                            </svg>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="歌手-歌名" width="120" align="center"></el-table-column>
            <el-table-column prop="introduction" label="专辑" width="150" align="center"></el-table-column>
            <el-table-column label="歌词" align="center">
                <template slot-scope="scope" >
                    <ul style="height:100px;overflow:scroll;">
                        <li v-for="(item,index) in parseLyric(scope.row.lyric)" :key="index">
                            {{item}}
                        </li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column label="资源更新"  align="center">
                <template slot-scope="scope">
                    <el-upload :action="uploadUrl(scope.row.id)" :on-success="handleAvatorSuccess" :before-upload="beforeAvatorSuccess">
                        <el-button size="mini">更新图片</el-button>
                    </el-upload>
                    <br>
                    <el-upload :action="uploadSongUrl(scope.row.id)" :on-success="handleSongSuccess" :before-upload="beforeSongSuccess">
                        <el-button size="mini">更新歌曲</el-button>
                    </el-upload>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        
        <div class="pageination">
            <el-pagination
                background
                layout="total,prev,pager,next"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="tableData.length"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        
        <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
            
            <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf" >
                <div>
                    <label>歌名</label>
                    <el-input type="text" v-model="registerForm.name" name="name"></el-input>
                </div>
                <div>
                    <label>专辑</label>
                    <el-input type="text" v-model="registerForm.introduction" name="introduction"></el-input>
                </div>
                <div>
                    <label>歌词</label>
                    <el-input type="textarea" v-model="registerForm.lyric" name="lyric"></el-input>
                </div>
                <div>
                    <label>歌曲上传</label>
                    <input type="file" name="file">
                </div>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
                <el-button size="mini" @click="addSong">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改歌曲" :visible.sync="editVisible" width="400px" center>
            <el-form :model="form" ref="form" label-width="80px">
                <el-form-item prop="name" label="歌手-歌名" size="mini">
                    <el-input v-model="form.name" placeholder="歌手-歌名"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="专辑" size="mini">
                    <el-input v-model="form.introduction" placeholder="专辑"></el-input>
                </el-form-item>
                <el-form-item prop="lyric" label="歌词" size="mini">
                    <el-input v-model="form.lyric" placeholder="歌词" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="editVisible = false">取消</el-button>
                <el-button size="mini" @click="editSave">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="删除歌曲" :visible.sync="deleteVisible" width="400px" center>
            <div align="center">删除后不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button size="mini" @click="deleteVisible = false">取消</el-button>
                <el-button size="mini" @click="deleteRow">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="批量删除歌曲" :visible.sync="allDeleteVisible" width="400px" center>
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
import {mapGetters} from 'vuex';
import {mapMutations} from 'vuex';
import '@/assets/js/iconfont.js';
import {songOfSingerId,updateSong,delSong} from '../api/index';

export default {
    mixins:[mixin],
    data() {
        return{
            singerId: '',                   //歌手id
            singerName: '',                 //歌手名
            centerDialogVisible: false,     //添加歌手弹窗是否显示
            editVisible: false,     //修改歌手弹窗是否显示
            deleteVisible: false,   //删除单个歌手弹窗是否显示
            allDeleteVisible: false,    //批量删除歌手弹窗是否显示
            registerForm:{  //添加表格
                name: '',
                singerName: '',
                introduction: '',
                lyric: ''
            },
            form:{  //编辑表格
                id:'',
                name: '',
                introduction: '',
                lyric: ''
            },
            tableData: [],
            tempData: [],
            select_word: '',
            pageSize: 5, //分页每页条数
            currentPage: 1,  //当前页
            idx: -1,             //当前选择项
            multipleSelection: [],   //多选打勾项
            toggle: false           //播放显示图标
        }        
    },
    computed:{
        ...mapGetters([
            'id',
            'url',
            'isPlay'
        ]),
        data(){
            return this.tableData.slice((this.currentPage - 1)*this.pageSize,this.pageSize * this.currentPage)
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
        this.singerId = this.$route.query.id;
        this.singerName = this.$route.query.name;
        this.getData();
    },
    
    destroyed(){
        this.$store.commit('setIsPlay',false);
    },
    methods:{
        //获取当前页
        handleCurrentChange(val){
            this.currentPage = val;
        },
        //查询所有歌手
        getData(){
            this.tempData = [];
            this.tableData = [];
            songOfSingerId(this.singerId).then(res => {
                this.tempData = res;
                this.tableData = res;
                this.currentPage = 1;
            });
        },

        //添加歌曲
        addSong(){
            let _this = this;
            var form = new FormData(document.getElementById('tf'));
            form.append('singerId',this.singerId);
            form.set('name',this.singerName+'-'+form.get('name'));
            if(!form.get('lyric')){
                form.set('lyric','[00:00:00]暂无歌词');
            }
            var req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                //req.readyState == 4 获取到返回值的完整数据
                //req.status == 200     和后台正常交互
                if (req.readyState == 4 && req.status == 200) {
                    let res = JSON.parse(req.response);
                    if (res.code) {
                        _this.getData();
                        console.log(_this.registerForm);
                        _this.registerForm = {};
                        _this.notify(res.msg,'success');    
                    } else {
                        _this.notify('保存失败','error');
                    }    
                }
            }
            req.open('post',`${_this.$store.state.HOST}/song/add`,false);
            req.send(form);
            form = new FormData(document.getElementById('tf'));
            _this.centerDialogVisible = false;
        },

        //弹出修改歌手弹框
        handleEdit(row){
            this.editVisible = true;
            this.form = {
                id : row.id,
                name: row.name,
                introduction: row.introduction,
                lyric: row.lyric
            }
        },

        //保存编辑页面的修改数据
        editSave(){
            let params = new  URLSearchParams();
            params.append('id',this.form.id);           
            params.append('name',this.form.name);         
            params.append('introduction',this.form.introduction);
            params.append('lyric',this.form.lyric);

            updateSong(params)
            .then(res => {
                if(res.code == 1){
                    this.getData();
                    this.notify('修改成功','success');
                } else {
                    this.notify('修改失败','error');
                }
            })
            .catch(err =>{
                console.log(err);
            });
            this.editVisible = false;
        },

        //更新图片
        uploadUrl(id){
            return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
        },

        //删除一首歌
        deleteRow(){
            delSong(this.idx)
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

        //解析歌词
        parseLyric(text){
            let lines = text.split('\n');
            let pattern = /\[\d{2}:\d{2}.(\d{2}|\d{3})\]/g;
            let result = [];
            for (let item of lines) {
                let value = item.replace(pattern,'');
                result.push(value);
            }
            return result
        },

        //上传歌曲之前的校验
        beforeSongSuccess(file){
            var testMsg = file.name.substr(file.name.lastIndexOf('.')+1);
            if(testMsg != 'mp3'){
                this.$message.error('上传文件只能是mp3格式');
                return false;
            }
            return true;
        },

        //上传歌曲成功后要完成的工作
        handleSongSuccess(res){
            let _this = this;
            if (res.code == 1) {
                _this.getData();
                _this.$notify({
                    title:'上传成功',
                    type: 'success'
                });
            }else{
                _this.$notify({
                    title: '上传失败',
                    type: 'error'
                });
            }
        },
        
        //更新歌曲
        uploadSongUrl(id){
            return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`
        },

        //切换播放音乐状态
        setSongUrl(url,name) {
            if (this.toggle == name) {
                this.toggle = false;
                this.setIsPlay(false);
            } else {    
                this.toggle = name;
                this.setUrl(this.$store.state.HOST+url);
                this.setIsPlay(true);
            }

        },

        ...mapMutations(['setUrl','setIsPlay'])
        
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

.song-img{
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
}

.handle-input{
    width: 300px;
    display: inline-block;
}

.pageination{
    display: flex;
    justify-content: center;
}

.play {
    position: absolute;
    z-index: 100;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    top: 13px;
    left: 10px;

}

.icon {
    width: 2em;
    height: 2em;
    color: white;
    fill: currentColor;
    overflow: hidden;
}
</style>