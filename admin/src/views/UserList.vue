<template>
  <div>
    <el-row>
      <el-input
        placeholder="输入用户名搜索"
        v-model="query"
        class="search-input"
        style="width:23rem;margin-right:1rem;"
      >
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="fetch"
        >搜索</el-button
      >
    </el-row>
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
    return { query: "", page: 0, limit: 10, total: 0, userList: [] };
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
        methods: "GET",
        url: "/rest/users",
        params: {
          match: {
            key: "nickname",
            val: this.query
          },
          limit: this.limit,
          page: this.page
        }
      });
      this.userList = res.data;

      const _total = await this.$http({
        methods: "GET",
        url: "/rest/users/count/page",
        params: {
          match: {
            key: "nickname",
            val: this.query
          }
        }
      });
      this.total = _total.data;
    },
    async handleEdit(id) {
      this.$router.push(`data/${id}`);
    }
  }
};
</script>
