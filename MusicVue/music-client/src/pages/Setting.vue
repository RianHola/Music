<template>
    <div class="setting">
        <div class="leftCol">
            <div class="settingsMainHeader">设置</div>
            <ul class="setting-aside">
                <li v-for="(item,index) in settingList" :key="index" :class="{activeColor:activeName==item.name}" @click="handleChangeView(item)">
                    {{item.name}}
                </li>
            </ul>
        </div>
        <div class="contentCol">
            <component :is="componentSrc">></component>
        </div>
    </div>
</template>

<script>
import Info from '../components/Info';
import Upload from '../components/Upload';

export default {
    name: 'setting',
    components:{
        Info,
        Upload
    },
    data(){
        return {
            settingList: [
                {name: '个人信息',path:'Info'},
                {name: '修改头像',path:'Upload'},
            ],
            activeName: '个人信息',
            componentSrc: 'Info'
        }
    },
    methods:{
        handleChangeView(val){
            this.activeName = val.name;
            this.componentSrc = val.path;
        }
    }
}
</script>
</script>

<style  lang="scss" scoped lang="scss">
    @import '../assets/css/setting.scss';
</style>