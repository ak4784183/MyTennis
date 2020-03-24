<template>
  <div>
    <el-form
      style="width:80%;"
      label-width="100px"
      @submit.native.prevent="save"
    >
      <h1>{{ id ? "编辑" : "新建" }}运动装备详情</h1>
      <el-form-item label="所属分类">
        <el-select v-model="model.parent" placeholder="请选择" multiple>
          <el-option
            v-for="item in equipTypes"
            :key="item['_id']"
            :label="item.title"
            :value="item['_id']"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参考价格">
        <el-input-number
          v-model="model.price"
          :precision="1"
          :step="5"
          :max="10000"
          size="large"
          placeholder="单位/元"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="装备名称">
        <el-input type="text" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item laber="展示封面图">
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/uploads'"
          :header="setAutoHeader()"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="model.cover" :src="model.cover" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="规格说明">
        <el-input type="text" v-model="model.specification"></el-input>
      </el-form-item>
      <el-form-item label="推荐理由">
        <el-input type="text" v-model="model.recommend"></el-input>
      </el-form-item>
      <el-form-item label="完整描述">
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
    this.fetchEquipTypes();
  },
  data() {
    return {
      equipTypes: [],
      model: {}
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`rest/products/${this.id}`);
      this.model = res.data;
    },
    async fetchEquipTypes() {
      const res = await this.$http.get("rest/equip_type");
      this.equipTypes = res.data;
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
        await this.$http.put(`rest/products/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/products", this.model);
      }
      this.$message({
        message: `${this.id ? "修改" : "新建"}成功`,
        type: "success"
      });
      this.$router.push({
        name: "productList"
      });
    },
    handleAvatarSuccess(res) {
      this.$set(this.model, "cover", res.url);
      // this.model.cover = res.url;
    }
  }
};
</script>
