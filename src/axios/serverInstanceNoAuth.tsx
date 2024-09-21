const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN
const ADDRESS_DOMAIN = import.meta.env.VITE_ADDRESS_DOMAIN
const SERVER_DOMAIN_REMIND = import.meta.env.VITE_HOST_REMIND_SERVER_DOMAIN
const SERVER_DOMAIN_FIREBASE = import.meta.env.VITE_HOST_FIREBASE_SERVER_DOMAIN

import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { _const } from "../_constant"
import storage from "../utils/storage"
import { getTokenParam } from "../utils/_param"
import { getAccessTokenService } from "../services/userServices"
import { api } from "../_helper"
import { _app } from "../utils/_app"

const getTokenAuthHeader = (token: string) => `${token}`

const createNoAuthInstance = (API: string) => {
  const serverInstanceNoAuth = axios.create({
    baseURL: API,
    headers: { "Content-Type": "application/json" },
  })

  const interceptorsRq = (config: InternalAxiosRequestConfig<any>) => {
    let accessToken = storage.getAccessToken() || getTokenParam()

    config.headers["x-mobicam-token"] = getTokenAuthHeader(accessToken)

    config.timeout = 60000 * 5 || _const?.axios?.timeout

    return config
  }
  const interceptorsRqError = (error: any) => {
    return Promise.reject(error)
  }

  const interceptorsRs = (response: AxiosResponse<any, any>) => {
    return response?.data
  }
  const interceptorsRsError = async (error: any) => {
    const status = error?.response?.status
    console.log("status >>>>", status)

    if (status === 401 || status === 403) {
      try {
        const fb: any = await getAccessTokenService()
        if (fb?.result == 1) {
          const originalRequest = error.config
          return serverInstanceNoAuth(originalRequest)
        }
      } catch (error: any) {
        
        if (error?.result == 2) {
          api.message?.error(_const?.string?.message?.network)
        }
        if (error?.result == 3) {
          _app?.logout?.()
        }
      }
    }

    return Promise.reject(error)
  }

  serverInstanceNoAuth.interceptors.request.use(
    interceptorsRq,
    interceptorsRqError,
  )
  serverInstanceNoAuth.interceptors.response.use(
    interceptorsRs,
    interceptorsRsError,
  )

  return serverInstanceNoAuth
}

export const serverInstanceNoAuth = createNoAuthInstance(SERVER_DOMAIN)
export const addressInstance = createNoAuthInstance(ADDRESS_DOMAIN)

// export const axiosInstance = createNoAuthInstance(
//   "https://midvnremindbe-production.up.railway.app/api/v1/remind/",
// )

// export const axiosInstance = createNoAuthInstance(
//   "http://192.168.2.24:3005/api/v1/remind/",
// )

// export const axiosInstance = createNoAuthInstance(
//   "http://192.168.2.42:3005/api/v1/remind/",
// )

// export const axiosInstance = createNoAuthInstance(
//   "http://192.168.2.42:3005/api/v1/remind/",
// )

// export const axiosInstance = createNoAuthInstance(
//   "http://26.73.188.74:3005/api/v1/remind/",
// )

// export const axiosFireBaseInstance = createNoAuthInstance(
//   "http://192.168.2.42:3005/api/v1/token-firebase/",
// )

export const axiosFireBaseInstance = createNoAuthInstance(
  SERVER_DOMAIN_FIREBASE,
)

export const axiosInstance = createNoAuthInstance(SERVER_DOMAIN_REMIND)
