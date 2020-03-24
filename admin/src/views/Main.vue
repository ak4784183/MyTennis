<template>
  <div class="main">
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu router unique-opened :default-active="$route.path">
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-menu"></i>内容管理</template
            >
            <el-menu-item-group>
              <template slot="title">文章分类</template>
              <el-menu-item index="/category/list">分类列表</el-menu-item>
              <el-menu-item index="/category/create">新建分类</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">文章管理</template>
              <el-menu-item index="/article/list">文章列表</el-menu-item>
              <el-menu-item index="/article/create">新建文章</el-menu-item>
              <el-menu-item index="/article/commend/list"
                >文章评论</el-menu-item
              >
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">球员管理</template>
              <el-menu-item index="/player/list">球员列表</el-menu-item>
              <el-menu-item index="/player/create">新建球员</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">赛事管理</template>
              <el-menu-item index="/match/list">赛事列表</el-menu-item>
              <el-menu-item index="/match/create">新建赛事</el-menu-item>
              <el-menu-item index="/contest/list">比赛列表</el-menu-item>
              <el-menu-item index="/contest/create">添加比赛</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">视频管理</template>
              <el-menu-item index="/video/list">视频列表</el-menu-item>
              <el-menu-item index="/video/create">新建视频</el-menu-item>
              <el-menu-item index="/video/commend/list">视频评论</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">广告管理</template>
              <el-menu-item index="/ads/list">广告列表</el-menu-item>
              <el-menu-item index="/ads/create">新建广告</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"
              ><i class="el-icon-document-copy"></i>装备管理</template
            >

            <el-menu-item-group>
              <template slot="title">装备分类</template>
              <el-menu-item index="/equipType/list">装备分类列表</el-menu-item>
              <el-menu-item index="/equipType/create"
                >新建装备分类</el-menu-item
              >
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">装备详情</template>
              <el-menu-item index="/product/list">装备详情列表</el-menu-item>
              <el-menu-item index="/product/create">新建装备详情</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"
              ><i class="el-icon-chat-dot-round"></i>论坛管理</template
            >

            <el-menu-item-group>
              <template slot="title">帖子列表</template>
              <el-menu-item index="/post/list">主贴列表</el-menu-item>
              <!-- <el-menu-item index="/admin/create">添加管理员</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"
              ><i class="el-icon-user-solid"></i>用户管理</template
            >

            <el-menu-item-group>
              <template slot="title">管理员</template>
              <el-menu-item index="/admin/list">管理员列表</el-menu-item>
              <el-menu-item index="/admin/create">添加管理员</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">普通用户</template>
              <el-menu-item index="/user/list">用户列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"
              ><i class="el-icon-stopwatch"></i>数据管理</template
            >
            <el-menu-item-group>
              <template slot="title">临时数据管理</template>
              <el-menu-item index="/temp/list">临时数据列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <span>{{ username }}</span>
          <el-button type="danger" plain size="small" @click="loginOut"
            ><i class="el-icon-switch-button"></i> 注销</el-button
          >
        </el-header>
        <el-main> <router-view :key="$route.path"></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      username: state => state.user.username
    })
  },
  methods: {
    loginOut() {
      this.$confirm("是否退出登录状态？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          window.localStorage.removeItem("token");
          this.$router.push({
            name: "login"
          });
          this.$message({
            type: "success",
            message: "退出成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    }
  }
};
</script>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
