<template>
  <div>
    <el-row>
      <el-input
        placeholder="输入球员中文名搜索"
        v-model="query"
        class="search-input"
        style="width: 23rem; margin-right: 1rem;"
      >
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="fetch"
        >搜索</el-button
      >
    </el-row>
    <el-table :data="list" stripe>
      <el-table-column prop="cname" label="球员名称"> </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <div>
            <img
              :src="scope.row['avatar'] ? scope.row['avatar'] : playerimg"
              width="100"
              height="100"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          {{ scope.row["gender"] === true ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
    <div style="text-align: center; margin-top: 1rem;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="limit"
        @prev-click="page -= 1"
        @next-click="page += 1"
        @current-change="(val) => (page = val - 1)"
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
      total: 0,
      limit: 10,
      page: 0,
      list: [],
    };
  },
  created() {
    this.fetch();
  },
  watch: {
    query() {
      if (this.query == "") {
        this.fetch();
      }
    },
    page() {
      this.fetch();
    },
  },
  methods: {
    async fetch() {
      this.list = (
        await this.$http({
          method: "GET",
          url: "/rest/players",
          params: {
            match: {
              key: "cname",
              val: this.query,
            },
            limit: this.limit,
            page: this.page,
          },
        })
      ).data;
      this.total = (
        await this.$http({
          method: "GET",
          url: "/rest/players/count/page",
          params: {
            match: {
              key: "cname",
              val: this.query,
            },
          },
        })
      ).data;
    },
    async handleEdit(id) {
      this.$router.push(`edit/${id}`);
    },
    async handleDelete(item) {
      this.$confirm(`是否删除《${item.cname}》`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          await this.$http.delete(`/rest/players/${item["_id"]}`);
          this.fetch();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
