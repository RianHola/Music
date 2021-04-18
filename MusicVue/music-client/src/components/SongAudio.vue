<template>
  <div class="song-audio">
    <audio
      ref="player"
      controls="controls"
      preload="true"
      @canplay="startPlay"
      @ended="ended"
      @timeupdate="timeupdate"
      :src="url"
    >
    </audio>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "song-audio",
  computed: {
    ...mapGetters([
      "id",             //歌曲id
      "url",            //歌曲地址
      "isPlay",         //是否播放中
      "listOfSongs",    //当前歌曲列表
      "curTime",        //当前播放时间
      "changeTime",     //指定播放时间
      "autoNext",       //自动播放
      "volume",         //音量
    ]),
  },
  watch: {
    isPlay() {
      this.togglePlay();
    },
    //跳转到指定播放时间
    changeTime(){
      this.$refs.player.currentTime = this.changeTime;
    },
    //改变音量
    volume(val){
      this.$refs.player.volume = val;
    }
  },
  methods: {
    //获取链接后准备播放
    startPlay() {
      let player = this.$refs.player;
      this.$store.commit('setDuration',player.duration);
      //开始播放
      if(this.isPlay){
        player.play().then(()=>{
        }).catch((err)=>{
          console.log(err);
        });
        this.$store.commit('setIsPlay',true);
      }
    },
    //播放结束后触发
    ended() {
      this.$store.commit('setIsPlay',false);
      this.$store.commit('setCurTime',0);
      this.$store.commit('setAutoNext',!this.autoNext);
    },
    //开始、暂停
    togglePlay() {
      let player = this.$refs.player;
      if (this.isPlay) {
        this.$store.commit('setIsPlay',true);
        player.play().then(()=>{
        }).catch((err)=>{
          console.log(err);
        })
      } else {
        this.$store.commit('setIsPlay',false);
        player.pause();
      }
    },

    //音乐播放时记录音乐播放的位置
    timeupdate(){
      this.$store.commit('setCurTime',this.$refs.player.currentTime);
    }
  }
};
</script>
<style>
.song-audio {
  display: none;
}
</style>