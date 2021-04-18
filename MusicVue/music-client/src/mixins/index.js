import { mapGetters } from 'vuex';
import {likeSongOfName,getCollectOfUserId} from '../api/index'
export const mixin = {
    computed: {
        ...mapGetters(['logIn','userId','id'])
    },
    methods: {
        //提示信息
        notify(title,type){
            this.$notify({
                title: title,
                type: type
            })
        },

        //获取图片地址
        attachImgUrl(srcUrl) {
            return srcUrl ? this.$store.state.configure.HOST + srcUrl : this.$store.state.configure.HOST +'/img/user.jpg'
        },
        //根据歌名模糊搜索
        getSong(){
            if(!this.$route.query.keywords){
                this.$store.commit('setListOfSong',[]);
                this.notify('您输入的内容为空','warning');
            }else{
                likeSongOfName(this.$route.query.keywords).then(res =>{
                    if(!res.length){
                        this.$store.commit('setListOfSong',[]);
                        this.notify('暂无符合数据的歌曲','warning');
                    }else{
                        this.$store.commit('setListOfSong',res);
                    }
                }).catch(err =>{
                    console.log(err);
                })
            }
        },

        //获取名字的前半部分---歌手名
        replaceName(str){
            let arr = str.split('-');
            return arr[0]
        },

        //获取名字的后半部分---歌名
        replaceSongsName(str){
            let arr = str.split('-');
            return arr[1]
        },
        
        //播放
        toPlay: function(id,url,pic,index,name,lyric){
            this.$store.commit('setId',id);
            this.$store.commit('setUrl',this.$store.state.configure.HOST + url);
            this.$store.commit('setPlayButtonUrl','#icon-zanting');
            this.$store.commit('setIsPlay',true);

            this.$store.commit('setPicUrl',this.$store.state.configure.HOST + pic);
            this.$store.commit('setListIndex',index);
            this.$store.commit('setTitle',this.replaceSongsName(name));  //歌名
            this.$store.commit('setArtist',this.replaceName(name));      //歌手名
            this.$store.commit('setLyric',this.parselyric(lyric));
            if(this.logIn){
                getCollectOfUserId(this.userId)
                    .then(res => {
                        for(let item of res){
                            if(item.songId == this.id){
                                this.$store.commit('setIsActive',true);
                                break;
                            }else{
                                this.$store.commit('setIsActive',false);
                            }
                        }
                    })
            }
        },

        //分解歌词
        parselyric(text){
            if(typeof text =='string'){
                let lines = text.split('\n');
            let pattern = /\[\d{2}:\d{2}.(\d{2}|\d{3})\]/g;     //时间格式的正则表式
            let result = [];
            //歌词不对直接返回
            if(!(/\[.+\]/.test(text))){
                return [[0,text]]
            }

            //过滤前面不正确的行
            while(!pattern.test(lines[0])){
                lines = lines.slice(1);
            }

            //遍历每一行，形成时间歌词两个元素的数组
            for(let item of lines){
                let time = item.match(pattern);         //存时间段
                let value = item.replace(pattern,'');   //存歌词
                if(value!=''){
                    for (let item1 of time) {
                        let t = item1.slice(1,-1).split(':');       //时间换算
                        result.push([parseInt(t[0],10)*60+parseFloat(t[1]),value]);
                    }
                }
            }
            //排序
            result.sort(function(a,b){
                return a[0] - b[0];
            });
            return result;
            }
        },

        //转向页面高亮
        changeActiveName(val){
            this.$store.commit('setActiveName',val);
        },

        //获取生日
        attachBirth(val){
            return val.substr(0,10);
        }
    }
}