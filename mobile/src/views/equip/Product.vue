<template>
  <div class="product-page">
    <MyHeader title="装备详情">
      <i
        class="iconfont icon-star fs-xl"
        :class="collection.length > 0 ? 'text-orange' : 'text-white'"
        v-if="model"
        @click="collect"
      ></i>
    </MyHeader>
    <img :src="model.cover" class="cover w-100 bb" />
    <div class="main">
      <div class="info p-2 text-dark m1-1">
        <p>
          <span
            class="fw letter-s1"
            v-for="item in model.parent"
            :key="item['_id']"
            >{{ item.title }}/</span
          >
        </p>
        <p>
          <strong class="text-dark letter-s1">装备名称：</strong
          ><span class="letter-s1 text-steel">{{ model.name }}</span>
        </p>

        <div class="d-flex jc-between">
          <div class="flex-1">
            <strong class="text-dark letter-s1">参考价格：</strong>
            <span class="text-tomato"
              >￥<strong class="fs-xl text-tomato">{{
                model.price
              }}</strong></span
            >
          </div>
          <div>
            <strong class="text-dark letter-s1">规格：</strong>
            <span class="text-purple">{{ model.specification }}</span>
          </div>
        </div>
        <p class="text-orange">
          <strong class="text-dark letter-s1">推荐理由：</strong
          >{{ model.recommend }}
        </p>
      </div>
      <div class="detail px-2">
        <p class="fs-m text-dark py-1 d-flex ai-center jc-start">
          详细介绍 <i class="iconfont icon-xiangyou fs-s"></i>
        </p>
        <p class="content" v-html="model.content"></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    id: {}
  },
  computed: {
    ...mapGetters(["getUserId"])
  },
  data() {
    return {
      model: {},
      collection: []
    };
  },
  created() {
    if (this.id) {
      this.init();
    }
  },
  methods: {
    async init() {
      await this.fetchProduct();
      await this.fetchCollectMessage();
    },
    async fetchProduct() {
      this.model = await this.fetch(`rest/products/${this.id}`, {
        populate: {
          path: "parent"
        }
      });
    },
    async collect() {
      await this.setCollection(this.model["_id"], "product_collection");
      await this.fetchCollectMessage();
    },
    async fetchCollectMessage() {
      if (this.model["_id"] && this.getUserId) {
        this.collection = await this.fetch("rest/product_collection", {
          where: {
            collect: this.model["_id"],
            user: this.getUserId
          }
        });
      }
    }
  }
};
</script>
<style lang="scss">
.product-page {
  .cover {
    height: 50vh;
    background-size: cover;
  }
  .main {
    .info {
      border-bottom: 0.5rem solid rgb(238, 238, 238);
    }
    .detail {
      .content {
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
