<template>
  <div class="videoCollect-page">
    <MyHeader title="视频收藏"></MyHeader>
    <div class="main">
      <MyLoadMore
        v-if="list.length > 0"
        @loadMore="loadMore(option, fetchVideos, list, 0, 1)"
        :loading="option.loading"
        :noMore="option.noMore"
      >
        <li v-for="item in list" :key="item['_id']">
          <VideoItem
            v-if="item.collect"
            :route="item.collect['_id']"
            :video="item.collect"
            :collectDate="item.createdAt"
          ></VideoItem>
          <!-- <div
            v-if="item.collect"
            class="bb d-flex flex-start ai-center p-2"
            @click="routeByName('videoDetail', item.collect['_id'])"
          >
            <img
              :src="item.collect.cover"
              class="h-100 w-30 flex-1 b-radius5"
            />
            <div class="w-70 d-flex flex-coloum pl-2">
              <p class="fs-m text-over">{{ item.collect.title }}</p>
              <span class="fs-m"
                ><i class="iconfont icon-fabu"></i>
                {{ item.collect.author }}</span
              >
              <div class="d-flex jc-between ai-center text-dark-6">
                <span class="fs-m w60"
                  ><i class="fs-m iconfont icon-bofang mr-1"></i
                  >{{ item.collect.reads | formatReads }}</span
                >
                <span class="fs-m flex-1"
                  >收藏于 {{ item.createdAt | formatMD }}</span
                >
                <i
                  class="iconfont icon-gengduo_huaban fw"
                  @click.stop="openActionSheet(item['_id'])"
                ></i>
              </div>
            </div>
          </div> -->
          <invalid-item
            v-else
            title="原视频已被删除，视频已失效"
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
import VideoItem from "../../components/VideoItem";
export default {
  props: {
    id: {}
  },
  components: {
    VideoItem
  },
  data() {
    return {
      option: {
        limit: 10,
        page: 0,
        loading: false,
        noMore: false
      },
      list: [],
      options: [
        {
          name: "移除收藏",
          method: this.removeCollect
        }
      ],
      removeState: false,
      removeTarget: null
    };
  },
  watch: {
    removeState() {
      if (this.removeState === false) {
        this.removeTarget = null;
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.list = await this.fetchVideos();
    },
    async fetchVideos() {
      return this.fetch("rest/video_collection", {
        where: {
          user: this.id
        },
        populate: {
          path: "collect"
        },
        limit: this.option.limit,
        page: this.option.page
      });
    },
    openActionSheet(id) {
      this.removeState = true;
      this.removeTarget = id;
    },
    async removeCollect() {
      if (this.removeTarget) {
        const res = await this.$http.delete(
          `rest/video_collection/${this.removeTarget}`
        );
        if (res) {
          this.AlertSuccess("移除成功");
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
.videoCollect-page {
  min-height: 100vh;
}
</style>
