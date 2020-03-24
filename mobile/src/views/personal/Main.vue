<template>
  <div class="person-page bg-grey-1 ">
    <div class="person-header w-100 bg-dark px-3 pb-5 pt-2">
      <p class="text-white text-center letter-s1 mb-4">我的</p>
      <div class=" d-flex jc-between ai-center">
        <div
          class="person-avatar h60 d-flex ai-center jc-start"
          v-if="userInfo"
        >
          <img
            @click="routeByName('avatar')"
            :src="userInfo.avatar ? userInfo.avatar : defaultHeader"
            class="w60 h60 b-radius-50"
          />
          <div class="ml-3 h-100 d-flex flex-coloum jc-around">
            <span class="fs-l fw letter-s1 text-white">
              {{ userInfo.nickname }}</span
            >
            <span class="b-radius10 bg-l-grey text-dark fs-m text-center px-1"
              ><i class="iconfont icon-dianhua fs-m"></i
              >{{ userInfo.tel }}</span
            >
          </div>
        </div>
        <i
          @click="routeByName('info')"
          class="iconfont icon-icon-- fs-lxx text-white ml-3"
        ></i>
      </div>
    </div>
    <div class="person-main pt-3">
      <div
        class="line bg-white bb mb-2 p-2 d-flex jc-between ai-center"
        v-for="(item, index) in menus"
        :key="index"
        @click="routeByName(item.route, item.routeId ? item.routeId : '')"
      >
        <i class="iconfont fs-xxl" :class="[item.icon, item.color]"></i>
        <p class="flex-1 pl-3 fs-l">{{ item.title }}</p>
        <i class="iconfont icon-icon-arrow-right2 fs-xl"></i>
      </div>
      <div class="w-100 h40 d-flex jc-center ai-center pt-5">
        <mt-button
          size="large"
          type="danger"
          class="letter-s1 w-50"
          style="box-shadow: 1px 3px 4px #888;"
          @click="loginOut"
          >注销登录</mt-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { MessageBox } from "mint-ui";
export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    ...mapGetters(["getUserId"])
  },
  async created() {
    await this.getUserInfo();
  },
  mounted() {
    this.menus = [
      {
        icon: "icon-geren",
        title: "账户信息",
        color: "text-blue-1",
        route: "info"
      },
      {
        icon: "icon-navicon-wzgl",
        title: "文章收藏",
        color: "text-tomato",
        route: "artCollect",
        routeId: this.getUserId
      },
      {
        icon: "icon-pinglun",
        title: "我的评论",
        color: "text-purple",
        route: "myCommend",
        routeId: this.getUserId
      },
      {
        icon: "icon-shipin",
        title: "视频收藏",
        color: "text-steel",
        route: "videoCollect",
        routeId: this.getUserId
      },
      {
        icon: "icon-tiezi",
        title: "帖子收藏",
        color: "text-black",
        route: "postCollect",
        routeId: this.getUserId
      },
      {
        icon: "icon-liaotian",
        title: "帖子管理",
        color: "text-orange",
        route: "postCommend",
        routeId: this.getUserId
      },
      {
        icon: "icon-wangqiu1",
        title: "装备关注",
        color: "text-steel",
        route: "productCollect",
        routeId: this.getUserId
      },
      {
        icon: "icon-lianxi",
        title: "联系我们",
        color: "text-red",
        route: "callus"
      }
    ];
  },
  data() {
    return {
      menus: []
    };
  },
  methods: {
    loginOut() {
      MessageBox.confirm("", {
        message: "是否注销登录？",
        title: "友情提示",
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(action => {
          if (action == "confirm") {
            this.removeItem("m_userInfo"); //移除本地的用户信息
            this.removeItem("m_token"); //移除本地的移动端token
            this.routeByName("login");
          }
        })
        .catch(err => {
          if (err == "cancel") {
          }
        });
    },
    ...mapMutations(["getUserInfo", "removeItem"])
  }
};
</script>
<style lang="scss">
.person-page {
  min-height: 100vh;
  .person-header {
    box-shadow: 0px 3px 4px #888;
  }
}
</style>
