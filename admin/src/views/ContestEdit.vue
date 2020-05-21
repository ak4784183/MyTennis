<template>
  <div>
    <el-form
      style="width: 50%;"
      label-width="100px"
      @submit.native.prevent="save"
    >
      <h1>
        {{ id ? "编辑" : "新建"
        }}{{ model.round ? "第" + model.round + "轮" : "" }}
        {{ model.single ? "单打" : "双打" }}比赛
      </h1>
      <el-form-item>
        <el-switch
          v-model="model.single"
          active-color="#409EFF"
          inactive-color="#ff4949"
          active-text="单打"
          inactive-text="双打"
          @change="
            (val) => {
              model.host = [];
              model.guest = [];
            }
          "
        >
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-select v-model="model.match" filterable placeholder="比赛类型">
          <el-option
            v-for="(item, index) in matches"
            :key="index"
            :label="item.label"
            :value="item['_id']"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        ><el-input-number
          v-model="model.round"
          :step="1"
          :min="0"
          :max="7"
          size="larger"
          placeholder="比赛轮次"
        ></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="model.host"
          filterable
          placeholder="比赛选手"
          multiple
          :multiple-limit="model.single ? 1 : 2"
        >
          <el-option
            v-for="(item, index) in players"
            :key="index"
            :label="item.label"
            :value="item['_id']"
          >
          </el-option>
        </el-select>
        <span style="margin: 0 1rem;">VS</span>
        <el-select
          v-model="model.guest"
          filterable
          placeholder="比赛选手"
          multiple
          :multiple-limit="model.single ? 1 : 2"
        >
          <el-option
            v-for="(item, index) in players"
            :key="index"
            :label="item.label"
            :value="item['_id']"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input-number
          v-model="model.hostscore"
          :step="1"
          :min="0"
          :max="3"
          size="larger"
          placeholder="host比分"
        ></el-input-number>
        <span style="margin: 0 1rem;"> </span>
        <el-input-number
          v-model="model.guestscore"
          :step="1"
          :min="0"
          :max="3"
          size="larger"
          placeholder="guest比分"
        ></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="model.date"
          type="datetime"
          placeholder="比赛时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="model.video" filterable placeholder="比赛视频">
          <el-option
            v-for="(item, index) in videos"
            :key="index"
            :label="item.label"
            :value="item['_id']"
          >
          </el-option>
        </el-select>
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
    id: {},
  },
  created() {
    if (this.id) {
      this.fetch();
    }
    this.fetchMatch();
    this.fetchPlayer();
    this.fetchVideos();
  },
  computed: {
    isValid() {
      const obj = this.model;
      if (
        obj.host &&
        obj.host.length > 0 &&
        obj.guest &&
        obj.guest.length > 0 &&
        obj.match &&
        obj.date
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  data() {
    return {
      model: {},
      matches: [],
      videos: [],
      players: [],
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`rest/contests/${this.id}`);
      this.model = res.data;
    },
    async fetchVideos() {
      const res = await this.$http({
        method: "GET",
        url: "rest/videos",
        params: {
          where: {
            type: "比赛",
          },
        },
      });

      this.videos = res.data.map((v) => {
        v.label = v.title;
        return v;
      });
    },
    async fetchPlayer() {
      const res = await this.$http({
        method: "GET",
        url: "rest/players",
      });
      this.players = res.data.map((v) => {
        v.label = v.cname;
        return v;
      });
    },
    async fetchMatch() {
      const res = await this.$http({
        method: "GET",
        url: "rest/matches",
      });
      this.matches = res.data.map((v) => {
        v.label = v.title;
        return v;
      });
    },
    async save() {
      if (this.id) {
        await this.$http.put(`rest/contests/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/contests", this.model);
      }
      this.$message({
        message: `${this.id ? "修改" : "新建"}成功`,
        type: "success",
      });
      this.$router.push({
        name: "contestList",
      });
    },
  },
};
</script>
