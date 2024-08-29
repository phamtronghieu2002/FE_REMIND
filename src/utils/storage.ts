import { _const } from "../_constant"

const storage = {
  getItem: function (key: string) {
    const items: string | null = localStorage.getItem(`${key}`)
    if (!items) return false
    return JSON.parse(items)
  },
  setItem: function (key: string, items: object | string) {
    localStorage.setItem(`${key}`, JSON.stringify(items))
  },
  remove: function (key: string) {
    localStorage.removeItem(`${key}`)
  },

  setAccessToken: function (t: string) {
    const { token, accessToken } = _const.storeKey
    const oldToken = storage?.getItem(token)

    const newToken = { ...(oldToken || {}), [accessToken]: t }

    storage.setItem(token, newToken)
  },
  setToken: function (a: string, f: string) {
    const { token, refeshToken, accessToken } = _const.storeKey

    storage.setItem(token, {
      [accessToken]: a,
      [refeshToken]: f,
    })
  },

  clearToken: function () {
    const { token } = _const.storeKey

    storage.remove(token)
  },

  getAccessToken: function () {
    const { token, accessToken } = _const.storeKey
    return storage.getItem(token)?.[accessToken]
  },
  getAccessTokenBearer: function () {
    const { token, accessToken } = _const.storeKey
    return `Bearer ${storage.getItem(token)?.[accessToken]}`
  },
  getRefreshToken: function () {
    const { token, refeshToken } = _const.storeKey
    return storage.getItem(token)?.[refeshToken]
  },
  getDeviceToken: function () {
    return storage.getItem(_const.storeKey.deviceToken)
  },
}

export default storage
