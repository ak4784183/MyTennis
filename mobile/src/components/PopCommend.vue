<template>
  <mt-popup
    v-model="$store.state.post.commend_drawer_state"
    position="bottom"
    class="drawer-wrap"
    v-if="commend"
  >
    <div class="drawer">
      <div class="drawer-header p-2 d-flex jc-start">
        <i
          class="iconfont icon-guanbi"
          @click="$store.state.post.commend_drawer_state = false"
        ></i>
        <p class="flex-1 text-center letter-s1">
          {{ commend.layer + 1 }}楼的回复
        </p>
      </div>
      <div class="pb-2" :class="replys.length > 0 ? 'commend' : ''">
        <div class="postItem pt-3 bg-white px-2">
          <div class="h40 d-flex jc-start" v-if="commend.user">
            <img
              :src="commend.user.avatar ? commend.user.avatar : defaultHeader"
              class="w40 h40 mr-2 b-radius-50"
            />
            <div class="flex-1 bg-white d-flex flex-coloum jc-center ai-start">
              <span class="fs-l flex-1">{{ commend.user.nickname }} </span>
              <span class="text-grey fs-m  h-50">
                {{ commend.createdAt | timeAgo }}</span
              >
            </div>
            <div class="fs-m d-flex w50 ai-start jc-start text-grey mr-3">
              <i
                :class="commend.fabulous | IsFabulous"
                @click="popThumbsUp(commend['_id'])"
                class="iconfont icon-dianzan1 fs-xxl "
              ></i>
              <span
                :class="commend.fabulous | IsFabulous"
                class="flex-1 fs-m text-center"
                >{{
                  commend.fabulous.length === 0 ? "赞" : commend.fabulous.length
                }}</span
              >
            </div>
          </div>
          <div class="content mt-2 px-6">
            <p class="text fs-l " v-html="commend.content"></p>
          </div>
        </div>
      </div>
      <MyLoadMore
        v-if="replys.length > 0"
        @loadMore="loadMore"
        :noMore="noMore"
        :loading="loading"
      >
        <li class="pt-2 px-2" v-show="replys.length > 0">
          <p class="text-start text-dark fs-m letter-s1">
            {{ replys.length }}条回复
          </p>
        </li>
        <li v-for="(item, index) in replys" :key="index">
          <div class="postItem pt-3 bg-white px-2">
            <div class="h40 d-flex jc-start" v-if="item.user">
              <img
                :src="item.user.avatar ? item.user.avatar : defaultHeader"
                class="w40 h40 mr-2 b-radius-50"
              />
              <div
                class="flex-1 bg-white d-flex flex-coloum jc-center ai-start"
              >
                <span class="fs-l flex-1">{{ item.user.nickname }} </span>
                <span class="text-grey fs-m  h-50">
                  {{ item.createdAt | timeAgo }}</span
                >
              </div>
              <div
                class="fs-m d-flex w50 ai-start jc-start mr-3"
                :class="item.fabulous | IsFabulous"
              >
                <i
                  @click="popThumbsUp(item['_id'], index)"
                  class="iconfont icon-dianzan1 fs-xxl "
                ></i>
                <span class="flex-1 fs-m text-center">{{
                  item.fabulous.length === 0 ? "赞" : item.fabulous.length
                }}</span>
              </div>
            </div>
            <div class="content mt-2 px-6">
              <p class="text fs-l ">
                <span v-if="item.reply"
                  >回复
                  <strong class="text-blue">{{ item.reply.nickname }}</strong
                  >：</span
                >{{ item.content }}
              </p>
              <span
                class="fs-m text-dark-6"
                @click="setReply(item.user['_id'], item.user.nickname)"
                >回复</span
              >
            </div>
          </div>
        </li>
      </MyLoadMore>
      <MyBlankPage v-else></MyBlankPage>
      <ArtReply
        class="replay bt"
        :placeholder="placeholder"
        @submit="replyPost"
      ></ArtReply>
    </div>
  </mt-popup>
</template>
<script>
import ArtReply from "./ArtReply";
import { mapState, mapGetters } from "vuex";
export default {
  props: {
    postId: {
      type: String,
      requrie: true
    }
  },
  components: {
    ArtReply
  },
  computed: {
    ...mapState({
      switch: state => state.post.commend_drawer_state,
      select_commend_id: state => state.post.select_commend_id
    }),
    ...mapGetters(["getUserId"])
  },
  watch: {
    async switch(val) {
      if (val === true) {
        await this.fetchTargetPost();
        await this.fetchReplys();
      }
    }
  },
  data() {
    return {
      loading: false,
      noMore: false,
      commend: {},
      replys: [],
      placeholder: "说点什么好呢？",
      replyId: null
    };
  },
  created() {},
  methods: {
    show() {
      console.log(this.replys);
    },
    async fetchTargetPost() {
      if (this.select_commend_id) {
        this.commend = await this.fetch(
          `rest/posts/${this.select_commend_id}`,
          {
            populate: JSON.stringify({
              path: "user fabulous"
            })
          }
        );
      }
    },
    loadMore() {},
    async init() {
      await this.fetchTargetPost();
      await this.fetchReplys();
    },
    async popThumbsUp(id, index) {
      if (id) {
        await this.setFabulous(id, "post_fabulous");
        let temp = await this.fetch(`rest/posts/${id}`, {
          populate: {
            path: "from fabulous"
          }
        });
        this.$set(
          typeof index === "number" ? this.replys[index] : this.commend,
          "fabulous",
          temp.fabulous
        );
      }
    },
    async replyPost(text) {
      const options = {
        parent: this.postId,
        to: this.commend["_id"],
        content: text,
        user: this.getUserId,
        reply: this.replyId != null ? this.replyId : this.commend.user["_id"]
      };
      const res = await this.post("rest/posts", options);
      if (res) {
        this.init();
      }
    },
    async fetchReplys() {
      this.replys = await this.fetch("rest/posts", {
        where: {
          parent: this.postId,
          to: this.commend["_id"]
        },
        populate: {
          path: "user fabulous reply",
          select: "nickname avatar reply.nickname"
        }
      });
    },
    async setReply(id, name) {
      this.replyId = id;
      this.placeholder = "@" + name;
    }
  }
};
</script>
<style lang="scss">
.drawer-wrap {
  background-color: transparent;
  border-radius: 10px 10px 0px 0px;
  .drawer {
    background-color: white;
    width: 100vw;
    height: 90vh;
    overflow: scroll;
    border-radius: 10px 10px 0px 0px;
    position: relative;
    padding-bottom: 7rem;
    .drawer-header {
      width: 100vw;
      height: 2.5rem;
      border-radius: 10px 10px 0px 0px;
      border: none;
      background-color: white;
      position: sticky;
      top: 0;
    }
    .commend {
      border-bottom: 0.3rem solid rgb(231, 231, 231);
    }
    .postItem {
      .content {
        .text {
          p {
            font-size: 0.9rem;
            img {
              width: 100%;
              height: auto;
            }
          }
        }
      }
    }
    .replay {
      position: fixed;
      width: 100vw;
      bottom: 0;
    }
  }
}
</style>
