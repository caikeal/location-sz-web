import { OUT_LOGIN } from './mutation-types.js';

export default {
	fedLogout ({commit, state}) { // 前端的登出
		return new Promise(resolve => {
			commit(OUT_LOGIN);
			resolve();
		});
	}
};
