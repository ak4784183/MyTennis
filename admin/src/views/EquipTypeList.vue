<template>
  <div>
    <el-row
      ><el-input
        placeholder="输入分类名称搜索"
        v-model="query"
        class="search-input"
        style="width:23rem;margin-right:1rem;"
      >
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="fetch"
        >搜索</el-button
      >
    </el-row>
    <el-table :data="dataList" stripe>
      <el-table-column prop="title" label="分类名称"></el-table-column>
      <el-table-column prop="parent.title" label="所属分类"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="medium " @click="handleEdit(scope.row['_id'])"
            >编辑</el-button
          >
          <el-button
            size="medium"
            type="danger"
            @click="handleDelete(scope.row['_id'])"
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
        @current-change="handlePageIndex"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
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
  data() {
    return {
      query: "",
      page: 0,
      limit: 10,
      total: 0,
      dataList: []
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const res = await this.$http({
        method: "GET",
        url: "/rest/equip_type",
        params: {
          match: {
            key: "title",
            val: this.query
          },
          populate: {
            path: "parent"
          },
          limit: this.limit,
          page: this.page
        }
      });
      this.dataList = res.data;

      const res2 = await this.$http({
        method: "GET",
        url: "/rest/equip_type/count/page",
        params: {
          match: {
            key: "title",
            val: this.query
          },
          populate: {
            path: "parent"
          },
          limit: this.limit,
          page: this.page
        }
      });
      this.total = res2.data;
    },
    async handleEdit(id) {
      this.$router.push(`edit/${id}`);
    },
    async handleDelete(id) {
      await this.$http.delete(`/rest/equip_type/${id}`);
      this.fetch();
    },
    handlePageIndex(val) {
      this.page = val - 1;
    }
  }
};
</script>
