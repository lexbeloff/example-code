import SvgEl from '@/core/SvgEl.vue';
import Share from '@/core/Share/Share.vue';

export default {
  name: 'Header',
  data: (context) => ({
    info: context.$utils.loadJSON('template/header.json'),
  }),
  components: {
    SvgEl,
    Share,
  },
};
