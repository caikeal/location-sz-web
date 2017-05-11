/**
 * 修改页面标题
 * @param  {Object || String || Number} title 标题
 * @return {[Boolean}                         页面修改状态
 */
const changeTitle = function (title) {
	if (typeof title === 'object') {
		if (title.hasOwnProperty('title')) {
			document.title = title.title;
			return true;
		} else if (title.hasOwnProperty('meta') &&
			(typeof title.meta === 'object') &&
			title.meta.hasOwnProperty('title')) {
			document.title = title.meta.title;
			return true;
		} else {
			return false;
		}
	} else if (typeof title === 'string' || typeof title === 'number') {
		document.title = title;
		return true;
	}
	return false;
};

export default changeTitle;
