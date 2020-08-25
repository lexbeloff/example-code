<template lang="pug">
  .table(:class="{'table--opened' : isOpened, 'table--edge' : isEdge && isOpened}")
    transition(name="show", mode="in-out")
      .table__wrap(v-if="isVisible")
        .table__row.table__row--head(:style="headStyle")
          .table__cell Страна
          .table__cell Заболели
          .table__cell Умерли
          .table__cell Вылечились
        .table__main(ref="main")
          .table__row(v-for="(country, index) in info", :key="`country-${index}`")
            .table__cell
              .table__cell-name
                img(v-lazy="`https://special.lifehacker.ru/${country.flag_url}`", alt="")
                span(v-html="country.name")
            .table__cell(v-html="formatParam(country.data.confirmed)")
            .table__cell(v-html="formatParam(country.data.deaths)")
            .table__cell(v-html="formatParam(country.data.recovered)")
    .table__button(:style="buttonStyle")
      Button(:text="buttonText", @click="toggleTable")
</template>

<script src="./Table.js"></script>

<style scoped lang="scss" src="./Table.scss"></style>
