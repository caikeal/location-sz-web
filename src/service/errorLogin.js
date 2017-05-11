import errors from './baseError.js';
import { MessageBox } from 'mint-ui';

const errorLogin = function (response) {
	if (errors(response) === false) {
		return false;
	}
	// 处理具体错误
	// 格式错误提示
	if (response.status === 422) {
		if (response.data.errors.hasOwnProperty('phone')) {
			MessageBox.alert(response.data.errors.phone[0], '提示');
			return false;
		}
		if (response.data.errors.hasOwnProperty('password')) {
			MessageBox.alert(response.data.errors.password[0], '提示');
			return false;
		}
		MessageBox.alert('帐号密码不匹配', '提示');
		return false;
	}
	// 普通错误提示
	MessageBox.alert(response.data.message, '提示');
	return false;
};

export default errorLogin;
