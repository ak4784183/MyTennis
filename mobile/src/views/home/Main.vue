<template>
  <div class="article-page">
    <div class="navbar w-100 h40 bg-dark d-flex jc-start ai-center">
      <div
        v-for="(item, index) in navlist"
        :key="index"
        @click="swiperSlide(index)"
        class="ml-3 fs-xl"
      >
        <span
          class="item letter-s1"
          :class="selected === index ? 'active fw' : 'text-l-grey '"
        >{{ item }}</span>
      </div>
    </div>

    <swiper
      v-if="categories.length > 0"
      :options="{ autoHeight: true }"
      ref="articleSwiper"
      class="bg-white"
      @slide-change="() => (selected = $refs.articleSwiper.swiper.realIndex)"
    >
      <swiper-slide>
        <div class="swiper" v-if="swipers.length != 0">
          <mt-swipe :auto="6000">
            <mt-swipe-item v-for="(item, index) in swipers" :key="index">
              <img :src="item.url" class="swiper-img" @click="linkToAd(item)" />
              <p class="swiper-text text-white fs-l">{{ item.title }}</p>
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <div class="card" v-for="(item, index) in categories" :key="index">
          <router-link
            v-show="item.articles.length > 0"
            :to="{ name: 'ArticleType', params: { id: item['_id'] } }"
            tag="div"
            class="fs-m p-2 d-flex jc-between ai-center"
          >
            <span class="pl-1 fw fs-l" style="border-left: 2px solid tomato;">{{ item.title }}</span>
            <span class="fs-1 text-dark-6">
              更多
              <i class="iconfont icon-icon-arrow-right2"></i>
            </span>
          </router-link>
          <ArtItem :list="item.articles" :catTitle="item.title"></ArtItem>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="bg-grey-1 px-2 py-2 fs-l fw d-flex jc-between letter-s1">
          <div>
            <span class="text-tomato">
              {{
              matchPage.match ? matchPage.match.title : "不限定赛事类型"
              }}
            </span>
          </div>
          <div class="text-steel" @click="matchPage.showMatchList = true">
            选择
            <i class="ml-1 iconfont icon-gengduo"></i>
          </div>
        </div>
        <MyLoadMore
          v-if="matchPage.list.length > 0"
          :loading="matchPage.loading"
          :noMore="matchPage.noMore"
          @loadMore="
            loadMore(matchPage, fetchMatch, matchPage.list, selected, 1)
          "
        >
          <li v-for="item in matchPage.list" :key="item['_id']" @click="watchVideo(item)">
            <div class="bg-grey-1 fs-l p-2 d-flex jc-between fw">
              <span>{{ item.date | formatMDcn }} 星期{{ item.date | formatWK }}</span>
              <span>{{ item.date | formatYear }}年{{ item.match.title }}</span>
            </div>
            <div class="d-flex p-2">
              <div class="d-flex flex-coloum jc-center ai-center">
                <span class="fs-l text-black">{{ item.date | formatDM }}</span>
                <span class="fs-m text-dark-6" v-if="item.round">第{{ item.round }}轮</span>
              </div>
              <div class="flex-1 d-flex fs-sm fw text-dark px-1">
                <div class="flex-1 d-flex flex-coloum ai-center jc-center">
                  <p
                    class="text-center"
                    v-for="player in item.host"
                    :key="player['_id']"
                  >{{ player.cname }}</p>
                </div>
                <div class="d-flex ai-center text-orange">VS</div>
                <div class="flex-1 d-flex flex-coloum ai-center jc-center">
                  <p
                    class="text-center"
                    v-for="player in item.guest"
                    :key="player['_id']"
                  >{{ player.cname }}</p>
                </div>
              </div>
              <div class="d-flex flex-coloum ai-end">
                <span
                  :class="
                    item.hostscore > item.guestscore
                      ? 'text-tomato'
                      : 'text-dark-6'
                  "
                >
                  {{ item.hostscore
                  }}
                  <i
                    :class="
                      item.guestscore < item.hostscore
                        ? 'text-tomato'
                        : 'text-white'
                    "
                    class="iconfont icon-zuobian-tianchong"
                  ></i>
                </span>
                <span
                  :class="
                    item.guestscore > item.hostscore
                      ? 'text-tomato'
                      : 'text-dark-6'
                  "
                >
                  {{ item.guestscore
                  }}
                  <i
                    :class="
                      item.guestscore > item.hostscore
                        ? 'text-tomato'
                        : 'text-white'
                    "
                    class="iconfont icon-zuobian-tianchong"
                  ></i>
                </span>
                <div v-show="item.video">
                  <i class="iconfont icon-bofang text-dark fs-m"></i>
                  <span class="fs-m text-dark ml-1">集锦</span>
                </div>
              </div>
            </div>
          </li>
        </MyLoadMore>
        <MyBlankPage v-else></MyBlankPage>
      </swiper-slide>
      <swiper-slide>
        <div class="d-flex bb-l letter-s1">
          <div
            class="flex-1 d-flex jc-around"
            v-for="(item, index) in dataPage.sortlist"
            :key="index"
            @click="dataPage.selected = index"
          >
            <span
              class="text-dark my-2 b-radius10 px-2"
              :class="dataPage.selected == index ? 'bg-blue text-white' : ''"
            >{{ item.title }}</span>
          </div>
        </div>
        <!-- <mt-switch v-model="dataPage.gender"></mt-switch> -->
        <div>
          <div class="bb-l letter-s1 py-1 px-3 d-flex jc-between fs-m text-dark-6">
            <span>ATP球员</span>
            <span>{{ dataPageSelected === 0 ? "积分" : "大满贯" }}</span>
          </div>
          <ul>
            <li
              class="py-2 pl-4 pr-3 d-flex ai-center bb-l"
              v-for="(item, index) in dataPage.ATP"
              :key="index"
              @click="routeByName('player', item['_id'])"
            >
              <span
                :class="[
                  index === 0 ? 'text-tomato' : '',
                  index === 1 ? 'text-blue' : '',
                  index === 2 ? 'text-green' : '',
                ]"
              >{{ index + 1 }}</span>
              <div class="flex-1 text-dark d-flex ai-center">
                <img
                  :src="item.avatar ? item.avatar : defaultHeader"
                  class="w40 h40 mx-3 b-radius50"
                />
                <span class="letter-s1 fs-l">{{ item.cname }}</span>
              </div>
              <span
                class="fs-l"
                :class="[
                  index === 0 ? 'text-tomato fw' : '',
                  index === 1 ? 'text-blue fw' : '',
                  index === 2 ? 'text-green fw' : '',
                ]"
              >
                {{
                dataPageSelected === 0 ? item.integral : item.grandslam
                }}
              </span>
            </li>
          </ul>
          <div class="bb-l letter-s1 py-1 px-3 d-flex jc-between fs-m text-dark-6">
            <span>WTA球员</span>
            <span>{{ dataPageSelected === 0 ? "积分" : "大满贯" }}</span>
          </div>
          <ul>
            <li
              class="py-2 pl-4 pr-3 d-flex ai-center bb-l"
              v-for="(item, index) in dataPage.WTA"
              :key="index"
              @click="routeByName('player', item['_id'])"
            >
              <span
                :class="[
                  index === 0 ? 'text-tomato fw' : '',
                  index === 1 ? 'text-blue fw' : '',
                  index === 2 ? 'text-green fw' : '',
                ]"
              >{{ index + 1 }}</span>
              <div class="flex-1 text-dark d-flex ai-center">
                <img
                  :src="item.avatar ? item.avatar : defaultHeader"
                  class="w40 h40 mx-3 b-radius50"
                />
                <span class="letter-s1 fs-l">{{ item.cname }}</span>
              </div>
              <span
                class="fs-l"
                :class="[
                  index === 0 ? 'text-tomato fw' : '',
                  index === 1 ? 'text-blue fw' : '',
                  index === 2 ? 'text-green fw' : '',
                ]"
              >
                {{
                dataPageSelected === 0 ? item.integral : item.grandslam
                }}
              </span>
            </li>
          </ul>
        </div>
      </swiper-slide>
      <swiper-slide>
        <!--   -->
        <MySearch :search="playerPage.search" @inputSearch="searchPlayer"></MySearch>
        <MyLoadMore
          v-if="playerPage.list.length > 0"
          :flexWrap="true"
          :loading="playerPage.loading"
          :noMore="playerPage.noMore"
          @loadMore="
            loadMore(playerPage, fetchPlayer, playerPage.list, selected, 3)
          "
        >
          <li
            class="w-50 p-2"
            v-for="player in playerPage.list"
            :key="player['_id']"
            @click="routeByName('player', player['_id'])"
          >
            <div class="px-2">
              <img :src="player.avatar ? player.avatar : default_img" class="w-100 h100" />
              <p class="text-over fs-l fw text-center">{{ player.cname }}</p>
            </div>
          </li>
        </MyLoadMore>
        <MyBlankPage v-else></MyBlankPage>
      </swiper-slide>
    </swiper>
    <mt-popup
      v-model="matchPage.showMatchList"
      style="height: 100vh; width: 70vw;"
      position="right"
    >
      <div class="d-flex px-3 flex-coloum" style="overflow: scroll;">
        <p class="fw my-3">赛事名称</p>
        <div
          class="bborder b-radius5 mb-2 p-2 fs-l text-center"
          v-for="item in matchPage.matches"
          :key="item['_id']"
          @click="selectMatch(item)"
          :class="
            matchPage.match == item ? 'bg-orange text-white' : 'text-dark'
          "
        >{{ item.title }}</div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import MySearch from "../../components/MySearch";
