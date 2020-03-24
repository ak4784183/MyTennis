<template>
  <div class="player-page">
    <div class="bg-dark">
      <div class="pt-2 px-3">
        <i
          class="iconfont icon-fanhui fs-xxl text-white"
          @click="routeBack"
        ></i>
      </div>
      <div class="py-3 fw text-white d-flex flex-coloum jc-center ai-center">
        <img
          :src="model.avatar ? model.avatar : defaultHeader"
          class="header1 mb-1 w70 h70 b-radius50"
        />
        <p class="fs-xl letter-s1">{{ model.cname }}</p>
        <p class="fs-m">{{ model.ename }}</p>
      </div>
      <div class="letter-s1 px-2 pb-2 d-flex jc-around ai-center">
        <span
          class="fw"
          :class="selected == index ? 'active' : 'else'"
          @click="selected = index"
          v-for="(item, index) in navList"
          :key="index"
        >
          {{ item }}
        </span>
      </div>
    </div>
    <div class="main">
      <swiper ref="playerSwiper" :options="{ autoHeight: true }">
        <swiper-slide>
          <div class="p-4 fs-xl data letter-s1">
            <p>
              <span class="text-dark-6">生日</span>
              {{ this.model.birthday | formatDay }}
            </p>
            <p>
              <span class="text-dark-6">年龄</span>
              {{ this.model.birthday | formatBirth }}岁
            </p>
            <p>
              <span class="text-dark-6">性别</span>
              {{ this.model.gender ? "男" : "女" }}
            </p>
            <p>
              <span class="text-dark-6">身高</span>
              {{ this.model.height }}cm
            </p>
            <p>
              <span class="text-dark-6">国籍</span>
              <span v-for="item in model.country" :key="item">
                {{ item }}
              </span>
            </p>
            <p>
              <span class="text-dark-6">持拍</span>
              {{ this.model.habithand ? "右手持拍" : "左手持拍" }}
            </p>
            <p>
              <span class="text-dark-6">反手</span>
              {{ this.model.backhand ? "单手式持拍" : "双手式持拍" }}
            </p>

            <p v-if="model.retire">
              <span class="text-dark-6">情况</span>
              已退役
            </p>
            <p v-else>
              <span class="text-dark-6">积分</span>
              {{ this.model.integral }}
            </p>
            <p>
              <span class="text-dark-6">荣誉</span>
              {{
                this.model.grandslam == 0
                  ? ""
                  : this.model.grandslam + "次大满贯"
              }}
              {{
                this.model.championships == 0
                  ? ""
                  : this.model.championships + "次单打冠军"
              }}
            </p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <ArtItem
            v-if="model.articles"
            :list="model.articles"
            :catTitle="model.ename"
          ></ArtItem>
          <MyBlankPage v-else></MyBlankPage>
        </swiper-slide>
        <swiper-slide>
          <div v-if="model.videos">
            <VideoItem
              v-for="item in model.videos"
              :key="item['_id']"
              :hiddenMoreBtn="true"
              :video="item"
              :posterDate="item.createdAt"
            ></VideoItem>
          </div>
          <MyBlankPage v-else></MyBlankPage>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script>
import ArtItem from "../../components/ArtItem";
import VideoItem from "../../components/VideoItem";
export default {
  props: {
    id: {}
  },
  components: {
    ArtItem,
    VideoItem
  },
  data() {
    return {
      navList: ["球员资料", "相关文章", "视频推荐"],
      videos: {
        limit: 10,
        page: 0,
        loading: false,
        noMore: false
      },
      selected: 0,
      model: {}
    };
  },
  watch: {
    selected() {
      this.$refs.playerSwiper.swiper.slideTo(this.selected);
    }
  },
  created() {
    this.fetchPlayer();
  },
  methods: {
    async fetchPlayer() {
      this.model = await this.fetch(`rest/player/${this.id}`, {
        populate: {
          path: "articles videos"
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/config.scss";
.player-page {
  .header1 {
    border: 3px solid map-get($map: $colors, $key: "dark");
    box-shadow: 0px 0px 2px rgb(230, 229, 229);
  }
  .active {
    border-bottom: 3px solid map-get($map: $colors, $key: "white");
    color: map-get($map: $colors, $key: "white");
  }
  .else {
    border-bottom: 3px solid transparent;
    color: #e4e3e3;
  }
  .data {
    p {
      margin-bottom: 0.5rem;
      span {
        margin-right: 1rem;
      }
    }
  }
}
</style>
