import { FC } from "react"
import React from "react"
import { ViahicleType } from "../../../../interface/interface"

interface ViahicleProviderProps {
  viahiclesStore: ViahicleType[]
  freshKey?: number
  keyword?: string
  type: number
  loading?: boolean
  viahicleGPS?: ViahicleType[]
  drawIndex?: any
  keywordNoGPS?: string
}

export interface ViahicleProviderContextProps {
  viahiclesStore: ViahicleProviderProps

  dispatch: {
    setDrawIndex: (index: any) => void
    setTypeViahicle: (type: number) => void
    freshKey: () => void
    setKeyword: (keyword: string) => void
    setViahicle: (viahicle: ViahicleType[]) => void
    setKeywordNoGPS: (keyword: string) => void
    getIdViahicles: () => number[] // Assuming `id` is a string
    setLoading?: (loading: boolean) => void
    setViahicleGPS?: (viahicleGPS: ViahicleType[]) => void
  }
}

const initState: ViahicleProviderProps = {
  viahiclesStore: [],
  viahicleGPS: [],
  freshKey: 0,
  keyword: "",
  type: 1,
  loading: false,
}

export const viahiclesContext = React.createContext<
  ViahicleProviderContextProps | undefined
>(undefined)

const ViahicleProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viahiclesStore, setState] =
    React.useState<ViahicleProviderProps>(initState)

  const dispatch = {
    setDrawIndex: (index: any) => {
      setState((prevState) => ({
        ...prevState,
        drawIndex: index,
      }))
    },
    setTypeViahicle: (type: number) => {
      setState((prevState) => ({
        ...prevState,
        type: type,
      }))
    },
    setKeywordNoGPS: (keyword: string) => {
      setState({ ...viahiclesStore, keywordNoGPS: keyword })
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
  }

  return (
    <viahiclesContext.Provider value={{ viahiclesStore, dispatch }}>
      {children}
    </viahiclesContext.Provider>
  )
}

export default ViahicleProvider
