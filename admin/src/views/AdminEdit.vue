<template>
  <div>
    <el-form
      style="width:50%;"
      label-width="100px"
      @submit.native.prevent="save"
      v-if="model"
    >
      <h1>{{ id ? "编辑" : "添加" }}管理员</h1>
      <el-form-item label="用户名">
        <el-input type="text" v-model.trim="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model.trim="model.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" :disabled="isValid">{{
          id ? "保存" : "添加"
        }}</el-button>
        <el-button type="danger" @click.prevent="$router.back()"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
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
  computed: {
    isValid() {
      return !(this.model.username && this.model.password);
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`rest/admin_user/${this.id}`);
      this.model = res.data;
    },
    async save() {
      if (this.id) {
        await this.$http.put(`rest/admin_user/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/admin_user", this.model);
      }
      this.$router.push({
        name: "adminList"
      });
    }
  }
};
</script>
