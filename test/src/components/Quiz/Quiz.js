import Banner from "@/components/Banner/Banner";
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer.vue";
import Pagination from "@/components/Pagination/Pagination";

export default {
  name: "Quiz",
  data: () => ({
    info: require('@/data/quiz.json'),
    currentQuestion: 0,
    updateQuiz: true,
  }),
  components: {
    Banner,
    Pagination,
    Header,
    Footer
  },
  computed: {
    current() {
      return this.info[this.currentQuestion];
    },
    total() {
      return this.info.length;
    }
  },
  updated() {
    this.updateQuiz = true;
  },
  methods: {
    next(index) {
      if ((this.currentQuestion + 1) < this.total) {
        this.updateQuiz = false;
        this.currentQuestion += 1;
        this.$emit('addAnswer', index);
      } else {
        this.$emit('addAnswer', index);
        this.$emit('getResult');
      }
    }
  }
}