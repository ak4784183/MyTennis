<template>
  <div>
    <el-row
      ><el-input
        placeholder="请输入学校名称"
        v-model="query"
        class="search-input"
        style="width:20rem;margin-right:1rem;"
      >
      </el-input>
      <el-button type="primary" icon="el-icon-search">搜索</el-button>
    </el-row>
    <el-table :data="productList" stripe>
      <el-table-column prop="name" label="装备名称"></el-table-column>
      <el-table-column label="类别">
        <template slot-scope="scope">
          <span v-for="item in scope.row.parent" :key="item._id">
            {{ item.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最近操作时间">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="参考价格/元"></el-table-column>
      <el-table-column prop="recommend" label="推荐理由"></el-table-column>
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
      productList: []
    };
  },
  created() {
    this.fetch();
  },
  watch: {
    page() {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http({
        method: "GET",
        url: "/rest/products",
        params: {
          populate: { path: "parent" },
          limit: this.limit,
          page: this.page
        }
      });

      this.productList = res.data;
      console.log(this.productList);

      const res2 = await this.$http.get("/rest/products/count/page");
      this.total = res2.data;
    },
    async handleEdit(id) {
      this.$router.push(`edit/${id}`);
    },
    async handleDelete(item) {
      this.$confirm(`是否删除《${item.name}》`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(async () => {
          await this.$http.delete(`/rest/products/${item["_id"]}`);
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
