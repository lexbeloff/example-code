<template lang="pug">
  include ../../pug/mixins.pug
  .welcome
    +content
      +content-inner
        Banner(:image="info.image")
      +content-inner('content-inner--main')
        Header
        .content-inner__main
          h1(v-html="info.title")
          p.content-inner__text(v-html="info.text", v-if="info.text")
          Share.welcome__share
          Button.welcome__button(:info="info.button", @click="$emit('startQuiz')")
    Footer

</template>

<script>
  import Banner from "@/components/Banner/Banner.vue";
  import Button from "@/components/Button";
  import Header from "@/components/Header/Header.vue";
  import Share from "@/components/Share/Share.vue";
  import Footer from "@/components/Footer.vue";
  export default {
    name: "Welcome",
    data: () => ({
      info: require('@/data/welcome.json'),
    }),
    components: {
      Header,
      Button,
      Banner,
      Share,
      Footer
    }
  }
</script>

<style scoped lang="scss">
  $parent: welcome;

  @include block($parent) {
    position: relative;

    @include element($parent, 'button') {
      width: 100%;

      @include breakpoint(lg) {
        max-width: rem(325);
      }
    }

    @include element($parent, 'share') {
      margin-bottom: rem(20);

      @include breakpoint(t) {
        margin-bottom: rem(30);
      }

      @include breakpoint(lg) {
        display: none;
      }
    }
  }
</style>