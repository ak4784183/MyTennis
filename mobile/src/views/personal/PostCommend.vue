<template>
  <div class="postCommend-page">
    <SwiperHeader
      title="帖子管理"
      :itemList="btns"
      :swiperIndex="active"
      @swiperClick="navbarClick"
    ></SwiperHeader>
    <div class="main">
      <swiper
        :options="{ autoHeight: true }"
        ref="PostCommendSwiper"
        class="bg-white"
        @slide-change="
          () => {
            active = $refs.PostCommendSwiper.swiper.realIndex;
          }
        "
      >
        <swiper-slide key="0">
          <MyLoadMore
            v-if="posts.length > 0"
            @loadMore="loadMore(swiper1, fetchPosts, posts, active, 0)"
            :loading="swiper1.loading"
            :noMore="swiper1.noMore"
          >
            <li
              class="px-3 pt-3"
              v-for="(item, index) in posts"
              :key="index"
              @click="routeByName('postDetail', item['_id'])"
            >
              <div class="postItem bb">
                <div class="h50 d-flex jc-start" v-if="item.user">
                  <img
                    :src="item.user.avatar ? item.user.avatar : defaultHeader"
                    class="w40 h40 mr-2 b-radius-50"
                  />
                  <div
                    class="flex-1 bg-white d-flex flex-coloum jc-center ai-start"
                  >
                    <span class="fs-l flex-1"> {{ item.user.nickname }}</span>
                    <span class="text-grey fs-m  h-50">
                      {{ item.createdAt | timeAgo }}</span
                    >
                  </div>
                  <i
                    class="iconfont icon-gengduo_huaban fw"
                    @click.stop="openActionSheet(item['_id'])"
                  ></i>
                </div>
                <div class="content mt-2 mb-2">
                  <p class="text fs-l" v-html="item.content"></p>
                </div>
              </div>
            </li>
          </MyLoadMore>
          <MyBlankPage v-else></MyBlankPage>
        </swiper-slide>
        <swiper-slide key="1">
          <MyLoadMore
            v-if="commends.length > -0"
            @loadMore="loadMore(swiper2, fetchCommend, commends, active, 1)"
            :loading="swiper2.loading"
            :noMore="swiper2.noMore"
          >
            <li
              class="px-3 pt-3"
              v-for="(item, index) in commends"
              :key="index"
              @click="
                item.parent ? routeByName('postDetail', item.parent['_id']) : ''
              "
            >
              <div class="postItem bb" v-if="item.parent">
                <div class="h50 d-flex jc-start" v-if="item.user">
                  <img
                    :src="item.user.avatar ? item.user.avatar : defaultHeader"
                    class="w40 h40 mr-2 b-radius-50"
                  />
                  <div
                    class="flex-1 bg-white d-flex flex-coloum jc-center ai-start"
                  >
                    <span class="fs-l flex-1"> {{ item.user.nickname }}</span>
                    <span class="text-grey fs-m  h-50">
                      {{ item.createdAt | timeAgo }}</span
                    >
                  </div>
                  <i
                    class="iconfont icon-gengduo_huaban fw"
                    @click.stop="openActionSheet(item['_id'])"
                  ></i>
                </div>
                <div class="content mt-2 mb-2">
                  <p class="text fs-l" v-html="item.content"></p>
                </div>
              </div>
              <invalid-item
                title="主帖已不存在"
                v-else
                @removeMethod="openActionSheet(item['_id'])"
              ></invalid-item>
            </li>
          </MyLoadMore>
          <MyBlankPage v-else></MyBlankPage>
        </swiper-slide>
        <swiper-slide key="2"
          ><MyLoadMore
            v-if="replys.length > 0"
            @loadMore="loadMore(swiper3, fetchReply, replys, active, 2)"
            :loading="swiper3.loading"
            :noMore="swiper3.noMore"
          >
            <li
              class="px-3 pt-3"
              v-for="(item, index) in replys"
              :key="index"
              @click="
                item.parent ? routeByName('postDetail', item.parent['_id']) : ''
              "
            >
              <div class="postItem bb" v-if="item.parent">
                <div class="h50 d-flex jc-start" v-if="item.user">
                  <img
                    :src="item.user.avatar ? item.user.avatar : defaultHeader"
                    class="w40 h40 mr-2 b-radius-50"
                  />
                  <div
                    class="flex-1 bg-white d-flex flex-coloum jc-center ai-start"
                  >
                    <span class="fs-l flex-1"> {{ item.user.nickname }}</span>
                    <span class="text-grey fs-m  h-50">
                      {{ item.createdAt | timeAgo }}</span
                    >
                  </div>
                </div>
                <div class="content mt-2 mb-2">
                  <p class="text fs-l" v-html="item.content"></p>
                </div>
              </div>
              <invalid-item
                title="主帖已不存在"
                v-else
                @removeMethod="openActionSheet(item['_id'])"
              ></invalid-item>
            </li>
          </MyLoadMore>
          <MyBlankPage v-else></MyBlankPage
        ></swiper-slide>
      </swiper>
      <mt-actionsheet :actions="options" v-model="removeState">
      </mt-actionsheet>
    </div>
  </div>
