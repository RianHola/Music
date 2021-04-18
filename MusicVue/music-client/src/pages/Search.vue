<template>
  <div class="search">
    <nav class="searchList-nav" ref="change">
      <span @click="handleChangeView('Songs')" :class="{isActive : currentView == 'searchSongs'}">歌曲</span>
      <span @click="handleChangeView('SongLists')" :class="{isActive : currentView == 'searchSongLists'}">歌单</span>
    </nav>
    <component :is="currentView"></component>
  </div>
</template>

<script>
import searchSongLists from "../components/search/SearchSongLists.vue";
import searchSongs from "../components/search/SearchSongs.vue";

export default {
  name: "search",  
  components: {
    searchSongs,
    searchSongLists,
  },
  data(){
      return {
          toggle: 'Songs',
          currentView: 'searchSongs'
      }
  },
  methods: {
      //切换组件
      handleChangeView(component){
          this.currentView = 'search'+ component;
      }
  }
};
</script>

<style scoped lang='scss'>
@import "../assets/css/search.scss";
</style>

