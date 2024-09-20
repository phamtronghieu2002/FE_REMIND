import { FC } from "react"
import React from "react"
import { Tabs } from "antd"
import type { TabsProps } from "antd"
import { TableC } from "../../../../conponents/TableC"
import getColumnViahicleGPS from "./columns"
import { ViahicleType } from "../../../../interface/interface"
import { useContext } from "react"
import {
  viahiclesContext,
  ViahicleProviderContextProps,
} from "../providers/ViahicleProvider" // Import the ViahicleProviderProps type 12
import { MaskLoader } from "../../../../conponents/Loader"

interface ViahicleGPSType {
  viahicles: ViahicleType[]
}

const ViahicleGPS: FC<ViahicleGPSType> = ({ viahicles }) => {
  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  //handle logig reload
  const onReload = () => {
    dispatch.freshKey()
  }

  //get viahicle checked
  const setViahicleChecked = (viahicle: ViahicleType[]) => {
    dispatch?.setViahicle(viahicle)
  }

  return (
    <div className="mt-5">
      <TableC
        loading={viahiclesStore.loading}
        setViahicleChecked={setViahicleChecked}
        checkBox
        title="123"
        hiddenTitle={true}
        onReload={onReload}
        search={{
          placeholder: "Tìm kiếm biển số,số điện thoại",
          width: 200,
          onSearch(q) {
            dispatch?.setKeyword(q)
          },
          limitSearchLegth: 0,
        }}
        right={<></>}
        props={{
          columns: getColumnViahicleGPS(dispatch?.setViahicle, {
            limit: viahiclesStore?.limit,
            offset: viahiclesStore?.offset,
          }),
          dataSource: viahicles,
          size: "middle",
          pagination: {
            pageSize: viahiclesStore?.limit,
            total:
              (viahiclesStore?.totalPageGPS ?? 0) *
              (viahiclesStore?.limit ?? 50),
            current: (viahiclesStore?.offset ?? 0) + 1,
            onChange(page, pageSize) {
              dispatch?.setOffset(page - 1)
              dispatch?.setLimit(pageSize)
            },
          },
        }}
      />
    </div>
  )
}

export default ViahicleGPS
