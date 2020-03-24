<template>
  <ul>
    <li
      v-for="child in list"
      :key="child['_id']"
      @click="routeByName('articleDetail', child['_id'])"
    >
      <div class="w-100 bb p-2 d-flex jc-between" style="height:8rem;">
        <div class="flex-1 d-flex flex-coloum jc-between mr-2 pb-1">
          <p class="fs-m">
            <strong class="text-tomato" v-if="catTitle"
              >[{{ catTitle }}]</strong
            >
            {{ child.title }}
          </p>
          <div class="d-flex jc-start ai-center text-dark-6">
            <span class="fs-m d-flex ai-center mr-2" v-if="child.commends">
              <i class="iconfont icon-liaotian mr-1 fs-m"></i>
              {{ child.commends.length }}
            </span>
            <span class="fs-m px-2 d-flex ai-center mr-1">
              <i class="iconfont icon-shijian mr-1 fs-m"></i>
              {{ child.createdAt | timeAgo }}
            </span>
            <span class="fs-m px-2 d-flex ai-center"
              ><i class="iconfont icon-ai-eye mr-2 fs-x"></i
              >{{ child.reads ? child.reads : "0" }}</span
            >
          </div>
        </div>
        <img :src="child.cover ? child.cover : default_img" class="my-2 w-40" />
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    catTitle: {
      type: String
    },
    list: {
      type: Array,
      default: () => []
    }
  }
};
</script>
