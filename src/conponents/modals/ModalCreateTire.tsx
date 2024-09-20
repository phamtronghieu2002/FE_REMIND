import { FC, useContext } from "react"
import { ModalCView } from "../ModalC/ModalC"
import React from "react"
import type { FormProps } from "antd"
import { Button, Input, Form } from "antd"
import { api } from "../../_helper"
import { MaskLoader } from "../Loader"
import { TabTableTire } from "../Draws/DrawViahicle"
import {
  ViahicleProviderContextProps,
  viahiclesContext,
} from "../../pages/manager/Remind/providers/ViahicleProvider"
import { addTire, deleteTire, updateTire } from "../../apis/tireAPI"
import { TireProps } from "../../interface/interface"

interface ModalCreateTireProps {
  onRefresh?: () => void
  onDelete?: () => void
  onUpdate?: () => void
  button: React.ReactNode
  type?: string
  data?: any
  isInModalRemind?: boolean
  isReload?: number
  isAddTireButton?: boolean
}

type FieldType = {
  licenseNumber?: string
  viahicleType?: string
  viahicleWeight?: string
}

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values)
}

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo)
}

const FormAdd: FC<{
  isReload?: number
  action: any
  initialValues?: TireProps
  data?: any
  type?: string
  onRefresh?: () => void
  isInModalRemind?: boolean
  isAddTireButton?: boolean
}> = ({
  action,
  initialValues,
  data,
  type,
  onRefresh,
  isInModalRemind,
  isReload,
  isAddTireButton,
}) => {
  const [form] = Form.useForm()

  const { viahiclesStore, dispatch } = useContext(
    viahiclesContext,
  ) as ViahicleProviderContextProps

  console.log("====================================")
  console.log("data", data)
  console.log("====================================")
  const lisence_plate = data?.imei ? data?.imei : data?.license_plate

  const tireId = initialValues?.id ?? 0
  const getAction = () => {
    if (type == "add") {
      return {
        title: "Thêm lốp phương tiện",
        okButton: "Thêm",
        okCallback: () => {
          form
            .validateFields()
            .then(async (values) => {
              // call api thêm lốp
              try {
                await addTire({
                  seri: values.seri.trim(),
                  size: values.size.trim(),
                  brand: values.brand.trim(),
                  license_plate: lisence_plate.trim(),
                })

                api.message?.success("Thêm lốp phương tiện thành công")
                onRefresh?.()
                action?.closeModal()
              } catch (error) {
                api.message?.error("Trùng series lốp!!")
              }
            })
            .catch((errorInfo) => {
              console.log("Validation Failed:", errorInfo)
            })
        },
      }
    }
    if (type == "delete") {
      return {
        title: "Xoá lốp phương tiện",
        okButton: "Xoá",
        okCallback: async () => {
          // call api xoá lốp
          await deleteTire(tireId)
          api.message?.success("Xoá lốp phương tiện thành công")
          onRefresh?.()
          action?.closeModal()
        },
      }
    }
    if (type == "update") {
      return {
        title: "Chỉnh sửa lốp",
        okButton: "Lưu",
        okCallback: () => {
          form
            .validateFields()
            .then(async (values) => {
              try {
                // trim các field
                values.seri = values.seri.trim()
                values.size = values.size.trim()
                values.brand = values.brand.trim()

                await updateTire(tireId, values)
                api.message?.success("Chỉnh sửa lốp thành công")
                onRefresh?.()
                action?.closeModal()
              } catch (error) {
                api.message?.error("Trùng series lốp!!")
              }
            })
            .catch((errorInfo) => {
              console.log("Validation Failed:", errorInfo)
            })
        },
      }
    }
  }

  return (
    <div>
      {type == "delete" ? (
        <p>Bạn có chắc chắn muốn xoá lốp này không?</p>
      ) : (
        <Form
          form={form}
          name="basic"
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
        >
          <Form.Item
            label="Số serie lốp"
            name="seri"
            rules={[{ required: true, message: "Vui lòng nhập số serie lốp!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Kích thước lốp"
            name="size"
            rules={[
              { required: true, message: "Vui lòng nhập kích thước lốp!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nhãn hiệu"
            name="brand"
            rules={[{ required: true, message: "Vui lòng nhập nhãn hiệu!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      )}

      {isInModalRemind && (
        <TabTableTire
          onReFresh={onRefresh}
          isAddTireButton={isAddTireButton}
          isReload={isReload}
          data={data}
        />
      )}

      <div className="flex justify-end gap-2">
        {/* {<MaskLoader />} */}
        <Button onClick={action?.closeModal}>Hủy</Button>
        <Button
          onClick={getAction()?.okCallback}
          type="primary"
          htmlType="submit"
        >
          {getAction()?.okButton}
        </Button>
      </div>
    </div>
  )
}

const ModalCreateTire: FC<ModalCreateTireProps> = ({
  data,
  button,
  type,
  onRefresh,
  isInModalRemind,
  isReload,
  isAddTireButton,
}) => {
  const getAction = () => {
    if (type === "add") {
      return {
        title: "Thêm lốp cho phương tiện",
      }
    }
    if (type === "delete") {
      return {
        title: `Xoá lốp   ${data?.license_plate}`,
      }
    }
    if (type === "update") {
      return {
        title: `Chỉnh sửa lốp ${data?.license_plate}`,
      }
    }
    return {}
  }

  return (
    <ModalCView
      modalProps={{
        width: 700,
      }}
      button={button}
      title={getAction()?.title}
      children={(action) => {
        return (
          <FormAdd
            isAddTireButton={isAddTireButton}
            data={data}
            isReload={isReload}
            isInModalRemind={isInModalRemind}
            onRefresh={onRefresh}
            type={type}
            initialValues={data}
            action={action}
          />
        )
      }}
    />
  )
}

export default ModalCreateTire
