<template>
    <div>
        <div class="comment">
            <h2>评论</h2>
            <div class="comment-msg">
                <div class="comment-img">
                    <img :src="attachImgUrl(avator)">
                </div>
                <el-input class="comment-input" type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
            </div>
            <el-button type="primary" class="sub-btn" @click="postComment">评论</el-button>
        </div>
        <p>精彩评论：一共{{commentList.length}}条评论</p>
        <!-- <hr> -->
        <ul class="popular" v-for="(item,index) in commentList" :key="index">
            <li>
                <div class="popular-img">
                    <img :src="attachImgUrl(userPic[index])">
                </div>
                <div class="popular-msg">
                    <ul>
                        <li class="name">{{userName[index]}}</li>
                        <li class="time">{{item.createTime}}</li>
                        <li class="content">{{item.content}}</li>
                    </ul>
                </div>
                <div class="up" ref="up" @click="postUp(item.id,item.up,index)">
                    <svg class="icon">
                        <use xlink:href="#icon-zan"></use>
                    </svg>
                    {{item.up}}
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { mixin } from "../mixins/index";
import {setComment,setLike,setAllComment,getUserOfId} from '../api/index'

export default {
  name: "comment",
  mixins: [mixin],
  props: [
      "playId",     //歌曲或歌单id
      "type"        //0歌曲，1歌单
  ],
  computed: {
      ...mapGetters([
          'id',
          'logIn',
          'userId',
          'avator'
      ])
  },
  data() {
      return {
          textarea: '',  //评论内容
          commentList: '',   //评论列表
          userPic: [],      //用户头像
          userName: []      //用户名
      } 
  },
  mounted(){
      this.getComment();
  },
  methods: {
    postComment(){
        if(this.logIn){
            let params = new URLSearchParams();
            params.append('userId',this.userId);
            params.append('type',this.type);
            if (this.type == 0) {
                params.append('songId',this.playId);
            } else {
                params.append('songListId',this.playId);
            }
            params.append('content',this.textarea);
            setComment(params)
                .then(res => {
                    if(res.code == 1){
                        this.notify('评论成功','success');
                        this.textarea='';
                        this.getComment();
                    }else{
                        this.notify('评论失败','error');
                    }
                })
                .catch(err => {
                    this.notify('评论失败','error');
                })
        }else{
            this.textarea='';
            this.notify('尚未登录','warning');
        }
    },
    //评论列表
    getComment(){
        setAllComment(this.type,this.playId)
            .then(res => {
                this.commentList = res;
                for(let item of res){
                    this.getUser(item.userId);
                }
            })
            .catch(err => {
                this.notify('评论加载失败','error');
                console.log(err);
            })
    },
    //获取用户的头像和昵称
    getUser(id){
        getUserOfId(id)
            .then(res => {
                this.userPic.push(res.avator);
                this.userName.push(res.username);
            })
            .catch(err => {
                this.notify('出错了','error');
                console.log(err);
            })
    },
    //给评论点赞
    postUp(id,up,index){
        if(this.logIn){
            let params = new URLSearchParams();
            params.append('id',id);
            params.append('up',up + 1);
            setLike(params)
                .then(res => {
                    if(res.code == 1){
                        this.$refs.up[index].children[0].style.color = '#2796cd';
                        this.getComment();
                    }else{
                        this.notify('点赞失败','error');
                    }
                })
                .catch(err => {
                    this.notify('点赞失败','error');
                })
        }else{
            this.textarea='';
            this.notify('尚未登录','warning');
        }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/css/comment.scss";
</style>