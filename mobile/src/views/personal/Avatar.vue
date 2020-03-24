<template>
  <div class="avatar-page w-100 bg-grey-0">
    <MyHeader title="设置个人头像"></MyHeader>
    <div class="wrap h-40">
      <img
        v-if="userInfo"
        :src="userInfo.avatar ? userInfo.avatar : defaultHeader"
        alt="头像封面"
        class="img w-100 h-100"
      />
    </div>
    <div class="pt-5 px-6 submitWrap">
      <form method="post" class="d-flex flex-coloum jc-center ai-center">
        <div class="btn bg-white w-80 h50 b-radius10 mt-5">
          <span class="title letter-s1 fs-xl fw text-dark">上传头像</span>
          <input
            class="file_input"
            ref="uploadAvatar"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            @change="uploadAvatar"
          />
        </div>
        <div class="btn bg-white w-80 h50 b-radius10 mt-5">
          <span class="title letter-s1 fs-xl fw text-dark" @click="routeBack"
            >取消设置</span
          >
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { mapState, mutations, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  data() {
    return {};
  },
  methods: {
    async uploadAvatar() {
      if (this.userInfo) {
        const formData = new FormData();
        formData.append("file", this.$refs.uploadAvatar.files[0]);
        const res = await this.post("uploads", formData);
        const { url } = res;
        const user = Object.assign({}, this.userInfo);
        user.avatar = url;
        const result = await this.put(
          `/rest/users/${this.userInfo["_id"]}`,
          user
        );
        setTimeout(() => {
          if (result) {
            this.AlertSuccess("操作成功");
            this.getUserInfo();
          }
        }, 500);
      }
    },
    ...mapMutations(["getUserInfo"])
  }
};
</script>
<style lang="scss">
.avatar-page {
  height: 100vh;
  .wrap {
    img {
      box-shadow: 0px 2px 4px #888;
    }
  }
  .submitWrap {
    .btn {
      box-shadow: 2px 2px 3px #888;
      position: relative;
      .title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
      }
      .file_input {
        z-index: 50;
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
}
</style>
