<template lang="pug">
  .share
    .share__social-icons
      a.share__social(v-for="social in socials"
        :key="social"
        :class="`sharing__social--${social}`"
        @click="share(social)"
      )
        svg
          use(:xlink:href="$utils.loadAsset(social, true)")
</template>

<script src="./Share.js"></script>

<style scoped lang="scss" src="./Share.scss"></style>
