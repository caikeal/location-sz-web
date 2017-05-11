import {
	RECORD_USERINFO,
	SYNC_USERINFO,
	OUT_LOGIN
} from './mutation-types.js';

import { readLocal, saveLocal, clearAllLocal } from '../utils/localstorage.js';

export default {
	// 登录并记录用户信息
	[RECORD_USERINFO] (state, info) {
		state.userInfo = info;
		state.login = true;
		saveLocal('user', info);
	},
	// 同步用户信息
	[SYNC_USERINFO] (state) {
		let user = readLocal('user');
		if (!user.token && state.userInfo && state.userInfo.token) {
			saveLocal('user', state.userInfo);
		} else if (user.token && (!state.userInfo || !state.userInfo.token)) {
			state.login = true;
			state.userInfo = user;
		}
	},
	// 退出登录
	[OUT_LOGIN] (state) {
		state.userInfo = null;
		state.login = false;
		clearAllLocal();
	}
};
