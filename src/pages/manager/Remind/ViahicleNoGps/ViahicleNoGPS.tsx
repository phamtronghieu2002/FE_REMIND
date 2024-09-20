import { FC } from "react"
import React from "react"
import { Button, Tabs } from "antd"
import type { TabsProps } from "antd"
import { TableC } from "../../../../conponents/TableC"

import { ViahicleType } from "../../../../interface/interface"
import getColumnViahicleNoGPS from "./columns"
import { useContext } from "react"
import {
  viahiclesContext,
  ViahicleProviderContextProps,
} from "../providers/ViahicleProvider"
import ModalImportExel from "../../../../conponents/modals/ModalImportExel"
import ModalAddViahicle from "../../../../conponents/modals/ModalAddViahicle"
import { MaskLoader } from "../../../../conponents/Loader"
import { log } from "console"
interface ViahicleNoGPSType {
  viahicles: ViahicleType[]
}
const ViahicleNoGPS: FC<ViahicleNoGPSType> = ({ viahicles }) => {
  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  console.log("====================================")
  console.log("viahiclesStore?.totalPageNoGPS ", viahiclesStore?.totalPageNoGPS)
  console.log("====================================")
  //handle logig reload
  const onReload = () => {
    dispatch.freshKey()
  }

  //get viahicle checked
  const getViahicleChecked = (viahicle: ViahicleType[]) => {
    dispatch?.setViahicle(viahicle)
  }

  return (
    <div className="mt-5">
      {viahiclesStore.loading && <MaskLoader />}

      <TableC
        checkBox
        setViahicleChecked={getViahicleChecked}
        hiddenTitle={true}
        title="123"
        onReload={onReload}
        search={{
          placeholder: "Tìm kiếm biển số,số điện thoại",
          width: 200,
          onSearch(q) {
            dispatch.setKeywordNoGPS(q)
          },
          limitSearchLegth: 0,
        }}
        right={
          <>
            <ModalAddViahicle
              type="add"
              button={<Button type="primary">Thêm phương tiện</Button>}
            />
            <ModalImportExel
              button={<Button type="primary">Tải lên exel</Button>}
            />
          </>
        }
        props={{
          columns: getColumnViahicleNoGPS(
            dispatch?.setViahicle,
            viahiclesStore?.totalPageNoGPS || 0,
          ),
          dataSource: viahicles,
          size: "middle",
          pagination: {
            onChange: (page, pageSize) => {
              dispatch?.setTotalPageNoGPS(page)
            },
          },
        }}
      />
    </div>
  )
}

export default ViahicleNoGPS
