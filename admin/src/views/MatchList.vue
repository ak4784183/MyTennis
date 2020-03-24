<template>
  <div>
    <!-- <el-date-picker
      v-model="duration"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    >
    </el-date-picker> -->
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      duration: [],
      list: []
    };
  },
  watch: {
    duration() {
      this.fetch();
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      // const option =
      // this.duration && this.duration.length > 0
      //   ? {
      //       where: {
      //         duration: {
      //           $gte: this.duration[0],
      //           $lt: this.duration[1]
      //         }
      //       }
      //     }
      //   : {};
      const res = await this.$http({
        method: "GET",
        url: "rest/matches"
      });
      this.list = res.data;
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
