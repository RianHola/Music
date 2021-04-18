<template>
  <div class="song-list">
    <ul class="song-list-header">
      <li
        v-for="(item, index) in this.songStyle"
        :key="index"
        @click="handleChangeView(item.name)"
        :class="{ active: item.name == activeName }"
      >
        {{ item.name }}
      </li>
    </ul>
    <content-list :contentList="data"></content-list>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="albumDatas.length"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import ContentList from "../components/ContentList";
import { getAllSongList, getSongListOfStyle } from "../api/index";
import { mixin } from "../mixins";
import { songStyle } from "../assets/data/songList";

export default {
  components: { ContentList },
  name: "song-list",
  mixins: [mixin],
  components: {
    ContentList,
  },
  data() {
    return {
      albumDatas: [], //歌单数据
      pageSize: 15, //页面大小，一页15条数据
      currentPage: 1, //当前页
      songStyle: [], //风格
      activeName: "全部歌单", //当前风格
    };
  },
  computed: {
    //计算当前页的数据
    data() {
      return this.albumDatas.slice(
        (this.currentPage - 1) * this.pageSize,
        this.pageSize * this.currentPage
      );
    },
  },
  watch: {
    $route() {
      this.getSongList();
    },
  },
  mounted() {
    this.songStyle = songStyle;
    this.getSongList();
  },
  methods: {
    getSongList() {
      getAllSongList().then((res) => {
        this.currentPage = 1;
        this.albumDatas = res;
        this.getByName();
      });
    },
    //获取风格种类
    getByName() {
        let obj = new Set();
        console.log(obj);
      for (let item of this.albumDatas) {
        obj.add(item.style)
      }
      this.songStyle = [{name:"全部歌单"}];
      for(let item of obj){
          this.songStyle.push({name:item});
      }
    },

    //获取当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //根据style显示对应的歌单
    handleChangeView(name) {
      this.albumDatas = [];
      this.activeName = name;
      if (name == "全部歌单") {
        this.getSongList();
      } else {
        this.getSongListOfStyle(name);
      }
    },

    //根据style查询对应的歌单
    getSongListOfStyle(style) {
      getSongListOfStyle(style).then((res) => {
        this.currentPage = 1;
        this.albumDatas = res;
      });
    },
  },
};
</script>

<style scoped lang='scss'>
@import "../assets/css/song-list.scss";
</style>