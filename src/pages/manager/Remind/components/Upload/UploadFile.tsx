import React, { useState } from "react"
import { UploadOutlined } from "@ant-design/icons"
import { Button, message, Upload, Modal, Table } from "antd"
import type { RcFile, UploadProps } from "antd/es/upload/interface"
import * as XLSX from "xlsx"
import { number } from "react-i18next/icu.macro"

interface UploadExelProps {
  setIsUpload: any
  setExcelData: any
}

const UploadExel: React.FC<UploadExelProps> = ({
  setIsUpload,
  setExcelData,
}) => {
  const [tableColumns, setTableColumns] = useState<any[]>([])
  const [tableData, setTableData] = useState<any[]>([])

  const handlePreview = (file: RcFile) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      if (typeof data === "string") {
        const workbook = XLSX.read(data, { type: "binary" })
        const worksheet = workbook.Sheets["Sheet1"]
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        })

        const header = jsonData[0] // Hàng đầu tiên là tiêu đề cột

        const indexBienSoXe = header.indexOf("Biển số xe")
        const indexLoaiCanhBao = header.indexOf("Loại cảnh báo")
        const indexPhoneNumber = header.indexOf("Số điện thoại")
        const indexName = header.indexOf("Họ và tên")
        const indexAddress = header.indexOf("Địa chỉ")
        const indexExp = header.indexOf("Hạn nhắc nhở")
        const indexCycle = header.indexOf("Chu kì( Tháng)")
        const indexDes = header.indexOf("Nội dung")

        const indicesDate = header.reduce((acc, col, index) => {
          if (col === "Thời gian nhắc nhở") acc.push(index)
          return acc
        }, [])

        const indicesSeri = header.reduce((acc, col, index) => {
          if (col === "Lốp(Seri,size,brand)") acc.push(index)
          return acc
        }, [])

        const result = jsonData
          .slice(1)
          .filter(
            (row) =>
              row[indexBienSoXe] !== null &&
              row[indexBienSoXe] !== undefined &&
              row[indexBienSoXe] !== "",
          )
          .map((row) => ({
            license_plate: row[indexBienSoXe],
            type: row[indexLoaiCanhBao],
            phoneNumber: row[indexPhoneNumber],
            name: row[indexName],
            address: row[indexAddress],
            exp: row[indexExp],
            cycle: row[indexCycle],
            indexDesc: row[indexDes],
            remindDate: indicesDate.map((index: number) => row[index]),
            remindTire: indicesSeri.map((index: number) => row[index]),
          }))
        setExcelData(result)

        // Generate columns for the Ant Design table
        const columns = jsonData[0].map((col: string, index: number) => ({
          title: col,
          dataIndex: `col${index}`,
          key: `col${index}`,
          width: 200,
        }))

        // Generate data for the Ant Design table
        const dataSource = jsonData
          .slice(1)
          .map((row: any[], rowIndex: number) => {
            const rowData: { [key: string]: any } = { key: rowIndex }
            row.forEach((cell, cellIndex) => {
              rowData[`col${cellIndex}`] = cell
            })
            return rowData
          })

        setTableColumns(columns)
        setTableData(dataSource)

        // Set the upload state to true after successful preview
        setIsUpload(true)

        Modal.info({
          title: `Preview of ${file.name}`,
          content: (
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              scroll={{ x: 1000, y: 400 }} // Thêm thanh trượt ngang và dọc
            />
          ),
          width: "100%",
        })
      }
    }
    reader.readAsBinaryString(file)
  }

  const props: UploadProps = {
    beforeUpload: (file: RcFile) => {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      if (!isExcel) {
        message.error("You can only upload Excel files!")
        return Upload.LIST_IGNORE
      }
      handlePreview(file) // Preview the file directly after selection
      return false // Prevent automatic upload
    },
  }

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Tải file Excel lên</Button>
    </Upload>
  )
}

export default UploadExel
