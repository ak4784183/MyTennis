<template>
  <div class="articleType-page w-100 d-flex flex-coloum jc-start ">
    <MyHeader title="文章收藏"></MyHeader>
    <div class="main">
      <MyLoadMore
        v-if="collections.length > 0"
        @loadMore="loadMore(option, fetchArtCollections, collections, 0, 1)"
        :noMore="option.noMore"
        :loading="option.loading"
      >
        <li v-for="item in collections" :key="item['_id']">
          <div
            class="w-100  p-2 d-flex jc-between"
            style="height:8rem;"
            v-if="item.article"
            @click="routeByName('articleDetail', item.article['_id'])"
          >
            <div class="flex-1 d-flex flex-coloum jc-between bb mr-2 pb-1">
              <p class="fs-m">
                <strong class="text-tomato"
                  >[{{ item.article.category.title }}]</strong
                >
                {{ item.article.title }}
              </p>
              <div class="d-flex jc-start ai-center text-dark-6">
                <span class="fs-m d-flex ai-center mr-2">
                  <i class="iconfont icon-liaotian mr-1 fs-m"></i>
                  {{ item.article.commends.length }}
                </span>
                <span class="fs-m px-2 d-flex ai-center mr-1">
                  <i class="iconfont icon-shijian mr-1 fs-m"></i>
                  {{ item.article.createdAt | timeAgo }}
                </span>
                <span class="fs-m px-2 d-flex ai-center"
                  ><i class="iconfont icon-ai-eye mr-2 fs-x"></i
                  >{{ item.article.reads ? item.article.reads : "0" }}</span
                >
              </div>
            </div>
            <img
              :src="item.article.cover ? item.article.cover : default_img"
              class="h-90 w-40"
            />
          </div>
          <div v-else class="px-2 pt-2">
            <invalid-item
              title="周边信息已被删除，此收藏已失效"
              @removeMethod="removeActionSheet(item['_id'], remove)"
            ></invalid-item>
          </div>
        </li>
      </MyLoadMore>
      <MyBlankPage v-else></MyBlankPage>
      <mt-actionsheet :actions="options" v-model="remove.state">
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
      showCategoriesWindow: false,
      collections: [],
      option: {
        limit: 10,
        page: 0,
        loading: false,
        noMore: false
      },
      options: [
        {
          name: "移除收藏",
          method: this.removeCollect
        }
      ],
      remove: {
        state: false,
        target: null
      }
    };
  },
  async created() {
    this.init();
  },
  methods: {
    async init() {
      this.option.page = 0;
      this.collections = await this.fetchArtCollections();
    },
    async fetchArtCollections() {
      const options = {
        limit: this.limit,
        page: this.page,
        populate: JSON.stringify({
          path: "article",
          populate: {
            path: "commends category",
            select: "_id title"
          }
        })
      };
      const res = await this.fetch(
        `/rest/art_collection/collections/${this.id}`,
        options
      );
      return res;
    },

    async removeCollect() {
      if (this.remove.target) {
        const res = await this.$http.delete(
          `rest/art_collection/${this.remove.target}`
        );
        if (res) {
          this.AlertSuccess("移除成功");
          this.remove.target = null;
          setTimeout(() => {
            this.init();
          }, 1000);
        }
      }
    }
  }
};
</script>
<style lang="scss">
.articleType-page {
  height: 100vh;
  .main {
    overflow: scroll;
    height: calc(100% - 2.5rem); //减去标题栏的高度
  }
}
</style>
