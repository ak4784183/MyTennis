<template>
  <div>
    <el-table :data="userList" stripe>
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="tel" label="手机号"> </el-table-column>
      <el-table-column label="注册时间">
        <template slot-scope="scope">
          {{ scope.row.register_time | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="medium " @click="handleEdit(scope.row['_id'])"
            >资料</el-button
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
      userList: []
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("/rest/users");
      this.userList = res.data;
      console.log(res.data);
    },
    async handleEdit(id) {
      this.$router.push(`data/${id}`);
    }
  }
};
</script>
