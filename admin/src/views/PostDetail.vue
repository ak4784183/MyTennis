<template>
  <div class="post-page">
    <el-card class="box-card" v-if="model.user">
      <div slot="header" class="clearfix">
        <div class="user">
          <img
            v-if="model.user.avatar"
            :src="model.user.avatar"
            style="width:2rem;height:2rem;"
          /><span>{{ model.user.nickname }}</span>
        </div>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click.prevent="$router.back()"
          >返回</el-button
        >
      </div>
      <div class="text item header"></div>
      <div class="text item"></div>

      <div class="text item" style="text-align:right;">
        发布于 {{ model.user.register_time | formatDay }}
      </div>
      <div v-html="model.content"></div>
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
      model: {}
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http({
        method: "GET",
        url: `/rest/posts/${this.id}`,
        params: {
          populate: {
            path: "user"
          }
        }
      });
      this.model = res.data;
      console.log(this.model);
    },
    async save() {
      this.$router.push({
        name: "adminList"
      });
    }
  }
};
</script>
<style>
.clearfix {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.clearfix .user {
  display: flex;
  align-items: center;
}
.clearfix .user img {
  margin-right: 1rem;
}
</style>
