<template>
  <div>
    <form class="w-100 p-2">
      <div class="bg-grey-1 b-radius10 h30 px-2 d-flex ai-center jc-between">
        <i class="iconfont icon-fangdajing fs-xl ml-1"></i>
        <input
          type="text"
          class="ml-1 flex-1 letter-s1"
          v-model.trim="search"
          placeholder="搜索"
        />
        <span
          class="letter-s1 fs-m w40 text-center"
          :class="search == '' ? 'text-blue' : 'text-tomato'"
          @click="
            () => {
              if (search != '') {
                search = '';
              }
            }
          "
          >{{ search == "" ? "搜索" : "取消" }}
        </span>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      search: "",
    };
  },
  watch: {
    async search() {
      await this.inputSearch();
    },
  },
  methods: {
    async inputSearch() {
      await this.$emit("inputSearch", this.search);
    },
  },
};
</script>
<style lang="scss"></style>
