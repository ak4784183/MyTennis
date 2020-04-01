<template>
  <div>
    <el-row>
      <el-input
        placeholder="输入文章标题搜索"
        v-model="query"
        class="search-input"
        style="width:23rem;margin-right:1rem;"
      >
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="fetch"
        >搜索</el-button
      >
      <el-switch
        style="margin-left:2rem;"
        v-model="isPoster"
        active-color="#ff4949"
        inactive-color="#409EFF"
        active-text="主帖"
        inactive-text="回帖"
      >
      </el-switch>
    </el-row>
    <el-table :data="list" stripe>
      <el-table-column prop="user.nickname" label="发帖用户" width="150">
      </el-table-column>

      <el-table-column label="内容" type="String">
        <template slot-scope="scope">
          <p v-html="scope.row.content" class="showbox"></p>
        </template> </el-table-column
      ><el-table-column label="发布时间" width="160">
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
    return {
      query: "",
      page: 0,
      limit: 10,
      total: 0,
      list: [],
      isPoster: true
    };
  },
  created() {
    this.fetch();
  },
  watch: {
    isPoster() {
      this.page = 0;
      this.fetch();
    },
    query() {
      if (this.query == "") {
        this.fetch();
      }
    },
    page() {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http({
        method: "GET",
        url: "/rest/posts",
        params: {
          match: {
            key: "content",
            val: this.query
          },
          where: {
            parent:
              this.isPoster == true
                ? null
                : {
                    $ne: null
                  }
          },
          populate: {
            path: "user"
          },
          limit: this.limit,
          page: this.page
        }
      });
      this.list = res.data;
      const _total = await this.$http({
        method: "GET",
        url: "/rest/posts/count/page",
        params: {
          match: {
            key: "content",
            val: this.query
          },
          where: {
            parent:
              this.isPoster == true
                ? null
                : {
                    $ne: null
                  }
          }
        }
      });
      this.total = _total.data;
      console.log(this.total);
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
<style scoped>
.showbox {
  max-height: 200px;
}
.showbox >>> img,
p,
span {
  width: 80%;
}
</style>
