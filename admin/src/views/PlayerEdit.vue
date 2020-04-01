<template>
  <div>
    <el-form
      style="width:50%;"
      label-width="100px"
      @submit.native.prevent="save"
    >
      <h1>{{ id ? "编辑" : "新建" }}球员信息</h1>
      <el-form-item label="国家">
        <el-select
          v-model="model.country"
          multiple
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in countrys"
            :key="index"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="中文名">
        <el-input type="text" v-model="model.cname"></el-input>
      </el-form-item>
      <el-form-item label="英文名">
        <el-input type="text" v-model="model.ename"></el-input>
      </el-form-item>
      <el-form-item label="职业情况">
        <el-radio v-model="model.retire" :label="false">现役</el-radio>
        <el-radio v-model="model.retire" :label="true">退役</el-radio>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="model.gender" :label="true">男</el-radio>
        <el-radio v-model="model.gender" :label="false">女</el-radio>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker
          v-model="model.birthday"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="身高">
        <el-input-number
          v-model="model.height"
          :step="1"
          :min="140"
          :max="230"
          size="large"
          placeholder="厘米/cm"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/uploads'"
          :header="setAutoHeader()"
          :show-file-list="false"
          :on-success="res => $set(model, 'avatar', res.url)"
        >
          <img v-if="model.avatar" :src="model.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="相关文章">
        <el-select
          v-model="model.articles"
          multiple
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in articles"
            :key="index"
            :label="item.label"
            :value="item['_id']"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相关视频">
        <el-select
          v-model="model.videos"
          multiple
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in videos"
            :key="index"
            :label="item.label"
            :value="item['_id']"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="惯用手">
        <el-radio v-model="model.habithand" :label="true">右</el-radio>
        <el-radio v-model="model.habithand" :label="false">左</el-radio>
      </el-form-item>
      <el-form-item label="反手持拍">
        <el-radio v-model="model.backhand" :label="true">单反</el-radio>
        <el-radio v-model="model.backhand" :label="false">双反</el-radio>
      </el-form-item>
      <el-form-item label="Rank积分">
        <el-input-number
          :disabled="retire"
          v-model="model.integral"
          :step="1"
          :min="0"
          :max="20000"
          size="large"
          placeholder="排名积分"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="大满贯次数">
        <el-input-number
          v-model="model.grandslam"
          :step="1"
          :min="0"
          :max="200"
          size="large"
          placeholder="大满贯头衔"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="单打冠军">
        <el-input-number
          v-model="model.championships"
          :step="1"
          :min="0"
          :max="500"
          size="large"
          placeholder="夺冠次数"
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
import countrys from "../assets/json/country.json";
export default {
  props: {
    id: {}
  },
  created() {
    if (this.id) {
      this.fetch();
    }
    this.fetchArticle();
    this.fetchVideo();
  },
  data() {
    return {
      model: {
        cname: ""
      },
      countrys: [],
      articles: [],
      videos: []
    };
  },
  computed: {
    retire() {
      return this.model.retire;
    },
    isValid() {
      return this.model.cname == "";
    }
  },
  watch: {
    retire() {
      if (this.retire === true) {
        this.model.integral = 0;
        this.$message({
          message: "已退役的球员，积分为0",
          type: "warning"
        });
      }
    }
  },
  mounted() {
    this.countrys = Object.assign([], countrys);
  },
  methods: {
    // 多余的代码
    // dataFilter(val) {
    //   if (val) {
    //     const patter = new RegExp(val, "i");
    //     this.countrys = Object.assign(
    //       [],
    //       countrys.filter(item => {
    //         return patter.test(item.label);
    //       })
    //     );
    //   } else {
    //     this.countrys = Object.assign([], countrys);
    //   }
    // },
    async fetch() {
      const res = await this.$http.get(`rest/player/${this.id}`);
      this.model = res.data;
    },
    async fetchArticle() {
      const res = await this.$http({
        method: "GET",
        url: "rest/articles"
      });
      this.articles = res.data.map(v => {
        v.label = v.title;
        return v;
      });
    },
    async fetchVideo() {
      const res = await this.$http({
        method: "GET",
        url: "rest/videos"
      });
      this.videos = res.data.map(v => {
        v.label = v.title;
        return v;
      });
    },
    async save() {
      console.log(this.model);

      if (this.id) {
        await this.$http.put(`rest/player/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/player", this.model);
      }
      this.$message({
        message: `${this.id ? "修改" : "新建"}成功`,
        type: "success"
      });
      this.$router.push({
        name: "playerList"
      });
    }
  }
};
</script>
