<template>
  <div>
    <el-card class="box-card" v-if="user">
      <div slot="header" class="clearfix">
        <span>账户名：{{ user.username }}</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click.prevent="$router.back()"
          >返回</el-button
        >
      </div>
      <div class="text item">昵称：{{ user.nickname }}</div>
      <div class="text item">邮箱：{{ user.email }}</div>
      <div class="text item">生日：{{ user.birthday }}</div>
      <div class="text item">手机号：{{ user.tel }}</div>
      <div class="text item">个性签名：{{ user.declaration }}</div>
      <div class="text item">
        <img v-if="user.avatar" :src="user.avatar" class="avatar" />
      </div>

      <div class="text item">
        注册时间：{{ user.register_time | formatDate }}
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    id: {}
  },
  created() {
    if (this.id) {
      this.fetch();
    }
  },
  data() {
    return {
      user: {}
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`rest/user/${this.id}`);
      this.user = res.data;
      console.log(this.user);
    },
    async save() {
      this.$router.push({
        name: "adminList"
      });
    }
  }
};
</script>
