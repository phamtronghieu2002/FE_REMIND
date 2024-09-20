import { FC, memo, useContext, useEffect, useState } from "react"
import React from "react"
import {
  Button,
  Form,
  Switch,
  Select,
  Checkbox,
  Popconfirm,
  message,
} from "antd"
import DrawC from "../DrawC/DrawC"
import { Tabs } from "antd"
import type { TabsProps } from "antd"
import { TableC } from "../TableC"
import { TableColumnsType } from "antd"
import ModalCreateRemind from "../modals/ModalCreateRemind"
import { PopconfirmProps } from "antd/lib"
import ModalCreateTire from "../modals/ModalCreateTire"
import { use } from "i18next"
import { TireProps, ViahicleType } from "../../interface/interface"
import { getTire } from "../../apis/tireAPI"
import { api } from "../../_helper"
import {
  AutoFinishRemind,
  getRemindAll,
  getRemindByLisencePlate,
  getRemindSearch,
  getRemindVehicleGPS,
  TurnOffRemind,
  TurnOnRemind,
} from "../../apis/remindAPI"
import { getViahicle } from "../../apis/viahicleAPI"
import {
  ViahicleProviderContextProps,
  viahiclesContext,
} from "../../pages/manager/Remind/providers/ViahicleProvider"
import { MaskLoader } from "../Loader"
import getTime from "../../utils/getTime"
import moment from "moment"
import { log } from "console"

export interface RemindProps {
  id?: number
  vehicle_id?: number
  license_plate?: string
  user_id?: number
  license?: string
  vehicle_create_time?: number
  vehicle_update_time?: number | null
  remind_id?: number
  remind_img_url?: string | null
  note_repair?: string
  history_repair?: string | null
  current_kilometers?: number
  cumulative_kilometers?: number
  expiration_time?: number
  time_before?: number
  is_notified: number
  is_received: number
  remind_create_time?: number
  remind_update_time?: number | null
  category_id?: number
  category_name: string
  category_desc?: string | null
  category_icon?: string | null
  category_create_time?: number
  category_update_time?: number
  category_is_deleted?: number
}

interface filterProps {
  select: string
  keyword: string
}
interface DrawViahicleProps {
  button: React.ReactNode
  title: string
  data: any
}

interface DetailViahicleComponentsProps {
  closeModal: any
  data: any
}

