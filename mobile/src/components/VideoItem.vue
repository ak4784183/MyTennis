<template>
  <div
    v-if="video"
    class="bb d-flex flex-start ai-center p-2"
    @click="routeByName('videoDetail', video['_id'])"
  >
    <img :src="video.cover" class="h-100 w-30 flex-1 b-radius5" />
    <div class="w-70 d-flex flex-coloum pl-2">
      <p class="fs-m text-over">{{ video.title }}</p>
      <span class="fs-m"
        ><i class="iconfont icon-fabu"></i> {{ video.author }}</span
      >
      <div class="d-flex jc-between ai-center text-dark-6">
        <span class="fs-m w60"
          ><i class="fs-m iconfont icon-bofang mr-1"></i
          >{{ video.reads | formatReads }}</span
        >
        <span class="fs-m flex-1" v-if="collectDate"
          >收藏于 {{ collectDate | formatMD }}</span
        >
        <span class="fs-m flex-1" v-else
          >发布于 {{ posterDate | formatMD }}</span
        >
        <i
          v-if="!hiddenMoreBtn"
          class="iconfont icon-gengduo_huaban fw"
          @click.stop="openActionSheet(item['_id'])"
        ></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    route: {
      type: String,
      require: true
    },
    video: {},
    collectDate: {
      type: String
    },
    posterDate: {
      type: String
    },
    hiddenMoreBtn: {
      type: Boolean
    }
  }
};
</script>
