<template>
  <div>
    <el-form
      style="width:50%;"
      label-width="100px"
      @submit.native.prevent="save"
    >
      <h1>{{ id ? "编辑" : "新建" }}广告列表</h1>
      <el-form-item label="宣传标题">
        <el-input type="text" v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item laber="封面图">
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/uploads'"
          :header="setAutoHeader()"
          :show-file-list="false"
          :on-success="res => $set(model, 'url', res.url)"
        >
          <img v-if="model.url" :src="model.url" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">{{
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
      model: {
        title: "",
        url: ""
      }
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`rest/ads/${this.id}`);
      this.model = res.data;
    },
    async save() {
      if (this.id) {
        await this.$http.put(`rest/ads/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/ads", this.model);
      }
      this.$message({
        message: `${this.id ? "修改" : "新建"}成功`,
        type: "success"
      });
      this.$router.push({
        name: "adList"
      });
    }
  }
};
</script>
