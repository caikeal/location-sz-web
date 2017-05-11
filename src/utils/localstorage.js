/**
 * 注册localstorage事件，加入超时时间。
 */
let expiration = 86400;         // 默认过期时间24h的秒数
const baseHead = 'hwsh_ins';    // 保存基础空间名

/**
 * 保存
 * @param  {String} head        保存空间
 * @param  data                 保存数据
 * @param  {Number|String} exp  保存持续时间
 * @return {Boolean}            保存状态
 */
const saveLocal = function (head, data, exp = '') {
	if (!window.localStorage) return false;    // localStorage不支持则不使用
	let expirationTime = expiration;
	if (typeof exp === 'number') {
		expirationTime = exp;
	}
	expirationTime = expirationTime * 1000;
	let res = {};
	let tplHead = `${baseHead}:${head}`;
	res.data = data;
	res.expiration = +new Date() + expirationTime;
	window.localStorage.setItem(tplHead, JSON.stringify(res));
	return true;
};

/**
 * 读取
 * @param  {String} head                             保存空间
 * @return {Boolean|Object|Array|Number|String}      数据
 */
const readLocal = function (head) {
	let tplHead = `${baseHead}:${head}`;
	let data = '';
	if (!window.localStorage) return false;    // localStorage不支持则不使用
	data = window.localStorage.getItem(tplHead);
	data = data ? JSON.parse(data) : {};
	// 超时返回false
	if (!data.hasOwnProperty('expiration') || data.expiration < +new Date()) {
		window.localStorage.removeItem(tplHead);
		return false;
	}
	return data.data;
};

/**
 * 清除指定空间数据
 * @param  {String} head  保存空间
 * @return {Boolean}      清除状态
 */
const clearLocal = function (head) {
	let tplHead = `${baseHead}:${head}`;
	if (!window.localStorage) return false;    // localStorage不支持则不使用
	window.localStorage.removeItem(tplHead);
	return true;
};

/**
 * 清除全部数据
 * @return {Boolean} 清除状态
 */
const clearAllLocal = function () {
	if (!window.localStorage) return false;    // localStorage不支持则不使用
	window.localStorage.clear();
	return true;
};

export { saveLocal, readLocal, clearLocal, clearAllLocal };
