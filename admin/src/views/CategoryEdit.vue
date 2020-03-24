<template>
  <div>
    <el-form
      style="width:50%;"
      label-width="100px"
      @submit.native.prevent="save"
    >
      <h1>{{ id ? "编辑" : "新建" }}文章分类</h1>
      <el-form-item label="名称">
        <el-input type="text" v-model="model.title"></el-input>
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
  computed: {
    isValid() {
      return this.model.title == "";
    }
  },
  data() {
    return {
      model: {
        title: ""
      }
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`rest/categories/${this.id}`);
      this.model = res.data;
    },
    async save() {
      if (this.id) {
        await this.$http.put(`rest/categories/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/categories", this.model);
      }
      this.$message({
        message: `${this.id ? "修改" : "新建"}成功`,
        type: "success"
      });
      this.$router.push({
        name: "categoryList"
      });
    }
  }
};
</script>
