<template>
  <div class="articleCommend-page">
    <MyHeader title="评论"></MyHeader>
    <div class="main pt-2">
      <MyLoadMore :loading="loading" :noMore="noMore" @loadMore="loadMore">
        <li
          class="item bg-white w-100 d-flex flex-coloum jc-start p-3 bb"
          @click="removeReply"
        >
          <div class="item-heade d-flex ai-center" v-if="model">
            <img
              v-if="model.from"
              :src="model.from.avatar ? model.from.avatar : defaultHeader"
              class="w40 h40 b-radius-50"
            />
            <div class="flex-1 flex-coloum jc-start ai-start px-3">
              <p class="fs-l text-black" v-if="model.from">
                {{ model.from.nickname }}
              </p>
              <span class="fs-m text-dark-6">
                {{ model.createdAt | timeAgo }}
              </span>
            </div>
            <div
              class="d-flex flex-coloum jc-start"
              v-if="model.fabulous"
              :class="model.fabulous | IsFabulous"
            >
              <div @click="thumbsUp(model['_id'])">
                <i class="iconfont icon-dianzan fs-xxl"></i>
              </div>
              <span class="fs-m text-center" v-if="model.fabulous">{{
                model.fabulous.length > 0 ? model.fabulous.length : "赞"
              }}</span>
            </div>
          </div>
          <div class="item-body mt-2">
            <p class="fs-l ">
              {{ model.content }}
            </p>
          </div>
        </li>
        <li
          class="item bg-grey-1 w-100 d-flex flex-coloum jc-start p-3 bb"
          v-for="(item, index) in childs"
          :key="index"
          @click="replyTo(item.from)"
        >
          <div class="item-heade d-flex ai-center">
            <img
              :src="item.from.avatar ? item.from.avatar : defaultHeader"
              class="w40 h40 b-radius-50"
            />
            <div class="flex-1 flex-coloum jc-start ai-start px-3">
              <p class="fs-l text-black" v-if="item.from">
                {{ item.from.nickname }}
              </p>
              <span class="fs-m text-dark-6">
                {{ item.createdAt | timeAgo }}
              </span>
            </div>
            <div
              class="d-flex flex-coloum jc-start"
              v-if="item.fabulous"
              :class="item.fabulous | IsFabulous"
            >
              <div @click="thumbsUp(item['_id'], index, true)">
                <i class="iconfont icon-dianzan fs-xxl"></i>
              </div>
              <span class="fs-m text-center" v-if="item.fabulous">{{
                item.fabulous.length > 0 ? item.fabulous.length : "赞"
              }}</span>
            </div>
          </div>
          <div class="item-body mt-2">
            <p class="fs-l ">
              <span v-if="item.reply">回复 {{ item.reply.nickname }}：</span
              >{{ item.content }}
            </p>
          </div>
        </li>
      </MyLoadMore>
    </div>
    <ArtReply
      ref="ArtReplyDetail"
      :placeholder="placeholder"
      @submit="submitCommends"
    ></ArtReply>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ArtReply from "../../components/ArtReply.vue";
export default {
  components: {
    ArtReply
  },
  props: {
    id: {}
  },
  data() {
    return {
      model: {},
      childs: [],
      isSubmit: false,
      limit: 5,
      page: 0,
      isMoreLoading: false,
      loading: false,
      noMore: false,
      placeholder: "回复层主",
      reply: null
    };
  },
  computed: {
    ...mapGetters(["getUserId"])
  },
  created() {
    this.Init();
  },
  watch: {
    reply() {
      this.placeholder =
        this.reply === null ? "回复层主" : "@" + this.reply.nickname + "：";
    }
  },
  methods: {
    async Init() {
      this.page = 0;
      this.model = await this.fetch(`/art_commend/${this.id}`, {
        limit: this.limit,
        page: this.page
      });
      this.childs = Object.assign([], this.model.childs);
    },
    async submitCommends(content) {
      if (this.isSubmit) {
        return;
      } else {
        this.isSubmit = true;
        const userId = JSON.parse(localStorage.getItem("m_userInfo")).id;
        const model = {
          article: this.model.article,
          content: content,
          from: userId,
          to: this.id
        };
        if (this.reply != null) {
          model.reply = this.reply["_id"];
        }
        await this.post(`art_commend`, model);
        this.isSubmit = false;
        this.IndicatorOpen("正在评论");
        setTimeout(() => {
          this.Init();
          this.IndicatorClose();
          this.AlertSuccess("评价完成");
        }, 1500);
      }
    },
    async loadMore() {
      if (this.noMore == true) {
        return;
      }
      this.loading = true;
      this.page += 1;
      const { childs } = await this.fetch(`/art_commend/${this.id}`, {
        limit: this.limit,
        page: this.page
      });
      setTimeout(() => {
        if (childs.length > 0) {
          for (let i = 0; i < childs.length; i++) {
            this.childs.push(childs[i]);
          }
          this.isMoreLoading = !this.isMoreLoading;
          this.loading = false;
        } else {
          this.loading = false;
          this.isMoreLoading = !this.isMoreLoading;
          this.noMore = true;
        }
      }, 1500);
    },
    replyTo(user) {
      this.reply = Object.assign({}, user);
    },
    removeReply() {
      this.reply = null;
    },
    async thumbsUp(id, index) {
      if (id) {
        await this.setFabulous(id, "art_fabulous");
        let temp = await this.fetch(`rest/art_commend/${id}`, {
          populate: {
            path: "from fabulous"
          }
        });
        this.$set(
          typeof index === "number" ? this.childs[index] : this.model,
          "fabulous",
          temp.fabulous
        );
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/config.scss";
.articleCommend-page {
  height: 100vh;
  .main {
    height: calc(100% - 8.5rem); //主题高度等于100vh减去头部和尾部的高度
    overflow: scroll;
  }
}
</style>
