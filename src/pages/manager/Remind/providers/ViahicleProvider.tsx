import { FC } from "react"
import React from "react"
import { ViahicleType } from "../../../../interface/interface"

interface ViahicleProviderProps {
  viahiclesStore: ViahicleType[]
  freshKey?: number
  keyword?: string
  keywordNoGPS?: string

  type: number
  loading?: boolean
  viahicleGPS?: ViahicleType[]
  limit?: number
  offset?: number
  totalPageGPS?: number
  totalPageNoGPS?: number
}

export interface ViahicleProviderContextProps {
  viahiclesStore: ViahicleProviderProps

  dispatch: {
    setTotalPageNoGPS: (totalPageGPS: number) => void
    setTypeViahicle: (type: number) => void
    freshKey: () => void
    setKeyword: (keyword: string) => void
    setKeywordNoGPS: (keyword: string) => void
    setViahicle: (viahicle: ViahicleType[]) => void
    getIdViahicles: () => number[] // Assuming `id` is a string
    setLoading?: (loading: boolean) => void
    setViahicleGPS?: (viahicleGPS: ViahicleType[]) => void
    setOffset: (offset: number) => void
    setLimit: (limit: number) => void
    setTotalPageGPS?: (totalPageGPS: number) => void
  }
}

const initState: ViahicleProviderProps = {
  viahiclesStore: [],
  viahicleGPS: [],
  freshKey: 0,
  keyword: "",
  type: 1,
  loading: false,
  limit: 10,
  offset: 0,
  totalPageGPS: 0,
  totalPageNoGPS: 1,
}

export const viahiclesContext = React.createContext<
  ViahicleProviderContextProps | undefined
>(undefined)

const ViahicleProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viahiclesStore, setState] =
    React.useState<ViahicleProviderProps>(initState)

  const dispatch = {
    setTotalPageNoGPS: (totalPageNoGPS: number) => {
      setState((prevState) => ({
        ...prevState,
        totalPageNoGPS: totalPageNoGPS,
      }))
    },
    setTotalPageGPS: (totalPageGPS: number) => {
      setState((prevState) => ({
        ...prevState,
        totalPageGPS: totalPageGPS,
      }))
    },
    setTypeViahicle: (type: number) => {
      setState((prevState) => ({
        ...prevState,
        type: type,
      }))
    },
    setViahicleGPS: (viahicleGPS: ViahicleType[]) => {
      setState((prevState) => ({
        ...prevState,
        viahicleGPS: viahicleGPS,
      }))
    },
    freshKey: () => {
      setState({ ...viahiclesStore, freshKey: Math.random() })
    },

    setLoading: (loading: boolean) => {
      setState((prevState) => ({
        ...prevState,
        loading: loading,
      }))
    },
    setKeyword: (keyword: string) => {
      setState({ ...viahiclesStore, keyword: keyword })
    },
    setKeywordNoGPS: (keyword: string) => {
      setState({ ...viahiclesStore, keywordNoGPS: keyword })
    },
    setViahicle: (viahicle: ViahicleType[]) => {
      setState((prevState) => ({
        ...prevState,
        viahiclesStore: viahicle,
      }))
    },
    getIdViahicles: () => {
      return viahiclesStore.viahiclesStore
        .map((viahicle) => viahicle.id)
        .filter((id) => id !== undefined)
    },
    setOffset: (offset: number) => {
      setState((prevState) => ({
        ...prevState,
        offset: offset,
      }))
    },
    setLimit: (limit: number) => {
      setState((prevState) => ({
        ...prevState,
        limit: limit,
      }))
    },
  }

  return (
    <viahiclesContext.Provider value={{ viahiclesStore, dispatch }}>
      {children}
    </viahiclesContext.Provider>
  )
}

export default ViahicleProvider
