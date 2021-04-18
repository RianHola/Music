<template>
  <div>
    <loginLogo/>
    <div class="signUp box">
      <div class="signUp-head">
        <span>登录</span>
      </div>
      <el-form :model="loginForm" ref="loginForm" label-width="70px" class="demo-ruleForm" :rules="rules">
          <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
          </el-form-item>
          <!-- style="display:flex;justify-content:center;" -->
          <div class="login-btn">
                <el-button @click="goSignUp">注册</el-button>
                <el-button type="primary" @click="loginIn">登录</el-button>
          </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import loginLogo from '../components/LoginLogo'
import {loginIn,getCollectOfUserId} from '../api/index'
import {mixin} from '../mixins'

export default {
    name: 'sign-up',
    mixins: [mixin],
    components: {
        loginLogo,
    },
    data(){
        return {
            loginForm: {
                username:'',    //用户名
                password:'',    //密码
            },
            rules:{
                username: [
                    { required: true, trigger: 'blur',message:'请输入用户名' }
                ],
                password: [
                    { required: true, trigger: 'blur',message:'请输入密码' }
                ]
            }
        }
    },
    mounted() {
        this.changeActiveName('登录');
    },
    methods:{
        loginIn(){
            let _this = this;
            let params = new URLSearchParams();
            params.append('username',this.loginForm.username);
            params.append('password',this.loginForm.password);
            loginIn(params)
            .then(res => {
                if(res.code == 1){
                    _this.notify('登录成功','success');
                    _this.$store.commit('setLogIn',true);
                    _this.$store.commit('setUserId',res.userMsg.id);
                    _this.$store.commit('setUsername',res.userMsg.username);
                    _this.$store.commit('setAvator',res.userMsg.avator);
                    _this.changeActiveName('首页');
                    setTimeout(function(){
                        _this.$router.push({path:'/'});
                    },1000);
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
                }else{
                    _this.notify('用户名或密码错误失败','error');
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        goSignUp(){
            this.changeActiveName('注册');
            this.$router.push({path:'/sign-up'});
        },
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/sign-up.scss";
.box{
    top: 30vh;
}
</style>