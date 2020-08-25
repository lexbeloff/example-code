<template lang="pug">
  footer.footer
    .footer__container
      .footer__copyright
        | ©
        a(:href="info.main.url", target="_blank", rel="noopener", v-html="info.main.text")
        span , {{ getCurrentYear() }}
</template>

<script>
import Share from '@/core/Share/Share.vue';

export default {
  name: 'Footer',
  data: (context) => ({
    info: context.$utils.loadJSON('template/template.json'),
  }),
  components: {
    Share,
  },
  methods: {
    getCurrentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped lang="scss" src="./Footer.scss"></style>
