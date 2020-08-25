<template lang="pug">
  .map
    .map__filter(:class="{'map__filter--fixed' : isFullscreen}", v-if="!tooltipOpened")
      .map__filter-btn(v-for="btn in filter", :key="btn.value", v-html="btn.text",
        @click="setFilter(btn)",
        :class="{'map__filter-btn--active' : activeFilter === btn.value }")
    .map__controls(:class="{'map__controls--fixed' : isFullscreen}", v-if="!tooltipOpened")
      button.map__control.map__control--zoom-in(@click="debounceZoom(true)",
        :class="controlClass('max')")
      button.map__control.map__control--zoom-out(@click="debounceZoom(false)",
        :class="controlClass('min')")
      button.map__control.map__control--fullscreen(@click="toggleFullscreen")
        SvgEl(:name="'fullscreen'", v-show="!isFullscreen")
        SvgEl(:name="'fullscreen-open'", v-show="isFullscreen")
    .map__element(ref="map")
</template>

<script src="./Map.js"></script>

<style scoped lang="scss" src="./Map.scss"></style>
