<template>
  <div class="equip-page bg-grey-0">
    <MyHeader title="装备" closeBack></MyHeader>
    <ul class="main p-2 mt-2">
      <li
        class="bg-white b-radius10 mb-3 p-2 letter-s1"
        v-for="item in equips"
        :key="item['_id']"
      >
        <div
          class="d-flex jc-between ai-center text-dark"
          @click="routeByName('equipList', item['_id'])"
        >
          <span class="fw">{{ item.title }}</span>
          <i class="iconfont icon-xiangyou fw text-dark-6"></i>
        </div>
        <div
          class="d-flex flex-wrap jc-between pt-2 fs-m text-dark"
          v-if="item.childs.length > 0"
        >
          <span
            @click="routeByName('equipList', child['_id'])"
            class="bg-grey-1 text-over items text-left mb-2 p-2"
            v-for="child in item.childs"
            :key="child['_id']"
          >
            {{ child.title }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      equips: []
    };
  },
  created() {
    this.fetchEquip();
  },
  methods: {
    async fetchEquip() {
      this.equips = await this.fetch("rest/equip_type", {
        where: {
          parent: null
        },
        populate: {
          path: "childs"
        }
      });
    }
  }
};
</script>
<style lang="scss">
.equip-page {
  .main {
    li {
      border: 1px solid rgb(238, 238, 238);
      box-shadow: 1px 2px 3px rgb(236, 236, 236);
      .items {
        width: calc((100% - 0.5rem) / 2);
        border-radius: 3px;
      }
    }
  }
}
</style>
