<template>
  <div
    class="articleDetail-page vw100 d-flex flex-coloum jc-start"
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10"
    infinite-scroll-immediate-check="true"
  >
    <SwiperHeader
      v-if="article.category"
      :title="article.category.title"
      :itemList="[
        '正文',
        `评论${article.commends.length ? article.commends.length : ''}`
      ]"
      :swiperIndex="active"
      @swiperClick="index => (active = index)"
    >
      <i
        class="iconfont icon-star fs-xxl"
        @click="articleCollet"
        :class="collections.length > 0 ? 'text-orange' : 'text-white'"
      ></i>
    </SwiperHeader>
    <!-- <div class="header-wrap w-100 h100 bg-dark text-white d-flex flex-coloum">
      <div class="flex-1 d-flex jc-between ai-center px-2 pt-2">
        <i class="iconfont icon-fanhui fs-xxl" @click="$router.back()"></i>
        <span class="fs-xl letter-s1 fw" v-if="article.category">{{
          article.category.title
        }}</span>
        <i
          class="iconfont icon-star fs-xxl"
          @click="articleCollet"
          :class="collections.length > 0 ? 'text-orange' : 'text-white'"
        ></i>
      </div>
      <div class="navbar w-100 h50 d-flex fs-l px-5 letter-s1">
        <div class="flex-1 d-flex jc-around ai-center" @click="active = 0">
          <span
            class="child"
            :class="active === 0 ? 'fw text-white' : 'text-grey'"
          >
            正文
          </span>
        </div>
        <div class="flex-1 d-flex jc-around ai-center" @click="active = 1">
          <span
            class="child"
            :class="active === 1 ? 'active-white' : ''"
            v-if="article.commends"
          >
            评论({{ article.commends.length }})
          </span>
        </div>
      </div>
    </div> -->
    <div class="articleDetail-main flex-1" v-if="article.content">
      <swiper
        :options="{ autoHeight: true }"
        ref="articleDetailSwiper"
        class="w-100"
        @slide-change="active = $refs.articleDetailSwiper.swiper.realIndex"
      >
        <!-- slides -->
        <swiper-slide>
          <div class="w-100 p-2 article-text flex-1">
            <p class="fs-xxl fw">
              {{ article.title }}
            </p>
            <div class="text-dark-6 fs-m mt-2 ">
              <span class="mr-3"> 作者：{{ article.author }} </span>
              <span class="mr-3"
                >时间：{{ article.createdAt | formatDay }}</span
              >
              <span>阅读量：{{ article.reads }}</span>
            </div>
            <div
              v-html="article.content"
              class="w-100 mt-5"
              style="overflow:hidden;"
            ></div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <ul
            class="articleDetail-commends w-100 d-flex flex-coloum jc-start"
            v-if="commends.length > 0"
          >
            <li
              class="item bg-white w-100 d-flex flex-coloum jc-start p-3 bb"
              v-for="(item, index) in commends"
              :key="index"
              @click="routeByName('ArtcleCommend', item['_id'])"
            >
              <div class="item-heade d-flex ai-center">
                <img
                  :src="item.from.avatar ? item.from.avatar : defaultHeader"
                  class="w40 h40 b-radius-50"
                />
                <div class="flex-1 flex-coloum jc-start ai-start px-3">
                  <p class="fs-l text-black">
                    {{ item.from.nickname }}
                  </p>
                  <span class="fs-m text-dark-6">
                    {{ item.createdAt | timeAgo }}
                  </span>
                </div>
                <div
                  class="d-flex flex-coloum jc-start"
                  v-if="item.fabulous"
                  :class="item.fabulous | IsFabulous"
                  @click.stop="thumbsUp(item['_id'], index)"
                >
                  <div>
                    <i class="iconfont icon-dianzan fs-xxl"></i>
                  </div>
                  <span class="fs-m text-center" v-if="item.fabulous">{{
                    item.fabulous.length > 0 ? item.fabulous.length : "赞"
                  }}</span>
                </div>
              </div>
              <div class="item-body mt-2">
                <p class="fs-l ">
                  {{ item.content }}
                </p>
              </div>
              <div
                class="item-more bg-grey-1 p-2 mt-1 text-dark"
                v-if="item.childs.length > 0"
              >
                <p
                  class="fs-m"
                  v-for="child in item.childs.slice(0, 2)"
                  :key="child['_id']"
                >
                  <span class="text-dark-6" v-if="child.from"
                    >{{ child.from.nickname
                    }}{{
                      child.reply ? " 回复 " + child.reply.nickname : ""
                    }}
                    ：</span
                  >
                  {{ child.content }}
                </p>
                <p
                  v-if="item.childs.length > 1"
                  class="fs-m letter-s1 text-dark-6"
                >
                  查看全部{{ item.childs.length }}条回复
                </p>
              </div>
            </li>
          </ul>
          <div v-else>
            暂无评论
          </div>
          <div
            class="loading-box d-flex jc-center ai-center py-3"
            v-if="loading"
          >
            <mt-spinner type="snake" class="mr-3"></mt-spinner>
            <span class="text-dark fw">加载中...</span>
          </div>
          <div class="no-more d-flex jc-center ai-center py-3" v-if="noMore">
            <span class="text-dark fw">没有更多了~</span>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <ArticleReply
      placeholder="评论一下"
      v-show="active === 0"
      @submit="submitCommend"
    ></ArticleReply>
  </div>
