<template>
  <div class="mask" v-show="$store.maskState"></div>
</template>
<style lang="scss">
.mask {
  background-color: rgba($color: #fff, $alpha: 0.2);
  height: 100vh;
  width: 100vw;
}
</style>
