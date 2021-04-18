<template>
  <div class="play-bar" :class="{show:!toggle}">
      <div @click="toggle = !toggle" class="item-up" :class="{turn:!toggle}">
          <svg class="icon">
            <use xlink:href="#icon-jiantou-xia-cuxiantiao"></use>
          </svg>
      </div>
      <div class="kongjian">
          <!-- 上一首歌 -->
          <div class="item" @click="prev">
              <svg class="icon">
                  <use xlink:href="#icon-ziyuanldpi"></use>
              </svg>
          </div>
          <!-- 播放 -->
          <div class="item" @click="togglePlay()">
              <svg class="icon">
                  <use :xlink:href="playButtonUrl"></use>
              </svg>
          </div>
          <!-- 下一首歌 -->
          <div class="item" @click="next">
              <svg class="icon">
                  <use xlink:href="#icon-ziyuanldpi1"></use>
              </svg>
          </div>
          <!-- 歌曲图片 -->
          <div class="item-img" @click="toLyric">
              <img :src="picUrl">
          </div>
          <!-- 播放进度 -->
          <div class="playing-speed">
              <!-- 播放开始时间 -->
              <div class="current-time">{{newTime}}</div>
              <div class="progress-box">
                  <div class="item-song-title">
                      <div>
                        {{title}}
                      </div>
                      <div>
                        {{artist}}
                      </div>
                  </div>
                  <div class="progress" ref="progress" @mousemove="mousemove">
                      <!-- 进度条 -->
                      <div ref="bg" class="bg" @click="updatemove">
                          <div ref="curProgress" class="cur-progress" :style="{width:curLength + '%'}"></div>
                      </div>
                      <!-- 点 -->
                      <div class="idot" ref="idot" @mousedown="mousedown" @mouseup="mouseup" :style="{left: curLength + '%'}"></div>
                  </div>
              </div>
              <!-- 播放总时间 -->
              <div class="left-time">{{songTime}}</div>
              <!-- 音量 -->
              <div class="item item-volume" @click="showVolume">
                <svg class="icon" v-if="volume==0">
                  <use xlink:href="#icon-yinliangjingyinheix"></use>
                </svg>
                <svg class="icon" v-else>
                  <use xlink:href="#icon-yinliang1"></use>
                </svg>
                <el-slider class="volume" v-model="volume" :vertical="true"></el-slider>
              </div>
              <!-- 喜欢、收藏 -->
              <div class="item" @click="collection">
                <svg class="icon" :class="{active:isActive}">
                  <use xlink:href="#icon-xihuan-shi"></use>
                </svg>
              </div>
              <!-- 下载 -->
              <div class="item" @click="download()">
                <svg class="icon">
                  <use xlink:href="#icon-xiazai"></use>
                </svg>
              </div>
              <!-- 歌曲列表 -->
              <div class="item" @click="changeAside">
                <svg class="icon">
                  <use xlink:href="#icon-liebiao"></use>
                </svg>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {mixin} from '../mixins/index';
import { download,setCollect,delCollect,getCollectOfUserId} from '../api/index';

