import { message } from "antd"
import { store } from "../app/store"

export const _const = {
  type: {
    model: {
      gps: 1,
      mobicam: 2,
    },
  },
  port: {
    mobicam: 6605,
  },
  axios: {
    timeout: 20000,
  },
  limit: {
    sync: 2,
    syncTime: 15,
  },
  position: {
    MID_PISITION: [10.863765, 106.739706],
  },
  color: {
    polilineDefault: "#fa8c06",
  },
  response: {},
  storeKey: {
    token: "__t__",
    accessToken: "__a",
    refeshToken: "__f",

    deviceToken: "__dt__",

    setting: "___st___s",
    settingM: "___st___m",

    followingDeviceList: "___f_d___",
  },
  socket: {
    chanel: {
      reqRealtime: "req-vehicle-online",
      resRealtime: "res-vehicle-online",
    },
    timeout: {
      req: 10000,
    },
  },
  interface: {
    map_vehicleFrameWidth: 350,
  },
  string: {
    status: {
      vehicle: {
        offline: "Mất kết nối",
        running: "Đang chạy",
        stopped: "Đang dừng",
        stoppedR: "Đang dừng, bật máy",
        lostgps: "Mất GPS",
        unknow: "Không xác định",
        logout: "Đăng xuất",
      },
      m: {
        accON: "ACC mở",
        accOFF: "ACC tắt",
        noVehiclePicked: "no device picked",
        noInfo: "no info",
        syn: "đồng bộ",
      },
    },
    form: {
      alarmNotEmpty: "Không được để trống",
    },

    searchReportTitle: {
      rangeTime: "Khoảng thời gian",
      vehicles: "Phương tiện",
      driver: "Lái phương tiện",
      minuteParking: "Dừng đỗ lớn hơn (> phút)",
      driverContinusMinute: "Lái phương tiện liên tục lớn hơn (> tiếng)",
      team: "Tài khoản / Đội PT",
    },

    message: {
      network: "Không thể kết nối đến máy chủ",
      error: "Có lỗi!",
      unknow: "Opp! Có gì đó không đúng!",
      success: "Thành công",
      noNote: "Không có ghi chú",
      noImei: "Không tìm thấy imei phương tiện",
    },

    s: {
      hidden: "hidden",
      pushlish: "pushlish",
      unknow: "unknow",
      unknow_: "-",
      notLenghtSearchError: (length: number) =>
        `Vui lòng nhập ít nhất ${length} ký tự để tìm kiếm`,
    },

    guide: {
      createOrder: () =>
        `Đơn hàng được tạo từ BẠN (${
          store?.getState?.()?.user?.access?.userInfo?.customer_name
        }) đến KHÁCH HÀNG NHẬN được chọn\n\n- Lưu ý:\n+ Chỉ được chọn những thiết bị thuộc quản lý trực tiếp từ bạn (không bao gồm tài khoản con và đội phương tiện)\n+ Chỉ được tạo đơn hàng đến khách hàng cấp gần nhất của bạn`,

      activeInside: (imei: string) =>
        `Bạn đang kích hoạt thiết bị\n\nLưu ý:\n+ Chỉ được kích hoạt thiết bị đang trực tiếp sở hữu\n+ Chỉ được kích  thiết bị vào tài khoản của BẠN (nếu không chọn "Tài khoản") hoặc tài khoản khách hàng cấp gần nhất`,
    },
  },
}
