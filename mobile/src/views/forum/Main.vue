<template>
  <div class="forum-page">
    <MyHeader title="论坛">
      <i class="iconfont icon-gengduo fs-xl"></i>
    </MyHeader>
    <div class="main">
      <MySearch @inputSearch="searchPost"></MySearch>
      <div
        @click="routeByName('postCreate')"
        class="postBtn bg-blue b-radius-50 w50 h50 d-flex jc-center ai-center"
      >
        <i class="iconfont icon-jianyi fs-lx text-white fw"></i>
      </div>
      <MyLoadMore
        v-if="posts.length > 0"
        @loadMore="loadMore(option, fecthPost, posts)"
        :loading="option.loading"
        :noMore="option.noMore"
      >
        <li
          class="px-3 pt-3"
          v-for="(item, index) in posts"
          :key="index"
          @click="routeByName('postDetail', item['_id'])"
        >
          <div class="postItem bb">
            <div class="h40 d-flex jc-start" v-if="item.user">
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
            <div class="content mt-2">
              <p class="text fs-l" v-html="item.content"></p>
            </div>
            <div class="d-flex jc-start ai-center py-2">
              <div class="mr-4 d-flex ai-center">
                <i class="iconfont icon-pinglun mr-1 fs-xxl"></i>
                <span class="fs-m">{{ item.counts.length }} </span>
              </div>
              <div class="fs-m d-flex ai-center">
                <i class="iconfont icon-dianzan mr-1 fs-xl"></i>
                <span class="fs-m">{{ item.fabulous.length }} </span>
              </div>
            </div>
          </div>
        </li>
      </MyLoadMore>
      <MyBlankPage v-else></MyBlankPage>
    </div>
  </div>
</template>
<script>
import MySearch from "../../components/MySearch";
import { mapGetters } from "vuex";
export default {
  components: {
    MySearch
  },
  computed: {
    ...mapGetters(["getUserId"])
  },
  data() {
    return {
      search: "",
      posts: [],
      option: {
        limit: 10,
        page: 0,
        loading: false,
        noMore: false
      }
    };
  },
  computed: {
    limit() {
      return this.option.limit;
    },
    page() {
      return this.option.page;
    }
  },
  async created() {
    this.posts = await this.fecthPost();
  },
  methods: {
    async fecthPost() {
      const res = await this.fetch("rest/posts", {
        limit: this.option.limit,
        page: this.option.page,
        where: {
          parent: null
        },
        match: {
          key: "content",
          val: this.search
        },
        populate: {
          path: "user fabulous counts replys",
          select: "avatar nickname"
        },
        sort: {
          _id: -1
        }
      });
      return res;
    },
    // async loadMore() {
    //   if (this.noMore) {
    //     return;
    //   }
    //   this.page += 1;
    //   this.loading = true;
    //   const temp = await this.fecthPost();

    //   setTimeout(() => {
    //     let len = temp.length;
    //     if (len > 0) {
    //       for (let i = 0; i < len; i++) {
    //         this.posts.push(temp[i]);
    //       }
    //       this.loading = false;
    //     } else {
    //       this.loading = false;
    //       this.noMore = true;
    //     }
    //   }, 1500);
    // },
    async searchPost(text) {
      this.search = text;
      this.posts = await this.fecthPost();
    }
  }
};
</script>
<style lang="scss">
.forum-page {
  min-height: 100%;
  .main {
    position: relative;
    .postBtn {
      //发帖按钮
      position: fixed;
      bottom: 5rem;
      right: 1rem;
      box-shadow: 1px 1px 4px #888;
    }
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
        // .imgBox {
        //   max-height: 8rem;
        //   overflow: hidden;
        //   img {
        //     max-height: 7rem;
        //     max-width: 7rem;
        //     border-radius: 3px;
        //   }
        // }
      }
    }
  }
}
</style>
