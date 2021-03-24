function storeData<T>(data: T, key: string) {
  if (!window.localStorage || !window.JSON || !key) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(data));
}

function getData<T>(key: string) {
  if (!window.localStorage || !window.JSON || !key) {
    return;
  }
  var item = localStorage.getItem(key);

  if (!item) {
    return;
  }

  return JSON.parse(item) as T;
}

function removeData(key: string) {
  if (!window.localStorage || !window.JSON || !key) {
    return;
  }
  localStorage.removeItem(key);
}

export { storeData, getData, removeData };
