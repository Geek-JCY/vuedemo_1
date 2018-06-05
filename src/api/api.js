import Vue from 'vue';

const debug = process.env.NODE_ENV !== 'production';

// 生产环境下，获取所有数据
function appData(url) {
	console.log(url);
	Vue.http.get(url).then((res) => {
		console.log(res);
	});
}

// 生产环境下，获取 ratings 数据
function getProData(urlstr) {
	let arr = urlstr.split('?');
	let url = arr[0];
	let type = arr[1].split('=')[1];
	appData(url)
	.then((res) => Promise.resolve(res))
	.then((data) => getSwitchedData(data, type));
}

function getSwitchedData(data, type) {
	let switchData = '';
	switch (type) {
		case 'goods':
			switchData = {body: {errno: 0, data: data.goods}};
		break;
		case 'ratings':
			switchData = {body: {errno: 0, data: data.ratings}};
		break;
		case 'seller':
			switchData = {body: {errno: 0, data: data.seller}};
		break;
	}
	return Promise.resolve(switchData);
}

// 开发环境下，获取 ratings 数据
function getDevData(url) {
	return Vue.http.get(url).then((res) => new Promise((resolve, reject) => {
		resolve(res);
	}));
}

// 判断 生产环境 和 开发环境，从而 选择不同方法去调用不同的 api接口
function getData(url) {
	let data = '';
	if (debug) {
		data = getDevData(url);
	} else {
		data = getProData(url);
	}
	return data;
}

// 得到 goods 数据
export function getGoods() {
  const url = debug ? '/api/goods' : './data.json?name=goods';
  return getData(url);
}

// 得到 ratings 数据
export function getRatings() {
  const url = debug ? '/api/ratings' : './data.json?name=ratings';
  return getData(url);
}

// 得到 seller 数据
export function getSeller() {
  const url = debug ? '/api/seller' : './data.json?name=seller';
  return getData(url);
}
