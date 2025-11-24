import axios from "axios";

// 현재 날짜와 시간을 기상청 API 형식으로 변환
const getCurrentBaseDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // 초단기실황은 매 시간 정각(00분)에 발표되며, 최근 1시간 이내 데이터만 제공
  // 현재 시간에서 1시간 전의 정각 시간을 사용
  let baseHours = hours - 1;
  let baseDate = `${year}${month}${date}`;

  // 자정 이전 시간 처리 (전날 23시로 설정)
  if (baseHours < 0) {
    baseHours = 23;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yDate = String(yesterday.getDate()).padStart(2, "0");
    baseDate = `${yYear}${yMonth}${yDate}`;
  }

  const baseTime = String(baseHours).padStart(2, "0") + "00";

  return { baseDate, baseTime };
};

export const weatherInfoApi = async (nx: number, ny: number) => {
  const { baseDate, baseTime } = getCurrentBaseDateTime();

  const serviceKey = process.env.REACT_APP_WEATHER_API_KEY;

  if (!serviceKey) {
    throw new Error(
      "API 키가 설정되지 않았습니다. REACT_APP_WEATHER_API_KEY 환경 변수를 확인해주세요."
    );
  }

  // 기상청 API는 serviceKey가 이미 URL 인코딩된 형태로 제공되는 경우가 많음
  // axios params는 자동 인코딩하므로, serviceKey가 이미 인코딩되어 있다면
  // 이중 인코딩을 방지하기 위해 디코딩 후 전달
  let decodedServiceKey = serviceKey;
  try {
    // 이미 인코딩되어 있는지 확인하고 디코딩
    if (serviceKey.includes("%")) {
      decodedServiceKey = decodeURIComponent(serviceKey);
    }
  } catch (e) {
    // 디코딩 실패 시 원본 사용
    decodedServiceKey = serviceKey;
  }

  const result = await axios.get(
    "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",
    {
      params: {
        serviceKey: decodedServiceKey,
        pageNo: "1",
        numOfRows: "10",
        dataType: "JSON",
        base_date: baseDate,
        base_time: baseTime,
        nx: String(nx),
        ny: String(ny),
      },
    }
  );

  return result;
};
