<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="delAll"
          >批量删除</el-button
        >
        <el-input
          v-model="select_word"
          size="mini"
          placeholder="筛选相关用户"
          class="handle-input"
        ></el-input>
        <el-button
          type="primary"
          size="mini"
          @click="centerDialogVisible = true"
          >添加新用户</el-button
        >
      </div>
    </div>
    <el-table
      size="mini"
      ref="multipleTable"
      border
      style="width: 100%"
      height="430px"
      :data="data"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="用户图片" width="100px" center>
        <template slot-scope="scope">
          <div class="consumer-img">
            <img :src="getUrl(scope.row.avator)" style="width: 100%" />
          </div>
          <el-upload
            :action="uploadUrl(scope.row.id)"
            :on-success="handleAvatorSuccess"
            :on-before="beforeAvatorSuccess"
          >
            <el-button size="mini">更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column label="性别" align="center" width="50">
        <template slot-scope="scope">
          {{ changeSex(scope.row.sex) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="phoneNum"
        label="手机号"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="email"
        label="电子邮箱"
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column label="生日" width="120" align="center">
        <template slot-scope="scope">
          {{ attachBirth(scope.row.birth) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="introduction"
        label="签名"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="location"
        label="地区"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        label="收藏"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="mini" @click="getCollect(scope.row.id)">收藏</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pageination">
      <el-pagination
        background
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="tableData.length"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <el-dialog
      title="添加新用户"
      :visible.sync="centerDialogVisible"
      width="400px"
      center
    >
      <el-form
        :model="registerForm"
        ref="registerForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item prop="username" label="用户名" size="mini">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" size="mini">
          <el-input
            type="password"
            v-model="registerForm.password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <input
            type="radio"
            name="sex"
            value="0"
            v-model="registerForm.sex"
          />&nbsp;女&nbsp;&nbsp;
          <input
            type="radio"
            name="sex"
            value="1"
            v-model="registerForm.sex"
          />&nbsp;男
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机号" size="mini">
          <el-input
            v-model="registerForm.phoneNum"
            placeholder="手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="电子邮箱" size="mini">
          <el-input
            v-model="registerForm.email"
            placeholder="电子邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="registerForm.birth"
            style="width 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="introduction" label="签名" size="mini">
          <el-input
            v-model="registerForm.introduction"
            placeholder="简介"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input
            v-model="registerForm.location"
            placeholder="地区"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false"
          >取消</el-button
        >
        <el-button size="mini" @click="addConsumer">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="删除用户"
      :visible.sync="deleteVisible"
      width="400px"
      center
    >
      <div align="center">删除后不可恢复，是否确定删除？</div>
      <span slot="footer">
        <el-button size="mini" @click="deleteVisible = false">取消</el-button>
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="批量删除用户"
      :visible.sync="allDeleteVisible"
      width="400px"
      center
    >
      <div align="center">批量删除后不可恢复，是否确定删除？</div>
      <span slot="footer">
        <el-button size="mini" @click="allDeleteVisible = false"
          >取消</el-button
        >
        <el-button size="mini" @click="allDelete">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editVisible"
      width="400px"
      center
    >
      <el-form :model="form" ref="form" label-width="80px" :rules="rules">
        <el-form-item prop="username" label="用户名" size="mini">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" size="mini">
          <el-input
            type="passwoed"
            v-model="form.password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-form-item label="性别" size="mini">
            <input
              type="radio"
              name="sex"
              value="0"
              v-model="form.sex"
            />&nbsp;女&nbsp;&nbsp;
            <input
              type="radio"
              name="sex"
              value="1"
              v-model="form.sex"
            />&nbsp;男
          </el-form-item>
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机号" size="mini">
          <el-input v-model="form.phoneNum" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="电子邮箱" size="mini">
          <el-input v-model="form.email" placeholder="电子邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.birth"
            style="width 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="introduction" label="签名" size="mini">
          <el-input
            v-model="form.introduction"
            placeholder="简介"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="form.location" placeholder="地区"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="editVisible = false">取消</el-button>
        <el-button size="mini" @click="editSave">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  setConsumer,
  getAllConsumer,
  updateConsumer,
  delConsumer,
} from "../api/index";
import { mixin } from "../mixins/index";

export default {
  mixins: [mixin],
  data() {
    return {
      centerDialogVisible: false, //添加弹窗是否显示
      editVisible: false, //修改弹窗是否显示
      deleteVisible: false, //删除弹窗是否显示
      allDeleteVisible: false, //批量删除弹窗是否显示
      registerForm: {
        //添加表格
        username: "",
        password: "",
        sex: "1",
        phoneNum: "",
        email: "",
        birth: "",
        location: "",
        introduction: "",
      },
      form: {
        //编辑表格
        id: "",
        username: "",
        password: "",
        sex: "",
        phoneNum: "",
        email: "",
        birth: "",
        location: "",
        introduction: "",
      },
      tableData: [],
      tempData: [],
      select_word: "",
      pageSize: 5, //分页每页条数
      currentPage: 1, //当前页
      idx: -1, //当前选择项
      multipleSelection: [], //多选打勾项
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入电子邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的电子邮箱",
            trigger: ["bler", "change"],
          },
        ],
        location: [{ required: true, message: "请输入地区", trigger: "blur" }],
        introduction: [
          { required: true, message: "请输入签名", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    data() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.pageSize * this.currentPage
      );
    },
  },
  watch: {
    //搜索框里面内容发生变化时，搜索结果的table列表内容也会跟着改变
    select_word: function () {
      if (this.select_word == "") {
        this.tableData = this.tempData;
      } else {
        this.tableData = [];
        for (let item of this.tempData) {
          if (item.username.includes(this.select_word)) {
            this.tableData.push(item);
          }
        }
      }
    },
  },
  created() {
    this.getData();
  },
  methods: {
    //获取当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //查询所有用户
    getData() {
      this.tempData = [];
      this.tableData = [];
      getAllConsumer().then((res) => {
        this.tempData = res;
        this.tableData = res;
        this.currentPage = 1;
      });
    },

    //添加用户
    addConsumer() {
      this.$refs["registerForm"].validate((valid) => {
        if (valid) {
          let d = this.registerForm.birth;
          let datetime =
            d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDay();
          let params = new URLSearchParams();
          params.append("username", this.registerForm.username);
          params.append("password", this.registerForm.password);
          params.append("sex", this.registerForm.sex);
          params.append("phoneNum", this.registerForm.phoneNum);
          params.append("email", this.registerForm.email);
          params.append("birth", datetime);
          params.append("introduction", this.registerForm.introduction);
          params.append("location", this.registerForm.location);
          params.append("avator", "/img/user.jpg");
          setConsumer(params)
            .then((res) => {
              if (res.code == 1) {
                this.getData();
                this.registerForm = {};
                this.notify("添加成功", "success");
              } else {
                this.notify("添加失败", "error");
              }
            })
            .catch((err) => {
              console.log(err);
            });
          this.centerDialogVisible = false;
        }
      });
    },

    //修改用户
    handleEdit(row) {
      console.log(row);
      this.editVisible = true;
      this.form = {
        id: row.id,
        username: row.username,
        password: row.password,
        sex: row.sex,
        phoneNum: row.phoneNum,
        email: row.email,
        birth: row.birth,
        introduction: row.introduction,
        location: row.location,
      };
      // console.log(this.form);
    },

    //保存编辑页面的修改数据
    editSave() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let d = new Date(this.form.birth);
          let datetime =
            d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDay();
          let params = new URLSearchParams();
          params.append("id", this.form.id);
          params.append("username", this.form.username);
          params.append("password", this.form.password);
          params.append("sex", this.form.sex);
          params.append("phoneNum", this.form.phoneNum);
          params.append("email", this.form.email);
          params.append("birth", datetime);
          params.append("introduction", this.form.introduction);
          params.append("location", this.form.location);
          updateConsumer(params)
            .then((res) => {
              if (res.code == 1) {
                this.getData();
                this.notify("修改成功", "success");
              } else {
                this.notify("修改失败", "error");
              }
            })
            .catch((err) => {
              console.log(err);
            });
          this.editVisible = false;
        }
      });
    },

    //更新图片
    uploadUrl(id) {
      return `${this.$store.state.HOST}/consumer/updateConsumerPic?id=${id}`;
    },

    //删除一名用户
    deleteRow() {
      delConsumer(this.idx)
        .then((res) => {
          if (res) {
            this.getData();
            this.notify("删除成功", "success");
          } else {
            this.notify("删除失败", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.deleteVisible = false;
      this.allDeleteVisible = false;
    },

    //用户收藏列表
    getCollect(id){
      this.$router.push({path:'/Collect',query:{id}});
    },
  },
};
</script>

<style scoped>
.table {
  overflow: hidden;
}

.handle-box {
  margin-bottom: 20px;
}

.consumer-img {
  width: 100%;
  height: 80px;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.pageination {
  display: flex;
  justify-content: center;
}
</style>