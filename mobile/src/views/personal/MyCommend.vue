<template>
  <div class="myCommend-page">
    <SwiperHeader
      :swiperIndex="swiperIndex"
      title="我的评论"
      :itemList="['文章', '视频']"
      @swiperClick="swiperClick"
    ></SwiperHeader>
    <div class="main">
      <swiper
        :options="{ autoHeight: true }"
        ref="MyCommendSwiper"
        class="bg-white"
        @slide-change="
          () => {
            swiperIndex = $refs.MyCommendSwiper.swiper.realIndex;
          }
        "
      >
        <swiper-slide key="0">
          <MyLoadMore
            v-if="articleList.length > 0"
            :loading="swiper1.loading"
            :noMore="swiper1.noMore"
            @loadMore="
              loadMore(
                swiper1,
                fetchArticleCommend,
                articleList,
                swiperIndex,
                0
              )
            "
          >
            <li
              v-show="swiperIndex === 0"
              class="p-2"
              v-for="item in articleList"
              :key="item['_id']"
              @click="routeByName('articleDetail', item.article['_id'])"
            >
              <div class="bb d-flex flex-coloum" v-if="item.article">
                <div class="d-flex ai-center">
                  <img
                    :src="item.from.avatar ? item.from.avatar : defaultHeader"
                    class="w40 h40 b-radius-50"
                  />
                  <div class="w-80 d-flex flex-coloum fs-m pl-2">
                    <span>{{ item.from.nickname }}</span>
                    <span class="text-dark-6 text-over"
                      >{{ item.createdAt | timeAgo }} ·
                      {{ item.article.title }}</span
                    >
                  </div>
                  <div class="flex-1 d-flex jc-end">
                    <i
                      class="iconfont icon-gengduo_huaban fw"
                      @click.stop="openActionSheet(item['_id'])"
                    ></i>
                  </div>
                </div>
                <div class="mt-2 mb-2 pb-1 d-flex jc-start ai-center">
                  <div class="w-80 pl-6 mr-2">
                    <p class="fs-l text-dark text-over-3 lh13">
                      {{ item.content }}
                    </p>
                  </div>
                  <div class="w-20 h50">
                    <img
                      v-if="!item.to"
                      :src="
                        item.article.cover ? item.article.cover : default_img
                      "
                      class="w-100 h-100"
                    />
                    <p v-else class="text-dark fs-m  text-over-3">
                      <i class="iconfont icon-liaotian fs-m"></i>
                      {{ item.to.content }}
                    </p>
                  </div>
                </div>
              </div>
              <invalid-item
                v-else
                title="原文章已被删除，该评论已失效"
                @removeMethod="openActionSheet(item['_id'])"
              ></invalid-item>
            </li>
          </MyLoadMore>
          <MyBlankPage v-else></MyBlankPage>
        </swiper-slide>
        <swiper-slide key="1">
          <MyLoadMore
            v-if="videoList.length > 0"
            :loading="swiper2.loading"
            :noMore="swiper2.noMore"
            @loadMore="
              loadMore(swiper2, fetchVideoCommend, videoList, swiperIndex, 1)
            "
          >
            <li
              v-show="swiperIndex === 1"
              class="p-2"
              v-for="item in videoList"
              :key="item['_id']"
              @click="routeByName('videoDetail', item.parent['_id'])"
            >
              <div class="bb d-flex flex-coloum" v-if="item.parent">
                <div class="d-flex ai-center">
                  <img
                    :src="item.user.avatar ? item.user.avatar : defaultHeader"
                    class="w40 h40 b-radius-50"
                  />
                  <div class="w-80 d-flex flex-coloum fs-m pl-2">
                    <span>{{ item.user.nickname }}</span>
                    <span class="text-dark-6 text-over"
                      >{{ item.createdAt | timeAgo }} ·
                      {{ item.parent.title }}</span
                    >
                  </div>
                  <div class="flex-1 d-flex jc-end">
                    <i
                      class="iconfont icon-gengduo_huaban fw"
                      @click.stop="openActionSheet(item['_id'])"
                    ></i>
                  </div>
                </div>
                <div class="mt-2 mb-2 pb-1 d-flex jc-start ai-center">
                  <div class="w-80 pl-6 mr-2">
                    <p class="fs-l text-dark text-over-3 lh13">
                      {{ item.content }}
                    </p>
                  </div>
                  <div class="w-20 h50">
                    <img
                      v-if="!item.commend"
                      :src="item.parent.cover ? item.parent.cover : default_img"
                      class="w-100 h-100"
                    />
                    <p v-else class="text-dark fs-m  text-over-3">
                      <i class="fs-m iconfont icon-liaotian"></i>
                      {{ item.commend.content }}
                    </p>
                  </div>
                </div>
              </div>
              <invalid-item
                v-else
                title="原视频已被删除，该评论已失效"
                @removeMethod="openActionSheet(item['_id'])"
              ></invalid-item>
            </li>
          </MyLoadMore>
          <MyBlankPage v-else></MyBlankPage>
        </swiper-slide>
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
  data() {
    return {
      swiperIndex: 0,
      articleList: [],
      videoList: [],
      removeState: false,
      removeTarget: null,
      options: [
        {
          name: "删除评论",
          method: this.removeCommend
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
      }
    };
  },
  watch: {
    swiperIndex() {
      this.$refs.MyCommendSwiper.swiper.slideTo(this.swiperIndex);
    }
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.articleList = await this.fetchArticleCommend();
      this.videoList = await this.fetchVideoCommend();
    },
    async fetchArticleCommend() {
      return await this.fetch("rest/art_commend", {
        where: {
          from: this.id
        },
        populate: {
          path: "article from to"
        },
        limit: this.swiper1.limit,
        page: this.swiper1.page,
        sort: {
          _id: -1
        }
      });
    },
    async fetchVideoCommend() {
      return await this.fetch("rest/video_commend", {
        where: {
          user: this.id
        },
        limit: this.swiper2.limit,
        page: this.swiper2.page,
        populate: {
          path: "parent user commend"
        },
        sort: {
          _id: -1
        }
      });
    },
    swiperClick(index) {
      this.swiperIndex = index;
    },
    openActionSheet(id) {
      this.removeTarget = id;
      this.removeState = true;
    },
    async removeCommend() {
      if (this.removeTarget) {
        const url =
          this.swiperIndex === 0
            ? `rest/art_commend/${this.removeTarget}`
            : `rest/video_commend/${this.removeTarget}`;
        const res = await this.$http.delete(url);
        if (res) {
          await this.$http.delete(
            this.swiperIndex === 0
              ? `rest/art_fabulous/remove_fabulou/${this.removeTarget}`
              : `rest/video_fabulous/remove_fabulou/${this.removeTarget}`
          );
          this.AlertSuccess(res.data.message);
          this.init();
        }
      }
    }
  }
};
</script>
<style lang="scss">
.myCommend-page {
  min-height: 100vh;
  .lh13 {
    line-height: 1.3rem;
  }
}
</style>
