<template>
  <div>
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
      const res = await this.$http({
        method: "GET",
        url: "/rest/contests",
        params: {
          populate: {
            path: "host guest match"
          }
        }
      });
      this.cateList = res.data;
      console.log(this.cateList);
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
