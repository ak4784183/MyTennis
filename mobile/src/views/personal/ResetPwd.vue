<template>
  <div class="resetPwd-page bg-grey-1">
    <MyHeader title="重置密码"></MyHeader>
    <form method="post">
      <mt-field
        label="旧密码"
        placeholder="请输入您的旧密码"
        type="password"
        v-model="model.oldPassword"
        :state="fieldState[fieldItems.oldPassword]"
      ></mt-field>
      <mt-field
        label="新密码"
        placeholder="请输入您的新密码"
        type="password"
        v-model="model.newPassword"
        :state="fieldState[fieldItems.newPassword]"
      ></mt-field>
      <mt-field
        label="确认密码"
        placeholder="再输入一次"
        type="password"
        v-model="model.repeat"
        :state="fieldState[fieldItems.repeat]"
      ></mt-field>
    </form>
    <div class="d-flex jc-around pt-6">
      <mt-button
        size="large"
        type="danger"
        class="letter-s1 w-30"
        style="box-shadow: 1px 3px 4px #888;"
        @click="routeBack"
        >取消</mt-button
      >
      <mt-button
        size="large"
        type="primary"
        class="letter-s1 w-30"
        style="box-shadow: 1px 3px 4px #888;"
        @click="submitInfoEdit"
        :disabled="submitState"
        >提交</mt-button
      >
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      model: {
        oldPassword: "",
        newPassword: "",
        repeat: ""
      },
      fieldItems: {
        oldPassword: 2,
        newPassword: 2,
        repeat: 2
      },
      fieldState: ["success", "error", "warning"],
      prevent: false
    };
  },
  computed: {
    ...mapGetters(["getUserId"]),
    oldPassword() {
      return this.model.oldPassword;
    },
    newPassword() {
      return this.model.newPassword;
    },
    repeat() {
      return this.model.repeat;
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
    oldPassword() {
      if (this.oldPassword === "") {
        this.fieldItems.oldPassword = 2;
      } else if (/^(\w){6,20}$/.test(this.oldPassword) === true) {
        this.fieldItems.oldPassword = 0;
      } else {
        this.fieldItems.oldPassword = 1;
      }
    },
    newPassword() {
      if (this.newPassword === "") {
        this.fieldItems.newPassword = 2;
      } else if (/^(\w){6,20}$/.test(this.newPassword) === true) {
        this.fieldItems.newPassword = 0;
      } else {
        this.fieldItems.newPassword = 1;
      }
    },
    repeat() {
      if (this.newPassword !== this.repeat) {
        this.fieldItems.repeat = 1;
      } else if (this.repeat === "") {
        this.fieldItems.repeat = 2;
      } else {
        this.fieldItems.repeat = 0;
      }
    }
  },
  methods: {
    async submitInfoEdit() {
      if (this.$store.state.preventClick === false && this.getUserId) {
        const res = await this.put(`/resetPwd/${this.getUserId}`, this.model);
        if (res) {
          this.AlertSuccess(res.data.message);
          setTimeout(() => {
            this.routeBack();
          }, 1500);
        }
      }
    }
  }
};
</script>
<style lang="scss">
.resetPwd-page {
  min-height: 100vh;
}
</style>
