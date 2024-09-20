import axios from "axios"
import { axiosInstance } from "../axios/serverInstanceNoAuth"

import { CategoryType } from "../interface/interface"
import { getTokenParam } from "../utils/_param"
import storage from "../utils/storage"
import { store } from "../app/store"
const SERVER_DOMAIN_REMIND = import.meta.env.VITE_HOST_REMIND_SERVER_DOMAIN

export const getIconRemindViahicleGPS = () => {
  return axiosInstance.get(`/main/get-category-all`)
}

export const addRemind = (data: any) => {
  return axios.post(`${SERVER_DOMAIN_REMIND}main/add-remind`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-mobicam-token": storage.getAccessToken(),
    },
  })
}

export const addRemindGPS = (data: any) => {
  return axios.post(`${SERVER_DOMAIN_REMIND}main/add-remind-gps`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-mobicam-token": storage.getAccessToken(),
    },
  })
}

export const updateRemind = (id: number, data: any) => {
  return axios.put(`${SERVER_DOMAIN_REMIND}main/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-mobicam-token": storage.getAccessToken(),
    },
  })
}

export const finishRemind = (id: number, data: any) => {
  return axios.post(`${SERVER_DOMAIN_REMIND}main/finish-remind/` + id, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-mobicam-token": storage.getAccessToken(),
    },
  })
}

export const getTimeRemind = (id: number) => {
  return axiosInstance.get("/main/get-schedule/" + id)
}

export const AutoFinishRemind = (id: number, tire_seri: any) => {
  const data = new FormData()
  data?.append("tire_seri", tire_seri)
  data?.append("token", storage.getAccessToken())
  return axios.post(`${SERVER_DOMAIN_REMIND}main/finish-remind/` + id, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-mobicam-token": storage.getAccessToken(),
    },
  })
}
export const getRemindByLisencePlate = (lisense_plate: string) => {
  return axiosInstance.get("/main/get-vehicle-id/" + lisense_plate)
}

export const getRemindAll = () => {
  return axiosInstance.get("/main/get-all/")
}

export const getRemindSearch = (keyword: string, lisense_plate: string) => {
  return axiosInstance.get(
    `/main/get-all?vehicle_id=${lisense_plate}&keyword=${keyword}`,
  )
}

export const TurnOnRemind = (id: number) => {
  return axiosInstance.patch("/main/update-notified-on/" + id)
}

export const TurnOffRemind = (id: number) => {
  return axiosInstance.patch("/main/update-notified-off/" + id)
}
// api: /api/v1/remind/main/delete-multi-remind/ body truyền object dạng thế này

export const deleMultiRemind = (vehicles: string[]) => {
  return axiosInstance.post("/main/delete-multi-remind/", { vehicles })
}

export const getRemindVehicleGPS = (
  lisense_plate: string,
  keyword: string = "",
) => {
  return axiosInstance.get(
    `/main/gps/get-all?vehicle_id=${lisense_plate}&keyword=${keyword}`,
  )
}
