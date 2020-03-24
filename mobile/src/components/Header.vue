<template>
  <div
    class="commend-header h40 py-1 px-2 d-flex ai-center bg-dark text-white"
    :class="closeBack ? 'jc-center' : 'jc-between'"
  >
    <div>
      <i
        v-show="!closeBack"
        class="iconfont icon-fanhui fs-xxl"
        @click="routeBack"
      ></i>
    </div>
    <span class="letter-s1 ">{{ title }}</span>
    <div @click="clickRight"><slot> </slot></div>
  </div>
</template>
<script>
export default {
  props: {
    closeBack: {
      type: Boolean
    },
    title: {
      type: String,
      require: true
    }
  },
  methods: {
    clickRight() {
      this.$emit("clickRight");
    }
  }
};
</script>
<style lang="scss">
.commend-header {
  box-shadow: 0px 3px 4px #888;
}
</style>
