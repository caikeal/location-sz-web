/**
* 接口错误信息统一处理
* 在需要登录验证的地方必须引入vuex的goLogout方法进行登出
*/
import { MessageBox } from 'mint-ui';
import store from '../store';
import router from '../router';

const errors = function (error) {
	if (error.status === 500) {
		MessageBox.alert('系统出错了！', '提示');
		return false;
	} else if (error.status === 401 && error.data.code !== '401001') {
		MessageBox.alert('请登录！', '提示').then(function () {
			// 返回登录页面
			try {
				// 登出
				store.dispatch('fedLogout').then(() => {
					router.push({ name: 'Login' });
				});
			} catch (e) {}
		});
		return false;
	} else if (error.status === 0) {
		MessageBox.alert('网络错误！', '提示');
		return false;
	} else {
		return error.data;
	}
};

export default errors;
