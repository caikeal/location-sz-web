import {
	RECORD_USERINFO,
	SYNC_USERINFO,
	OUT_LOGIN,
	TASK_LIST,
	TO_SOLVE_TASK_LIST,
	CLEAR_TASK_LIST,
	MY_OWN_PLACE,
	MY_OWN_DIRECTION
} from './mutation-types.js';

import { readLocal, saveLocal, clearAllLocal } from '../utils/localstorage.js';

export default {
	// 登录并记录用户信息
	[RECORD_USERINFO] (state, info) {
		state.userInfo = info;
		state.login = true;
		saveLocal('user', info, 604800);
	},
	// 同步用户信息
	[SYNC_USERINFO] (state) {
		let user = readLocal('user');
		if (!user.token && state.userInfo && state.userInfo.token) {
			saveLocal('user', state.userInfo, 604800);
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
	},
	// 任务列表
	[TASK_LIST] (state, info) {
		state.taskList = info;
	},
	// 需要完成的任务列表
	[TO_SOLVE_TASK_LIST] (state, info) {
		state.toSolveTaskList = info;
	},
	// 清空任务列表和完成列表
	[CLEAR_TASK_LIST] (state) {
		state.taskList = [];
		state.toSolveTaskList = [];
	},
	[MY_OWN_PLACE] (state, info) {
		state.myPlace.x = info.x;
		state.myPlace.y = info.y;
		state.myPlace.type = info.type;
		state.myPlace.group_id = info.group_id;
	},
	[MY_OWN_DIRECTION] (state, info) {
		state.myPlace.direction = info;
	}
};
