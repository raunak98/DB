export const setLocalStorageData = (uid, data) => {
  localStorage.setItem(uid, data)
}

export const getLocalStorageData = (uid) => JSON.parse(localStorage.getItem(uid))
