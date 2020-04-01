<template>
  <div>
    <el-row
      ><el-input
        placeholder="输入评论内容搜索"
        v-model="query"
        class="search-input"
        style="width:23rem;margin-right:1rem;"
      >
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="fetch"
        >搜索</el-button
      >
    </el-row>
    <el-table :data="list" stripe>
      <el-table-column
        prop="from.nickname"
        label="用户"
        width="130"
      ></el-table-column>
      <el-table-column prop="content" label="评论内容"></el-table-column>
      <el-table-column label="发布时间" width="150">
        <template slot-scope="scope">
          {{ scope.row["createdAt"] | formatDay }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
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
        :total="this.total"
        :page-size="limit"
        @prev-click="page -= 1"
        @next-click="page += 1"
        @current-change="handlePageIndex"
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
      list: []
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
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http({
        method: "GET",
        url: "/rest/art_commend",
        params: {
          match: {
            key: "content",
            val: this.query
          },
          populate: {
            path: "from"
          },
          limit: this.limit,
          page: this.page
        }
      });
      this.list = res.data;

      const res2 = await this.$http({
        method: "GET",
        url: "/rest/art_commend/count/page",
        params: {
          match: {
            key: "content",
            val: this.query
          },
          populate: {
            path: "from"
          },
          limit: this.limit,
          page: this.page
        }
      });
      this.total = res2.data;
    },
    async handleDelete(item) {
      this.$confirm(`是否删除此评论`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(async () => {
          await this.$http.delete(`/rest/art_commend/${item["_id"]}`);
          await this.$http.delete(
            `/rest/art_fabulou/remove_fabulou/${item["_id"]}`
          );
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
    },
    handlePageIndex(val) {
      this.page = val - 1;
    }
  }
};
</script>
