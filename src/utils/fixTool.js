// 浏览器可用高度（去除浏览器头部和底部栏目）
export function getScreenHeight () {
	let height = 0;
	height = document.body.scrollHeight ? document.body.scrollHeight : window.screen.availHeight;
	return height;
};

// 滚动条高度
export function getScrollTop () {
	let height = 0;
	height = document.body.scrollTop ? document.body.scrollTop : 0;
	return height;
};

// body元素实际高度
export function getClientHeight () {
	let height = 0;
	height = document.body.clientHeight ? document.body.clientHeight : document.body.scrollHeight;
	return height;
};

// 获取本地上传的图片
export function getFileUrl (sourceId) {
	let url;
	let isImg = false;
	let type = sourceId.files.item(0) ? sourceId.files.item(0).type : '';
	// 判断是否为图片
	switch (type) {
	case 'image/png':
		isImg = true;
		break;
	case 'image/jpeg':
		isImg = true;
		break;
	case 'image/jpg':
		isImg = true;
		break;
	default:
		isImg = false;
		break;
	}

	if (!isImg) {
		url = null;
	}

	try {
		if (navigator.userAgent.indexOf('MSIE') >= 1) { // IE
			url = sourceId.value;
		} else if (navigator.userAgent.indexOf('Firefox') > 0) { // Firefox
			url = window.URL.createObjectURL(sourceId.files.item(0));
		} else if (navigator.userAgent.indexOf('Chrome') > 0) { // Chrome
			url = window.URL.createObjectURL(sourceId.files.item(0));
		} else {
			url = window.URL.createObjectURL(sourceId.files.item(0));
		}
	} catch (e) {
		url = null;
	}
	return url;
};

// 将'\r\n,\r,\n'转义为'<br>'
export function line2br (text) {
	return text.replace(/\r|\n|\r\n/g, '<br>');
};

// 判断手机是否是微信
export function isWechat () {
	let ua = navigator.userAgent.toLowerCase();
	return /wechat|micromessenger/g.test(ua);
};

export function toCNTime (time) {
	let year = time.getFullYear();
	let month = time.getMonth() + 1 < 10 ? `0${time.getMonth() + 1}` : time.getMonth() + 1;
	let day = time.getDate() < 10 ? `0${time.getDate()}` : time.getDate();
	let weekTem = time.getDay();
	let week = '';
	let weekday = [];
	weekday[0] = '日';
	weekday[1] = '一';
	weekday[2] = '二';
	weekday[3] = '三';
	weekday[4] = '四';
	weekday[5] = '五';
	weekday[6] = '六';
	week = weekday[weekTem];
	let hour = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
	let minute = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
	let second = time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds();
	return {
		year,
		month,
		day,
		week,
		hour,
		minute,
		second
	};
}
