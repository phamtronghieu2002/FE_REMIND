import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  Modal,
} from "antd"
import TextArea from "antd/es/input/TextArea"
import { FC, useContext, useEffect, useState, forwardRef, useRef } from "react"
import moment from "moment"
import { use } from "i18next"
import {
  CategoryType,
  TireProps,
  ViahicleType,
} from "../../../../../interface/interface"
import {
  ViahicleProviderContextProps,
  viahiclesContext,
} from "../../providers/ViahicleProvider"
import ModalCreateTire from "../../../../../conponents/modals/ModalCreateTire"
import { Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { getCategory } from "../../../../../apis/categoryAPI"
import { api } from "../../../../../_helper"
import { getTire } from "../../../../../apis/tireAPI"
import { t } from "i18next"
import MultiDateTimePicker from "./MultiRangeDateWithTimePickerProps"
import { log } from "console"
import { getTimeRemind } from "../../../../../apis/remindAPI"
import { MaskLoader } from "../../../../../conponents/Loader"

import { FilePond, registerPlugin } from "react-filepond"
import "filepond/dist/filepond.min.css"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import { _log } from "../../../../../utils/_log"
const SERVER_DOMAIN_REMIND = import.meta.env.VITE_HOST_REMIND_SERVER_DOMAIN_IMG

// Đăng ký plugin
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType)

interface FormAddRemindProps {
  isUpdateCycleForm?: boolean
  viahicleSelected?: ViahicleType[]
  initialValues?: any
  onSubmit: (formData: any, callback: any, images: any) => void
}

