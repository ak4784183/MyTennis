<template>
  <div class="postDetail-page">
    <MyHeader title="帖子详情"></MyHeader>
    <div class="main bg-grey-1">
      <div
        class="postItem pt-3 bg-white bb px-2"
        @click="routeByName('postEdit', model['_id'])"
      >
        <div class="h40 d-flex jc-start" v-if="model.user">
          <img
            :src="model.user.avatar ? model.user.avatar : defaultHeader"
            class="w40 h40 mr-2 b-radius-50"
          />
          <div class="flex-1 bg-white d-flex flex-coloum jc-center ai-start">
            <span class="fs-l flex-1">{{ model.user.nickname }} </span>
            <span class="text-grey fs-m  h-50">{{
              model.createdAt | formatDay
            }}</span>
          </div>
          <!-- <div class="fs-m d-flex flex-coloum ai-center jc-start">
                <i class="iconfont icon-dianzan text-dark-6 fs-xxl"></i>
                <span class="fs-m text-center">105</span>
              </div> -->
        </div>
        <div class="content my-2">
          <p class="text fs-l" v-html="model.content"></p>
        </div>
        <div class="pb-1" v-if="model.fabulous && model.fabulous.length > 0">
          <p class="fs-m">
            <span class="text-blue"> {{ model.fabulous.length }}</span
            >人赞过
          </p>
        </div>
      </div>
      <div class="goods-wrap w-100 mb-1 px-2 py-3 bb bg-white">
        <div
          class="goods jc-start ai-center"
          v-show="model.fabulous && model.fabulous.length > 0"
        >
          <div
            class="items w40 h40 mr-2"
            v-for="item in avatarList"
            :key="item['_id']"
          >
            <img
              v-if="item.user"
              :src="item.user.avatar ? item.user.avatar : defaultHeader"
              class="w-100 h-100 mr-3 b-radius-50"
            />
            <i class="logo iconfont icon-dianzan text-tomato fs-xxl"></i>
          </div>
          <span class="fs-lxx">···</span>
        </div>
      </div>

      <div class="bg-white h40 d-flex jc-between ai-center px-2">
        <div class="flex-1">
          <span
            class="mr-4 letter-s1"
            :class="active === 0 ? 'fs-l text-black fw' : 'fs-m text-dark'"
            @click="active = 0"
            >全部回复</span
          >
          <span
            class=" letter-s1"
            :class="active === 1 ? 'fs-l text-black fw' : 'fs-m text-dark'"
            @click="active = 1"
            >只看楼主</span
          >
        </div>
        <div @click="showSortBtn = true">
          <span class="fs-m text-dark letter-s1">{{ sortName }}</span>
          <i class="iconfont icon-xiala fs-s ml-1"></i>
        </div>
      </div>
      <swiper
        :options="{ autoHeight: true }"
        ref="postSwiper"
        class="bg-white"
        @slide-change="
          () => {
            active = $refs.postSwiper.swiper.realIndex;
          }
        "
      >
        <swiper-slide key="0">
          <MyLoadMore
            v-if="commends.length > 0"
            @loadMore="loadMore"
            :noMore="noMore"
            :loading="loading"
          >
            <li v-for="(item, index) in commends" :key="index">
              <div class="postItem pt-3 bg-white px-2">
                <div class="h40 d-flex jc-start" v-if="item.user">
                  <img
                    :src="item.user.avatar ? item.user.avatar : defaultHeader"
                    class="w40 h40 mr-2 b-radius-50"
                  />
                  <div
                    class="flex-1 bg-white d-flex flex-coloum jc-center ai-start"
                  >
                    <span class="fs-l flex-1">{{ item.user.nickname }} </span>
                    <p class="text-grey fs-m  h-50">
                      <span class="letter-s1">{{
                        "第" + (item.layer + 1) + "楼"
                      }}</span>
                      ·
                      <span>{{ item.createdAt | formatMD }}</span>
                    </p>
                  </div>
                  <div class="fs-m d-flex w50 ai-start jc-start text-grey mr-3">
                    <i
                      :class="item.fabulous | IsFabulous"
                      @click="thumbsUp(item['_id'], index)"
                      class="iconfont icon-dianzan1 fs-xxl "
                    ></i>
                    <span
                      :class="item.fabulous | IsFabulous"
                      class="flex-1 fs-m text-center"
                      >{{
                        item.fabulous.length === 0 ? "赞" : item.fabulous.length
                      }}</span
                    >
                  </div>
                </div>
                <div class="content mt-2 px-6">
                  <p class="text fs-l " v-html="item.content"></p>
                  <span
                    v-if="item.childs"
                    v-show="item.childs.length > 0"
                    class="fs-m text-dark-6 letter-s1 d-flex ai-center"
                    @click="openPopCommend(item['_id'])"
                    >查看{{ item.childs.length }}条回复
                    <i class="iconfont icon-xiangyou fs-s fw"></i>
                  </span>

                  <span
                    v-show="item.childs.length === 0"
                    class="fs-m text-dark-6 letter-s1 "
                    @click="openPopCommend(item['_id'])"
                    >回复</span
                  >
                </div>
              </div>
            </li>
          </MyLoadMore>
          <MyBlankPage v-else></MyBlankPage>
        </swiper-slide>
        <swiper-slide key="1">
          <MyLoadMore
            v-if="commends.length > 0"
            @loadMore="loadMore"
            :noMore="noMore"
            :loading="loading"
          >
            <li v-for="(item, index) in commends" :key="item['_id']">
              <div class="postItem pt-3 bg-white px-2">
                <div class="h40 d-flex jc-start" v-if="item.user">
                  <img
                    :src="item.user.avatar ? item.user.avatar : defaultHeader"
                    class="w40 h40 mr-2 b-radius-50"
                  />
                  <div
                    class="flex-1 bg-white d-flex flex-coloum jc-center ai-start"
                  >
                    <span class="fs-l flex-1">{{ item.user.nickname }} </span>
                    <p class="text-grey fs-m  h-50">
                      <span class="letter-s1">{{
                        "第" + (item.layer + 1) + "楼"
                      }}</span>
                      ·
                      <span>{{ item.createdAt | formatMD }}</span>
                    </p>
                  </div>
                  <div class="fs-m d-flex w50 ai-start jc-start text-grey mr-3">
                    <i
                      :class="item.fabulous | IsFabulous"
                      @click="thumbsUp(item['_id'], index)"
                      class="iconfont icon-dianzan1 fs-xxl "
                    ></i>
                    <span
                      :class="item.fabulous | IsFabulous"
                      class="flex-1 fs-m text-center"
                      >{{
                        item.fabulous.length === 0 ? "赞" : item.fabulous.length
                      }}</span
                    >
                  </div>
                </div>
                <div class="content mt-2 px-6">
                  <p class="text fs-l " v-html="item.content"></p>
                  <span
                    v-if="item.childs"
                    v-show="item.childs.length > 0"
                    class="fs-m text-dark-6 letter-s1 "
                    @click="openPopCommend(item['_id'])"
                    >查看{{ item.childs.length }}条回复</span
                  >
                  <span
                    v-show="item.childs.length === 0"
                    class="fs-m text-dark-6 letter-s1 "
                    @click="openPopCommend(item['_id'])"
                    >回复</span
                  >
                </div>
              </div>
            </li>
          </MyLoadMore>
          <MyBlankPage v-else></MyBlankPage>
        </swiper-slide>
      </swiper>
    </div>
    <mt-actionsheet :actions="sortList" v-model="showSortBtn"> </mt-actionsheet>
    <div class="util px-2 d-flex ai-center">
      <div
        class="w-60 h-70 bg-grey-1 letter-s1 b-radius10"
        @click="routeByName('postEdit', model['_id'])"
      >
        <span class="ml-2 fs-m text-dark-6">我也来说几句...</span>
      </div>
      <div class="flex-1 pl-3 d-flex ai-center jc-between">
        <span class="fs-s d-flex "
          ><i class="iconfont icon-pinglun fs-lx text-dark"></i
          >{{ commends.length }}
        </span>
        <span @click="thumbsUp(model['_id'])"
          ><i
            class="iconfont icon-dianzan1 fs-xxl"
            :class="model.fabulous | IsFabulous"
          ></i
        ></span>
        <span @click="collectPost">
          <i
            class="iconfont icon-shoucang fs-lx text-orange"
            :class="isCollect.length > 0 ? 'text-orange' : 'text-dark'"
          ></i>
        </span>
      </div>
    </div>
    <PopCommend @thumbsUp="thumbsUp" :postId="this.id"></PopCommend>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import PopCommend from "../../components/PopCommend";
