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
      const res = await this.$http.get("/rest/temps");
      this.list = res.data;
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
