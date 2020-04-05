<template lang="pug">
  include ../../pug/mixins.pug
  .quiz
    +content
      +content-inner
        Banner.banner--quiz.quiz__banner(:image="'quiz.png'")
          Pagination.quiz__pagination(:current="currentQuestion + 1", :total="total")
          transition(name="slide")
            template(v-if="updateQuiz")
              .quiz__title(v-html="current.question")
      +content-inner('content-inner--quiz')
        Header.quiz__header
        .content-inner__main
          transition(name="slide")
            .quiz__answers(v-if="updateQuiz")
              .quiz__answer(
                v-for="answer, index in current.answers",
                :key="'answer-' + index",
                v-html="answer",
                @click="next(index)"
            )
    Footer
</template>

<script src="./Quiz.js"></script>

<style scoped lang="scss" src="./Quiz.scss"></style>