</template>
<script>
import SwiperHeader from "../../components/SwiperHeader";
export default {
  props: {
    id: {}
  },
  components: {
    SwiperHeader
  },
  watch: {
    active() {
      this.$refs.PostCommendSwiper.swiper.slideTo(this.active);
    }
  },
  data() {
    return {
      btns: ["主贴", "回复", "@我"],
      active: 0,
      posts: [],
      commends: [],
      replys: [],
      options: [
        {
          name: "删除帖子",
          method: this.removePost
        }
      ],
      swiper1: {
        limit: 5,
        page: 0,
        loading: false,
        noMore: false
      },
      swiper2: {
        limit: 5,
        page: 0,
        loading: false,
        noMore: false
      },
      swiper3: {
        limit: 5,
        page: 0,
        loading: false,
        noMore: false
      },
      removeid: "",
      removeState: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.posts = await this.fetchPosts();
      this.commends = await this.fetchCommend();
      this.replys = await this.fetchReply();
    },
    async fetchPosts() {
      return await this.fetch("/rest/posts", {
        limit: this.swiper1.limit,
        page: this.swiper1.page,
        where: {
          user: this.id,
          parent: null
        },
        populate: {
          path: "user"
        },
        sort: {
          _id: -1
        }
      });
    },
    async fetchCommend() {
      return await this.fetch("rest/posts", {
        limit: this.swiper2.limit,
        page: this.swiper2.page,
        where: {
          user: this.id,
          parent: { $ne: null }
        },
        populate: {
          path: "user parent"
        },
        sort: {
          _id: -1
        }
      });
    },
    async fetchReply() {
      return await this.fetch("rest/posts", {
        limit: this.swiper3.limit,
        page: this.swiper3.page,
        where: {
          reply: this.id
        },
        populate: {
          path: "user parent"
        },
        sort: {
          _id: -1
        }
      });
    },
    openActionSheet(id) {
      this.removeState = true;
      this.removeid = id;
    },
    async removePost() {
      if (this.removeid) {
        const res = await this.$http.delete(`rest/posts/${this.removeid}`);
        if (res) {
          await this.$http.delete(
            `rest/post_fabulou/remove_fabulou/${this.removeid}`
          );
          this.AlertSuccess("移除成功");
          setTimeout(() => {
            this.init();
          }, 1000);
        }
      }
    },
    navbarClick(index) {
      this.active = index;
    }
  }
};
</script>
<style lang="scss">
.postCommend-page {
  min-height: 100vh;
  .postItem {
    .content {
      .text {
        max-height: 12rem;
        line-height: 1.5rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        p {
          display: flex;
          flex-direction: column;
          img {
            width: 100%;
            height: auto;
          }
        }
      }
    }
  }
}
</style>
