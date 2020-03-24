<template>
  <div class="header-wrap w-100 h100 bg-dark text-white d-flex flex-coloum">
    <div class="flex-1 d-flex jc-between ai-center px-2 ">
      <i class="iconfont icon-fanhui fs-xxl" @click="$router.back()"></i>
      <span class="fs-xl letter-s1">{{ title }}</span>
      <span><slot></slot></span>
      <!-- 这个插槽是填点击按钮之类的图标 -->
    </div>
    <div class="navbar w-100 h50 d-flex text-grey fs-l px-5 letter-s1">
      <div
        class="flex-1 d-flex jc-around ai-center"
        @click="swiperClick(index)"
        v-for="(item, index) in itemList"
        :key="item"
      >
        <span
          class="child pb-1"
          :class="swiperIndex === index ? 'active-white' : 'other-white'"
        >
          {{ item }}
        </span>
      </div>
      <!-- <div class="flex-1 d-flex jc-around ai-center" @click="swiperClick(1)">
        <span class="child" :class="swiperIndex === 1 ? 'active-white' : ''">
          {{ rightText }}
        </span>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      requrie: true
    },
    // leftText: {
    //   type: String,
    //   requrie: true
    // },
    // rightText: {
    //   type: String,
    //   requrie: true
    // },
    itemList: {
      type: Array,
      default: () => []
    },
    swiperIndex: { type: Number, requrie: true }
  },
  methods: {
    swiperClick(index) {
      this.$emit("swiperClick", index);
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/config.scss";
.active-white {
  line-height: 100%;
  color: map-get($map: $colors, $key: "white");
  border-bottom: 3px solid map-get($map: $colors, $key: "white") !important;
}
.other-white {
  line-height: 100%;
  color: map-get($map: $colors, $key: "grey");
  border-bottom: 3px solid transparent !important;
}
</style>
