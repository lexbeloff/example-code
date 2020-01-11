import vStore from '../../base/scripts/vue/v-store';

export default {
	computed: {
		clearFilter() {
			const responceData = {};
			Object.keys(this.filter).forEach((key) => {
				const item = this.filter[key];
				if (item !== '') {
					responceData[key] = item;
				}
			});
			return responceData;
		}
	},
	methods: {
		setRange(data) {
			for (const key in data) {
				if (data.hasOwnProperty(key)) {
					this.$set(this.filter, `${key}`, data[`${key}`])
				}
			}
		},
		showFields(fields) {
			const visibleFields = [];
			if (fields && fields.length !== 0) {
				fields.forEach((el) => {
					if (el.condition) {
						const conditions = JSON.parse(el.condition);
						Object.keys(conditions).forEach((key) => {
							const isFalse = key[0] === '!' ? key.slice(1) : false;
							if (isFalse && (this.filter.hasOwnProperty(`${isFalse}`) && this.filter[`${isFalse}`] !== conditions[`${key}`])) {
								visibleFields.push(el);
							} else if (this.filter.hasOwnProperty(`${key}`) && this.filter[`${key}`] === conditions[`${key}`]) {
								visibleFields.push(el);
							}
						});
					} else visibleFields.push(el);
				});
			}
			return visibleFields;
		},
		setFieldData(val, name) {
			this.$set(this.filter, `${name}`, val);
		},
		changeTags(val) {
			this.filter.tags = [];
			const taglist = this.info.tabs.find(el => el.name === this.activeTab).tags;
			if (taglist) {
				let tags = taglist.selected;

				if (taglist.list && taglist.list.length !== 0) {
					tags = taglist.list.find(el => el.name === val);

					if (tags && tags.length !== 0) {
						tags = tags.list;
					} else {
						tags = taglist.list.reduce((summ, el) => {
							el.list.forEach(tag => {
								let tagAdd = false;
								const countTag = summ.filter(item => (tag && item.value === tag.value));
								if (countTag.length === 0) {
									tagAdd = tag;
								}
								if (tagAdd) {
									summ.push(tagAdd);
								}
							});
							return summ;
						}, []).sort(function () {
							return Math.random() - 0.5;
						}).slice(0, 6);
					}
				}
				taglist.selected = tags;
			}
		},
		updateFilter() {
			this.filter = {};
			let activeTab = this.info;
			if (this.info.tabs) {
				activeTab = this.info.tabs.find((el) => el.name === this.activeTab);
			}
			if (activeTab) {
				this.filterUrl = activeTab.action;
				for (const name in activeTab) {
					if (activeTab.hasOwnProperty(name) && (name === 'fields')) {
						activeTab[name].forEach((field) => {
							for (const key in field) {
								if (field.hasOwnProperty(key)) {
									if (field.type === 'range') {
										for (const j in field.range.inputs) {
											if (field.range.inputs.hasOwnProperty(j)) {
												const jObject = field.range.inputs[`${j}`];
												if (j !== 'title') {
													this.$set(this.filter, `${jObject.name}`, jObject.value);
												}
											}
										}
										if (field.range && field.range.currency) {
											const selected = field.range.currency.values.find((select) => select.selected);
											this.$set(this.filter, `${field.range.currency.name}`, selected.value);
										}
									} else if (field.type === 'radio') {
										const checked = field.values.find((radio) => radio.checked);
										this.$set(this.filter, `${field.name}`, checked.value);
									} else if (field.type === 'select') {
										const selected = field.values.find((select) => select.selected);
										this.$set(this.filter, `${field.name}`, selected.value);
									} else if (field.type === 'input') {
										this.$set(this.filter, `${field.input.name}`, field.input.value);
									} else if (field.type === 'hidden') {
										this.$set(this.filter, field.name, field.value);
									}
								}
							}
						});
					}
				}
			}
			this.clearPopupButtons();
		},
		clearPopupButtons() {
			if (this.visibleButtons && this.visibleButtons.length !== 0) {
				this.visibleButtons.forEach(btn => this.$set(btn, 'count', false));
			}
		},
		updateValue(item) {
			if (vStore.state.mapFilter[item.name]) {
				if (item.values) {
					item.values.forEach((opt) => {
						if (opt.value === vStore.state.mapFilter[item.name]) {
							opt[(item.type === 'radio' ? 'checked' : 'selected')] = true;
						} else {
							opt[(item.type === 'radio' ? 'checked' : 'selected')] = false;
						}
						if (opt[(item.type === 'radio' ? 'checked' : 'selected')] === true) {
							this.$set(this.filter, item.name, opt.value);
						}
					})
				} else {
					item.input.value = vStore.state.mapFilter[item.name];
					this.$set(this.filter, item.name, item.input.value);
				}
			} else {
				if (item.values) {
					item.values.forEach((opt) => {
						if (opt[(item.type === 'radio' ? 'checked' : 'selected')] === true) {
							this.$set(this.filter, item.name, opt.value);
						}
					})
				} else {
					this.$set(this.filter, item.name, item.input.value);
				}
			}
		}
	}
}
