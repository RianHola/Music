<template>
  <div class="login-wrap">
    <div class="ms-title">music 后台管理登录</div>
    <div class="ms-login">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" ></el-input>
        </el-form-item>
        <div class="ms-btn">
          <el-button type="primary" @click="onSubmit" class="button">登录</el-button>  
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {mixin} from "../mixins/index"
import {getLoginStatus} from "../api/index";
export default {
  mixins:[mixin],
  data: function(){
    return {
      ruleForm: {
        username: "admin",
        password: "123"
      },
      rules: {
        username:[
          {required:true,message:"请输入用户名",trigger:"blur"}
        ],
        password:[
          {required:true,message:"请输入密码",trigger:"blur"}
        ],
      }
    }
  },
  methods: {
    onSubmit() {
      let params = new URLSearchParams();
      params.append('name',this.ruleForm.username);
      params.append('password',this.ruleForm.password);
      getLoginStatus(params)
        .then((res) =>{
          if(res.code == 1){
            this.notify('登录成功','success');
          }else{
            this.notify('登录失败','error');
          }
        });
    }
  }
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  background: url("../assets/img/background.jpg");
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100%;
}
.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  color: #fff;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  background-color: #fff;
  margin-left: -190px;
  margin-top: -120px;
  padding: 40px;
  border-radius: 10px;
}

.ms-btn {
  text-align: center;
}

.ms-btn button {
  width: 100%;
  height: 36px;
}
</style>
