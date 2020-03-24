<template>
  <div>
    <div class="loading-box d-flex jc-center ai-center py-3" v-if="loading">
      <mt-spinner type="snake" class="mr-3"></mt-spinner>
      <span class="text-dark fw">加载中...</span>
    </div>
    <div class="no-more d-flex jc-center ai-center py-3" v-if="noMore">
      <span class="text-dark fw">没有更多了~</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      require: true
    },
    noMore: {
      type: Boolean,
      require: true
    }
  }
};
</script>
