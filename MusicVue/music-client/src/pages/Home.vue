<template>
  <div class="home">
    <swiper />
    <div class="section" v-for="(item, index) in songsList" :key="index">
      <div class="section-title">{{ item.name }}</div>
      <content-list :contentList="item.list"></content-list>
    </div>
  </div>
</template>

<script>
import Swiper from "../components/Swiper";
import { getAllSinger, getAllSongList } from "../api/index";
import ContentList from "../components/ContentList";

export default {
  name: "home",
  components: {
    Swiper,
    ContentList
  },
  data() {
    return {
      songsList: [
        { name: "歌单", list: [] },
        { name: "歌手", list: [] },
      ],
    };
  },
  created() {
    this.getSongList();
    this.getSinger();
  },
  methods: {
    //获取前十条歌单
    getSongList() {
      getAllSongList()
        .then((res) => {
          this.songsList[0].list = res.slice(0, 10);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //获取前十位歌手
    getSinger() {
      getAllSinger()
        .then((res) => {
          this.songsList[1].list = res.slice(0, 10);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/home.scss";

</style>
