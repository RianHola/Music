<template>
  <div>
    <div class="info">
      <div class="title">
        <span>编辑个人信息</span>
      </div>
      <hr class="hr">
      <el-form
        :model="registerForm"
        ref="registerForm"
        label-width="70px"
        :rules="rules"
        class="personal"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="registerForm.password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="registerForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNum">
          <el-input
            v-model="registerForm.phoneNum"
            placeholder="手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birth">
          <el-date-picker
            v-model="registerForm.birth"
            placeholder="生日"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="签名">
          <el-input
            v-model="registerForm.introduction"
            placeholder="签名"
          ></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-select
            v-model="registerForm.location"
            placeholder="地区"
            style="width: 100%"
          >
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" @click="saveMsg">保存</el-button>
          <el-button @click="goback(-1)">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { rules, cities } from '../assets/data/form';
import { getUserOfId,updateConsumer } from "../api/index";
import { mixin } from "../mixins";
import { mapGetters } from 'vuex';

export default {
  name: "info",
  mixins: [mixin],
  data() {
    return {
      registerForm: {
        username: "", //用户名
        password: "", //密码
        sex: "", //性别
        phoneNum: "", //手机号
        email: "", //邮箱
        birth: "", //生日
        introduction: "", //个人简介
        location: "", //所在地
      },
      cities: [], //所有地区 -- 省份
      rules: {}, //规则
    };
  },
  computed:{
    ...mapGetters(['userId'])
  },
  created() {
    this.cities = cities;
    this.rules = rules;
  },
  mounted(){
    this.getUserOfId(this.userId);
  },
  methods: {
    saveMsg() {
      this.$refs["registerForm"].validate((valid) => {
        if (valid) {
          let _this = this;
          let d = new Date();
          d = this.registerForm.birth;
          let datetime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
          let params = new URLSearchParams();
          params.append("id", this.userId);
          params.append("username", this.registerForm.username);
          params.append("password", this.registerForm.password);
          params.append("sex", this.registerForm.sex);
          params.append("phoneNum", this.registerForm.phoneNum);
          params.append("email", this.registerForm.email);
          params.append("birth", datetime);
          params.append("introduction", this.registerForm.introduction);
          params.append("location", this.registerForm.location);
          updateConsumer(params)
            .then((res) => {
              if (res.code == 1) {
                this.$store.commit('setUsername',this.registerForm.username);
                _this.notify("修改成功", "success");
              } else {
                _this.notify("修改失败", "error");
              }
            })
            .catch((err) => {
              console.log(err);
              _this.notify("修改失败", "error");
            });
        }
      });
    },
    goback(val) {
      this.$router.go(val);
    },
    //获取用户信息
    getUserOfId(userId){
      getUserOfId(userId)
        .then(res => {
          this.registerForm.username = res.username;
          this.registerForm.password = res.password;
          this.registerForm.sex = res.sex;
          this.registerForm.phoneNum = res.phoneNum;
          this.registerForm.email = res.email;
          this.registerForm.birth = new Date(res.birth);
          this.registerForm.introduction = res.introduction;
          this.registerForm.location = res.location;
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/info.scss";
</style>