</template>
<script>
import ArticleReply from "../../components/ArtReply.vue";
import SwiperHeader from "../../components/SwiperHeader.vue";

import { mapGetters } from "vuex";
export default {
  props: {
    id: {}
  },
  components: {
    ArticleReply,
    SwiperHeader
  },
  data() {
    return {
      active: 0, //正文和评论切换索引
      article: {},
      content: "",
      isSubmit: false, //防二次点击
      commends: [],
      limit: 5,
      page: 0,
      isMoreLoading: false,
      loading: false,
      noMore: false,
      collections: []
    };
  },
  watch: {
    active() {
      this.$refs.articleDetailSwiper.swiper.slideTo(this.active);
    }
  },
  computed: {
    isValid() {
      if (this.content === "") {
        return true;
      } else {
        return false;
      }
    },
    ...mapGetters(["getUserId"])
  },
  async created() {
    this.init();
  },
  methods: {
    async init() {
      this.page = 0;
      this.article = await this.fetch(`/articles/${this.id}`);
      this.commends = await this.fetchCommends();
      this.fetchColletions();
    },
    async fetchArticle() {
      const res = await this.fetch(`/articles/${this.id}`, {
        limit: this.limit,
        page: this.page
      });
      return res;
    },
    async fetchCommends() {
      return await this.fetch(`/articles/commends/${this.id}`, {
        limit: this.limit,
        page: this.page
      });
    },
    swiperSlide(index) {
      this.active = index;
      this.$refs.articleDetailSwiper.swiper.slideTo(index);
    },
    async submitCommend(content) {
      if (this.isSubmit) {
        return;
      } else {
        this.isSubmit = true;
        const userId = JSON.parse(localStorage.getItem("m_userInfo")).id;
        const model = {
          article: this.id,
          content: content,
          from: userId
        };
        const res = await this.post(`art_commend`, model);
        this.isSubmit = false;
        this.IndicatorOpen("正在评论");
        this.noMore = false;
        this.commends.length = 0;
        setTimeout(() => {
          this.IndicatorClose();
          this.init();
          this.AlertSuccess("评价完成");
        }, 1500);
      }
    },
    async loadMore() {
      if (this.noMore == true) {
        return;
      }
      this.loading = true;
      this.page += 1;
      const temp = await this.fetchCommends();
      setTimeout(() => {
        if (temp.length > 0) {
          for (let i = 0; i < temp.length; i++) {
            this.commends.push(temp[i]);
          }
          this.isMoreLoading = !this.isMoreLoading;
          this.loading = false;
        } else {
          this.loading = false;
          this.isMoreLoading = !this.isMoreLoading;
          this.noMore = true;
        }
      }, 1500);
    },
    async articleCollet() {
      if (this.article && this.getUserId) {
        const obj = {
          article: this.article["_id"],
          user: this.getUserId
        };
        const res = await this.post(`/art_colletion`, obj);
        this.AlertSuccess(res.message);
        this.fetchColletions();
      }
    },
    async fetchColletions() {
      if (this.article && this.getUserId) {
        const obj = {
          article: this.article["_id"],
          user: this.getUserId
        };
        this.collections = await this.fetch("/rest/art_collection/find", obj);
      }
    },
    async thumbsUp(id, index) {
      if (id && typeof index === "number") {
        await this.setFabulous(id, "art_fabulous");
        let temp = await this.fetch(`rest/art_commend/${id}`, {
          populate: {
            path: "from fabulous"
          }
        });
        this.$set(this.commends[index], "fabulous", temp.fabulous);
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/config.scss";
.articleDetail-page {
  min-height: 100vh;
  .header-wrap {
    box-shadow: 0px 3px 4px #888;
  }
  .articleDetail-main {
    overflow-y: scroll;
    .swiper-container {
      width: 100%;
      height: 100%;
      .article-text {
        p {
          font-size: 0.9rem;
          color: map-get($map: $colors, $key: "dark");
          img {
            width: 100%;
            height: auto;
          }
        }
      }
    }
  }
  .articleDetail-commends {
    .item {
      .item-more {
        max-height: map-get($map: $rem-sizes, $key: "70");
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
