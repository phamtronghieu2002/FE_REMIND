import { ReactNode } from "react"
import { Button, type TableColumnsType } from "antd"
import DrawViahicle from "../../../../conponents/Draws/DrawViahicle"
import ModalAddViahicle from "../../../../conponents/modals/ModalAddViahicle"

import { ViahicleType } from "../../../../interface/interface"
import { SettingOutlined } from "@ant-design/icons"

const getColumnViahicleNoGPS = (
  setViahicleSelect: any,
): TableColumnsType<ViahicleType> => {
  return [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Biển số xe",
      dataIndex: "license_plate",
      key: "licenseNumber",
      sorter: (a, b) => a.license_plate.localeCompare(b.license_plate),
    },
    {
      title: "Giấy phép",
      dataIndex: "license",
      key: "license",
      sorter: (a, b) => a.license.localeCompare(b.license),
    },
    {
      title: "Đang có nhắc nhở",
      dataIndex: "statusRemind",
      key: "statusRemind",
      render(value, record, index) {
        return {
          children: record?.reminds?.map((icon: any) => <span> {icon}</span>),
        }
      },
    },
    {
      title: "Cài đặt",
      dataIndex: "setting",
      key: "setting",
      render(value, record, index) {
        return {
          children: (
            <DrawViahicle
              data={record}
              title="Cài đặt nhắc nhở xe"
              button={
                <Button
                icon={<SettingOutlined />}
                  onClick={() => {
                    setViahicleSelect([record])
                  }}
                >
                  {/* Cài đặt */}
                </Button>
              }
            />
          ),
        }
      },
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      render(value, record, index) {
        return {
          children: (
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
          ),
        }
      },
    },
  ]
}
export default getColumnViahicleNoGPS
