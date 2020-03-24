<template>
  <div>
    <el-table :data="list" stripe>
      <el-table-column prop="user.nickname" label="发帖用户id">
      </el-table-column>
      <el-table-column label="发布时间">
        <template slot-scope="scope">
          {{ scope.row.register_time | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="medium " @click="handleEdit(scope.row['_id'])"
            >详情</el-button
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const res = await this.$http({
        method: "GET",
        url: "/rest/posts",
        params: {
          populate: {
            path: "user"
          }
        }
      });
      this.list = res.data;
    },
    async handleEdit(id) {
      this.$router.push(`${id}`);
    },
    async handleDelete(item) {
      this.$confirm(`是否删除此帖子`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(async () => {
          await this.$http.delete(`/rest/posts/${item["_id"]}`);
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
