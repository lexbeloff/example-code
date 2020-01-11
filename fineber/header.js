import Vue from 'vue';
import Axios from 'axios';
import Cookies from 'js-cookie';

export default class Header {
  constructor(parent) {
    if (parent) {
      this.header = parent;
      this.searchContainer = this.header ? this.header.querySelector('.header__search') : false;
      this.laborStates = this.header ? Array.from(this.header.querySelectorAll('.header__labor')) : false;
      this.headerLogo = this.header ? this.header.querySelector('.header__logo-wrp') : false;
      this.geoSelect = this.header ? this.header.querySelector('.header__geo-select') : false;

      if (this.laborStates && this.laborStates.length !== 0) this.laborTooltip();

      if (this.searchContainer) {
        this.initSearch();

        if (this.headerLogo) {
          window.addEventListener('toggleLogo', (e) => {
            if (window.innerWidth < 510) {
              this.headerLogo.style.opacity = e.detail ? 0 : 1;
            }
          });
        }
      }

      if (this.geoSelect) {
        this.initGeo();
      }
    }
  }

  laborTooltip() {
    this.laborStates.forEach((state) => {
      if (state.classList.contains('header__labor--main')) {
        const clockIco = state.querySelector('.header__labor-ico');

        if (clockIco) {
          document.addEventListener('click', (e) => {
            const { target } = e;
            if (window.innerWidth <= 1023) {
              if (target === clockIco) {
                e.preventDefault();
                if (state.classList.contains('header__labor--show')) {
                  state.classList.remove('header__labor--show');
                } else state.classList.add('header__labor--show');
              } else state.classList.remove('header__labor--show');
            }
          });
        }
      }
    });
  }

  initSearch() {
    new Vue({
      el: this.searchContainer,
      data: {
        showDropdown: false,
        isOpen: false,
        searchValue: '',
        searchOptions: [],
        inputOpacity: 1,
      },
      watch: {
        isOpen() {
          window.dispatchEvent(new window.CustomEvent('toggleLogo', { detail: this.isOpen }));
        },
      },
      methods: {
        toggleSearch(target) {
          const dropdownNotTarget = target !== this.searchDropdown
            && !this.searchDropdown.contains(target);
          const wrpNotTarget = target !== this.searchWrap && !this.searchWrap.contains(target);

          if (dropdownNotTarget) {
            if (target === this.searchButton) {
              if (window.innerWidth <= 1023) {
                this.isOpen = true;
                this.searchWrap.style.overflow = 'visible';
                this.inputOpacity = 1;
                this.searchInput.focus();
              }
            }

            if (
              (target !== this.searchButton &&
              target !== this.searchClose && wrpNotTarget) ||
              target === this.searchClose
            ) {
              this.closeTips();

              if (window.innerWidth <= 1023) {
                this.isOpen = false;
                this.searchValue = '';

                setTimeout(() => {
                  this.searchWrap.style.overflow = 'hidden';
                  this.inputOpacity = 0;
                }, 300);
              }
            }
          }
        },
        focus(el) {
          this.showDropdown = el.srcElement.value.length !== 0;
        },
        searchHelp(close = false) {
          if (this.searchValue.length > 2) {
            Axios.get(this.searchTips, this.searchValue)
              .then((response) => {
                this.searchOptions = [];
                response.data.forEach((option) => {
                  const regMatches = option.match(new RegExp(this.searchValue, 'ig'));
                  if (regMatches !== null) {
                    this.searchOptions.push({
                      value: option,
                      text: option.replace(new RegExp(regMatches[0], 'ig'), `<mark>${regMatches[0]}</mark>`),
                    });
                  }
                });
                if (close !== true) {
                  this.showDropdown = this.searchOptions.length !== 0;
                } else {
                  this.showDropdown = false;
                }
              });
          } else {
            this.showDropdown = false;
            this.searchOptions = [];
          }
        },
        updateSearchValue(option) {
          this.searchValue = option.value;
          this.closeTips();
          this.searchHelp(true);
          this.searchSubmit();
        },
        closeTips() {
          this.showDropdown = false;
          if (this.searchValue.length === 0) this.searchOptions = [];
        },
        searchSubmit() {
          if (this.searchValue.length !== 0) {
            Axios.get(this.searchAction, {
              q: this.searchValue,
            }).then(() => {
              window.location = `${this.searchAction}?q=${this.searchValue}`;
            });
          }
        },
      },
      mounted() {
        this.searchTips = this.$el.getAttribute('data-search-tips');
        this.searchAction = this.$el.getAttribute('action');
        this.searchDropdown = this.$el.querySelector('.header__search-dropdown');
        this.searchWrap = this.$el.querySelector('.header__search-wrp');
        this.searchButton = this.$el.querySelector('.header__search-btn');
        this.searchClose = this.$el.querySelector('.header__search-close');
        this.searchInput = this.$el.querySelector('.header__search-input');
        if (window.innerWidth <= 1023) this.inputOpacity = 0;

        document.addEventListener('click', (e) => {
          const { target } = e;

          this.toggleSearch(target);
        });
      },
    });
  }

