// export interface ViahicleType {
//     id?: number
//     license_plate: string
//     license: string
//     user_id?: number
//     is_deleted?: boolean
//     reminds?: any
//     key?: number
//     icons?: any
//   }
export function getData(data) {
  // Sử dụng một object tạm để gom nhóm dữ liệu theo id
  const groupedData = {};

  data.forEach(item => {
    const { vehicle_id
      , user_id, is_deleted, license, license_plate, category_icon, user_name, user_address } = item;

    // Nếu id chưa tồn tại trong object tạm, khởi tạo đối tượng
    if (!groupedData[vehicle_id]) {
      const key = vehicle_id + 1;
      groupedData[vehicle_id] = {
        user_name,
        user_address,
        id: vehicle_id,
        user_id,
        is_deleted,
        license,
        license_plate,
        key,
        icons: []

      };
    }

    // Thêm name vào mảng name tương ứng với id
    groupedData[vehicle_id].icons.push(category_icon);
  });

  // Chuyển object tạm thành mảng kết quả
  return Object.values(groupedData);
}