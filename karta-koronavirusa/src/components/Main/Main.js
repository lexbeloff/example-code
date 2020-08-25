import Button from '@/core/Button/Button.vue';
import Share from '@/core/Share/Share.vue';
import Posts from '@/components/Posts/Posts.vue';
import Footer from '@/components/Footer/Footer.vue';
import Table from '@/components/Table/Table.vue';
import MainGlobal from './global/Main-global.vue';

export default {
  name: 'Main',
  components: {
    Table,
    Share,
    Footer,
    Posts,
    MainGlobal,
    Button,
  },
  props: {
    apiData: {
      type: Object,
      required: true,
      default: null,
    },
    info: {
      type: Object,
      required: true,
      default: null,
    },
  },
  created() {
    this.global = { ...this.apiData.global };
    this.countries = [...this.apiData.countries];
    const dateOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const date = new Date(this.apiData.date * 1000);
    this.updated = {
      date: date.toLocaleDateString('ru', dateOptions),
      time: `${date.getUTCHours() + 3}:${date.getUTCMinutes()}`,
    };
  },
  methods: {
    scrollToTable(isOpened) {
      if (isOpened) {
        this.$scrollTo(this.$refs.table.$el, 700, {
          container: window.innerWidth <= 1023 ? 'body' : this.$el,
          offset: window.innerWidth >= 768 ? 2 : 0,
        });
      }
    },
  },
};
