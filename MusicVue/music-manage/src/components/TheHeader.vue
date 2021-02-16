<template>
  <div class="header">
    <!-- 折叠图片 -->
    <div class="collape-btn" @click="collapseChange">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">Music后台管理</div>
    <div class="header-right">
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip :content="fullscreen ? '取消全屏' : '全屏'">
          <i class="el-icon-rank"></i>
        </el-tooltip>
      </div>
      <div class="user-pic">
          <img src="../assets/img/user.jpg" alt="">
      </div>
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="userName">
              {{userName}}
          </span>
          <i class="el-icon-caret-bottom"></i>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import bus from "../assets/js/bus";
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
    }
  },
  computed:{
      userName(){
          return localStorage.getItem('userName');
      }
  },
  methods: {
    //通过Bus实现组件通信   侧边栏折叠
    collapseChange() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    //全屏事件
    handleFullScreen() {
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        let element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    handleCommand(command){
        // console.log("测试");
        if(command == "logout"){
            localStorage.removeItem('userName');
            this.$router.push("/");
        }
    }
  }
};
</script>

<style  scoped>
.header {
  position: relative;
  background-color: #253041;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #ffffff;
}

.collape-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  float: left;
  line-height: 70px;
}

.header .header-right {
  float: right;
  padding-right: 50px;
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-fullscreen {
  margin-right: 5px;
  font-size: 24px;
  transform: rotate(45deg);
}

.user-pic {
    margin-left: 20px;    
}

.user-pic img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: block;
}

.user-name {
    margin-left: 10px;
}

.userName {
    color: white;
    cursor: pointer;
}
</style>