export default {
    name: 'paly-bar',
    mixins: [mixin],
    data(){
        return {
            newTime: '00:00',    //当前播放进度的时间
            songTime: '00:00',   //当前歌曲总时间
            curLength: 0,        //进度条的位置
            progressLength: 0,   //进度条总长度
            mouseStartX: 0,      //开始拖拽时的位置
            tag: false,          //拖拽开始结束的标志
            volume:20,
            falg: false,          //音量开关
            toggle: true          //显示隐藏播放栏
        }
    },
    computed: {
      ...mapGetters([
        'isPlay',           //播放状态
        'url',              //歌曲地址
        'id',               //歌曲id
        'playButtonUrl',    //播放状态的按钮
        'picUrl',           //歌曲图片
        'title',            //歌名
        'artist',            //歌手名
        'duration',    //音乐时长
        'curTime',     //当前播放时间
        'showAside',    //是否显示歌曲列表
        'listIndex',      //播放位置
        'listOfSongs',     //播放列表
        'autoNext',        //自动播放
        'logIn',           //是否登录
        'userId',            //登录用户的ID
        'isActive',          //是否收藏
        'activeName',         //高亮显示
        'beforeActiveName'    //缓存打开歌词前的页面
      ])
    },
    watch: {
      curTime(){
        this.newTime = this.formatSeconds(this.curTime);
        this.songTime = this.formatSeconds(this.duration);
        this.curLength = (this.curTime / this.duration)*100;
      },
      //音量变化
      volume(){
        this.$store.commit('setVolume',this.volume /100);
      },
      //自动下一首
      autoNext(){
        this.next();
      }
    },
    mounted() {
      this.progressLength = this.$refs.progress.getBoundingClientRect().width;
      document.addEventListener('click',function(){
        document.querySelector('.volume').classList.remove('show-volume');
      },false);
    },
    created(){
      if(this.isPlay == true){
        this.$store.commit('setPlayButtonUrl','#icon-zanting');
      }
      this.$store.commit('setVolume',this.volume /100);
    },
    methods: {
      //控制音乐播放还是暂停
      togglePlay(){
        if(this.isPlay){
          this.$store.commit('setIsPlay',false);
          this.$store.commit('setPlayButtonUrl','#icon-bofang');
        }else{
          this.$store.commit('setIsPlay',true);
          this.$store.commit('setPlayButtonUrl','#icon-zanting');
        }
      },
      //时间转化
      formatSeconds(val){
        let theTime = parseInt(val);
        let result = '';    //返回值
        let hour = parseInt(theTime/3600);
        let minute = parseInt((theTime / 60) % 60);
        let second = parseInt((theTime / 1) % 60);
        result = (hour>0)?(hour<10?hour:'0'+hour+ ':'):''  + (minute>10?minute:'0'+minute) + ':' + (second>10?second:'0'+second);
        return result
      },
      //拖拽开始
      mousedown(e){
        this.mouseStartX = e.clientX;
        this.tag = true;
      },
      //拖拽结束
      mouseup(e){
        this.tag = false;
      },
      //拖拽中
      mousemove(e){
        if(!this.duration){
          return false
        }
        if(this.tag){
          let movementX = e.clientX - this.mouseStartX;     //移动的距离
          let curLength = this.$refs.curProgress.getBoundingClientRect().width;
          let newLength = ((movementX + curLength)/this.progressLength)*100;
          if(newLength>100){
            newLength = 100;
          }
          this.curLength = newLength;
          this.mouseStartX = e.clientX;
          this.changeTime(newLength);
        }
      },
      //更改歌曲进度
      changeTime(percent){
        let newCurTime = (percent*0.01)*this.duration;
        this.$store.commit('setChangeTime',newCurTime);
        this.$store.commit('setIsPlay',true);
      },
      //点击更改歌曲进度
      updatemove(e){
        if(!this.duration){
          return false
        }
        if(!this.tag){
          //进度条左侧坐标
          let curLength = this.$refs.bg.offsetLeft;
          let newPercent = ((e.clientX - curLength) / this.progressLength) * 100;
          if(newPercent>100){
            newPercent = 100;
          }else if(newPercent<0){
            newPercent = 0;
          }
          this.curLength = newPercent;
          this.changeTime(newPercent);
        }
      },
      //显示音量
      showVolume(e){
          document.querySelector('.volume').classList.add('show-volume');
          e.stopPropagation();
      },
      //显示歌曲列表
      changeAside(){
        this.$store.commit('setShowAside',true);
      },
      //上一首歌
      prev(){
        if(this.listIndex!=-1 && this.listOfSongs.length >1){
          if(this.listIndex>0){
            this.$store.commit('setListIndex',this.listIndex-1);
          }else{
            this.$store.commit('setListIndex',this.listOfSongs.length-1);
          }
          this.play(this.listOfSongs[this.listIndex].url);
        }
      },
      //下一首歌
      next(){
        if(this.listIndex!=-1 && this.listOfSongs.length >1){
          if(this.listIndex < this.listOfSongs.length-1){
            this.$store.commit('setListIndex',this.listIndex+1);
          }else{
            this.$store.commit('setListIndex',0);
          }
          this.play(this.listOfSongs[this.listIndex].url);
        }
      },
      //前进后退播放音乐
      play(url){
        this.$store.commit('setId',this.listOfSongs[this.listIndex].id);
        this.$store.commit('setUrl',this.$store.state.configure.HOST + url);
        this.$store.commit('setPlayButtonUrl','#icon-zanting');
        this.$store.commit('setIsPlay',true);

        this.$store.commit('setPicUrl',this.$store.state.configure.HOST + this.listOfSongs[this.listIndex].pic);
        this.$store.commit('setTitle',this.replaceSongsName(this.listOfSongs[this.listIndex].name));  //歌名
        this.$store.commit('setArtist',this.replaceName(this.listOfSongs[this.listIndex].name));      //歌手名
        this.$store.commit('setLyric',this.parselyric(this.listOfSongs[this.listIndex].lyric));
        this.$store.commit('setIsActive',false);
            if(this.logIn){
                getCollectOfUserId(this.userId)
                    .then(res => {
                        for(let item of res){
                            if(item.songId == this.id){
                                this.$store.commit('setIsActive',true);
                                break;
                            }
                        }
                    })
            }
      },
      //转向歌词页面
      toLyric(){
        if(this.activeName != '歌词'){
          this.$store.commit('setBeforeActiveName',this.activeName);
          this.changeActiveName('歌词');
          this.$router.push({path:`/lyric`});
        }else{
          this.changeActiveName(this.beforeActiveName);
          this.$router.go(-1);
        }
      },
      //下载音乐
      download(){
        if(this.logIn){
          if(this.url!=''){
            download(this.url)
            .then(res=>{
              console.log(this.url);
              let content = res.data;
              let eleLink = document.createElement('a');
              eleLink.download = `${this.artist}-${this.title}.mp3`;
              let blob = new Blob([content]);
              eleLink.href = URL.createObjectURL(blob);
              eleLink.click();
              eleLink.remove();
            })
            .catch(err => {
              console.log(err);
            })
          }
        }else{
          this.notify('请先登录','warning');
        }
        
      },
      //收藏
      collection(){
        if(this.logIn){
          let params = new URLSearchParams();
          params.append('userId',this.userId);
          params.append('type',0);
          params.append('songId',this.id);
          setCollect(params)
            .then(res => {
              if(res.code == 1){
                this.$store.commit('setIsActive',true);
              }else if(res.code == 2){
                delCollect(this.userId,this.id)
                  .then(res => {
                    if(res == true){
                      this.$store.commit('setIsActive',false);
                    }else{
                      this.notify('取消收藏失败','error');
                    }
                  })
              }else{
                this.notify('收藏失败','error');
              }
            })
            .catch(err => {
              console.log(err);
            })
        }else{
          this.notify('请先登录','warning');
        }
      }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/play-bar.scss';
</style>