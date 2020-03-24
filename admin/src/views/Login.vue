<template>
  <div class="login-container">
    <el-card header="网球俱乐部" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input type="text" v-model="model.username"> </el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      bg: require("../assets/images/bg.jpg"),
      model: {}
    };
  },
  methods: {
    async login() {
      const res = await this.$http.post("/login", this.model);
      this.setUserName(res.data.username);
      localStorage.setItem("token", res.data.token || "");
      this.$router.push({
        name: "main"
      });
      this.$message({
        message: "登录成功",
        type: "success"
      });
    },
    ...mapMutations(["setUserName"])
  }
};
</script>
<style>
.login-container {
  height: 100vh;
  background-color: #545c64;
  /* background-image: url("../assets/images/bg.jpg"); */
  /* background-size: cover; */
  position: relative;
}
.login-card {
  width: 27rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
