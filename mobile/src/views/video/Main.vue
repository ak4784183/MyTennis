<template>
  <div class="videoList-page">
    <MyHeader title="视频" closeBack></MyHeader>
    <div class="main ">
      <MySearch @inputSearch="searchVideo"></MySearch>
      <MyLoadMore
        v-if="videos.length > 0"
        @loadMore="loadMore"
        :loading="loading"
        :noMore="noMore"
      >
        <li class="pb-2 item" v-for="item in videos" :key="item['_id']">
          <div class="wrap" @click="routeByName('videoDetail', item['_id'])">
            <div class="cover mb-2" style="height:13rem;">
              <img :src="item.cover" class="w-100 h-100" />
            </div>
            <p class="title fw px-2">
              <span class="text-tomato">[{{ item.label }}]</span>
              {{ item.title }}
            </p>
            <div class="d-flex text-dark-6 px-2">
              <span class="mr-3 d-flex ai-center"
                ><i class="iconfont icon-bofang fs-m mr-2"></i
                >{{ item.reads | formatReads }}</span
              >
              <span class="d-flex ai-center"
                ><i class="iconfont icon-pinglun fs-xl mr-2"></i
                >{{ item.commends.length | formatReads }}
              </span>
              <span class="flex-1 text-right">{{
                item.createdAt | formatDay
              }}</span>
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
export default {
  components: {
    MySearch
  },
  data() {
    return {
      videos: [],
      loading: false,
      noMore: false,
      limit: 3,
      page: 0
    };
  },
  async created() {
    this.videos = await this.fetchVideos();
  },
  methods: {
    async fetchVideos() {
      const res = await this.fetch("rest/videos", {
        populate: {
          path: "commends"
        },
        match: {
          key: "title",
          val: this.search
        },
        limit: this.limit,
        page: this.page,
        sort: { _id: -1 }
      });
      return res;
    },
    async searchVideo(text) {
      this.search = text;
      this.videos = await this.fetchVideos();
    },
    async loadMore() {
      if (this.noMore) {
        return;
      }
      this.page += 1;
      this.loading = true;
      const temp = await this.fetchVideos();

      setTimeout(() => {
        let len = temp.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            this.videos.push(temp[i]);
          }
          this.loading = false;
        } else {
          this.loading = false;
          this.noMore = true;
        }
      }, 1500);
    }
  }
};
</script>
<style lang="scss">
.videoList-page {
  min-height: 100vh;
  .main {
    .item {
      border-bottom: 0.6rem solid #e7e7e7;
      .wrap {
        .cover {
          overflow: hidden;
          // border-radius: 5px;
          border: 1px solid rgb(231, 231, 231);
        }
        .title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
