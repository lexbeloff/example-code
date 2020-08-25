import Meta from '@/utils/meta';

export default {
  name: 'Share',
  data: () => ({
    socials: [
      {
        name: 'twitter',
      },
      {
        name: 'vk',
      },
      {
        name: 'facebook',
      },
    ],
  }),
  props: {
    theme: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: `${window.location.origin}${window.location.pathname}`,
    },
    title: {
      type: String,
      default: Meta.getMeta('og:title'),
    },
    description: {
      type: String,
      default: Meta.getMeta('og:description'),
    },
    image: {
      type: String,
      default: Meta.getMeta('og:image'),
    },
    twitterUser: {
      type: String,
      default: 'ru_lh',
    },
    networkTag: {
      type: String,
      default: 'div',
    },
    eventAction: {
      type: String,
      default: '',
    },
  },
  computed: {
    getTheme() {
      return this.theme ? `share--${this.theme}` : '';
    },
  },
  methods: {
    shareDataLayer(eventLabel) {
      window.dataLayer.push({
        event: 'passEventToGa',
        eventCategory: 'Спецпроект',
        eventAction: this.eventAction
          ? this.eventAction
          : 'Карта коронавируса_социальная активность',
        eventLabel,
        eventValue: 1,
      });
    },
  },
};