const TabTableRemind = memo(({ data, isReload }: any) => {
  const viahicleInfor = data
  const [reminds, setReminds] = useState<RemindProps[]>([])
  const [remindsFilter, setRemindsFilter] = useState<RemindProps[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { viahiclesStore } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps
  const [filter, setFilter] = useState<filterProps>({
    select: "all",
    keyword: "",
  })

  const [loadingButton, setLoadingButton] = useState<number>(0)
  const [isShowModal, setIsShowModal] = useState(false)

  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    setIsShowModal(true)
  }

  const handleCancel = async (e: any, remind: any) => {
    try {
      await AutoFinishRemind(remind?.remind_id, remind?.tire_seri)
      api.message?.success("Gia hạn thông báo thành công")
      fetchRemind()
    } catch (error) {}
    cancel?.(e)
  }

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    setIsShowModal(false)
  }
  const onSearch = (q: string) => {
    setFilter({ ...filter, keyword: q })
  }

  const fetchRemind = async (keyword: string = "") => {
    // alert("re render remind")
    // call api get remind by viahicle id or license plate
    setLoading(true)
    const type = viahiclesStore?.type
    try {
      if (type == 0) {
        let res: any = []
        res = await getRemindSearch(keyword, data?.license_plate)
        const reminds = res?.data.filter(
          (item: any) => item?.remind_id !== null,
        )
        const remindsHandle = reminds.map((item: any) => ({
          ...item,
          expiration_timeStamp: moment(item?.expiration_time),
          expiration_time: getTime.formatDate(item?.expiration_time),
        }))
        setReminds(remindsHandle)
        setRemindsFilter(remindsHandle)
      } else {
        let res: any = []
        res = await getRemindVehicleGPS(data?.imei, keyword)
        const reminds = res?.data.filter(
          (item: any) => item?.remind_id !== null,
        )
        const remindsHandle = reminds.map((item: any) => ({
          ...item,
          expiration_timeStamp: moment(item?.expiration_time),

          expiration_time: getTime.formatDate(item?.expiration_time),
        }))
        setReminds(remindsHandle)
        setRemindsFilter(remindsHandle)
      }
      setLoading(false)
    } catch (error) {
      api.message?.error("Lỗi khi lấy dữ liệu nhắc nhở !!")
    }
  }

  useEffect(() => {
    const keyword = filter.keyword
    fetchRemind(keyword)
  }, [filter.keyword, filter.select, isReload])
  //   column

  const handleOnOf = async (checked: boolean, data: RemindProps) => {
    //  call api bật tắt thông báo
    const remindId = data?.remind_id
    const notifyTilte = checked
      ? "bật thông báo thành công"
      : "tắt thông báo thành công"
    try {
      setLoadingButton(remindId || 0)
      if (checked) {
        await TurnOnRemind(remindId || 0)
      } else {
        await TurnOffRemind(remindId || 0)
      }
      api.message?.success(notifyTilte)
      setLoadingButton(0)
      fetchRemind()
    } catch (error) {
      console.log(error)
    }
  }

  const columns: TableColumnsType<RemindProps> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Nội dung nhắc nhở",
      dataIndex: "note_repair",
      key: "note_repair",
      sorter: (a, b) =>
        (a.note_repair ?? "").length - (b.note_repair ?? "").length,
    },
    {
      title: "Dịch vụ",
      dataIndex: "category_name",
      key: "category_name",
      sorter: (a, b) => a.category_name.length - b.category_name.length,
    },
    {
      title: "Km",
      dataIndex: "cumulative_kilometers",
      key: "cumulative_kilometers",
    },
    {
      title: "Thời hạn",
      dataIndex: "expiration_time",
      key: "expiration_time",
    },

    {
      title: "Bật/tắt",
      dataIndex: "isOn",
      key: "isOn",
      render: (text, record, index) => {
        console.log("====================================")
        console.log("record >>>", record)
        console.log("====================================")
        return (
          <Switch
            loading={record?.remind_id === loadingButton}
            checked={record?.is_notified === 0 ? true : false}
            onChange={(e) => {
              handleOnOf(e, record)
            }}
          />
        )
      },
    },

    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (text, record, index) => (
        <ModalCreateRemind
          type="update"
          onReload={fetchRemind}
          remindData={record}
          button={<Button type="link">Cập nhật</Button>}
        />
      ),
    },
    {
      title: "Hoàn thành",
      dataIndex: "isFinish",
      key: "isFinish",
      render: (text, record, index) => (
        <Popconfirm
          title="Xác nhận hoàn thành nhắc nhở"
          description="Bạn có muốn cập nhật thông tin cho chu kì tiếp theo không?"
          onConfirm={confirm}
          onCancel={(e) => handleCancel(e, record)}
          okText={
            <ModalCreateRemind
              isUpdateCycleForm
              type="update-cycle"
              onReload={fetchRemind}
              remindData={record}
              button={<span>OK</span>}
            />
          }
          cancelText="No"
        >
          <Button>Hoàn thành</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <>
      <p className="absolute top-[-120px]"> </p>
      {loading && <MaskLoader />}
      <TableC
        title="Danh sách nhắc nhở"
        hiddenTitle
        onReload={() => {
          fetchRemind()
        }}
        search={{
          placeholder: "Tìm kiếm nội dung,dịch vụ,...",
          width: 200,
          onSearch(q) {
            onSearch(q)
          },
          limitSearchLegth: 3,
        }}
        right={<div className=""></div>}
        props={{
          columns: columns,
          dataSource: remindsFilter,
          size: "middle",
          pagination: {},
        }}
      />
    </>
  )
})

