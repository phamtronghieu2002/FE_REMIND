import { FC, useEffect } from "react"
import { Tabs } from "antd"
import getTabItem from "../items/TabItemMobile"
import { useState } from "react"
import { ViahicleType } from "../../../interface/interface"
import { Button } from "antd"
import { PlusCircleOutlined } from "@ant-design/icons"
import ViahicleProvider from "./providers/ViahicleProvider"
import { useContext } from "react"
import {
  viahiclesContext,
  ViahicleProviderContextProps,
} from "./providers/ViahicleProvider"
import ModalCreateRemindMobile from "../../../conponents/modals/ModalCreateRemindMobile"
import { getViahicle } from "../../../apis/viahicleAPI"

import { getData } from "../../../utils/handleDataViahicle"
import "./customeTab.scss"
import axios from "axios"
import {
  getIconRemindViahicleGPS,
  getRemindVehicleGPS,
} from "../../../apis/remindAPI"
import { getTokenParam } from "../../../utils/_param"
interface RemindProps {}

const Remind: FC<RemindProps> = () => {
  const [viahicles, setViahicles] = useState<ViahicleType[]>([])
  const [viahiclesNoGPS, setViahiclesNoGPS] = useState<ViahicleType[]>([])

  const [tab, setTab] = useState<string>("1")
  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  console.log("viahicle mới nhât >>", viahiclesStore)

  const fetchViahicle = async (keyword: string = "") => {
    // alert('co fe')
    setViahicles([])
    dispatch?.setLoading?.(true)
    if (tab === "1") {
      try {
        const res = await axios.get(
          `https://sys01.midvietnam.net/api/v1/device/rows?keyword=${keyword}&offset=0&limit=50&type=1`,
          {
            headers: {
              Authorization: `Bearer ${getTokenParam()}`,
            },
          },
        )

        const remind_viahicles_gps = await getIconRemindViahicleGPS()

        const viahicleGPS = res?.data?.data?.map((item: any) => {
          return {
            key: item.id,
            id: item.id,
            license: item.imei,
            license_plate: item.vehicle_name,
            user_name: item.customer_name,
            imei: item.imei,
            icons: remind_viahicles_gps?.data[item.imei],
          }
        })

        // for (let i = 0; i < viahicleGPS?.length; i++) {
        //   try {
        //     const reminds: any = await getRemindVehicleGPS(viahicleGPS[i].imei)
        //     const icons: any = []
        //     reminds?.data?.forEach((item: any) => {
        //       item?.icon && icons.push(item.icon)
        //     })
        //     viahicleGPS[i]["icons"] = icons
        //   } catch (error) {
        //     api.message?.error("Lỗi !!")
        //   }
        // }

        dispatch?.setLoading?.(false)
        setViahicles(viahicleGPS)
      } catch (error) {
        console.log("error  >>", error)
      }
    } else {
      try {
        const res = await getViahicle(keyword)
        const data = getData(res?.data)
        setViahiclesNoGPS(data)
        dispatch?.setLoading?.(false)
      } catch (error) {
        console.log("error", error)
      }
    }
  }
  useEffect(() => {
    const keyword = viahiclesStore.keyword
    fetchViahicle(keyword)
  }, [tab, viahiclesStore.freshKey, viahiclesStore.keyword])

  useEffect(() => {
    dispatch?.setViahicle([])
  }, [tab])

  const onChangeTab = (key: string) => {
    setTab(key)
    dispatch?.setTypeViahicle(key === "1" ? 1 : 0)
  }

  return (
    <div className="relative remind_mobile">
      <div className="action_create_remind "></div>
      <Tabs
        type="card"
        defaultActiveKey="1"
        items={getTabItem(viahicles, viahiclesNoGPS)}
        onChange={onChangeTab}
      />
    </div>
  )
}
const RemindMeMo: FC = () => (
  <ViahicleProvider>
    <Remind />
  </ViahicleProvider>
)
export default RemindMeMo
