import ua from './uaTest.js';

let isJB = false;

if (ua.isMyApp) {
	isJB = true;
}

// 设置Odin对象下的属性
if (!window.hasOwnProperty('Odin')) {
	Object.defineProperty(window, 'Odin', {
		enumerable: true,
		configurable: true,
		writable: true,
		value: {}
	});
	window.Odin = {
		setBeaconInfo (info) {
			return true;
		},
		compassHeading (info) {
			return true;
		}
	};
}

// 开启beacon监听
const startMonitor = function () {
	if (!isJB) {
		console.warn('please use in my app');
		return false;
	}
	let iframe = document.createElement('iframe');
	iframe.src = 'beacon://startRanging';
	iframe.style.display = 'none';
	iframe.addEventListener('load', function () {
		// window.alert('start1!');
		document.body.removeChild(iframe);
	});
	document.body.appendChild(iframe);
	setTimeout(function () {
		// window.alert('start2!');
		document.body.removeChild(iframe);
	}, 2000);
	return true;
};

// 关闭beacon监听
const stopMonitor = function () {
	if (!isJB) {
		console.warn('please use in my app');
		return false;
	}
	let iframe = document.createElement('iframe');
	iframe.src = 'beacon://stopRanging';
	iframe.style.display = 'none';
	iframe.addEventListener('load', function () {
		// window.alert('stop1!');
		document.body.removeChild(iframe);
	});
	document.body.appendChild(iframe);
	setTimeout(function () {
		// window.alert('stop2!');
		document.body.removeChild(iframe);
	}, 2000);
	return true;
};

// beacon的回调方法
const setBeaconInfo = function (callback) {
	if (!isJB) {
		console.warn('please use in my app');
		return false;
	}
	if (typeof callback === 'function') {
		window.Odin.setBeaconInfo = callback;
	} else {
		console.warn('need a function');
		return false;
	}
};

// 实时获取compass heading
const compassHeading = function (callback) {
	if (typeof callback === 'function') {
		window.Odin.compassHeading = callback;
	} else {
		console.warn('need a function');
		return false;
	}
};

const odin = { startMonitor, stopMonitor, setBeaconInfo, compassHeading };

export default odin;