export const TabTableTire: FC<{
  isAddTireButton?: boolean
  data: ViahicleType | TireProps
  isReload?: number
  onReFresh?: () => void
}> = ({ data, isReload, isAddTireButton, onReFresh }) => {
  const columns: TableColumnsType<TireProps> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Số seri",
      dataIndex: "seri",
      key: "seri",
    },
    {
      title: "Nhãn hiệu",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
    },

    {
      title: "Thao tác",
      dataIndex: "isOn",
      key: "isOn",
      render: (text, record, index) => (
        <div className="flex justify-start">
          <ModalCreateTire
            onRefresh={() => {
              fetchTire()
              onReFresh?.()
            }}
            button={<Button type="link">Cập nhật</Button>}
            type="update"
            data={record}
          />
          <ModalCreateTire
            onRefresh={() => {
              fetchTire()
              onReFresh?.()
            }}
            button={<Button type="link">Xóa</Button>}
            type="delete"
            data={record}
          />
        </div>
      ),
    },
  ]
  const [tires, setTires] = useState<TireProps[]>([])
  const [keyword, setKeyword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const fetchTire = async (keyword: string = "") => {
    try {
      setLoading(true)
      const res = await getTire(
        data?.imei ? data?.imei : data?.license_plate || "",
        keyword,
      )
      setTires(res?.data)
      setLoading(false)
    } catch (error) {}
  }
  useEffect(() => {
    fetchTire(keyword)
  }, [isReload, keyword])

  return (
    <div>
      {loading && <MaskLoader />}
      <TableC
        hiddenTitle
        title="123"
        search={{
          placeholder: "Tìm kiếm seri,nhãn hiệu,kích thước,...",
          width: 200,
          onSearch(q) {
            setKeyword(q)
          },
          limitSearchLegth: 3,
        }}
        onReload={() => {
          fetchTire()
          onReFresh?.()
        }}
        right={
          <div className="ml-5 flex items-center">
            {isAddTireButton && (
              <ModalCreateTire
                data={data}
                onRefresh={() => {
                  fetchTire()
                  onReFresh?.()
                }}
                button={<Button type="primary">Thêm lốp</Button>}
                type="add"
              />
            )}
          </div>
        }
        props={{
          columns: columns,
          dataSource: tires,
          size: "middle",
          pagination: {},
        }}
      />
    </div>
  )
}
const DetailViahicleComponents: FC<DetailViahicleComponentsProps> = ({
  closeModal,
  data,
}: any) => {
  useEffect(() => {
    // alert('xin chao')
  }, [])
  const viahicleInfor = data

  const [isReload, setIsReload] = useState<number>(0)

  const onReload = () => {
    setIsReload(Math.random())
  }
  const items = (reload: () => void): TabsProps["items"] => [
    {
      key: "2",
      label: "Nhắc nhở của phương tiện",
      children: <TabTableRemind isReload={isReload} data={viahicleInfor} />,
    },
    {
      key: "3",
      label: "Lốp của phương tiện",
      children: <TabTableTire isAddTireButton data={viahicleInfor} />,
    },
  ]

  return (
    <div className="relative">
      <div className="absolute z-50 left-[350px] top-[11px]">
        <ModalCreateRemind
          onReload={onReload}
          button={<Button type="primary">Thêm</Button>}
        />
      </div>
      <div className="mt-10">
        <Tabs items={items(onReload)} />
        {/* <Button onClick={closeModal}>Đóng</Button> */}
      </div>
    </div>
  )
}

const DrawViahicle: FC<DrawViahicleProps> = ({ button, title, data }) => {
  return (
    <DrawC
      title={
        <p>
          Cài đặt nhắc nhở phương tiện : <b>{data?.license_plate}</b>
        </p>
      }
      button={button}
      data={data}
      children={(action) => <DetailViahicleComponents {...action} />}
    />
  )
}

export default DrawViahicle
