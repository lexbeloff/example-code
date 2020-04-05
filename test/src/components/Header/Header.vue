<template lang="pug">
  include ../../pug/mixins.pug
  header.header
    .header__logos
      a.header__logo(href="https://lifehacker.ru", target="_blank")
        svg
          use(:xlink:href="$utils.loadAsset('logo', true)")
      a.header__logo.header__logo--pik(href="https://pik.ru", target="_blank")
        svg
          use(:xlink:href="$utils.loadAsset('pik', true)")
    Share.header__share
</template>

<script src="./Header.js"></script>

<style scoped lang="scss" src="./Header.scss"></style>