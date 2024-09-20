import { FC, useEffect, useRef, useState } from "react"
import React from "react"
import { Button, Tabs, Upload } from "antd"
import type { TabsProps } from "antd"
import { TableC } from "../../../../conponents/TableC"

import { ViahicleType } from "../../../../interface/interface"
import getColumnViahicleNoGPS from "./columns"
import { useContext } from "react"
import {
  viahiclesContext,
  ViahicleProviderContextProps,
} from "../providers/ViahicleProvider"
import ModalImportExelMobile from "../../../../conponents/modals/ModalImportExelMobile"
import ModalAddViahicleMobile from "../../../../conponents/modals/ModalAddViahicleMobile"
import { TableCM } from "../../../../conponents/TableCM/TableCM"
import CardCar from "../components/Card/CardCar"
import ModalCreateRemindMobile from "../../../../conponents/modals/ModalCreateRemindMobile"
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons"
import { MaskLoader } from "../../../../conponents/Loader"
import DrawViahicle from "../../../../conponents/Draws/DrawViahicleMobile"
interface ViahicleNoGPSType {
  viahicles: ViahicleType[]
}
const ViahicleNoGPS: FC<ViahicleNoGPSType> = ({ viahicles }) => {
  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  //handle logig reload
  const onReload = () => {
    dispatch.freshKey()
  }

  //get viahicle checked
  const getViahicleChecked = (viahicle: ViahicleType[]) => {
    dispatch?.setViahicle(viahicle)
  }

  const [selectedItems, setSelectedItems] = useState<any>([])
  const [showCheckbox, setShowCheckbox] = useState(false) // Hiển thị checkbox khi thả chuột
  const [isSelecting, setIsSelecting] = useState(false) // Trạng thái nhấn giữ chuột
  const [selectAll, setSelectAll] = useState(false) // Trạng thái chọn tất cả
  const [isPressing, setIsPressing] = useState(false)

  const isIndexDraw = viahiclesStore.drawIndex

  const pressTimer = useRef<any>()

  const containerRef = useRef<HTMLDivElement>(null)

  // Hàm handle khi check/uncheck checkbox
  const handleCheck = (item: ViahicleType, checked: boolean) => {
    setSelectedItems(
      (prevSelected: any[]) =>
        checked
          ? [...prevSelected, item] // Lưu đối tượng viahicle
          : prevSelected.filter((selectedItem) => selectedItem.id !== item.id), // Lọc bỏ đối tượng đã bỏ chọn
    )
    dispatch.setViahicle(
      checked
        ? [...selectedItems, item]
        : selectedItems.filter(
            (selectedItem: { id: number | undefined }) =>
              selectedItem.id !== item.id,
          ),
    )
  }

  // Bắt đầu chọn khi nhấn giữ chuột
  const handleMouseDown = (id: number) => {
    setIsSelecting(true) // Bắt đầu quá trình chọn item
  }

  // Kết thúc chọn khi thả chuột
  const handleMouseUp = (item: ViahicleType) => {
    if (isSelecting) {
      setShowCheckbox(true) // Hiển thị checkbox sau khi thả chuột
      handleCheck(item, true) // Chọn item ngay khi thả chuột
    }
    setIsSelecting(false) // Kết thúc quá trình chọn
  }

  // Xử lý click ra ngoài, ẩn checkbox và reset trạng thái
  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setShowCheckbox(false) // Ẩn checkbox khi click ra ngoài
      setSelectedItems([]) // Reset các item đã chọn
      setSelectAll(false) // Reset nút "Chọn tất cả"
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Xử lý khi bấm nút "Chọn tất cả"
  const handleSelectAll = () => {
    if (selectAll) {
      // Nếu đã chọn tất cả, bỏ chọn
      setSelectedItems([])
      dispatch.setViahicle([]) // Bỏ chọn tất cả
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả item
      setSelectedItems(viahicles) // Lưu tất cả đối tượng viahicle
      dispatch.setViahicle(viahicles) // Dispatch với tất cả các đối tượng viahicle
    }
    setSelectAll(!selectAll) // Đảo trạng thái "Chọn tất cả"
    setShowCheckbox(true) // Hiển thị checkbox khi chọn tất cả
  }

  const handleTouchStart = (item: any) => {
    pressTimer.current = setTimeout(() => {
      dispatch.setDrawIndex(item.id)
      setIsPressing(true)
    }, 500) // Thay đổi thời gian giữ ở đây
  }

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current)
    if (isPressing) {
      // dispatch.setDrawIndex(0)
      setIsPressing(false)
    }
  }

  return (
    <div
      className="mt-7"
      onMouseUp={() => setIsSelecting(false)} // Kết thúc quá trình chọn nhiều item
      ref={containerRef} // Tham chiếu container để xử lý click ra ngoài
    >
      {viahiclesStore.loading && <MaskLoader />}

      {
        <div className="flex items-center justify-between">
          <div>
            <ModalCreateRemindMobile
              button={
                <Button
                  onClick={() => {
                    console.log("selectedItems", selectedItems)

                    // dispatch.setViahicle(selectedItems)
                  }}
                  type="primary"
                  className="ml-2"
                  icon={<PlusCircleOutlined />}
                >
                  Thêm
                </Button>
              }
            />
          </div>
          <div className="flex ml-2">
            <ModalAddViahicleMobile
              type="add"
              button={
                <Button className="mr-2" type="primary">
                  Thêm phương tiện
                </Button>
              }
            />
            <ModalImportExelMobile
              button={
                <Button icon={<UploadOutlined />} type="primary">
                  Tải Excel
                </Button>
              }
            />
          </div>
        </div>
      }
      {/* Nút Chọn Tất Cả */}
      {showCheckbox && ( // Chỉ hiển thị nút "Chọn tất cả" khi checkbox đang được hiển thị
        <Button
          className="ml-2 mt-2"
          onClick={handleSelectAll}
          style={{ marginBottom: 16 }}
        >
          {selectAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </Button>
      )}
      <TableCM
        checkBox
        setViahicleChecked={getViahicleChecked}
        hiddenColumnPicker={true}
        hiddenTitle={true}
        title="123"
        onReload={onReload}
        search={{
          placeholder: "Tìm kiếm biển số,sdt...",
          width: 277,
          onSearch(q) {
            dispatch.setKeywordNoGPS(q)
          },
          limitSearchLegth: 3,
        }}
        props={{
          columns: getColumnViahicleNoGPS(dispatch?.setViahicle),
          dataSource: viahicles,
          size: "middle",
          pagination: {},
        }}
      >
        {viahicles.map((item: any, index: number) => {
          return (
            <div
              onClick={() => {
                if (showCheckbox) return
                dispatch.setDrawIndex(item.id)
              }}
              key={item.id}
              onMouseDown={() => handleMouseDown(item)} // Nhấn chuột để bắt đầu chọn
              onMouseUp={() => handleMouseUp(item)} // Thả chuột để hiển thị checkbox và chọn item
              className="item-container"
              onTouchStart={() => handleTouchStart(item)}
              onTouchEnd={handleTouchEnd}
            >
              <CardCar
                key={index}
                weight=""
                isGPS={false}
                {...item}
                showCheckbox={showCheckbox} // Hiển thị checkbox khi người dùng nhấn giữ và thả chuột
                checked={selectedItems.includes(item)} // Trạng thái checkbox
                onCheckChange={(checked) => handleCheck(item, checked)} // Xử lý thay đổi trạng thái checkbox
              />
              {isIndexDraw === item.id && (
                <DrawViahicle
                  setSelectedItems={() => {
                    dispatch.setDrawIndex(null)
                    dispatch.setViahicle([])
                    setSelectedItems([])
                  }}
                  button={<></>}
                  title="Chi tiết"
                  data={item}
                />
              )}
            </div>
          )
        })}
      </TableCM>
    </div>
  )
}

export default ViahicleNoGPS
