import { ReactNode } from "react"
import { Button, type TableColumnsType } from "antd"
import DrawViahicle from "../../../../conponents/Draws/DrawViahicle"
import { ViahicleType } from "../../../../interface/interface"
import { SettingOutlined } from "@ant-design/icons"
import ModalCreateRemind from "../../../../conponents/modals/ModalCreateRemind"

const getColumnViahicleGPS = (
  setViahicleSelect: any,
  params?: any,
): TableColumnsType<ViahicleType> => {
  return [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) =>
        params?.limit * params?.offset + index + 1,
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
      title: "Việc cần làm",
      dataIndex: "icons",
      key: "icons",
      render(value, record, index) {
        return {
          children: record?.icons?.map((icon: any, index: number) => (
            <ModalCreateRemind
              type="update"
              remindData={icon?.remind}
              button={
                <span
                  onClick={() => {
                    setViahicleSelect([record])
                  }}
                  className="cursor-pointer"
                  key={index}
                >
                  {" "}
                  {icon?.icon}
                </span>
              }
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
        // This log should print the correct record

        return (
          <DrawViahicle
            data={record}
            title="Cài đặt nhắc nhở phương tiện"
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
        )
      },
    },
  ]
}

export default getColumnViahicleGPS
