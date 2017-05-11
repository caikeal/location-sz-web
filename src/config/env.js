/**
 * 配置编译环境和线上环境之间的切换
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 */
let baseUrl;
let routerMode;
const imgBaseUrl = 'http://139.196.11.82:8100';

if (process.env.NODE_ENV === 'development') {
	baseUrl = 'http://localhost:8080/api/v1';
	routerMode = 'hash';
} else {
	baseUrl = 'http://139.196.11.82:8100/api/v1';
	routerMode = 'hash';
};

export default {
	baseUrl,
	routerMode,
	imgBaseUrl
};
