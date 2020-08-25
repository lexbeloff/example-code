<template lang="pug">
  div(id="app")
    Header
    Home
</template>

<style lang="scss">
@import "./scss/base";
</style>

<script>
import Home from '@/views/Home/Home.vue';
import Header from '@/components/Header/Header.vue';

export default {
  components: {
    Header,
    Home,
  },
};
</script>
