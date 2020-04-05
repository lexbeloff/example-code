import Share from "ninelines-sharing";

export default {
  name: "Sharing",
  props: {
    place: String,
    shareImage: '',
  },
  data: () => ({
    socials: ["facebook", "vk", "twitter"]
  }),
  components: {
    Share
  },
  methods: {
    share(social) {
      const host = "https://lifebeta.ru/special/test-belov/";
      let title =
        "Готовы жить в 2040 году с искусственным интеллектом и роботами? Сейчас узнаем!";
      const description =
        "Пока вы листаете ленту, учёные вовсю работают над интернетом вещей и искусственным интеллектом. Проверьте, насколько далека ваша жизнь от технологий и легко ли вам будет жить в 2040 году среди новых умных устройств.";
      const imageURL = `${host}dist/static/img/${this.shareImage}`;
      let shareUrl = `${window.location.origin +
      window.location.pathname}?share=true`;

      const getUrlBySocials = social => {
        const defaultSocial = "vk";
        const shareBySocial = {
          twitter: () => {
            const url = `${window.location.href}?utm_source=twitter&utm_medium=social&utm_campaign=sharing`;
            const titleWithoutUnicode =
              title.replace(/&nbsp;/gi, " ").replace(/&mdash;/gi, "-") + " " +
              description.replace(/&nbsp;/gi, " ").replace(/&mdash;/gi, "-");

            const twitterText = encodeURIComponent(
              `${titleWithoutUnicode} ${url}`
            );
            window.open(`https://twitter.com/intent/tweet?text=${twitterText}`);
          },
          facebook: () => {
            shareUrl += `&title=${encodeURIComponent(title)}`;
            shareUrl += `&description=${encodeURIComponent(description)}`;
            shareUrl += `&image=${imageURL}`;
            shareUrl +=
              "&utm_source=facebook&utm_medium=social&utm_campaign=sharing";

            Share.facebook(shareUrl);
          },
          vk: () => {
            shareUrl += `&title=${encodeURIComponent(title)}`;
            shareUrl += `&image=${imageURL}`;
            shareUrl +=
              "&utm_source=vk.com&utm_medium=social&utm_campaign=sharing";
            Share.vk(shareUrl);
          }
        };

        return shareBySocial[social]
          ? shareBySocial[social]()
          : shareBySocial[defaultSocial]();
      };

      getUrlBySocials(social);
      this.shareDataLayer(social);
    },
    shareDataLayer(eventLabel) {
      if (this.$parent.$options.name === "ResultScreen") {
        window.dataLayer.push({
          event: "passEventToGa",
          eventCategory: "ПИК",
          eventAction: "Шаринг результатов_Тест 2040",
          eventLabel,
          eventValue: 1
        });
      } else {
        window.dataLayer.push({
          event: "passEventToGa",
          eventCategory: "ПИК",
          eventAction: "Социальная активность_Тест 2040",
          eventLabel,
          eventValue: 1
        });
      }
    }
  }
};
