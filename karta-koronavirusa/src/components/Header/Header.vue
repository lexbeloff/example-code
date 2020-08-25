<template lang="pug">
  header.header(ref="header")
    .container.header__container
      .header__main
        a.header__logo(:href="info.logo.main.url", target="_blank", rel="noopener")
          span Lifehacker
          SvgEl(:name="info.logo.main.svg")
        h1.header__title(v-html="info.title")
      Share.header__share
</template>

<script src="./Header.js"></script>
<style scoped lang="scss" src="./Header.scss"></style>
