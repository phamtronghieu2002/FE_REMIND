import { ReactNode } from "react"
import { Button, type TableColumnsType } from "antd"
import DrawViahicle from "../../../../conponents/Draws/DrawViahicle"
import ModalAddViahicle from "../../../../conponents/modals/ModalAddViahicle"

import { ViahicleType } from "../../../../interface/interface"
import { SettingOutlined } from "@ant-design/icons"
import ModalCreateRemind from "../../../../conponents/modals/ModalCreateRemind"

const getColumnViahicleNoGPS = (
  setViahicleSelect: any,
  totalPageNoGPS: number,
): TableColumnsType<ViahicleType> => {
  return [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => (totalPageNoGPS - 1) * 10 + index + 1,
    },
    {
      title: "Biển số phương tiện",
      dataIndex: "license_plate",
      key: "licenseNumber",
      sorter: (a, b) => a.license_plate.localeCompare(b.license_plate),
    },

    {
      title: "Họ tên",
      dataIndex: "user_name",
      key: "user_name",
      sorter: (a, b) => a.license.localeCompare(b.license),
    },
    {
      title: "Địa chỉ",
      dataIndex: "user_address",
      key: "user_address",
      sorter: (a, b) => a.license.localeCompare(b.license),
    },
    {
      title: "Số điện thoại",
      dataIndex: "license",
      key: "license",
      sorter: (a, b) => a.license.localeCompare(b.license),
    },
    {
      title: "Việc cần làm",
      dataIndex: "statusRemind",
      key: "statusRemind",
      render(value, record, index) {
        return {
          children: record?.icons?.map((icon: any, index: number) => (
            <ModalCreateRemind
              type="update"
              remindData={record}
              button={<span key={index}> {icon?.icon}</span>}
            />
          )),
        }
      },
    },
    {
      title: "Cài đặt",
      dataIndex: "setting",
      key: "setting",
      render(value, record, index) {
        return (
          <DrawViahicle
            data={record}
            title="Cài đặt nhắc nhở phương tiện"
            button={
              <Button
                icon={<SettingOutlined />}
                onClick={() => {
                  console.log("record >>>>>>>>>>", record)

                  setViahicleSelect([record])
                }}
              >
                {/* Cài đặt */}
              </Button>
            }
          />
        )
      },
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      render(value, record, index) {
        return (
          <div className="flex">
            <ModalAddViahicle
              data={record}
              type="update"
              button={<Button type="link">Cập nhật</Button>}
            />
            <ModalAddViahicle
              type="delete"
              data={record}
              button={<Button type="link">Xóa</Button>}
            />
          </div>
        )
      },
    },
  ]
}
export default getColumnViahicleNoGPS
