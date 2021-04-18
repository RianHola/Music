<template>
    <div class="song-lyric">
        <h1 class="lyric-title">歌词</h1>
        <!-- 存在歌词 -->
        <ul class="has-lyric" v-if="lyr[0][1]!=''" key="index">
            <li class="li" v-for="(item,index) in lyr" :key="index">
                {{item[1]}}
            </li>
        </ul>
        <!-- 暂无歌词 -->
        <div v-else class="no-lyric" key="no-lyric">
            <span>暂无歌词</span>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    name: 'lyric',
    data() {
        return {
            lyr: [],    //当前歌词
        }
    },
    watch: {
        id(){
            this.lyr = this.lyric;
        },
        curTime(){
            if(this.lyric.length>0){
                
                for(let i=0;i<this.lyr.length;i++){
                    for(let j=0;j<this.lyr.length;j++){
                        document.querySelectorAll('.has-lyric li')[i].style.color ='#000';
                        document.querySelectorAll('.has-lyric li')[i].style.fontSize= '18px';
                    }
                    if(this.curTime>=this.lyr[i][0]){
                        if(i>0){
                            document.querySelectorAll('.has-lyric li')[i-1].style.color = '#000';
                            document.querySelectorAll('.has-lyric li')[i-1].style.fontSize = '18px';
                        }
                        if(i>=0){
                            document.querySelectorAll('.has-lyric li')[i].style.color = '#95d2f6';
                            document.querySelectorAll('.has-lyric li')[i].style.fontSize = '25px';
                        };
                    }
                }
            }
        }
    },
    computed:{
        ...mapGetters(['lyric','id','curTime'])
    },
    created(){
        this.lyr = this.lyric;
    }
}
</script>
<style scoped lang='scss'>
@import '../assets/css/lyric.scss';
</style>