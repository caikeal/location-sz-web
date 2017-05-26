import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations.js';
import actions from './action.js';
import getters from './getters.js';

Vue.use(Vuex);

const state = {
	myPlace: {
		type: '', // 工作类型，S:无，N:非巡检中，W:巡检中
		x: '',
		y: '',
		group_id: '',
		direction: 180
	}    //  我的位置
};

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations
});
