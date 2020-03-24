<template>
  <div class="main-page d-flex flex-coloum">
    <div class="main-body d-flex flex-coloum">
      <router-view></router-view>
    </div>
    <Tabbar></Tabbar>
  </div>
</template>
<script>
import Tabbar from "../../components/Tabbar";
export default {
  components: {
    Tabbar
  }
};
</script>
<style lang="scss">
.main-page {
  width: 100vw;
  height: 100vh;
  .main-body {
    width: 100%;
    height: calc(100% - 3rem);
    overflow: scroll;
  }
}
</style>
