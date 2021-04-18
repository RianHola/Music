<template>
  <div class="search-songs">
    <album-content :songList="listOfSongs"></album-content>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mixin } from "../../mixins/index";
import AlbumContent from "../AlbumContent.vue";

export default {
  name: "search-songs",
  components: { AlbumContent },
  mixins: [mixin],
  watch:{
    $route(){
      this.getSong();
    }
  },
  computed: {
    ...mapGetters(['listOfSongs']),
  },
  mounted() {
    this.getSong();
  },
};
</script>

<style scoped lang='scss'>
@import "../../assets/css/search-songs.scss";
</style>