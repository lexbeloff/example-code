<template lang="pug">
  .main
    .container.main__container
      .main__content
        .main__global(v-if="global")
          .main__title.title Всего в мире
          MainGlobal(:info="global")
        .main__list
          .main__title.main__title--countries.title Список стран
          Table.main__table(ref="table",
            v-if="countries", :info="countries", @tableToggled="scrollToTable")
        .main__posts(v-if="info.posts")
          .main__title.title Узнайте больше
          Posts(:info="info.posts")
        .main__updated(v-if="updated")
          span <b>Последнее обновление: <span v-html="updated.date"></span>, </b>
            | <span v-html="updated.time"></span> GMT+3&nbsp;
          span Источник: <a href="https://www.worldometers.info/coronavirus/" target="_blank">Worldometer</a>
        Share.main__share
      Footer
</template>

<script src="./Main.js"></script>

<style scoped lang="scss" src="./Main.scss"></style>
