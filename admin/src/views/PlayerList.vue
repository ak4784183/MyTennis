<template>
  <div>
    <el-table :data="cateList" stripe>
      <el-table-column prop="cname" label="球员名称"> </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <div>
            <img :src="scope.row['avatar']" width="100" height="100" />
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: []
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("/rest/players");
      this.cateList = res.data;
    },
    async handleEdit(id) {
      this.$router.push(`edit/${id}`);
    },
    async handleDelete(item) {
      this.$confirm(`是否删除《${item.cname}》`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(async () => {
          await this.$http.delete(`/rest/players/${item["_id"]}`);
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
