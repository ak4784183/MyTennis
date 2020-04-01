<template>
  <div>
    <el-row>
      <el-input
        placeholder="输入文章标题搜索"
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
      <el-table-column prop="title" label="赛事名称"> </el-table-column>
      <el-table-column prop="sitetype" label="场地类型"> </el-table-column>
      <el-table-column prop="place" label="举办地"> </el-table-column>
      <el-table-column prop="bonus" label="奖金"> </el-table-column>

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
      list: []
    };
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
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const res = await this.$http({
        method: "GET",
        url: "rest/matches",
        params: {
          match: {
            key: "title",
            val: this.query
          },
          limit: this.limit,
          page: this.page
        }
      });
      this.list = res.data;

      const res2 = await this.$http({
        method: "GET",
        url: "/rest/articles/count/page",
        params: {
          match: {
            key: "title",
            val: this.query
          }
        }
      });
      this.total = res2.data;
      console.log(this.total);
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
          await this.$http.delete(`/rest/matches/${item["_id"]}`);
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
