<template>
    <transition>
        <div class="the-aside" v-if="showAside">
            <h2 class="title">播放列表</h2>
            <ul class="menus">
                <li v-for="(item,index) in listOfSongs" :key="index" :class="{'is-play':id==item.id}" @click="toPlay(item.id,item.url,item.pic,item.index,item.name,item.lyric)">
                    {{replaceSongsName(item.name)}}
                </li>
            </ul>
        </div>
    </transition>
</template>

<script>
import {mapGetters} from 'vuex';
import {mixin} from '../mixins/index';
export default {
    name: 'the-aside',
    mixins: [mixin],
    computed: {
        ...mapGetters([
            'showAside',        //是否显示播放歌曲列表
            'listOfSongs',       //当前播放列表
            'id',               //播放中音乐id
        ])
    },
    mounted() {
      let _this = this;
      document.addEventListener('click',function(){
        _this.$store.commit('setShowAside',false);
      },true)
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/the-aside.scss';
</style>