const FormAddRemind = forwardRef<HTMLButtonElement, FormAddRemindProps>(
  ({ onSubmit, initialValues, viahicleSelected, isUpdateCycleForm }, ref) => {
    const [isName, setIsName] = useState<boolean>(false)
    const [isTireSelect, setIsTireSelect] = useState<boolean>(false)
    const [tires, setTires] = useState<any[]>([])

    const [isReloadTableTire, setIsReloadTableTire] = useState<number>(
      Math.random(),
    )

    const [categories, setCategories] = useState<CategoryType[]>([])

    const { viahiclesStore } = useContext(
      viahiclesContext,
    ) as ViahicleProviderContextProps

    const [vhiahicleTire, setViahicleTire] = useState<ViahicleType | null>(null)

    const [timeSelect, setTimeSelect] = useState<any[]>([])

    const buttonDateRef = useRef<HTMLButtonElement>(null)

    const [randomKey, setRandomKey] = useState<number>(Math.random())
    const [imageFiles, setImageFiles] = useState<any[]>([])
    const [schedules, setSchedules] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm()

    console.log("====================================")
    console.log("imageFiles >>", imageFiles)
    console.log("====================================")
    _log("initialValues >>", initialValues)
    // xử lí fill hình ảnh
    useEffect(() => {
      if (initialValues?.remind_img_url) {
        const urls = initialValues?.remind_img_url?.split(",")?.map(
          (url: string, index: number) =>
            `${SERVER_DOMAIN_REMIND}${url.trim()}`, // The URL of the image
        )

        // tôi có links các url làm sao fill preview ngược lại filepond
      }
    }, [])

    // xử lí fill thời gian
    useEffect(() => {
      const fetchTime = async (id: number) => {
        try {
          const res = await getTimeRemind(id)
          if (res.data.length > 0) {
            setSchedules(res?.data)
          }
        } catch (error) {
          console.log("error time >>>", error)
        }
      }

      if (initialValues?.remind_id) {
        fetchTime(initialValues?.remind_id)
      }
    }, [])

    const fetchTire = async () => {
      try {
        const license_plate =
          viahiclesStore?.type == 1
            ? vhiahicleTire?.imei
            : vhiahicleTire?.license_plate
        const res = await getTire(license_plate ?? "", "")

        setTires(res?.data)
      } catch (error) {
        api.message?.error("Lỗi khi lấy dữ liệu lốp")
      }
      // setIsReloadTableTire(Math.random())
    }

    const fetchCategory = async () => {
      try {
        setLoading(true)
        const res = await getCategory()
        setLoading(false)
        setCategories(res?.data)
      } catch (error) {
        setLoading(false)
        api.message?.error("Lỗi khi lấy dữ liệu loại nhắc nhở")
      }
    }

    // fetch category
    useEffect(() => {
      // call api to get remindType
      fetchCategory()
    }, [])

    //  initial value
    useEffect(() => {
      if (categories?.length > 0) {
        if (Object.keys(initialValues).length === 0) {
          form.setFieldsValue({
            is_notified: true,
            note_repair: "Tới hạn thay dầu rồi,đi thay dầu thôi !!",
          })
        } else {
          // cộng thêm n tháng

          initialValues.expiration_time = moment(
            initialValues?.expiration_timeStamp,
          ).add(isUpdateCycleForm ? initialValues?.cycle : 0, "months")
          const tire = initialValues?.tire
          if (tire) {
            handleSelectViahicle(
              viahiclesStore?.viahiclesStore[0]?.license_plate,
            )
          }
          form.setFieldsValue({
            ...initialValues,
            vehicles: viahiclesStore?.viahiclesStore[0]?.license_plate,
            tire: initialValues?.tire,
            is_notified: initialValues?.is_notified == 0 ? true : false,
          })
        }
      }
    }, [categories?.length])

    useEffect(() => {
      if (timeSelect.length > 0) {
        form.setFieldValue("schedules", timeSelect)
        form
          ?.validateFields()
          .then((values) => {
            const processedValuesForm = {
              ...values,
              expiration_time: values.expiration_time
                ? values.expiration_time.valueOf() // Chuyển đổi date thành timestamp
                : null,
              vehicles: values.vehicles
                ? [values.vehicles]
                : viahiclesStore?.viahiclesStore.map((item: ViahicleType) =>
                    viahiclesStore?.type ? item?.imei : item.license_plate,
                  ),
              is_notified: values.is_notified ? 0 : 1,
            }

            const formData = new FormData()

            imageFiles.forEach((file) => {
              formData.append("images", file) // Thêm ảnh vào FormData
            })

            onSubmit(processedValuesForm, fetchCategory, formData) // Gửi dữ liệu đã xử lý
          })
          .catch(() => {
            console.log("Lỗi xác thực:")
          })
      }
    }, [timeSelect.length, randomKey])
    // xử lí render lốp khi chọn xe
    useEffect(() => {
      if (vhiahicleTire) {
        fetchTire()
      }
    }, [vhiahicleTire?.license_plate])
    // xử lí chọn xe
    const handleSelectViahicle = (value: string) => {
      const viahicle: any = viahicleSelected?.find((item: ViahicleType) =>
        viahiclesStore?.type == 0
          ? item?.license_plate == value
          : item?.imei == value,
      )
      setViahicleTire(viahicle)
    }

    const handleSelectTypeRemind = (value: any) => {
      if (value === "khác") {
        setIsName(true)
      } else {
        setIsName(false)
      }
      if (value === 6) {
        if (viahicleSelected?.length == 1) {
          setViahicleTire(viahiclesStore?.viahiclesStore[0])
          //  xử lí khi  chọn 1 xe
          viahicleSelected?.length == 1
            ? viahiclesStore?.type == 1
              ? form.setFieldValue("vehicles", viahicleSelected[0]?.imei)
              : form.setFieldValue(
                  "vehicles",
                  viahicleSelected[0]?.license_plate,
                )
            : ""
        }
        setIsTireSelect(true)
      } else {
        setIsTireSelect(false)
      }
    }

    // Hàm xử lý khi ảnh được chọn
    const handleImageUpload = (file: any, action: string) => {
      const formData = new FormData()
      if (action === "add") {
        formData.append("images", file) // Thêm ảnh mới vào FormData
        setImageFiles((prev) => [...prev, formData])
      } else if (action === "remove") {
        setImageFiles((prev) => prev.filter((item) => item.name !== file.name)) // Xóa ảnh
      }

      return false // Ngăn việc upload tự động
    }

    const handleGetDataForm = () => {
      buttonDateRef.current?.click()
      setRandomKey(Math.random())
    }

    return (
      <div>
        {loading && <MaskLoader />}
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          disabled={false}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="remind_category_id"
            style={{ gap: 10 }}
            label="Loại nhắc nhở"
            rules={[{ required: true, message: "Vui lòng chọn loại nhắc nhở" }]}
          >
            <Select
              className="select-type-remind"
              onChange={handleSelectTypeRemind}
            >
              {categories.map((item: CategoryType) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}

              {/* <Select.Option value="khác" key={100}>
                Khác
              </Select.Option> */}
            </Select>
          </Form.Item>

          {/* chọn phương tiện */}
          {(isTireSelect || initialValues?.remind_category_id == 6) && (
            <>
              <Form.Item
                name="vehicles"
                rules={[{ required: true, message: "Vui lòng chọn xe" }]}
                style={{ gap: 10 }}
                label="Chọn xe"
              >
                <Select
                  className="select-viahicle"
                  onChange={(value: any) => {
                    handleSelectViahicle(value)
                    form.validateFields(["vehicles"])
                  }}
                >
                  {viahicleSelected?.map((item: ViahicleType) => (
                    <Select.Option
                      key={item.license_plate}
                      value={
                        viahiclesStore?.type == 0
                          ? item.license_plate
                          : item.imei
                      }
                    >
                      {item?.license_plate}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="relative">
                <Form.Item
                  className="flex-1"
                  name="tire_seri"
                  rules={[{ required: true, message: "Vui lòng chọn lốp" }]}
                  style={{ gap: 10 }}
                  label="Chọn Lốp"
                >
                  <Select className="select-viahicle">
                    {tires.map((item: TireProps) => (
                      <Select.Option key={item.id} value={item.seri}>
                        {item?.seri}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <ModalCreateTire
                  isAddTireButton={false}
                  data={vhiahicleTire}
                  isReload={isReloadTableTire}
                  isInModalRemind
                  onRefresh={fetchTire}
                  type="add"
                  button={
                    <Button
                      disabled={vhiahicleTire ? false : true}
                      className="absolute right-[-20px] top-0"
                      icon={<PlusOutlined />}
                    >
                      Thêm lốp
                    </Button>
                  }
                />
              </div>
            </>
          )}

          {/* tên nhắc nhở */}
          {isName && (
            <Form.Item
              name="cat_name"
              rules={[
                { required: true, message: "Vui lòng nhập tên loại nhắc nhở" },
              ]}
              style={{ gap: 10 }}
              label="Tên loại nhắc nhở"
            >
              <Input onChange={() => form.validateFields(["name"])} />
            </Form.Item>
          )}

          {viahiclesStore.type ? (
            <>
              <Form.Item
                name="km_before"
                label="Cảnh báo trước"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập KM cảnh báo trước",
                  },
                  {
                    validator: (_, value) =>
                      value > 0
                        ? Promise.resolve()
                        : Promise.reject("KM phải lớn hơn 0"),
                  },
                ]}
              >
                <InputNumber
                  onChange={(value) => {
                    form.setFieldsValue({ km_before: value })
                  }}
                  defaultValue={initialValues?.km_before}
                />
                <span style={{ marginLeft: 10, display: "inline-block" }}>
                  (KM)
                </span>
              </Form.Item>

              <Form.Item
                name="cumulative_kilometers"
                label="KM cảnh báo"
                rules={[
                  { required: true, message: "Vui lòng nhập KM cảnh báo" },
                  {
                    validator: (_, value) =>
                      value > 0
                        ? Promise.resolve()
                        : Promise.reject("KM phải lớn hơn 0"),
                  },
                ]}
              >
                <InputNumber
                  onChange={(value) => {
                    form.setFieldsValue({ cumulative_kilometers: value })
                  }}
                  defaultValue={initialValues?.cumulative_kilometers}
                />
                <span style={{ marginLeft: 10, display: "inline-block" }}>
                  (KM)
                </span>
              </Form.Item>
            </>
          ) : (
            <></>
          )}

          <Form.Item
            name="expiration_time"
            label="Hạn nhắc nhở"
            rules={[{ required: true, message: "Vui lòng chọn ngày nhắc nhở" }]}
          >
            <DatePicker
              disabledDate={(current) => {
                return current && current < moment().endOf("day")
              }}
              onChange={() => form.validateFields(["remindDate"])}
            />
          </Form.Item>

          <Form.Item
            name="cycle"
            label="Chu kì"
            rules={[
              { required: true },
              {
                validator: (_, value) =>
                  value > 0
                    ? Promise.resolve()
                    : Promise.reject("Chu kì phải lớn hơn 0"),
              },
            ]}
          >
            <InputNumber
              defaultValue={initialValues?.cycle}
              onChange={(value) => {
                form.setFieldsValue({ cycle: value })
              }}
            />
            <span style={{ marginLeft: "10px", display: "inline-block" }}>
              Tháng
            </span>
          </Form.Item>

          <Form.Item
            name={"schedules"}
            label="Thời gian"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian nhắc nhở" },
            ]}
          >
            <MultiDateTimePicker
              initialValues={schedules}
              ref={buttonDateRef}
              setValueTime={(value: any) => {
                setTimeSelect(value)
              }}
            />
            <Input
              className="!mt-[-30px]"
              value={timeSelect.length > 0 ? "ok" : ""}
              type="hidden"
            />
          </Form.Item>
          <Form.Item name="note_repair" label="Nội dung">
            <TextArea />
          </Form.Item>

          {/* Upload ảnh */}
          <Form.Item label="Tải lên hình ảnh" style={{ gap: 10 }}>
            <FilePond
              imagePreviewHeight={200} // Chiều cao của ảnh preview
              imagePreviewMaxHeight={200} // Chiều cao tối đa của ảnh preview
              files={imageFiles}
              allowMultiple={true}
              maxFiles={5}
              acceptedFileTypes={["image/*"]} // Chỉ chấp nhận file ảnh
              name="images"
              labelIdle='Kéo thả hình hoặc<span class="filepond--label-action"> Chọn </span>'
              onupdatefiles={(fileItems) => {
                const validFiles = fileItems
                  .filter((fileItem: any) => {
                    // Kiểm tra nếu file hợp lệ
                    const isValid = fileItem.file.type.startsWith("image/")
                    if (!isValid) {
                      // nếu không hợp lệ thì loại khỏi danh sách file
                      setImageFiles((prev) =>
                        prev.filter((item) => item.name !== fileItem.file.name),
                      )
                    }
                    return isValid
                  })
                  .map((fileItem) => fileItem.file)

                // Cập nhật lại danh sách file chỉ với những file hợp lệ
                setImageFiles(validFiles)
              }}
              onaddfile={(error, fileItem) => {
                if (error) {
                  setImageFiles((prev) =>
                    prev.filter((item) => item.name !== fileItem.file.name),
                  )
                  return
                }
                if (!fileItem.file.type.startsWith("image/")) {
                  setImageFiles((prev) =>
                    prev.filter((item) => item.name !== fileItem.file.name),
                  )
                } else {
                  handleImageUpload(fileItem.file, "add")
                }
              }}
              onremovefile={(error, fileItem) => {
                if (!error) {
                  handleImageUpload(fileItem.file, "remove")
                }
              }}
            />
          </Form.Item>

          <Form.Item
            className="hidden"
            name="is_notified"
            label="Bật thông báo"
            valuePropName="checked"
          >
            <Switch checked />
          </Form.Item>

          {/*  */}
        </Form>

        <button onClick={handleGetDataForm} ref={ref}></button>
      </div>
    )
  },
)

export default FormAddRemind
