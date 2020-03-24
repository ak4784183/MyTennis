<template>
  <div class="tabbar d-flex jc-around bt">
    <div
      class="d-flex flex-coloum jc-around ai-center p-1"
      :class="$store.state.tabbarIndex === index ? 'text-blue-1' : 'text-dark'"
      v-for="(item, index) in tabbar"
      :key="index"
      @click="tabbarClick(item['route_name'], index)"
    >
      <i class="iconfont fs-lx" :class="item.icon"></i>
      <span class="fs-s lh-m">{{ item.title }}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      tabbar: [
        {
          title: "首页",
          icon: "icon-shouye",
          route_name: "article"
        },
        {
          title: "视频",
          icon: "icon-shipin-tianchong",
          route_name: "video"
        },
        {
          title: "装备",
          icon: "icon-wangqiu1",
          route_name: "equip"
        },
        {
          title: "论坛",
          icon: "icon-luntanxuanze",
          route_name: "forum"
        },
        {
          title: "我的",
          icon: "icon-yonghu",
          route_name: "personal"
        }
      ],
      select: 0
    };
  },
  computed: {
    ...mapState({
      tabbarIndex: state => state.tabbarIndex
    })
  },
  watch: {
    tabbarIndex() {
      this.routeByName(this.tabbar[this.tabbarIndex]["route_name"]);
    }
  },
  methods: {
    tabbarClick(route, index) {
      this.$store.state.tabbarIndex = index;
    }
  }
};
</script>
<style lang="scss">
@import "../assets/css/config.scss";
.tabbar {
  width: 100%;
  height: 3rem;
  background-color: map-get($map: $colors, $key: "white");
}
</style>
