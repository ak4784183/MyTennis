<template>
  <div class="equip-page" v-if="id">
    <MyHeader :title="model.title ? model.title : '装备收藏'"
      ><i
        class="fs-xxl iconfont icon-act_liebiaohengxiang
"
        v-show="!horizontal"
        @click="horizontal = !horizontal"
      ></i>
      <i
        class="fs-xxl iconfont icon-act_liebiaozongxiang
"
        v-show="horizontal"
        @click="horizontal = !horizontal"
      ></i>
    </MyHeader>
    <MySearch v-if="!flag" @inputSearch="searchProduct"> </MySearch>
    <div class="main p-2">
      <MyLoadMore
        v-if="products.length > 0"
        :flexWrap="horizontal"
        @loadMore="
          loadMore(
            option,
            flag === true ? fetchCollections : fetchProducts,
            products
          )
        "
        :noMore="option.noMore"
        :loading="option.loading"
      >
        <li
          class="mb-2 d-flex"
          :class="horizontal ? 'itemX flex-coloum' : 'itemY'"
          v-for="item in products"
          :key="item['_id']"
          @click="routeByName('product', item['_id'])"
        >
          <img :src="item.cover ? item.cover : default_img" class="cover" />
          <div
            class="pb-1 d-flex flex-coloum"
            :class="horizontal ? 'px-2 ' : 'box px-2  jc-around flex-1'"
          >
            <p class="text-over fs-l fw">{{ item.name }}</p>
            <p
              class="fs-m text-over"
              :class="horizontal ? 'text-orange' : 'text-blue'"
              style="line-height:1rem;"
            >
              {{ item.recommend }}
            </p>
            <p class="fs-m" v-show="!horizontal">
              <span>规格：</span>{{ item.specification }}
            </p>
            <div class="d-flex jc-between">
              <div class="text-tomato">
                <span class="fs-m">￥</span><strong>{{ item.price }}</strong>
              </div>
              <i
                v-if="flag"
                class="iconfont icon-gengduo1 fs-xl text-dark"
                @click.stop="openRemoveBtn(item['remove_id'])"
              ></i>
            </div>
          </div>
        </li>
      </MyLoadMore>
      <MyBlankPage v-else></MyBlankPage>
      <mt-actionsheet :actions="options" v-model="removeState">
      </mt-actionsheet>
    </div>
  </div>
</template>
<script>
import MySearch from "../../components/MySearch";
import { mapGetters } from "vuex";
export default {
  props: {
    id: {}
  },
  components: {
    MySearch
  },
  computed: {
    ...mapGetters(["getUserId"])
  },
  data() {
    return {
      flag: false, //装备收藏的判断
      horizontal: true,
      search: "",
      model: {},
      products: [],
      option: { noMore: false, loading: false, limit: 10, page: 0 },
      options: [
        {
          name: "移除收藏",
          method: this.removeCollect
        }
      ],
      removeState: false,
      removeTarget: null
    };
  },
  created() {
    if (this.id === this.getUserId) {
      this.flag = true;
      this.initCollect();
    } else {
      this.flag = false;
      this.init();
    }
  },
  methods: {
    async init() {
      this.option.page = 0;
      await this.fetchEquip();
      this.products = await this.fetchProducts();
    },
    async initCollect() {
      this.option.page = 0;
      this.products = await this.fetchCollections();
    },
    async fetchEquip() {
      this.model = await this.fetch(`rest/equip_type/${this.id}`);
    },
    async fetchProducts() {
      let find = this.model["_id"];
      if (find) {
        const res = await this.fetch("rest/products", {
          where: {
            parent: find
          },
          match: {
            key: "name",
            val: this.search
          },
          select: "-content",
          limit: this.option.limit,
          page: this.option.page
        });
        return res;
      }
    },
    async fetchCollections() {
      const temp = await this.fetch("rest/product_collection", {
        where: {
          user: this.id
        },
        populate: {
          path: "collect"
        },
        limit: this.option.limit,
        page: this.option.page
      });
      if (temp.length === 0) {
        return [];
      } else {
        return temp.map(v => {
          const obj = v.collect
            ? v.collect
            : {
                _id: v["_id"],
                name: "装备已失效",
                price: 0
              };
          obj.remove_id = v["_id"];
          return obj;
        });
      }
    },
    openRemoveBtn(id) {
      this.removeTarget = id;
      this.removeState = true;
    },
    async removeCollect() {
      if (this.removeTarget && this.getUserId) {
        await this.$http.delete(`rest/product_collection/${this.removeTarget}`);
        await this.initCollect();
      }
    },
    async searchProduct(search) {
      this.search = search;
      this.products = await this.fetchProducts();
      this.option.page = 0;
    }
  }
};
</script>
<style lang="scss">
.equip-page {
  .main {
    .itemX {
      border-radius: 5px;
      overflow: hidden;
      width: calc((100% - 0.6rem) / 2);
      border: 1.5px solid rgb(253, 152, 58);
      box-shadow: 0px 2px 5px rgb(211, 210, 210);
      .cover {
        width: 100%;
        height: 10rem;
      }
    }
    .itemY {
      border-radius: 5px;
      overflow: hidden;
      width: 100%;
      border: 1.5px solid rgb(81, 171, 255);
      box-shadow: 0px 2px 5px rgb(211, 210, 210);
      .cover {
        width: 8.5rem;
        height: 8rem;
      }
      .box {
        width: calc(100% - 8.5rem);
      }
    }
  }
}
</style>
