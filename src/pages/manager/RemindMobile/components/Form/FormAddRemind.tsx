import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  Modal,
  Row,
  Col,
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
import ModalCreateTire from "../../../../../conponents/modals/ModalCreateTireMobile"
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

import { _log } from "../../../../../utils/_log"

import dayjs from "dayjs"

const SERVER_DOMAIN_REMIND = import.meta.env.VITE_HOST_REMIND_SERVER_DOMAIN_IMG

// Đăng ký plugin

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
    const [schedules, setSchedules] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [form] = Form.useForm()

    const [imageFiles, setImageFiles] = useState<any[]>([])
    const [fileList, setFileList] = useState<any[]>([])
    const [previewImage, setPreviewImage] = useState<string | null>(null) // State for the preview image
    const initImageURL = initialValues?.remind_img_url || initialValues?.img_url

    // xử lí fill hình ảnh
    const createFileFromUrl = async (url: string, name: string) => {
      const response = await fetch(url)
      const blob = await response.blob()
      return new File([blob], name, { type: blob.type })
    }

    // Handle filling images from server URLs
    useEffect(() => {
      if (initImageURL) {
        // Get the URLs of the images
        const urls = initImageURL.split(",").map((url: string) => {
          const trimmedUrl = `${SERVER_DOMAIN_REMIND}${url.trim()}`
          const name = trimmedUrl.split("/").pop() || "image.jpg" // Default name if extraction fails

          return {
            uid: trimmedUrl, // unique id for each image
            name: name,
            status: "done",
            url: trimmedUrl,
          }
        })

        // Update fileList state
        setFileList(urls)

        // Create File objects and set imageFiles (append existing ones)
        Promise.all(
          urls.map(async ({ url, name }: { url: string; name: string }) => {
            const file = await createFileFromUrl(url, name)
            return file
          }),
        ).then((files) => {
          setImageFiles(files) // Initialize imageFiles with files from URLs
        })
      }
    }, [initImageURL]) // Run when initImageURL changes

    // Handle image upload and preview
    const handleChange = (info: any) => {
      const newFileList = info.fileList
      setFileList(newFileList)

      // Get only the new files (files that are not in imageFiles yet)
      const newFiles = newFileList
        .filter(
          (file: any) =>
            !imageFiles.some((imgFile: any) => imgFile.name === file.name),
        )
        .map((file: any) => file.originFileObj)
        .filter(Boolean)

      if (newFiles.length > 0) {
        setImageFiles((prev) => [...prev, ...newFiles]) // Append only new files
      }
    }

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
  
   
        if ((viahicleSelected?.length ?? 0) > 1) {
          const newRes = res?.data.filter((item: CategoryType) => {
            return item.id != 6
          })
          setCategories(newRes)
        } else {
          setCategories(res?.data)
        }
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
          initialValues.expiration_time = dayjs(
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
            expiration_time: dayjs(initialValues?.expiration_time),
            remind_category_id: initialValues?.remind_category_id,
            cycle: initialValues?.cycle,
            note_repair: initialValues?.note_repair,
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
    console.log("====================================")
    console.log("imageFiles", imageFiles)
    console.log("====================================")
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
    const beforeUpload = (file: any) => {
      const isImage = file.type.startsWith("image/")
      if (!isImage) {
        Modal.error({
          title: "chỉ cho phép tải ảnh !",
        })
        return Upload.LIST_IGNORE; // Ngăn kh
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        Modal.error({
          title: 'Kích thước ảnh phải dưới 2MB!',
        });
        return Upload.LIST_IGNORE; // Ngăn không cho tải file lớn hơn 2MB
      }
    
    
      return isImage
    }

    // Hàm xử lý khi ảnh được chọn

    const handleGetDataForm = () => {
      buttonDateRef.current?.click()
      setRandomKey(Math.random())
    }

    return (
      <div>
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

              <Select.Option value="khác" key={100}>
                Khác
              </Select.Option>
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

              <div className="relative flex items-center">
                <Form.Item
                  className="w-[80%]"
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
                      disabled={!vhiahicleTire}
                      className="ml-3 -mb-[15px] block"
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
              <div>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="km_before"
                      label="Cảnh báo trước"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập KM cảnh báo trước",
                        },
                      ]}
                    >
                      <InputNumber
                        defaultValue={initialValues?.km_before}
                        onChange={(value) => {
                          form.setFieldsValue({ km_before: value })
                        }}
                      />
                      <span style={{ marginLeft: 10, display: "inline-block" }}>
                        (KM)
                      </span>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="cumulative_kilometers"
                      label="KM cảnh báo"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập KM cảnh báo",
                        },
                      ]}
                    >
                      <InputNumber
                        defaultValue={initialValues?.cumulative_kilometers}
                        onChange={(value) => {
                          form.setFieldsValue({ cumulative_kilometers: value })
                        }}
                      />
                      <span style={{ marginLeft: 10, display: "inline-block" }}>
                        (KM)
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </>
          ) : (
            <></>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="expiration_time"
                label="Hạn nhắc nhở"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày nhắc nhở" },
                ]}
              >
                <DatePicker
                  disabledDate={(current) => {
                    return current && current < moment().endOf("day")
                  }}
                  onChange={() => form.validateFields(["remindDate"])}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="cycle"
                label="Chu kì"
                rules={[{ required: true, message: "Vui lòng nhập chu kì" }]}
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
            </Col>
          </Row>
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
          {/* đoạn này nè */}

          {/* Upload ảnh */}
          <Form.Item label="Tải ảnh">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={beforeUpload}
              onPreview={(file: any) => {
                setPreviewImage(file.url) // Set the preview image
              }}
              onRemove={(file: any) => {
                const newFileList = fileList.filter(
                  (item: any) => item.uid !== file.uid,
                )
                setFileList(newFileList)

                // Cập nhật `imageFiles` sau khi xóa
                const updatedImageFiles = imageFiles.filter(
                  (imgFile: any) => imgFile.name !== file.name,
                )
           
                setImageFiles(updatedImageFiles)
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Ảnh</div>
              </div>
            </Upload>
          </Form.Item>

          {/* Preview modal */}
          {previewImage && (
            <Modal
              visible={!!previewImage}
              footer={null}
              onCancel={() => setPreviewImage(null)}
            >
              <img alt="preview" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          )}

          <Form.Item name="note_repair" label="Nội dung">
            <TextArea />
          </Form.Item>

          <Form.Item
            name="is_notified"
            label="Bật thông báo"
            valuePropName="checked"
            hidden
          >
            <Switch defaultChecked />
          </Form.Item>

          {/*  */}
        </Form>

        <button onClick={handleGetDataForm} ref={ref}></button>
      </div>
    )
  },
)

export default FormAddRemind
