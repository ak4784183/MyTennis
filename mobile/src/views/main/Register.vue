<template>
  <div class="register-page">
    <mt-header title="注册" class="bg-dark">
      <router-link to="/login" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button
        icon="more"
        slot="right"
        @click="popupVisible = true"
      ></mt-button>
    </mt-header>
    <form method="post" class="bb">
      <mt-field
        label="账户名"
        placeholder="带有英文和数字的账户名"
        v-model.trim="model.username"
        :state="fieldState[fieldItems.username]"
      ></mt-field>
      <mt-field
        label="密码"
        placeholder="6-20位带有英文和数字的密码"
        type="password"
        v-model.trim="model.password"
        :state="fieldState[fieldItems.password]"
      ></mt-field>
      <mt-field
        label="昵称"
        placeholder="不超过10位的昵称"
        v-model.trim="model.nickname"
        :state="fieldState[fieldItems.nickname]"
      ></mt-field>
      <mt-field
        label="邮箱"
        placeholder="请输入邮箱"
        type="email"
        v-model.trim="model.email"
        :state="fieldState[fieldItems.email]"
      ></mt-field>
      <mt-field
        label="手机号"
        placeholder="请输入手机号"
        type="tel"
        v-model.trim="model.tel"
        :state="fieldState[fieldItems.tel]"
      ></mt-field>
    </form>
    <div class="p-6">
      <mt-button
        size="large"
        :class="submitState === false ? 'bg-blue' : 'bg-tomato'"
        class="mt-2 text-white"
        @click.prevent="regSubmit"
        :disabled="submitState"
        ><i
          class="iconfont  fs-xxl mr-1"
          :class="submitState === false ? 'icon-zhuce' : 'icon-hold__easyico'"
        ></i
        >注册</mt-button
      >
    </div>
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade"
      class="bg-steel"
      style="border-radius:0.5rem;"
    >
      <div class="text-white p-2">
        此项目由李林衡开发
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      popupVisible: false,
      fieldItems: {
        username: 2,
        password: 2,
        nickname: 2,
        email: 2,
        tel: 2
      },
      fieldState: ["success", "error", "warning"],
      model: {
        username: "",
        password: "",
        nickname: "",
        email: "",
        tel: ""
      }
    };
  },
  computed: {
    username() {
      return this.model.username;
    },
    password() {
      return this.model.password;
    },
    nickname() {
      return this.model.nickname;
    },
    email() {
      return this.model.email;
    },
    tel() {
      return this.model.tel;
    },
    submitState() {
      let flag = false;
      const state = this.fieldItems;
      for (let index in state) {
        if (state[index] !== 0) {
          flag = true;
        }
      }
      return flag;
    }
  },
  watch: {
    username() {
      if (/^[a-zA-Z0-9_-]{4,16}$/.test(this.username) === true) {
        this.fieldItems.username = 0;
      } else if (this.username === "") {
        this.fieldItems.username = 2;
      } else {
        this.fieldItems.username = 1;
      }
    },
    password() {
      if (this.password === "") {
        this.fieldItems.password = 2;
      } else if (/^(\w){6,20}$/.test(this.password) === true) {
        this.fieldItems.password = 0;
      } else {
        this.fieldItems.password = 1;
      }
    },
    nickname() {
      if (this.nickname.length > 10) {
        this.fieldItems.nickname = 1;
      }
      if (this.nickname === "") {
        this.fieldItems.nickname = 2;
      }
      if (this.nickname !== "" && this.nickname.length < 10) {
        this.fieldItems.nickname = 0;
      }
    },
    email() {
      let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (this.email === "") {
        this.fieldItems.email = 2;
      } else if (pattern.test(this.email) === true) {
        this.fieldItems.email = 0;
      } else {
        this.fieldItems.email = 1;
      }
    },
    tel() {
      let pattern = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
      if (this.tel === "") {
        this.fieldItems.tel = 2;
      } else if (pattern.test(this.tel) === true) {
        this.fieldItems.tel = 0;
      } else {
        this.fieldItems.tel = 1;
      }
    }
  },
  methods: {
    async regSubmit() {
      if (this.$store.state.preventClick === false) {
        const res = await this.$http.post("register", this.model);
        let { code, message } = res.data;
        if (code === 1) {
          Toast({
            message: message,
            iconClass: "iconfont icon-cuowu"
          });
          return;
        } else {
          Toast({
            message: message,
            iconClass: "iconfont icon-xiaoxi-chenggong",
            duration: 1500
          });
          setTimeout(() => {
            this.$router.push("/login");
          }, 1500);
        }
      }
    }
  }
};
</script>
