import { FC, useState, useRef, useEffect } from "react"
import React from "react"
import { Button } from "antd"
import { ViahicleType } from "../../../../interface/interface"
import { useContext } from "react"
import {
  viahiclesContext,
  ViahicleProviderContextProps,
} from "../providers/ViahicleProvider"
import { TableCM } from "../../../../conponents/TableCM/TableCM"
import CardCar from "../components/Card/CardCar"
import ModalCreateRemindMobile from "../../../../conponents/modals/ModalCreateRemindMobile"
import { PlusCircleOutlined } from "@ant-design/icons"
import { MaskLoader } from "../../../../conponents/Loader"
import DrawViahicle from "../../../../conponents/Draws/DrawViahicleMobile"
import { d } from "vitest/dist/types-e3c9754d.js"

interface ViahicleGPSType {
  viahicles: ViahicleType[]
}

const ViahicleGPS: FC<ViahicleGPSType> = ({ viahicles }) => {
  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  const [selectedItems, setSelectedItems] = useState<ViahicleType[]>([])
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
      (prevSelected) =>
        checked
          ? [...prevSelected, item] // Lưu đối tượng viahicle
          : prevSelected.filter((selectedItem) => selectedItem.id !== item.id), // Lọc bỏ đối tượng đã bỏ chọn
    )
    dispatch.setViahicle(
      checked
        ? [...selectedItems, item]
        : selectedItems.filter((selectedItem) => selectedItem.id !== item.id),
    )
  }

  // Bắt đầu chọn khi nhấn giữ chuột
  const handleMouseDown = (id: number) => {
    setIsSelecting(true)
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

  // Xử lý nút reload
  const onReload = () => {
    dispatch.freshKey()
  }

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

  const handleTouchStart = (item: ViahicleType) => {
    pressTimer.current = setTimeout(() => {
      dispatch.setDrawIndex(item.id)
      setIsPressing(true)
    }, 500) // Thay đổi thời gian giữ ở đây
  }

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current)
    if (isPressing) {
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

      <ModalCreateRemindMobile
        type="add"
        button={
          <Button
            onClick={() => {}}
            type="primary"
            className="ml-2"
            icon={<PlusCircleOutlined />}
          >
            Thêm
          </Button>
        }
      />

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
        title="123"
        hiddenTitle={true}
        hiddenColumnPicker={true}
        onReload={onReload}
        search={{
          width: 277,
          onSearch(q) {
            dispatch.setKeyword(q)
          },
          limitSearchLegth: 3,
        }}
        right={<></>}
        props={{}}
      >
        {viahicles.map((item: any,index:number) => (
          <div
            onClick={() => {
              //  nếu đang đang có check box thì không bật draw
              if (showCheckbox) return
              dispatch.setDrawIndex(item.id)
            }}
            key={index}
            onMouseDown={() => handleMouseDown(item.id)} // Nhấn giữ chuột để bắt đầu chọn
            onMouseUp={() => handleMouseUp(item)} // Thả chuột để hiển thị checkbox và chọn item
            onTouchStart={() => handleTouchStart(item)}
            onTouchEnd={handleTouchEnd}
            className="item-container"
          >
            <CardCar
             key={index}
              isGPS
              {...item}
              showCheckbox={showCheckbox} // Hiển thị checkbox khi người dùng nhấn giữ và thả chuột
              checked={selectedItems.includes(item)} // Trạng thái checkbox
              onCheckChange={(checked) => handleCheck(item, checked)} // Xử lý thay đổi trạng thái checkbox
            />
            {/* reload set isIndexDraw = null */}
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
        ))}
      </TableCM>
    </div>
  )
}

export default ViahicleGPS