export default {
  props: {
    id: {}
  },
  components: {
    PopCommend
  },
  computed: {
    ...mapGetters(["getUserId"]),
    sortName() {
      if (this.sort == 0) {
        return "热门";
      } else if (this.sort == 1) {
        return "正序";
      } else {
        return "倒序";
      }
    }
  },
  watch: {
    async active() {
      this.IndicatorOpen();
      this.commends.length = 0;
      await this.init();
      this.IndicatorClose();
      this.$refs.postSwiper.swiper.slideTo(this.active);
    },
    async sort() {
      this.init();
    }
  },
  data() {
    return {
      commends: [],
      selectCommend: {},
      model: {},
      isCollect: [],
      avatarList: [],
      limit: 20,
      page: 0,
      loading: false,
      noMore: false,
      active: 0,
      showSortBtn: false,
      sortList: [
        //方法无法传参，必须是不同的方法
        {
          name: "热门",
          method: this.sortHot
        },
        {
          name: "正序",
          method: this.sortUp
        },
        {
          name: "倒序",
          method: this.sortDown
        }
      ],
      sort: -1
    };
  },
  async created() {
    await this.init();
    await this.fetchCollectMessage();
  },
  methods: {
    // 初始化
    async init() {
      this.page = 0;
      await this.fetchPost();
      this.commends = await this.fetchPosts();
      await this.fetchFabulousAvatar();
      this.loading = false;
      this.noMore = false;
    },
    // 获取主贴信息
    async fetchPost() {
      const options = {
        populate: JSON.stringify({
          path: "user fabulous"
        })
      };
      this.model = await this.fetch(`rest/posts/${this.id}`, options);
    },
    // 获取帖子回复
    async fetchPosts() {
      //排序
      const sort = this.sort;
      const options = {
        page: this.page,
        limit: this.limit,
        where: {
          parent: this.model["_id"],
          to: null
        },
        populate: {
          path: "user childs fabulous"
        },
        sort: { _id: sort }
      };
      if (this.active === 1) {
        //切换全部回复和只看楼主
        options.where.user = this.model.user["_id"];
      }

      return await this.fetch("rest/posts", options);
    },
    async fetchFabulousAvatar() {
      this.avatarList = await this.fetch("rest/post_fabulou", {
        where: {
          from: this.model["_id"]
        },
        limit: 7,
        page: 0,
        populate: JSON.stringify({
          path: "user",
          select: "avatar"
        })
      });
    },
    // 获取帖子收藏信息
    async fetchCollectMessage() {
      if (this.model["_id"] && this.getUserId) {
        this.isCollect = await this.fetch("/rest/post_collection", {
          where: {
            post: this.model["_id"],
            user: this.getUserId
          }
        });
      }
    },
    async loadMore() {
      if (this.noMore) {
        return;
      }
      this.page += 1;
      this.loading = true;
      const temp = await this.fetchPosts();

      setTimeout(() => {
        let len = temp.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            this.commends.push(temp[i]);
          }
          this.loading = false;
        } else {
          this.loading = false;
          this.noMore = true;
        }
      }, 1500);
    },
    // 收藏
    async collectPost() {
      if (this.model && this.getUserId) {
        const res = await this.post("rest/post_collection/collect", {
          post: this.model["_id"],
          user: this.getUserId
        });
        this.AlertSuccess(res.message);
        this.fetchCollectMessage();
      }
    },
    // 点赞
    async thumbsUp(id, index) {
      if (id && typeof index === "number") {
        await this.setFabulous(id, "post_fabulou");
        let temp = await this.fetch(`rest/post/${id}`, {
          populate: {
            path: "from fabulous"
          }
        });
        this.$set(this.commends[index], "fabulous", temp.fabulous);
      } else {
        await this.setFabulous(id, "post_fabulou");
        await this.fetchPost();
        await this.fetchFabulousAvatar();
      }
    },
    async openPopCommend(id) {
      if (id) {
        this.$store.state.post.select_commend_id = id;
        this.$store.state.post["commend_drawer_state"] = true;
      }
    },
    sortUp() {
      this.sort = 1;
    },
    sortDown() {
      this.sort = -1;
    },
    sortHot() {
      this.sort = 1;
    }
  }
};
</script>
<style lang="scss">
.postDetail-page {
  height: 100vh;
  .main {
    z-index: 0;
    overflow: scroll;
    margin-top: 0.3rem;
    margin-bottom: 0.1rem;
    max-height: calc(100% - 5.4rem);
    .goods-wrap {
      overflow-x: hidden;
      .goods {
        display: -webkit-box;
        text-overflow: ellipsis;
        white-space: nowrap;
        .items {
          position: relative;
          img {
            z-index: 10;
          }
          .logo {
            position: absolute;
            bottom: -0.4rem;
            z-index: 20;
            right: -0.3rem;
          }
        }
      }
    }
    .postItem {
      .content {
        .text {
          p {
            font-size: 0.9rem;
            img {
              width: 100%;
              height: auto;
            }
          }
        }
      }
    }
  }
  .util {
    width: 100vw;
    position: fixed;
    bottom: 0;
    height: 2.5rem;
    box-shadow: 0 -1px 3px -1px rgb(212, 212, 212);
  }
}
</style>
