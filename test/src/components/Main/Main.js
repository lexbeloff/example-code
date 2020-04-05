import Welcome from "../Welcome/Welcome.vue";
import Quiz from "../Quiz/Quiz.vue";
import Result from "../Result/Result.vue";

export default {
  name: "Main",
  data: () => ({
    isWelcome: true,
    results: {},
    isEnd: false,
    resultID: null,
  }),
  components: {
    Welcome,
    Quiz,
    Result
  },
  computed: {
    currentComponent() {
      return this.isWelcome ? 'Welcome' : this.isEnd ? 'Result' : 'Quiz';
    }
  },
  methods: {
    startQuiz() {
      this.isWelcome = false;
    },
    restartQuiz() {
      this.isEnd = false;
      this.isWelcome = true;
      this.results = {};
    },
    showResult() {
      const maxAnswers = Math.max(...Object.values(this.results));
      this.resultID = this.getResultID(maxAnswers);
      this.isEnd = true;
    },
    getResultID(value) {
      return Object.keys(this.results).find(key => this.results[key] === value);
    },
    updateResult(index) {
      if (!this.results[index]) {
        this.results[index] = 1;
      } else {
        this.results[index] += 1;
      }
    }
  }
}
