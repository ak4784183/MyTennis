<template>
  <div>
    <el-form
      style="width:50%;"
      label-width="100px"
      @submit.native.prevent="save"
    >
      <h1>{{ id ? "编辑" : "添加" }}装备分类</h1>
      <el-form-item label="所属分类">
        <el-select v-model="model.parent" placeholder="请选择">
          <el-option
            v-for="item in equiptypes"
            :key="item['_id']"
            :label="item.title"
            :value="item['_id']"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称">
        <el-input type="text" v-model.trim="model.title"></el-input>
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
    this.fetchEquipTypes();
  },
  computed: {
    isValid() {
      return this.model.title == "";
    }
  },
  data() {
    return {
      equiptypes: [],
      model: {
        title: ""
      }
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`rest/equip_type/${this.id}`);
      this.model = res.data;
    },
    async fetchEquipTypes() {
      const res = await this.$http.get("rest/equip_type");
      let temp = res.data.filter(item => {
        return item.hasOwnProperty("parent") != true;
      });
      this.equiptypes = Object.assign([], temp);
    },
    async save() {
      if (this.id) {
        await this.$http.put(`rest/equip_type/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/equip_type", this.model);
      }
      this.$router.push({
        name: "equipTypeList"
      });
    }
  }
};
</script>
