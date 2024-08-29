import { useEffect } from "react"
import { history } from "../../_helper"
import { routeConfig } from "../../configs/routeConfig"

export const RootPage: React.FC = () => {
  useEffect(() => {
    history.navigate?.(routeConfig?.monitor)
  }, [])
  return null
}
