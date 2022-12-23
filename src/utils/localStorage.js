//保存缓存
export function setStorage(name, data) {
	localStorage.setItem(name, data);
}

//获取缓存
export function getStorage(name) {
	return localStorage.getItem(name);
}