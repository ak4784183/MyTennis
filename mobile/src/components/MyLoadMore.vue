<template>
  <div>
    <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="true"
      :class="flexWrap ? 'flex-wrap d-flex w-100 jc-between' : ''"
    >
      <slot></slot>
    </ul>
    <div>
      <div class="loading-box d-flex jc-center ai-center py-3" v-if="loading">
        <mt-spinner type="snake" class="mr-3"></mt-spinner>
        <span class="text-dark fw">加载中...</span>
      </div>
      <div class="no-more d-flex jc-center ai-center py-3" v-if="noMore">
        <span class="text-dark fw">已加载全部~</span>
      </div>
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
    },
    flexWrap: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {};
  },
  methods: {
    async loadMore() {
      this.$emit("loadMore");
    }
  }
};
</script>
<style lang="scss"></style>
