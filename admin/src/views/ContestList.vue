<template>
  <div>
    <el-row>
      <el-date-picker
        v-model="duration"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']"
        @change="
          () => {
            page = 0;
            fetch();
          }
        "
      >
      </el-date-picker>
      <el-select
        style="margin-left:2rem;"
        v-model="matchid"
        filterable
        clearable
        placeholder="筛选比赛类型"
      >
        <el-option
          v-for="(item, index) in matches"
          :key="index"
          :label="item.label"
          :value="item['_id']"
        >
        </el-option>
      </el-select>
    </el-row>
    <el-table :data="cateList" stripe>
      <el-table-column label="时间" width="250">
        <template slot-scope="scope">
          {{ scope.row.date | formatDay }}
        </template>
      </el-table-column>
      <el-table-column label="比赛" width="250">
        <template slot-scope="scope">
          {{ scope.row.match.title }}
          {{ scope.row.round ? " 第" + scope.row.round + "轮" : "" }}
        </template>
      </el-table-column>
      <el-table-column
        ><template slot-scope="scope">
          <div
            style="display:flex;align-items: center;justify-content: center;"
          >
            <div>
              <img
                v-for="item in scope.row.host"
                :key="item['_id']"
                :src="item.avatar"
                width="50"
                height="50"
                style="margin-right:12px;"
              />
            </div>
            VS
            <div>
              <img
                style="margin-left:12px;"
                v-for="item in scope.row.guest"
                :key="item['_id']"
                :src="item.avatar"
                width="50"
                height="50"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="medium " @click="handleEdit(scope.row['_id'])"
            >编辑</el-button
          >
          <el-button
            size="medium"
            type="danger"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:1rem;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="limit"
        @prev-click="page -= 1"
        @next-click="page += 1"
        @current-change="val => (page = val - 1)"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      query: "",
      page: 0,
      limit: 10,
      total: 0,
      matches: [],
      matchid: "",
      duration: null,
      cateList: []
    };
  },
  watch: {
    matchid() {
      this.page = 0;
      this.fetch();
    },
    query() {
      if (this.query == "") {
        this.fetch();
      }
    },
    page() {
      this.fetch();
    }
  },
  created() {
    this.fetch();
    this.fetchMatch();
  },
  methods: {
    async fetch() {
      const option = {};
      if (this.duration !== null && this.duration.length > 0) {
        option.date = { $gt: this.duration[0], $lt: this.duration[1] };
      }
      if (this.matchid) {
        option.match = this.matchid;
      }
      const res = await this.$http({
        method: "GET",
        url: "/rest/contests",
        params: {
          where: option,
          populate: {
            path: "host guest match"
          },
          limit: this.limit,
          page: this.page
        }
      });
      this.cateList = res.data;
      const _total = await this.$http({
        method: "GET",
        url: "/rest/contests/count/page",
        params: {
          where: option
        }
      });
      this.total = _total.data;
    },
    async fetchMatch() {
      const res = await this.$http({
        method: "GET",
        url: "rest/matches"
      });
      this.matches = res.data.map(v => {
        v.label = v.title;
        return v;
      });
    },
    async handleEdit(id) {
      this.$router.push(`edit/${id}`);
    },
    async handleDelete(item) {
      this.$confirm(`是否删除《${item.title}》`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(async () => {
          await this.$http.delete(`/rest/contests/${item["_id"]}`);
          this.fetch();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style scoped>
.boxer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
