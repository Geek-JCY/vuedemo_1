import Vue from 'vue';

const debug = process.env.NODE_ENV !== 'production';

// 得到 goods 数据
export function getGoods() {
	const url = '/api/goods';
	return debug ? getDevData(url) : getProData(url);
}

// 得到 ratings 数据
export function getRatings() {
	const url = '/api/ratings';
	return debug ? getDevData(url) : getProData(url);
}

// 得到 seller 数据
export function getSeller() {
	const url = '/api/seller';
	return debug ? getDevData(url) : getProData(url);
}

// 开发环境下，获取数据
function getDevData(url) {
	return Vue.http.get(url).then((res) => Promise.resolve(res));
}

// 生产环境下，获取匹配数据
function getProData(url) {
	return appData().then((res) => Promise.resolve(getSwitchedData(res, url)));
}

// 生产环境下，获取所有数据
function appData() {
	const url = './data.json';
	return Vue.http.get(url).then((res) => Promise.resolve(res));
}

// 匹配对应所需数据
function getSwitchedData(data, url) {
	let switchData = '';
	switch (url) {
		case '/api/goods':
			switchData = {body: {errno: 0, data: data.body.goods}};
		break;
		case '/api/ratings':
			switchData = {body: {errno: 0, data: data.body.ratings}};
		break;
		case '/api/seller':
			switchData = {body: {errno: 0, data: data.body.seller}};
		break;
	}
	return switchData;
}
