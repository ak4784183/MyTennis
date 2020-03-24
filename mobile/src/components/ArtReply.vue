<template>
  <div class="articleDetail-myComment d-flex flex-coloum">
    <form method="post" class="flex-1">
      <mt-field
        class="h-100"
        :placeholder="placeholder"
        type="textarea"
        rows="2"
        v-model="content"
      ></mt-field>
    </form>
    <button
      class="w-100 h40 fs-xl letter-s1 fw text-white submit"
      :class="isValid ? 'bg-grey' : 'bg-dark '"
      :disabled="isValid"
      @click="submit"
    >
      评论
    </button>
  </div>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String
    }
  },
  computed: {
    isValid() {
      if (this.content === "") {
        return true;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      content: "",
      reply: null
    };
  },
  methods: {
    async submit() {
      await this.$emit("submit", this.content);
      this.content = "";
    }
    // setReplyName(name) {
    //   // this.reply = Object.assign({}, user);
    //   this.content = name ? "@" + name : "";
    // }
  }
};
</script>
<style lang="scss">
.articleDetail-myComment {
  height: 6rem;
  .submit {
    height: 2.5rem;
    border-radius: 0;
    border: none;
  }
}
</style>
