<template>
    <div class="upload">
        <p class="title">修改头像</p>
        <hr/>
        <div class="section">
            <el-upload
            drag 
            :action="uploadUrl()" 
            :show-file-list="false"
            :on-success="handleAvatorSueccess"
            :before-upload="beforeAvatorUpload">
                <i class="el-icon-upload"></i>
                <div>将文件拖到此处，或点击修改头像</div>
                <div slot="tip">只能上传jpg/png文件，上传大小不超过10M</div>
            </el-upload>
            
        </div>
    </div>
</template>

<script>
import { mixin } from "../mixins";
import { mapGetters } from 'vuex';

export default {
    name: 'upload',
    mixins: [mixin],
    computed: {
        ...mapGetters(['userId'])
    },
    methods: {
        //上传地址
        uploadUrl(){
            return `${this.$store.state.configure.HOST}/consumer/updateConsumerPic?id=${this.userId}`
        },
        //上传成功
        handleAvatorSueccess(res,file){
            let _this = this;
            if (res.code == 1) {
                _this.$store.commit('setAvator',res.avator);
                console.log(file);
                _this.notify('上传成功','success');
            }else{
                _this.notify('上传失败','error');
            }
        },
        //上传之前的过滤
        beforeAvatorUpload(file){
            const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png');
            if(!isJPG){
                this.notify('上传头像图片只能是jpg或png格式','error');
                return false;
            }
            const isLt10M = (file.size / 1024 /1024) <10;
            if(!isLt10M){
                this.notify('上传头像图片大小不能超过10M','error');
                return false;
            }
            return true;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/upload.scss";
</style>