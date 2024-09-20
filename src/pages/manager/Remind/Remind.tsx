import { FC, useEffect } from "react"
import { Tabs } from "antd"
import getTabItem from "../items/TabItem"
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
import ModalCreateRemind from "../../../conponents/modals/ModalCreateRemind"
import { getViahicle } from "../../../apis/viahicleAPI"
import axios from "axios"
import { getData } from "../../../utils/handleDataViahicle"
import {
  getIconRemindViahicleGPS,
  getRemindVehicleGPS,
} from "../../../apis/remindAPI"
import { log } from "console"
import { getTokenParam } from "../../../utils/_param"
import { api } from "../../../_helper"
import storage from "../../../utils/storage"

interface RemindProps {}

const Remind: FC<RemindProps> = () => {
  const [viahicles, setViahicles] = useState<ViahicleType[]>([])
  const [viahiclesNoGPS, setViahiclesNoGPS] = useState<ViahicleType[]>([])

  const [tab, setTab] = useState<string>("1")

  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  const fetchViahicle = async (
    keyword: string = "",
    limit: number = 10,
    offset: number = 0,
  ) => {
    // alert('co fe')
    dispatch?.setLoading?.(true)
    if (tab === "1") {
      try {
        const res = await axios.get(
          `https://sys01.midvietnam.net/api/v1/device/rows?keyword=${keyword}&offset=${offset}&limit=${limit}&type=1`,
          {
            headers: {
              Authorization: `Bearer ${storage.getAccessToken()}`,
            },
          },
        )

        const totalPage = res?.data?.totalPage
        dispatch?.setTotalPageGPS?.(totalPage)

        const remind_viahicles_gps = await getIconRemindViahicleGPS()

        const viahicleGPS = res?.data?.data?.map((item: any, index: number) => {
          return {
            key: index,
            id: item.id,
            license: item.imei,
            license_plate: item.vehicle_name,
            user_name: item.customer_name,
            imei: item.imei,
            icons: remind_viahicles_gps?.data[item.imei],
          }
        })
        dispatch?.setViahicleGPS?.(viahicleGPS)

        dispatch?.setLoading?.(false)
        setViahicles(viahicleGPS)
      } catch (error) {
        console.log("error  >>", error)
      }
    } else {
      try {
        const res = await getViahicle(keyword)
        console.log("dataa trc loc >>", res)

        const data = getData(res?.data)
        console.log("dataa loc >>", data)

        const remind_viahicles_NoGPS = await getIconRemindViahicleGPS()

        data.map((item: any) => {
          item["icons"] = remind_viahicles_NoGPS.data[item.license_plate]
        })

        setViahiclesNoGPS(data)
        dispatch?.setLoading?.(false)
      } catch (error) {
        console.log("error", error)
      }
    }
  }
  useEffect(() => {
    const keyword = viahiclesStore.keyword
    const keywordNoGPS = viahiclesStore.keywordNoGPS
    if (tab === "1") {
      fetchViahicle(keyword, viahiclesStore.limit, viahiclesStore.offset)
    } else {
      fetchViahicle(keywordNoGPS)
    }
  }, [
    tab,
    viahiclesStore.freshKey,
    viahiclesStore.keyword,
    viahiclesStore.keywordNoGPS,
    viahiclesStore.offset,
    viahiclesStore.limit,
  ])

  useEffect(() => {
    dispatch?.setViahicle([])
  }, [tab])

  const onChangeTab = (key: string) => {
    setTab(key)
    dispatch?.setTypeViahicle(key === "1" ? 1 : 0)
  }

  return (
    <div className="relative">
      <div
        className="mb-10 font-bold text-lg  "
        style={{ visibility: "hidden" }}
      >
        Quản lí Việc
      </div>
      <div className="action_create_remind flex justify-end absolute left-[450px] top-[80px] z-50 ">
        <ModalCreateRemind
          button={
            <Button type="primary" icon={<PlusCircleOutlined />}>
              Thêm
            </Button>
          }
        />
      </div>
      <Tabs
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
