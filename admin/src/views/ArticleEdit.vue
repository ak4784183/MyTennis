<template>
  <div v-if="model">
    <el-form
      style="width:80%;"
      label-width="100px"
      @submit.native.prevent="save"
    >
      <h1>{{ id ? "编辑" : "新建" }}文章</h1>
      <el-form-item label="所属分类">
        <el-select v-model="model.category" placeholder="请选择">
          <el-option
            v-for="item in categories"
            :key="item['_id']"
            :label="item.title"
            :value="item['_id']"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文章封面">
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/uploads'"
          :header="setAutoHeader()"
          :show-file-list="false"
          :on-success="res => $set(model, 'cover', res.url)"
        >
          <img v-if="model.cover" :src="model.cover" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="作者姓名">
        <el-input type="text" v-model="model.author"></el-input>
      </el-form-item>
      <el-form-item label="文章标题">
        <el-input type="text" v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="文章内容">
        <VueEditor
          v-model="model.content"
          useCustomImageHandler
          @image-added="handleImageAdded"
        ></VueEditor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">{{
          id ? "保存" : "发布"
        }}</el-button>
        <el-button type="danger" @click.prevent="$router.back()"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { VueEditor } from "vue2-editor";
export default {
  props: {
    id: {}
  },
  components: {
    VueEditor
  },
  created() {
    if (this.id) {
      this.fetch();
    }
    this.fetchCategory();
  },
  data() {
    return {
      categories: [],
      model: {}
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`rest/articles/${this.id}`);
      this.model = res.data;
      console.log(this.model);
    },
    async fetchCategory() {
      const res = await this.$http.get("rest/categories");
      this.categories = res.data;
    },
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await this.$http.post("uploads", formData);
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    },
    async save() {
      if (this.id) {
        await this.$http.put(`rest/articles/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/articles", this.model);
      }
      this.$message({
        message: `${this.id ? "修改" : "新建"}成功`,
        type: "success"
      });
      this.$router.push({
        name: "articleList"
      });
    }
  }
};
</script>
