<template>
  <div
    class="px-3 py-2 bg-white d-flex jc-between ai-center mb-2 bb"
    @click="route ? routeByName(route) : ''"
  >
    <span class="fs-l letter-s1">{{ title }}</span>
    <div class="d-flex ai-center jc-center h30">
      <span class="text-grey mr-1 d-flex ai-center jc-center"
        ><slot></slot
      ></span>
      <i class="iconfont icon-icon-arrow-right2 fs-xl" v-show="!closeDir"></i>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      require: true
    },
    route: {
      type: String
    },
    closeDir: {
      //父传值的时候直接写属性名是Boolean类型，写=''会变成String类型
      type: Boolean
    }
  },
  created() {}
};
</script>
<style lang="scss"></style>