  initGeo() {
    new Vue({
      el: this.geoSelect,
      data: {
        isOpenHint: false,
        showDropdown: false,
        geoValue: '',
        geoOptions: [],
        isOpen: false,
        selectedCity: {
          id: 202,
          district: 41,
          name: 'Москва',
        },
      },
      methods: {
        toggleGeo(target) {
          if (this.geoDropdown) {
            const dropdownNotTarget = target !== this.geoDropdown &&
              !this.geoDropdown.contains(target);

            if (dropdownNotTarget) this.closeTips();
          } else this.closeTips();
        },
        focus() {
          this.showDropdown = this.geoOptions.length !== 0;
        },
        getCookie(name) {
          const matches = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\+^])/g, '\\$1')}=([^;]*)`));
          return matches ? decodeURIComponent(matches[1]) : undefined;
        },
        geoHelp(close = false) {
          if (this.geoValue.length > 2) {
            Axios.get(this.geoTips, this.geoValue)
              .then((response) => {
                this.geoOptions = [];

                response.data.forEach((option) => {
                  const regMatches = option.name.match(new RegExp(this.geoValue, 'ig'));
                  if (regMatches !== null) {
                    this.geoOptions.push({
                      value: option.name,
                      text: option.name.replace(new RegExp(regMatches[0], 'ig'), `<mark>${regMatches[0]}</mark>`),
                      id: option.id,
                      district: option.district,
                    });
                  }
                });

                this.showDropdown = close !== true;
              });
          } else {
            this.showDropdown = false;
            this.geoOptions = [];
          }
        },
        updateGeoValue(option) {
          this.geoValue = option.value;
          this.selectedCity = {
            name: option.value,
            id: option.id,
            district: option.district,
            value: option.value,
          };

          this.closeTips();
          this.geoHelp(true);
          this.geoSubmit();
        },
        closeTips() {
          this.showDropdown = false;
          this.isOpen = false;
          if (this.geoValue.length === 0) this.geoOptions = [];
        },
        geoSubmit() {
          Cookies.set('city_id', this.selectedCity.id);
          Cookies.set('city_name', this.selectedCity.name);
          Cookies.set('district_id', this.selectedCity.district);

          window.dispatchEvent(new window.CustomEvent('selectGeo', {
            detail: {
              city: this.selectedCity.id,
              district: this.selectedCity.district,
            },
          }));
        },
        openGeoInput() {
          this.closeHint();

          setTimeout(() => {
            this.isOpen = true;
            this.geoInput.focus();
          }, 1);
        },
        closeHint() {
          localStorage.setItem('sity-popup', 'true');
          this.isOpenHint = false;
        },
        checkOpenPopup() {
          const flagSity = JSON.parse(localStorage.getItem('sity-popup')) || false;
          const flagSityTime = JSON.parse(localStorage.getItem('sity-popup-time')) || false;

          if (!flagSity && flagSityTime) this.isOpenHint = true;
        },
        checkCityPopup() {
          const flagSity = JSON.parse(localStorage.getItem('sity-popup')) || false;
          const delay = 3000;

          if (!flagSity) {
            setTimeout(() => {
              localStorage.setItem('sity-popup-time', 'true');
              this.checkOpenPopup();
            }, delay);
          }

          this.checkOpenPopup();
        },
      },
      mounted() {
        this.geoTips = this.$el.getAttribute('data-geo-tips');
        this.geoInput = this.$el.querySelector('.header__geo-input');
        this.geoTitle = this.$el.querySelector('.header__geo-title');
        this.selectedCity = {
          id: parseFloat(this.getCookie('city_id')) || 202,
          name: this.getCookie('city_name') || 'Москва',
          district: parseFloat(this.getCookie('district_id')) || 41,
        };

        document.addEventListener('click', (e) => {
          const { target } = e;

          if (target !== this.geoInput && target !== this.geoTitle) {
            this.$nextTick(() => {
              this.geoDropdown = this.$el.querySelector('.header__geo-dropdown');
              this.toggleGeo(target);
            });
          } else if (target === this.geoTitle) {
            this.closeHint();
            this.isOpen = !this.isOpen;
            this.geoInput.focus();
          }
        });

        this.$nextTick(() => {
          this.geoSubmit();
        });

        this.checkCityPopup();
      },
    });
  }
}
