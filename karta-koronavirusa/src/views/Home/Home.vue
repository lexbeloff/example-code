<template lang="pug">
  .home
    transition(name="fade", mode="in-out")
      Preloader(v-if="isLoading")
    Map.home__main(:info="mapData", v-if="mapData", @mapLoaded="hidePreloader")
    Main.home__info(v-if="tableData", :apiData="tableData", :info="info")
</template>

<script src="./Home.js"></script>

<style lang="scss" src="./Home.scss"></style>
