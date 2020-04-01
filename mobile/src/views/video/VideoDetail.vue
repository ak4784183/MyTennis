<template>
  <div class="video-page">
    <MyHeader title="视频详情">
      <router-link tag="i" :to="{ name: 'video' }"
        ><i class="iconfont icon-shouye fs-xl"></i
      ></router-link>
    </MyHeader>
    <div class="video-wrap bg-dark">
      <video-player
        v-if="playerOptions.sources[2].src != ''"
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
        @play="onPlayerPlay($event)"
        @pause="onPlayerPause($event)"
      ></video-player>
    </div>
    <!-- 这里不能用v-if ，不需要重新加载dom -->
    <div class="main d-flex flex-coloum" v-show="hideCommendDetail">
      <div class="tools mb-1 px-2 d-flex h40 ai-center">
        <div class="flex-1 px-5 h-100 d-flex jc-start ai-center">
          <span
            :class="active === 0 ? 'active' : 'normal'"
            class=" h-70 d-flex letter-s1 ai-center mr-5 fs-l"
            @click="active = 0"
            >简介</span
          >
          <span
            :class="active === 1 ? 'active' : 'normal'"
            class="h-70 letter-s1 d-flex ai-center fs-l"
            @click="active = 1"
            v-if="video.commends"
            >评论{{
              video.commends.length > 0 ? video.commends.length : ""
            }}</span
          >
        </div>
        <i
          :class="collections.length === 0 ? 'text-dark-6' : 'text-tomato'"
          class="iconfont icon-star fs-lx mr-1"
          @click="collect(video['_id'], 'video')"
        ></i>
      </div>
      <div class="content">
        <swiper
          :options="{ autoHeight: true }"
          ref="videoSwiper"
          class="bg-white"
          @slide-change="
            () => {
              active = $refs.videoSwiper.swiper.realIndex;
            }
          "
        >
          <swiper-slide key="0">
            <div class="p-2 bb">
              <div class="d-flex ">
                <p
                  class="fw flex-1 fs-l letter-s1"
                  :class="showInfo ? '' : 'text-over'"
                >
                  {{ video.title }}
                </p>
                <i
                  class="ml-1 fs-xxl iconfont"
                  :class="showInfo ? 'icon-shang' : 'icon-weibiaoti35'"
                  @click="showInfo = !showInfo"
                ></i>
              </div>
              <div class="d-flex fs-m text-dark-6 ">
                <span class="mr-3 d-flex ai-center"
                  ><i class="fs-s mr-1 iconfont icon-bofang"></i
                  >{{ video.reads | formatReads }}</span
                >
                <span class="mr-3 d-flex ai-center"
                  ><i class="fs-m mr-1 iconfont icon-pinglun"></i>0
                </span>
                <span class="mr-3">{{ video.createdAt | formatDay }}</span>
                <span
                  ><i class="iconfont icon-fabu fs-m"></i> -
                  {{ video.author }}</span
                >
              </div>
              <p class="fs-l letter-s1" v-show="showInfo">{{ video.intro }}</p>
            </div>
            <div class="p-2">
              <p class="fw letter-s1">更多视频</p>
              <div class="more">
                <ul v-if="moreList.length > 0">
                  <li v-for="item in moreList" :key="item['_id']">
                    <div
                      class="more-item d-flex bb py-2 ai-center"
                      @click="routeByName('videoDetail', item['_id'])"
                    >
                      <img :src="item.cover" class="more-img w-30 h70" />
                      <div class="more-content px-2 w-70 d-flex flex-coloum">
                        <p class="fs-m more-title text-over">
                          {{ item.title }}
                        </p>
                        <span class="fs-m"
                          ><i class="fs-m mr-1 text-dark iconfont icon-fabu"></i
                          >{{ item.author }}</span
                        >
                        <div class="d-flex text-dark-6 ai-center">
                          <span class="mr-3 d-flex ai-center fs-m"
                            ><i class="fs-s mr-1 iconfont icon-bofang"></i
                            >{{ item.reads | formatReads }}</span
                          >
                          <span class="mr-3 d-flex ai-center fs-m"
                            ><i class="fs-m mr-1 iconfont icon-pinglun"></i>
                            {{ item.commends.length }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide key="1">
            <MyLoadMore
              v-if="commends.length > 0"
              @loadMore="loadMore(false)"
              :loading="loading"
              :noMore="noMore"
            >
              <li
                class="px-3 pb-1 pt-3 d-flex bb"
                v-for="(item, index) in commends"
                :key="index"
              >
                <div class="flex-1">
                  <img
                    v-if="item.user"
                    :src="item.user.avatar ? item.user.avatar : defaultHeader"
                    class="w40 h40 b-radius-50"
                  />
                </div>
                <div class="w-90 pl-3">
                  <div class="h40 d-flex">
                    <div
                      class="flex-1 h40 d-flex flex-coloum jc-center ai-start
                   "
                    >
                      <span
                        class="fs-m h-50 text-dark letter-s1"
                        v-if="item.user"
                        >{{ item.user.nickname }}</span
                      >
                      <span class="fs-s h-50 text-dark-6">{{
                        item.createdAt | formatDay
                      }}</span>
                    </div>
                    <span
                      class="fs-m letter-s1 text-right h30 text-tomato"
                      @click="replyCommend(item, index)"
                      >回复</span
                    >
                  </div>
                  <div class="fs-m mt-2">
                    <p class="letter-s1">{{ item.content }}</p>
                    <div class="d-flex ai-center jc-start mt-1">
                      <span
                        class="fs-s mr-3"
                        :class="item.fabulous | IsFabulous"
                        ><i
                          class="fs-m mr-1 iconfont icon-dianzan1"
                          @click="thumbsUp(item['_id'], index, false)"
                        ></i
                        >{{
                          item.fabulous.length > 0 ? item.fabulous.length : ""
                        }}</span
                      >
                      <span><i class="iconfont icon-liaotian fs-m"></i> </span>
                    </div>
                  </div>
                  <div
                    class="bg-grey-1 pl-2 mb-1 fs-m letter-s1"
                    v-if="item.childs.length > 0"
                    @click="replyCommend(item, index)"
                  >
                    <!-- <p
                      class="w-100 text-over"
                      v-for="child in item.childs"
                      :key="child['_id']"
                    >
                      <span class="text-blue">立陶宛大师</span>
                      {{ child.content }}
                    </p> -->
                    <span class="fs-s text-blue"
                      >共{{ item.childs.length }}条回复<i
                        class="fs-s iconfont icon-icon-arrow-right2"
                      ></i>
                    </span>
                  </div>
                </div>
              </li>
            </MyLoadMore>
            <MyBlankPage v-else></MyBlankPage>
            <div class="pop"></div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="reply d-flex jc-start ai-center p-2" v-show="active === 1">
        <input
          type="text"
          placeholder="说点什么吧"
          v-model="content"
          class="bg-grey-1 flex-1 h30 b-radius10 px-2"
        />
        <span
          class="fs-l letter-s1 text-center ml-2 w40"
          :class="isValid ? 'text-blue' : 'text-tomato'"
          @click="submitVideoCommend"
          >发布</span
        >
      </div>
    </div>
    <!-- 这里不能用v-else，不需要重新加载dom -->
    <div class="main d-flex flex-coloum" v-show="!hideCommendDetail">
      <div class="tools mb-1 px-2 d-flex h40 ai-center jc-between">
        <span class="letter-s1 fs-l">详情</span>
        <i
          class="iconfont icon-guanbi fs-l mr-1"
          @click="hideCommendDetail = !hideCommendDetail"
        ></i>
      </div>
      <div class="content">
        <div
          class="px-3 pb-2 pt-3 d-flex bb"
          style="border-bottom: 0.4rem solid rgb(235, 235, 235);"
          v-if="commend"
        >
          <div class="flex-1">
            <img
              v-if="commend.user"
              :src="commend.user.avatar ? commend.user.avatar : defaultHeader"
              class="w40 h40 b-radius-50"
            />
          </div>
          <div class="w-90 pl-3">
            <div class="h40 d-flex">
              <div
                class="flex-1 h40 d-flex flex-coloum jc-center ai-start
                   "
              >
                <span class="fs-m h-50 text-dark letter-s1">{{
                  commend.user.nickname
                }}</span>
                <span class="fs-s h-50 text-dark-6">{{
                  commend.createdAt | formatDay
                }}</span>
              </div>
            </div>
            <div class="fs-m mt-2">
              <p class="letter-s1">{{ commend.content }}</p>
              <div class="d-flex ai-center jc-start mt-1">
                <span class="fs-s mr-3" :class="commend.fabulous | IsFabulous"
                  ><i
                    class="fs-m mr-1 iconfont icon-dianzan1"
                    @click="thumbsUp(commend['_id'], commend['index'], false)"
                  ></i
                  >{{
                    commend.fabulous.length > 0 ? commend.fabulous.length : ""
                  }}</span
                >
                <span><i class="iconfont icon-liaotian fs-m"></i> </span>
              </div>
            </div>
          </div>
        </div>
        <MyLoadMore
          v-if="replys.length > 0"
          :loading="loading1"
          :noMore="noMore1"
          @loadMore="loadMore(true)"
        >
          <p class="pl-2 fs-m text-dark-6">相关回复共{{ replys.length }}条</p>
          <li
            class="px-3 pb-2 pt-3 d-flex bb"
            v-for="(item, index) in replys"
            :key="index"
            @click="setReplyTo(item.user)"
          >
            <div class="flex-1">
              <img
                v-if="item.user"
                :src="item.user.avatar ? item.user.avatar : defaultHeader"
                class="w40 h40 b-radius-50"
              />
            </div>
            <div class="w-90 pl-3">
              <div class="h40 d-flex">
                <div
                  class="flex-1 h40 d-flex flex-coloum jc-center ai-start
                   "
                >
                  <span
                    class="fs-m h-50 text-dark letter-s1"
                    v-if="item.user"
                    >{{ item.user.nickname }}</span
                  >
                  <span class="fs-s h-50 text-dark-6">{{
                    item.createdAt | formatDay
                  }}</span>
                </div>
              </div>
              <div class="fs-m mt-2">
                <p class="letter-s1">
                  <span v-if="item.reply"
                    >回复<strong class="text-blue"
                      >{{ item.reply.nickname }}:</strong
                    >
                  </span>
                  {{ item.content }}
                </p>
                <div class="d-flex ai-center jc-start mt-1">
                  <span class="fs-s mr-3" :class="item.fabulous | IsFabulous"
                    ><i
                      class="fs-m mr-1 iconfont icon-dianzan1"
                      @click="thumbsUp(item['_id'], index, true)"
                    ></i
                    >{{
                      item.fabulous.length > 0 ? item.fabulous.length : ""
                    }}</span
                  >
                  <span><i class="iconfont icon-liaotian fs-m"></i> </span>
                </div>
              </div>
            </div>
          </li>
        </MyLoadMore>
        <MyBlankPage v-else></MyBlankPage>
        <div class="pop"></div>
      </div>
      <div class="reply d-flex jc-start ai-center p-2">
        <input
          type="text"
          :placeholder="placeholder"
          v-model="content"
          class="bg-grey-1 flex-1 h30 b-radius10 px-2"
        />
        <span
          class="fs-l letter-s1 text-center ml-2 w40"
          :class="isValid ? 'text-blue' : 'text-tomato'"
          @click="submitVideoCommend"
          >回复</span
        >
      </div>
    </div>
  </div>
</template>
<script>
// 引入视频播放组件
import { videoPlayer } from "vue-video-player";
require("video.js/dist/video-js.css");
require("vue-video-player/src/custom-theme.css");
import { mapGetters } from "vuex";
export default {
  props: {
    id: {
      type: String,
      require: true
    }
  },
  components: {
    videoPlayer
  },
  watch: {
    active() {
      this.$refs.videoSwiper.swiper.slideTo(this.active);
    },
    async $route(to, from) {
      if (to.name === "videoDetail") {
        this.video = await this.fetchVideo();
        this.playerOptions.sources[0].src = this.video.url;
        this.playerOptions.poster = this.video.cover;
        this.init();
      }
    },
    hideCommendDetail() {
      if (this.hideCommendDetail === true) {
        this.reply = null;
        this.placeholder = "";
        this.page1 = 0;
        this.noMore1 = false;
      }
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
    isValid() {
      if (this.content === "") {
        return false;
      } else {
        return true;
      }
    },
    ...mapGetters(["getUserId"])
  },
  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: "" //url地址
          },
          {
            type: "video/ogg",
            src: "" //url地址
          },
          {
            type: "video/webm",
            src: "" //url地址
          }
        ],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      },
      hideCommendDetail: true,
      video: {},
      active: 0,
      showInfo: false,
      moreList: [],
      commends: [],
      collections: [],
      limit: 20,
      page: 0,
      loading: false,
      noMore: false,
      limit1: 10,
      page1: 0,
      loading1: false,
      noMore1: false,
      content: "",
      reply: null,
      placeholder: "",
      commend: null,
      replys: []
    };
  },
  async created() {
    this.init();
  },
  methods: {
    async init() {
      this.video = await this.fetchVideo();
      this.playerOptions.sources.forEach(item => {
        item.src = this.video.url;
      });
      this.playerOptions.poster = this.video.cover;
      this.moreList = await this.fetchVideos();
      this.video.reads = await this.setReads(
        `rest/videos/reads/${this.video["_id"]}`
      );
      await this.fetchCollectMessage();
      this.commends = await this.fetchCommends();
    },
    async fetchVideo() {
      const res = await this.fetch(`rest/videos/${this.id}`, {
        populate: {
          path: "commends",
          select: "id"
        }
      });
      return res;
    },
    async fetchVideos() {
      const res = await this.fetch("rest/videos", {
        limit: 10,
        page: 0,
        populate: {
          path: "commends",
          select: "id"
        },
        where: JSON.stringify({
          _id: { $ne: this.video._id }
        })
      });
      return res;
    },
    async fetchCollectMessage() {
      if (this.video["_id"] && this.getUserId) {
        this.collections = await this.fetch("rest/video_collection", {
          where: {
            collect: this.video["_id"],
            user: this.getUserId
          },
          populate: {
            path: "collect"
          }
        });
      }
    },
    async fetchCommends() {
      if (this.id) {
        const res = await this.fetch("rest/video_commend", {
          parent: this.id,
          where: {
            commend: null
          },
          populate: {
            path: "user childs fabulous",
            select: "nickname avatar user"
          },
          limit: this.limit,
          page: this.page
        });
        return res;
      }
    },
    async collect() {
      if (this.video["_id"]) {
        await this.setCollection(this.video["_id"], "video_collection");
        await this.fetchCollectMessage();
      }
    },
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    async loadMore(isReply) {
      if (isReply === true) {
        if (this.noMore1) {
          return;
        }
        this.page1 += 1;
        this.loading1 = true;
        const temp = await this.fetchReplys();
        setTimeout(() => {
          let len = temp.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              this.replys.push(temp[i]);
            }
            this.loading1 = false;
          } else {
            this.loading1 = false;
            this.noMore1 = true;
          }
        }, 1500);
      } else {
        if (this.noMore) {
          return;
        }
        this.page += 1;
        this.loading = true;
        const temp = await this.fetchCommends();
        setTimeout(() => {
          let len = temp.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              this.commends.push(temp[i]);
            }
            this.loading = false;
          } else {
            this.loading = false;
            this.noMore = true;
          }
        }, 1500);
      }
    },
    async submitVideoCommend() {
      if (this.isValid === false) {
        this.AlertError("评论不能为空");
      } else {
        if (
          this.getUserId &&
          this.content &&
          this.id &&
          this.commend &&
          this.reply
        ) {
          const res = await this.post("rest/video_commend", {
            parent: this.id,
            user: this.getUserId,
            content: this.content,
            commend: this.commend["_id"],
            reply: this.reply["_id"]
          });
          this.content = "";
          this.page = 0;
          this.replys = await this.fetchReplys();
        } else {
          const res = await this.post("rest/video_commend", {
            parent: this.id,
            user: this.getUserId,
            content: this.content
          });
          if (res) {
            this.content = "";
            this.page = 0;
            this.noMore = false;
            this.commends = await this.fetchCommends();
          }
        }
      }
    },
    setReplyTo(user) {
      this.reply = user;
      this.placeholder = "@" + user.nickname;
    },
    async replyCommend(item, index) {
      this.hideCommendDetail = false;
      this.commend = item;
      this.$set(this.commend, "index", index);
      this.setReplyTo(item.user);
      this.replys = await this.fetchReplys();
    },
    async fetchReplys() {
      let commend = this.commend["_id"];
      if (commend) {
        const res = await this.fetch("rest/video_commend", {
          parent: this.id,
          limit: this.limit1,
          page: this.page1,
          where: {
            commend: commend
          },
          populate: {
            path: "user childs fabulous reply",
            select: "avatar nickname user"
          }
        });
        return res;
      }
    },
    async thumbsUp(id, index, isReply) {
      if (id && typeof index === "number") {
        await this.setFabulous(id, "video_fabulou");
        let temp = await this.fetch(`rest/video_commend/${id}`, {
          populate: {
            path: "user fabulous"
          }
        });
        this.$set(
          isReply === true ? this.replys[index] : this.commends[index],
          "fabulous",
          temp.fabulous
        );
      }
    }
  }
};
</script>
<style lang="scss">
.video-page {
  min-height: 100vh;
  .video-wrap {
    width: 100%;
  }
  .active {
    border-bottom: 2px solid tomato;
    color: tomato;
  }
  .normal {
    border-bottom: 2px solid transparent;
  }
  .main {
    .tools {
      box-shadow: 0px 0.5px 3px rgb(180, 180, 180);
    }
    .content {
      z-index: 10;
      .more {
        .more-item {
          .more-img {
            border-radius: 5px;
            border: 1px solid rgb(231, 231, 231);
          }
        }
      }
      .commend {
        margin-bottom: 2.3rem;
      }
      .pop {
        height: 2.6rem;
      }
    }

    .reply {
      width: 100vw;
      // height: 2.3rem;
      position: fixed;
      z-index: 30;
      background-color: #fff;
      bottom: 0;
      border-top: 0.05px solid rgb(231, 231, 231);
    }
  }
}
</style>
