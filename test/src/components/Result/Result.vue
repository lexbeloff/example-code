<template lang="pug">
  include ../../pug/mixins.pug
  .result
    +content
      +content-inner
        Banner.banner--result.result__banner(:image="result.image")
      +content-inner('content-inner--main')
        Header.header--no-share.result__header

        .content-inner__main
          h1(v-html="result.title")
          p.content-inner__text.result__text(v-html="result.text", v-if="result.text")
          Share.share--orange.result__share(:shareImage="resultImage")
          Link.result__retry(:text="'Пройти еще раз'", @click="$emit('restartQuiz')")
    Footer
</template>

<script>
  import Banner from "@/components/Banner/Banner.vue";
  import Header from "@/components/Header/Header.vue";
  import Footer from "@/components/Footer.vue";
  import Share from "@/components/Share/Share.vue";
  import Link from "@/components/Link";

  export default {
    name: "Result",
    props: {
      resultIndex: {
        type: String,
        default: null
      }
    },
    data: () => ({
      info: require('@/data/results.json'),
    }),
    components: {
      Banner,
      Header,
      Share,
      Link,
      Footer
    },
    computed: {
      result() {
        return this.info[+this.resultIndex];
      },
      resultImage() {
        return this.result.shareImage;
      }
    }
  }
</script>

<style scoped lang="scss" src="./Result.scss"></style>
