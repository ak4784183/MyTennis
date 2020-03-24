<template>
  <div class="articleType-page w-100 d-flex flex-coloum jc-start ">
    <MyHeader :title="category.title">
      <i class="iconfont icon-gengduo fs-xl" @click="selectCategory"></i>
    </MyHeader>
    <div class="main">
      <MySearch @inputSearch="searchArticles"></MySearch>
      <MyLoadMore
        v-if="list.length > 0"
        @loadMore="loadMore(option, fetchArticles, list)"
        :noMore="option.noMore"
        :loading="option.loading"
      >
        <li
          v-for="item in list"
          :key="item['_id']"
          @click="routeByName('articleDetail', item['_id'])"
        >
          <div class="w-100  p-2 d-flex jc-between" style="height:8rem;">
            <div class="flex-1 d-flex flex-coloum jc-between bb mr-2 pb-1">
              <p class="fs-m">
                <strong class="text-tomato">[{{ category.title }}]</strong>
                {{ item.title }}
              </p>
              <div class="d-flex jc-start ai-center text-dark-6">
                <span class="fs-m d-flex ai-center mr-2">
                  <i
                    class="iconfont icon-liaotian mr-1 fs-m"
                    v-if="item.commends"
                  ></i>
                  {{ item.commends.length }}
                </span>
                <span class="fs-m px-2 d-flex ai-center mr-1">
                  <i class="iconfont icon-shijian mr-1 fs-m"></i>
                  {{ item.createdAt | timeAgo }}
                </span>
                <span class="fs-m px-2 d-flex ai-center"
                  ><i class="iconfont icon-ai-eye mr-2 fs-x"></i
                  >{{ item.reads ? item.reads : "0" }}</span
                >
              </div>
            </div>
            <img
              :src="item.cover ? item.cover : default_img"
              class="h-90 w-40"
            />
          </div>
        </li>
      </MyLoadMore>
      <MyBlankPage v-else></MyBlankPage>
    </div>
    <mt-popup
      v-model="showCategoriesWindow"
      popup-transition="popup-fade"
      class="category-window "
      style="border-radius:0.5rem;"
    >
      <ul>
        <li v-for="item in categories" :key="item['_id']">
          <mt-button
            type="default"
            size="large"
            class="my-3 text-dark letter-s1 fw"
            @click="switchCategory('ArticleType', item['_id'])"
          >
            {{ item.title }}
          </mt-button>
        </li>
      </ul>
    </mt-popup>
  </div>
</template>
<script>
import MySearch from "../../components/MySearch";
export default {
  props: {
    id: {}
  },
  components: {
    MySearch
  },
  data() {
    return {
      search: "",
      showCategoriesWindow: false,
      categories: [],
      category: {
        title: ""
      },
      list: [],
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
    noMore() {
      return this.option.noMore;
    }
  },
  watch: {
    async $route(to, from) {
      if (to.name === "ArticleType") {
        this.option = Object.assign(
          {},
          {
            limit: 10,
            page: 0,
            loading: false,
            noMore: false
          }
        );
        this.initCategories();
        this.list = await this.fetchArticles();
        // this.list = Object.assign([], this.category.articles);
      }
    }
  },
  async created() {
    await this.initCategories();
    this.list = await this.fetchArticles();
  },
  methods: {
    async fetchArticles() {
      const res = await this.fetch(`/rest/articles/`, {
        limit: this.option.limit,
        page: this.option.page,
        where: {
          category: this.id
        },
        match: {
          key: "title",
          val: this.search
        },
        populate: {
          path: "commends",
          select: "id"
        }
      });
      return res;
    },
    // async fetchArticles() {
    //   const res = await this.fetch(`/categories/${this.id}`, {
    //     limit: this.limit,
    //     page: this.page,
    //     match: this.search
    //   });
    //   return res;
    // },
    async initCategories() {
      this.category = await this.fetch(`/rest/categories/${this.id}`);
      this.categories = await this.fetch("/categories");
    },
    // async loadMore() {},
    //   if (this.noMore == true) {
    //     return;
    //   }
    //   this.loading = true;
    //   this.page += 1;
    //   this.category = await this.fetchArticles();
    //   setTimeout(() => {
    //     let len = this.category.articles.length;
    //     if (len > 0) {
    //       for (let i = 0; i < len; i++) {
    //         this.list.push(this.category.articles[i]);
    //       }
    //       this.loading = false;
    //     } else {
    //       this.loading = false;
    //       this.noMore = true;
    //     }
    //   }, 1500);
    // },
    async searchArticles(search) {
      this.search = search;
      this.list = await this.fetchArticles();
      this.page = 0;
    },
    async selectCategory() {
      this.showCategoriesWindow = !this.showCategoriesWindow;
    },
    switchCategory(routeName, id) {
      if (id !== this.id) {
        this.routeByName(routeName, id);
      }
      this.showCategoriesWindow = !this.showCategoriesWindow;
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
  .category-window {
    background-color: transparent;
    width: 55%;
  }
}
</style>
