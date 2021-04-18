<template>
    <div class="search-song-lists">
        <content-list :contentList="albumDatas"></content-list>
    </div>
</template>

<script>
import ContentList from '../ContentList.vue';
import {getSongListOfLikeTitle} from '../../api/index'
import {mixin} from '../../mixins';

export default {
  components: { ContentList },
    name: 'search-song-lists',
    mixins:[mixin],
    components:{
        ContentList
    },
    data(){
        return {
            albumDatas: []
        }
    },   
    watch:{
        $route(){
         this.getSearchList();
        }
    },
    mounted(){
        this.getSearchList();
    },
    methods: {
        getSearchList(){
            let _this = this;
            if(!this.$route.query.keywords){
                this.notify('您输入的内容为空','warning');
            }else{
                getSongListOfLikeTitle(this.$route.query.keywords)
                    .then(res => {
                        if(res.length!=0){
                            this.albumDatas = res;
                        }else{
                            _this.notify('暂无符合的歌单内容','warning');
                        }
                    })
            }
        }
    }
}
</script>

<style scoped lang='scss'>
@import "../../assets/css/search-song-lists.scss";
</style>