import Button from '@/core/Button/Button.vue';

export default {
  name: 'Table',
  props: {
    info: {
      type: Array,
      required: true,
      default: null,
    },
  },
  components: {
    Button,
  },
  data: () => ({
    isOpened: false,
    scrolledFromTop: null,
    tableHeadState: false,
    isButtonFixed: false,
  }),
  computed: {
    buttonText() {
      return this.isOpened ? 'Свернуть список' : 'Развернуть список';
    },
    isVisible() {
      return (window.innerWidth <= 767 && this.isOpened) || window.innerWidth >= 768;
    },
    isEdge() {
      return navigator.userAgent.indexOf('Edge') !== -1;
    },
    // Microsoft Edge Sticky fix
    buttonStyle() {
      return this.isOpened && this.isButtonFixed ? {
        position: 'fixed',
        width: `${this.$el.offsetWidth}px`,
      } : null;
    },
    // Microsoft Edge Sticky fix
    headStyle() {
      let styles = null;
      if (this.isOpened) {
        if (this.tableHeadState === 'fixed') {
          styles = {
            position: 'fixed',
            width: `${this.$el.offsetWidth}px`,
            top: '56px',
          };
        }
        if (this.tableHeadState === 'end') {
          styles = {
            top: 'calc(100% - 30px)',
          };
        }
      }
      return styles;
    },
  },
  methods: {
    formatParam(param) {
      return param === '0' ? '—' : param;
    },
    toggleTable() {
      this.isOpened = !this.isOpened;

      this.$nextTick(() => this.$emit('tableToggled', this.isOpened));

      window.dataLayer.push({
        event: 'passEventToGa',
        eventCategory: 'Спецпроект',
        eventAction: 'Карта коронавируса_кнопки',
        eventLabel: 'Развернуть список',
        eventValue: 1,
      });
    },
  },
  mounted() {
    // Microsoft Edge Sticky fix
    if (this.isEdge) {
      this.parent = this.$parent.$el;
      this.parent.addEventListener('scroll', () => {
        if (this.isOpened) {
          this.scrolledFromTop = this.parent.scrollTop;

          if (this.scrolledFromTop < this.$el.offsetTop) {
            this.tableHeadState = false;
          }
          if (this.scrolledFromTop >= this.$el.offsetTop + 2) {
            this.tableHeadState = 'fixed';
          }
          if (this.scrolledFromTop >= (this.$el.offsetTop + this.$refs.main.offsetHeight) + 30) {
            this.tableHeadState = 'end';
          }

          this.isButtonFixed = (this.scrolledFromTop + this.parent.offsetHeight)
            < (this.$el.offsetTop + this.$el.offsetHeight);
        }
      });
    }
  },
};
