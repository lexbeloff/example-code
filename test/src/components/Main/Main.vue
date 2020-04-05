<template lang="pug">
  .main
    transition(name="component-fade", mode="out-in")
      component(
        :is="currentComponent",
        @startQuiz="startQuiz",
        @getResult="showResult",
        @addAnswer="updateResult",
        @restartQuiz="restartQuiz",
        :resultIndex="resultID")
</template>

<script src="./Main.js"></script>

<style scoped lang="scss">
  .main {
    flex: 1 0 auto;
  }
</style>