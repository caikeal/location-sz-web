import errors from './baseError.js';
import { MessageBox } from 'mint-ui';
const errorPublic = function (response) {
	if (errors(response) === false) {
		return false;
	}
	// 处理具体错误
	// 格式错误提示
	if (response.status === 422) {
		MessageBox.alert(response.data.message, '提示');
		return false;
	}
	// 普通错误提示
	MessageBox.alert(response.data.message, '提示');
	return false;
};

export default errorPublic;
