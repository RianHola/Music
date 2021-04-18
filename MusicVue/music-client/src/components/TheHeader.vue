<template>
  <div class="the-header">
      <div class="header-logo" @click="goHome">
          <svg class="icon">
            <use xlink:href = "#icon-erji"></use>
          </svg>
          <span>music</span>
      </div>
      <ul class="navbar">
        <!-- 左侧导航栏 -->
          <li :class="{active:item.name == activeName}" v-for="item in navMsg" :key="item.path" @click="goPage(item.path,item.name)">
            {{item.name}} 
          </li>
          <!-- 搜索框 -->
          <li>
            <div class="header-search">
              <input type="text" placeholder="搜索音乐" @keyup.enter="goSearch()" v-model="keywords">
              <div class="search-btn" @click="goSearch()">
                <svg class="icon">
                  <use xlink:href = "#icon-sousuo"></use>
                </svg>
              </div>
            </div>
          </li>
          <!-- 右侧导航栏 -->
          <li v-show="!logIn" :class="{active:item.name == activeName}" v-for="item in loginMsg" :key="item.path" @click="goPage(item.path,item.name)">
            {{item.name}} 
          </li>
      </ul>
      <div class="header-right" v-show="logIn">
        <div id="user">
          <img :src="attachImgUrl(avator)">
        </div>
        <ul class="menu">
          <li v-for="(item,index) in menuList" :key="index" @click="goMenuList(item.path)">
            {{item.name}}
          </li>
        </ul>
      </div>
  </div>
</template>

<script>

import {navMsg,loginMsg,menuList} from '../assets/data/header';
import {mapGetters} from 'vuex';
import {mixin} from '../mixins';


export default {
  name: 'the-hesder',
  mixins:[mixin],
  data(){
    return{
      navMsg: [],  //导航栏
      loginMsg: [],   //登录栏
      keywords: '',    //关键字搜索
      menuList: [],   //用户下拉菜单
    }
  },
  computed:{
    ...mapGetters(['activeName','logIn','avator'])
  },
  mounted() {
    document.querySelector('#user').addEventListener('click',function(e){
      document.querySelector('.menu').classList.add('show');
      e.stopPropagation();    //阻止冒泡
    },false)
    document.querySelector('.menu').addEventListener('click',function(e){
      e.stopPropagation();    //阻止冒泡
    },false)
    document.addEventListener('click',function(e){
      document.querySelector('.menu').classList.remove('show');
      e.stopPropagation();    //阻止冒泡
    },false)
  },
  created(){
    this.navMsg = navMsg;
    this.loginMsg = loginMsg;
    this.menuList = menuList;
  },
  methods: {
      goHome(){
          this.changeActiveName('首页');
          this.$router.push({path:"/"});
      },
      goPage(path,name){
        if(!this.logIn && name == '我的音乐'){
          this.notify('请先登录','warning');
        }else{
          this.$store.commit('setActiveName',name);
          this.$router.push({path:path});
        }
      },
      goSearch(){
        this.$router.push({path:'/search',query:{keywords:this.keywords}});
      },
      goMenuList(path){
        if(path==0){
          this.$store.commit('setLogIn',false);
          this.$store.commit('setIsActive',false);
          if(this.activeName=='我的音乐'||this.activeName=='设置'){
            setTimeout(() => {
              this.changeActiveName('首页');
              this.$router.push({path:'/'});
            }, 200);
          }else{
            this.$router.go(0);
          }
        }else{
          this.changeActiveName('设置');
          this.$router.push({path:path});
        }
      }
  }
}
</script>

<style  lang="scss" scoped lang="scss">
    @import '../assets/css/the-header.scss';
</style>



