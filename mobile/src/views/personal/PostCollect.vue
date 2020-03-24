<template>
  <div class="postCollect-page">
    <MyHeader title="帖子收藏"></MyHeader>
    <div class="main">
      <MyLoadMore
        v-if="posts.length > 0"
        @loadMore="loadMore(option, fecthPost, posts, 0, 1)"
        :loading="option.loading"
        :noMore="option.noMore"
      >
        <li class="px-3 pt-3" v-for="(item, index) in posts" :key="index">
          <div
            class="postItem bb"
            v-if="item.post"
            @click="routeByName('postDetail', item.post['_id'])"
          >
            <div class="h40 d-flex jc-start" v-if="item.post.user">
              <img
                :src="
                  item.post.user.avatar ? item.post.user.avatar : defaultHeader
                "
                class="w40 h40 mr-2 b-radius-50"
              />
              <div
                class="flex-1 bg-white d-flex flex-coloum jc-center ai-start"
              >
                <span class="fs-l flex-1"> {{ item.post.user.nickname }}</span>
                <span class="text-grey fs-m  h-50">
                  {{ item.post.createdAt | timeAgo }}</span
                >
              </div>
              <i
                class="iconfont icon-gengduo_huaban fw"
                @click.stop="openActionSheet(item['_id'])"
              ></i>
            </div>
            <div class="content mt-2">
              <p class="text fs-l" v-html="item.post.content"></p>
            </div>
            <div class="d-flex jc-start ai-center py-2">
              <div class="mr-4 d-flex ai-center">
                <i class="iconfont icon-pinglun mr-1 fs-xxl"></i>
                <span class="fs-m">{{ item.post.counts.length }} </span>
              </div>
              <div class="fs-m d-flex ai-center">
                <i class="iconfont icon-dianzan mr-1 fs-xl"></i>
                <span class="fs-m">{{ item.post.fabulous.length }} </span>
              </div>

              <div class="flex-1 text-right">
                <span class="fs-m text-dark"
                  >收藏于 {{ item.createdAt | formatDay }}</span
                >
              </div>
            </div>
          </div>
          <invalid-item
            :model="item"
            title="帖子"
            v-else
            @removeMethod="openActionSheet(item['_id'])"
          ></invalid-item>
        </li>
      </MyLoadMore>
      <MyBlankPage v-else></MyBlankPage>
      <mt-actionsheet :actions="options" v-model="removeState">
      </mt-actionsheet>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: {}
  },
  data() {
    return {
      options: [
        {
          name: "移除收藏",
          method: this.removeCommend
        }
      ],
      removeState: false,
      removeTarget: "",
      posts: [],
      option: {
        limit: 20,
        page: 0,
        loading: false,
        noMore: false
      }
    };
  },
  async created() {
    this.init();
  },
  methods: {
    async init() {
      this.posts = await this.fecthPost();
    },
    async fecthPost() {
      const res = await this.fetch("rest/post_collection", {
        limit: this.option.limit,
        page: this.option.page,
        populate: {
          path: "post",
          populate: {
            path: "counts replys fabulous user",
            select: "nickname avatar"
          }
        },
        where: {
          post: { $ne: null },
          user: this.id
        }
      });

      return res;
      // return res.filter(v => v.post != null);
    },
    childs(commends, replys) {
      return Number(commends + replys);
    },
    async loadMore() {
      if (this.noMore) {
        return;
      }
      this.page += 1;
      this.loading = true;
      const temp = await this.fecthPost();

      setTimeout(() => {
        let len = temp.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            this.posts.push(temp[i]);
          }
          this.loading = false;
        } else {
          this.loading = false;
          this.noMore = true;
        }
      }, 1500);
    },
    openActionSheet(id) {
      this.removeTarget = id;
      this.removeState = true;
    },
    async removeCommend() {
      if (this.removeTarget) {
        const res = await this.$http.delete(
          `rest/post_collection/${this.removeTarget}`
        );
        if (res) {
          this.AlertSuccess(res.data.message);
          this.init();
        }
      }
    }
  }
};
</script>
<style lang="scss">
.postCollect-page {
  height: 100vh;
  .main {
    overflow: scroll;
    height: calc(100% - 2.5rem); //减去标题栏的高度
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
}
</style>
