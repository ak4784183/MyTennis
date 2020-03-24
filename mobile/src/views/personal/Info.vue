<template>
  <div class="info-page bg-grey-1">
    <MyHeader title="账户信息"></MyHeader>
    <div class="main pt-3" v-if="userInfo">
      <InfoLine title="账户名" closeDir>
        {{ userInfo.username | shieldText }}</InfoLine
      >
      <InfoLine title="头像" route="avatar">
        <img
          :src="userInfo.avatar ? userInfo.avatar : defaultHeader"
          style="width:1.7rem;height:1.7rem;"
      /></InfoLine>
      <InfoLine title="昵称" route="infoEdit">
        {{ userInfo.nickname }}</InfoLine
      >
      <InfoLine title="邮箱" route="infoEdit">
        {{ userInfo.email | shieldText }}</InfoLine
      >
      <InfoLine title="电话" route="infoEdit">
        {{ userInfo.tel | shieldText }}</InfoLine
      >
      <InfoLine title="性别" route="infoEdit">
        {{ userInfo.gender === 0 ? "女" : "男" }}</InfoLine
      >
      <InfoLine title="生日" route="infoEdit">
        {{ userInfo.birthday | formatDay }}</InfoLine
      >
      <InfoLine title="重置密码" route="resetPwd"> </InfoLine>
      <div class="declaration bg-white px-3 py-2">
        <p>个性签名</p>
        <p class="text-grey">{{ userInfo.declaration }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import InfoLine from "../../components/InfoLine";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    InfoLine
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  async created() {
    await this.getUserInfo(); //再获取一次数据，防止刷新页面没数据
  },
  methods: {
    onValuesChange(picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0]);
      }
    },
    ...mapMutations(["getUserInfo"])
  }
};
</script>
<style lang="scss">
.info-page {
  .main {
    .declaration {
      min-height: 6rem;
    }
  }
}
</style>
