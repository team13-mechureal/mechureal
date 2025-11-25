// 날씨 정보 설명
//     PTY : 강수 형태 (0: 없음, 1: 비, 2: 비/눈, 3: 눈, 4: 소나기, 5: 빗방울, 6: 빗방울눈날림, 7: 눈날림)
//     REH : 습도 (%)
//     RN1 : 1시간 강수량 (mm)
//     T1H : 기온 (°C)
//     UUU : 동서바람성분 (m/s)
//     VEC : 풍향 (deg)
//     VVV : 남북바람성분 (m/s)
//     WSD : 풍속 (m/s)
//     ---
//     SKY : 하늘 상태 (1: 맑음, 3: 구름많음, 4: 흐림) (다른 api 데이터)

import { WeatherCategory } from "../type/weather";

export const weatherCategoryMap: Record<
  WeatherCategory,
  {
    label: string;
    unit: string;
    convert?: (value: string | number) => string;
  }
> = {
  PTY: {
    label: "강수 형태",
    unit: "",
    convert: (value: string | number) => {
      const map: Record<string, string> = {
        "0": "없음",
        "1": "비",
        "2": "비/눈",
        "3": "눈",
        "4": "소나기",
        "5": "빗방울",
        "6": "빗방울눈날림",
        "7": "눈날림",
      };
      return map[String(value)] ?? "정보 없음";
    },
  },
  REH: { label: "습도", unit: "%" },
  RN1: { label: "1시간 강수량", unit: "mm" },
  T1H: { label: "기온", unit: "°C" },
  UUU: { label: "동서 바람성분", unit: "m/s" },
  VEC: { label: "풍향", unit: "°" },
  VVV: { label: "남북 바람성분", unit: "m/s" },
  WSD: { label: "풍속", unit: "m/s" },
};
