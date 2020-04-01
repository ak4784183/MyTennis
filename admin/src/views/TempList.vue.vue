<template>
  <div>
    <el-table :data="list" stripe>
      <el-table-column prop="filename" label="文件名"> </el-table-column>
      <el-table-column label="类型"
        ><template slot-scope="scope">
          {{ scope.row.type === true ? "图片" : "视频" }}
        </template></el-table-column
      >
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
    return { page: 0, limit: 10, total: 0, list: [] };
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
        url: "/rest/temps",
        params: {
          limit: this.limit,
          page: this.page
        }
      });
      this.list = res.data;
      const _total = await this.$http("/rest/temps/count/page");
      this.total = _total.data;
    },
    async handleDelete(item) {
      await this.$http.delete(`/uploads`, {
        data: item
      });
      this.fetch();
    }
  }
};
</script>
