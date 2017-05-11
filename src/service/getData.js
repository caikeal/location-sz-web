import axios from 'axios';
import env from '../config/env.js';
import {readLocal} from '../utils/localstorage.js';

/**
 * 接口调用类参数统一配置.
 */
axios.defaults.baseURL = env.baseUrl;
axios.defaults.timeout = 5000;
let user = readLocal('user');
if (user && user.token) {
	axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
}

/**
 * 登录接口.
 * @param  { String } phone     手机号
 * @param  { String } password  密码
 * @return { Promise }
 */
let login = (phone, password) => {
	return new Promise((resolve, reject) => {
		axios.post('/login', {phone: phone, password: password})
		.then((res) => {
			axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.token}`;
			resolve(res);
		})
		.catch((err) => {
			reject(err);
		});
	});
};

/**
 * 退出登录接口.
 * @return { Promise }
 */
let logout = () => {
	return axios.get('/logout');
};

export default { axios, login, logout };
