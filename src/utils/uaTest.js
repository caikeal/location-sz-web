const ua = window.navigator.userAgent.toLowerCase();
let isMyApp = false;
if (ua.indexOf('android') !== -1 && ua.indexOf('mobile') !== -1) {
	isMyApp = true;
} else if (ua.indexOf('mobile') !== -1) {
	isMyApp = true;
}

export default {isMyApp};
