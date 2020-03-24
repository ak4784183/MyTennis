<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-main d-flex flex-coloum ai-center jc-start p-6">
      <div
        class="login-btn  mt-6 text-white fs-xxl d-flex ai-center jc-center"
        :class="logoState === true ? 'bg-tomato' : 'bg-blue'"
      >
        <i
          class="iconfont "
          :class="logoState === true ? 'icon-icon-test' : 'icon-wangqiu1'"
        ></i>
      </div>
      <form method="post" class="h100">
        <div class="w-100 h40 input-item ">
          <i class="iconfont icon-yonghu mr-3 ml-2"></i>
          <input
            type="text"
            placeholder="Username"
            v-model="model.username"
            style="color:#fff;"
          />
        </div>
        <div class="w-100 h40 input-item mt-5">
          <i class="iconfont icon-mima mr-3 ml-2"></i>
          <input
            type="password"
            placeholder="Password"
            v-model="model.password"
            style="color:#fff;"
          />
        </div>
      </form>
      <mt-button
        size="large"
        class="bg-blue mt-5 text-white"
        @click="goRegister"
        ><i class="iconfont icon-zhuce fs-xxl mr-1"></i>注册</mt-button
      >

      <mt-button size="large" class="bg-tomato mt-5 text-white" @click="login"
        ><i class="iconfont icon-icon-test fs-xxl mr-1"></i>登录</mt-button
      >
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      model: {
        username: "",
        password: ""
      },
      isLogin: false
    };
  },
  computed: {
    logoState() {
      if (this.model.username != "" && this.model.password != "") {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    goRegister() {
      this.$router.push("/register");
    },
    async login() {
      if (this.isLogin === true) {
        return;
      }
      this.isLogin = true;
      const { username, password } = this.model;
      if (username === "" || password === "") {
        Toast({
          message: "账户名或密码不能为空",
          iconClass: "iconfont icon-cuowu",
          duration: 1000
        });
        this.isLogin = false;
        return;
      } else {
        const res = await this.$http.post("/login", this.model);
        this.isLogin = false;
        if (res.data) {
          const { name, id, m_token } = res.data;
          localStorage.setItem("m_token", m_token || "");
          this.setItem({
            key: "m_userInfo",
            value: {
              name,
              id
            }
          });
          this.AlertSuccess(`欢迎${name}登录`);
          setTimeout(() => {
            this.routeByName("article");
          }, 1500);
        }
      }
    },
    ...mapMutations(["setItem"])
  }
};
</script>
<style lang="scss">
@import "../../assets/css/config.scss";
.login-page {
  height: 100vh;
  position: relative;
  .login-bg {
    position: fixed;
    top: 0;
    left: 0;
    background: url("../../assets/img/bg.jpg") no-repeat;
    background-size: cover;
    opacity: 0.85;
    z-index: -1;
    width: 100%;
    height: 100%;
  }
  .login-main {
    z-index: 50;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.65));
    form {
      margin-top: 6rem;
      .input-item {
        border-bottom: 3px solid #fff;
        i {
          font-size: 1.6rem !important;
          color: map-get($map: $colors, $key: "white");
        }
        input {
          font-size: 1.1rem;
        }
        input::-webkit-input-placeholder {
          color: map-get($map: $colors, $key: "white");
          font-size: 1rem;
        }
        input::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: map-get($map: $colors, $key: "white");
          font-size: 1rem;
        }
        input:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: map-get($map: $colors, $key: "white");
          font-size: 1rem;
        }
        input:-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: map-get($map: $colors, $key: "white");
          font-size: 1rem;
        }
      }
    }
    .login-btn {
      width: 7rem;
      height: 7rem;
      border: 5px solid map-get($map: $colors, $key: "white");
      box-shadow: 0px 4px 5px #888;
      border-radius: 50%;
      margin-top: 5rem;
      i {
        font-size: 4rem;
      }
    }
  }
}
</style>
