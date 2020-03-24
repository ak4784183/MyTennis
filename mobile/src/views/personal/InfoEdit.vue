<template>
  <div class="infoEdit-page">
    <MyHeader title="修改资料信息"></MyHeader>
    <form method="post">
      <mt-field
        label="昵称"
        placeholder="不超过10位的昵称"
        v-model="model.nickname"
        :state="fieldState[fieldItems.nickname]"
      ></mt-field>
      <mt-field
        label="邮箱"
        placeholder="请输入邮箱"
        type="email"
        v-model="model.email"
        :state="fieldState[fieldItems.email]"
      ></mt-field>
      <mt-field
        label="手机号"
        placeholder="请输入手机号"
        type="tel"
        v-model="model.tel"
        :state="fieldState[fieldItems.tel]"
      ></mt-field>
      <div
        class="ml-2 pl-1 pr-3 py-2 d-flex jc-between ai-center bt"
        @click="$refs.birthdayPicker.open()"
      >
        <span class="w100 mr-1">生日</span>
        <p class="flex-1">{{ model.birthday | formatDay }}</p>
        <i class="iconfont icon-jianyi"></i>
      </div>
      <mt-radio class="bt" title="性别" v-model="gender" :options="options">
      </mt-radio>
      <mt-field
        label="个性签名"
        placeholder="此用户很懒，什么都没留下"
        type="textarea"
        rows="4"
        v-model="model.declaration"
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
        >提交</mt-button
      >
    </div>
    <mt-datetime-picker
      ref="birthdayPicker"
      type="date"
      :startDate="startDate"
      v-model="birthday"
      @confirm="$set(model, 'birthday', birthday)"
    >
    </mt-datetime-picker>
  </div>
</template>
<script>
import { DatetimePicker } from "mint-ui";
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    nickname() {
      return this.model.nickname;
    },
    email() {
      return this.model.email;
    },
    tel() {
      return this.model.tel;
    }
  },
  data() {
    return {
      model: {},
      gender: "0",
      birthday: "",
      declaration: "",
      startDate: new Date("1930/1/1"),
      options: [
        {
          label: "女生",
          value: "0"
        },
        {
          label: "男生",
          value: "1"
        }
      ],
      fieldItems: {
        nickname: 2,
        email: 2,
        tel: 2
      },
      fieldState: ["success", "error", "warning"]
    };
  },
  watch: {
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
  created() {
    this.model = Object.assign({}, this.userInfo);
    this.gender = String(this.model.gender);
    this.initBirthday();
  },
  methods: {
    initBirthday() {
      //初始化时间控件的时间值
      if (this.model.birthday) {
        this.birthday = this.model.birthday;
      }
    },
    async submitInfoEdit() {
      this.$set(this.model, "gender", Number(this.gender));
      if (this.model) {
        const res = await this.put(
          `/rest/users/${this.userInfo["_id"]}`,
          this.model
        );
        this.AlertSuccess("修改成功");
        setTimeout(() => {
          this.routeBack();
        }, 1500);
      }
    },
    ...mapMutations(["getUserInfo"])
  }
};
</script>
<style lang="scss">
.mint-radiolist {
  .mint-radiolist-title {
    padding-left: 0.3rem;
  }
}
</style>
