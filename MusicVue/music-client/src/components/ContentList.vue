<template>
  <div class="content-list">
    <ul class="section-content">
      <li
        class="content-item"
        v-for="(item, index) in contentList"
        :key="index"
      >
        <div class="kuo" @click="goAlbum(item,item.name)">
          <img class="item-img" :src="attachImgUrl(item.pic)" />
          <div class="mask">
            <svg class="icon">
              <use xlink:href="#icon-bofang"></use>
            </svg>
          </div>
        </div>
        <p class="item-name">{{item.name||item.title}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mixin } from "../mixins/index";

export default {
  name: "content-list",
  props: ["contentList"],
  mixins: [mixin],
  methods: {
    goAlbum(item,type){
      this.$store.commit('setTempList',item);
      if(type){         //歌手ID
        this.$router.push({path:`singer-album/${item.id}`});
      }else{            //歌单ID
        this.$router.push({path:`song-list-album/${item.id}`});
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/css/content-list.scss";
</style>