import ArtItem from "../../components/ArtItem";
import { mapState } from "vuex";
export default {
  components: {
    MySearch,
    ArtItem
  },
  data() {
    return {
      selected: 0,
      categories: [],
      swipers: [],
      navlist: ["推荐", "赛事", "数据", "球员"],
      dataPage: {
        selected: 0,
        ATP: [],
        WTA: [],
        sortlist: [
          {
            title: "积分排名",
            sortname: "integral"
          },
          {
            title: "大满贯",
            sortname: "grandslam"
          }
        ]
      },
      matchPage: {
        showMatchList: false,
        limit: 10,
        page: 0,
        list: [],
        matches: [],
        match: null,
        loading: false,
        noMore: false
      },
      playerPage: {
        search: "",
        list: [],
        limit: 10,
        page: 0,
        loading: false,
        noMore: false
      }
    };
  },
  computed: {
    dataPageSelected() {
      return this.dataPage.selected;
    }
  },
  watch: {
    dataPageSelected() {
      this.fetchRank();
    }
  },
  async created() {
    this.fetchSwipers();
    this.fetchCategories();
    this.fetchRank();
    this.initMatchPage();
    this.initPlayerPage();
  },
  methods: {
    async initMatchPage() {
      this.matchPage.page = 0;
      this.matchPage.noMore = false;
      this.matchPage.matches = await this.fetchMatchStyle();
      this.matchPage.list = await this.fetchMatch();
    },
    async initPlayerPage() {
      this.playerPage.page = 0;
      this.playerPage.noMore = false;
      this.playerPage.list = await this.fetchPlayer();
    },
    async fetchCategories() {
      this.categories = await this.fetch("categories/all");
    },
    async fetchSwipers() {
      this.swipers = await this.fetch("rest/ads");
    },
    swiperSlide(index) {
      this.$refs.articleSwiper.swiper.slideTo(index);
    },
    async fetchMatchStyle() {
      return await this.fetch("rest/matches", {
        sort: {
          title: -1
        }
      });
    },
    async fetchMatch() {
      const option = this.matchPage;
      const queryOption = {
        limit: option.limit,
        page: option.page,
        sort: {
          date: -1
        },
        populate: {
          path: "host guest match"
        }
      };
      if (this.matchPage.match) {
        queryOption.where = {
          match: this.matchPage.match["_id"]
        };
      }
      return await this.fetch("rest/contest", queryOption);
    },
    async fetchRank() {
      const obj = this.dataPage;
      const ATPOptions = {};
      ATPOptions[obj.sortlist[obj.selected].sortname] = -1;
      const ATPquery = {
        where: {
          gender: true
        },
        limit: 20,
        page: 0,
        sort: ATPOptions
      };
      const WTAquery = {
        where: {
          gender: false
        },
        limit: 20,
        page: 0,
        sort: ATPOptions
      };
      if (this.dataPageSelected === 0) {
        ATPquery.where.retire = false;
        WTAquery.where.retire = false;
      }

      this.dataPage.ATP = await this.fetch("rest/players", ATPquery);
      this.dataPage.WTA = await this.fetch("rest/players", WTAquery);
    },
    async fetchPlayer(text) {
      return await this.fetch("rest/players", {
        match: {
          key: "cname",
          val: text
        },
        limit: this.playerPage.limit,
        page: this.playerPage.page
      });
    },
    async selectMatch(item) {
      this.matchPage.match && this.matchPage.match["_id"] == item["_id"]
        ? (this.matchPage.match = null)
        : (this.matchPage.match = item);
      this.matchPage.showMatchList = false;
      this.matchPage.noMore = false;
      this.matchPage.page = 0;
      this.matchPage.list = await this.fetchMatch();
    },
    async searchPlayer(text = "") {
      this.playerPage.list = await this.fetchPlayer(text);
    },
    linkToAd(item) {
      if (item.link) {
        window.location.href = item.link;
      }
    },
    watchVideo(item) {
      if (item.video) {
        this.routeByName("videoDetail", item.video);
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/config.scss";
.article-page {
  background-color: map-get($map: $colors, $key: "bg");
  .swiper {
    width: 100%;
    height: 13rem;
    background-color: map-get($map: $colors, $key: "white");
    .mint-swipe-items-wrap {
      // border-radius: 8px;
      .mint-swipe-item {
        .swiper-img {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 5;
          background-size: cover;
        }
        .swiper-text {
          position: absolute;
          left: 0.5rem;
          letter-spacing: 2px;
          bottom: 0.6rem;
          z-index: 99;
        }
      }
    }
  }
  .active {
    color: map-get($map: $colors, $key: "white");
    border-bottom: 3px solid map-get($map: $colors, $key: "blue-1") !important;
  }
  .card {
    border-bottom: 0.5rem solid #f0f0f0;
  }
}
</style>
