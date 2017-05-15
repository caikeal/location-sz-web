import axios from 'axios';
import env from '../config/env.js';
import {readLocal} from '../utils/localstorage.js';

/**
 * 接口调用类参数统一配置.
 */
axios.defaults.baseURL = env.baseUrl;
axios.defaults.timeout = 8000;
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

/**
 * 图片上传
 * @param  { FormData } poster 图片文件
 * @return { Promise }
 */
let upload = (poster) => {
	return axios.post('/upload/images', poster);
};

/**
 * 上报位置信息
 * @param  { String } options.type                定位类型，S:无需上报，W:巡检中，N:非巡检中
 * @param  { Number|String } options.x            巡检点x
 * @param  { Number|String } options.y            巡检点y
 * @param  { Number|String } options.group_id     巡检点楼层
 * @return { Promise }
 */
let reportingLocation = ({type, x, y, group_id}) => {
	return axios.post('/point', {type, x, y, group_id});
};

/**
 * 任务列表
 * @return { Promise }
 */
let taskList = () => {
	return axios.get('/tasks');
};

export default { axios, login, logout, upload, reportingLocation, taskList };
