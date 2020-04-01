<template>
  <div>
    <el-form
      style="width:50%;"
      label-width="100px"
      @submit.native.prevent="save"
    >
      <h1>{{ id ? "编辑" : "新建" }}赛事</h1>
      <el-form-item label="名称">
        <el-input type="text" v-model.trim="model.title"></el-input>
      </el-form-item>

      <el-form-item label="举办地">
        <el-input type="text" v-model.trim="model.place"></el-input>
      </el-form-item>
      <el-form-item label="场地类型">
        <el-radio v-model="model.sitetype" label="草地">草地</el-radio
        ><el-radio v-model="model.sitetype" label="红土">红土</el-radio>
        <el-radio v-model="model.sitetype" label="硬地">硬地</el-radio
        ><el-radio v-model="model.sitetype" label="室内硬地">室内硬地</el-radio>
      </el-form-item>
      <el-form-item label="奖金">
        <el-input-number
          v-model="model.bonus"
          :step="10000"
          :min="50000"
          :max="100000000"
          size="large"
          placeholder="奖金数目"
        ></el-input-number>
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
      model: {
        title: "",
        contest: []
      }
    };
  },
  computed: {
    isValid() {
      return this.model.title == "";
    }
  },
  // computed: {
  //   duration() {
  //     return this.model.duration;
  //   }
  // },
  // watch: {
  //   duration() {
  //     if (this.model.contest.length > 0) {
  //       const arr = this.model.contest;
  //       arr.forEach(item => {
  //         this.changeItemValid(item);
  //       });
  //     }
  //   }
  // },
  methods: {
    async fetch() {
      const res = await this.$http.get(`rest/matches/${this.id}`);
      this.model = res.data;
    },
    async save() {
      if (this.id) {
        await this.$http.put(`rest/matches/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/matches", this.model);
      }
      this.$message({
        message: `${this.id ? "修改" : "新建"}成功`,
        type: "success"
      });
      this.$router.push({
        name: "matchList"
      });
    }
  }
};
</script>
