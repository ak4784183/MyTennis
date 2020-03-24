<template>
  <div class="bb pb-3 d-flex ai-center">
    <div class="flex-1">
      <span class="text-dark fs-l letter-s1">{{ title }}</span
      ><i class="iconfont icon-jiufuqianbaoicon11 text-orange fs-lxx"></i>
    </div>
    <i class="iconfont icon-gengduo_huaban fw" @click.stop="removeMethod"></i>
  </div>
</template>
<script>
export default {
  props: {
    title: String
  },
  methods: {
    removeMethod() {
      this.$emit("removeMethod");
    }
  }
};
</script>
