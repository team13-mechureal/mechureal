import React, { JSX, useEffect, useState, useRef } from "react";
import mechureal from "../asset/img/mechureal.png";
import { weatherInfoApi } from "../api/common";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { weatherCategoryMap } from "../data/weather";
import { WeatherCategory, WeatherData } from "../type/weather";
import { LocationData } from "../type/location";


// Leaflet 마커 아이콘 설정 (기본 아이콘 경로 문제 해결)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Home = (): JSX.Element => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // 서울 좌표 (기본값)
  const defaultNx = 60;
  const defaultNy = 127;

  // Leaflet 지도 초기화 및 마커 표시
  useEffect(() => {
    if (!location || !mapRef.current) return;

    // 기존 지도가 있으면 업데이트
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      const newCenter: [number, number] = [
        location.latitude,
        location.longitude,
      ];

      // 지도 중심 업데이트
      map.setView(newCenter, map.getZoom());

      // 마커 업데이트
      if (markerRef.current) {
        markerRef.current.setLatLng(newCenter);
        // 팝업 내용도 업데이트
        markerRef.current.setPopupContent(
          `
          <div style="padding: 5px;">
            <h3 style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">현재 위치</h3>
            <p style="margin: 0; font-size: 12px;">
              위도: ${location.latitude.toFixed(6)}<br/>
              경도: ${location.longitude.toFixed(6)}
            </p>
          </div>
        `
        );
      } else {
        // 마커가 없으면 새로 생성
        markerRef.current = L.marker(newCenter, {
          title: "현재 위치",
        }).addTo(map);

        // 팝업 추가
        markerRef.current.bindPopup(
          `
          <div style="padding: 5px;">
            <h3 style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">현재 위치</h3>
            <p style="margin: 0; font-size: 12px;">
              위도: ${location.latitude.toFixed(6)}<br/>
              경도: ${location.longitude.toFixed(6)}
            </p>
          </div>
        `
        );
      }
      return;
    }

    // 새 지도 생성
    try {
      const map = L.map(mapRef.current).setView(
        [location.latitude, location.longitude],
        15
      );

      // OpenStreetMap 타일 레이어 추가
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // 마커 추가
      const marker = L.marker([location.latitude, location.longitude], {
        title: "현재 위치",
      }).addTo(map);

      // 팝업 추가
      marker.bindPopup(
        `
        <div style="padding: 5px;">
          <h3 style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">현재 위치</h3>
          <p style="margin: 0; font-size: 12px;">
            위도: ${location.latitude.toFixed(6)}<br/>
            경도: ${location.longitude.toFixed(6)}
          </p>
        </div>
      `
      );

      // 마커 클릭 시 팝업 열기
      marker.on("click", () => {
        marker.openPopup();
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // 컴포넌트 언마운트 시 지도 정리
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        markerRef.current = null;
      };
    } catch (err: any) {
      console.error("지도 초기화 오류:", err);
    }
  }, [location]);

  // Geolocation API로 위치 정보 가져오기
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setLocationError("이 브라우저는 위치 정보를 지원하지 않습니다.");
        return;
      }

      setLocationLoading(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setLocationLoading(false);
          console.log("위치 정보:", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (err) => {
          let errorMessage = "위치 정보를 가져올 수 없습니다.";
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "위치 정보 접근이 거부되었습니다.";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "위치 정보를 사용할 수 없습니다.";
              break;
            case err.TIMEOUT:
              errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
              break;
            default:
              errorMessage = `알 수 없는 오류: ${err.message}`;
              break;
          }
          setLocationError(errorMessage);
          setLocationLoading(false);
          console.error("위치 정보 오류:", err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getLocation();
  }, []);

  // 날씨 정보 가져오기
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await weatherInfoApi(defaultNx, defaultNy);

        // API 응답 구조 확인
        const responseData = response.data?.response;

        // 에러 응답 확인
        if (responseData?.header?.resultCode !== "00") {
          const errorMsg = responseData?.header?.resultMsg || "알 수 없는 오류";
          setError(
            `API 오류 (${responseData?.header?.resultCode}): ${errorMsg}`
          );
          console.error("API 응답 오류:", responseData?.header);
          return;
        }

        // 데이터 추출
        if (responseData?.body?.items?.item) {
          setWeatherData(responseData.body.items.item);
        } else {
          setError("날씨 데이터를 찾을 수 없습니다.");
        }
      } catch (err: any) {
        // axios 에러인 경우 상세 정보 추출
        if (err.response) {
          const errorData = err.response.data;
          if (errorData?.response?.header) {
            const errorMsg =
              errorData.response.header.resultMsg || "알 수 없는 오류";
            setError(
              `API 오류 (${errorData.response.header.resultCode}): ${errorMsg}`
            );
          } else {
            setError(`HTTP 오류 (${err.response.status}): ${err.message}`);
          }
        } else {
          setError(err.message || "날씨 정보를 불러오는데 실패했습니다.");
        }
        console.error("날씨 API 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="w-screen h-full pb-[100px] bg-ivory flex flex-col items-center">
      <img
        src={mechureal}
        alt="Mechureal Logo"
        className="w-[250px] h-[250px] mt-[100px]"
      />
      <p className="tj-eb-64 mt-[88px] text-darkBrown">메추리얼</p>
      <p className="tj-b-24 text-darkBrown">뭘 먹고 싶은지 맞춰볼게!</p>

      {/* 날씨 정보 테스트 표시 */}
      {
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md max-w-md w-full">
          <h3 className="tj-b-20 text-darkBrown mb-4">날씨 정보 테스트</h3>

          {/* API 키 확인 (디버깅용) */}
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
            <p className="tj-b-12 text-gray-600">
              API 키 상태:{" "}
              {process.env.REACT_APP_WEATHER_API_KEY ? "✓ 설정됨" : "✗ 미설정"}
            </p>
          </div>

          {loading && (
            <p className="tj-b-16 text-darkBrown">날씨 정보를 불러오는 중...</p>
          )}

          {error && (
            <div className="p-3 bg-red-100 rounded">
              <p className="tj-b-16 text-red-600">오류: {error}</p>
              {!process.env.REACT_APP_WEATHER_API_KEY && (
                <p className="tj-b-12 text-red-500 mt-2">
                  💡 .env 파일에 REACT_APP_WEATHER_API_KEY를 설정해주세요.
                </p>
              )}
            </div>
          )}

          {!loading && !error && weatherData.length > 0 && (
            <div className="space-y-2">
              {weatherData.map((item, index) => {

                // weatherCategoryMap으로 정보 한글로 변환
                const info = weatherCategoryMap[item.category as WeatherCategory];
                if (!info) return null;

                const value = info.convert
                  ? info.convert(item.obsrValue)
                  : `${item.obsrValue}${info.unit}`;

                return (
                  <div
                    key={index}
                    className="flex justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="tj-b-16 text-darkBrown">
                      {info.label}:
                    </span>
                    <div>
                      <span className="tj-b-16 text-darkBrown">
                        {value}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!loading && !error && weatherData.length === 0 && (
            <p className="tj-b-16 text-darkBrown">날씨 데이터가 없습니다.</p>
          )}
        </div>
      }

      {/* 위치 정보 테스트 표시 */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-md max-w-md w-full">
        <h3 className="tj-b-20 text-darkBrown mb-4">
          위치 정보 테스트 (Geolocation API)
        </h3>

        {locationLoading && (
          <p className="tj-b-16 text-darkBrown">위치 정보를 가져오는 중...</p>
        )}

        {locationError && (
          <div className="p-3 bg-red-100 rounded">
            <p className="tj-b-16 text-red-600">오류: {locationError}</p>
            <p className="tj-b-12 text-red-500 mt-2">
              💡 브라우저에서 위치 정보 접근 권한을 허용해주세요.
            </p>
          </div>
        )}

        {!locationLoading && !locationError && location && (
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="tj-b-16 text-darkBrown">위도 (Latitude):</span>
              <span className="tj-b-16 text-darkBrown">
                {location.latitude.toFixed(6)}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="tj-b-16 text-darkBrown">경도 (Longitude):</span>
              <span className="tj-b-16 text-darkBrown">
                {location.longitude.toFixed(6)}
              </span>
            </div>
            {location.accuracy && (
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="tj-b-16 text-darkBrown">
                  정확도 (Accuracy):
                </span>
                <span className="tj-b-16 text-darkBrown">
                  ±{Math.round(location.accuracy)}m
                </span>
              </div>
            )}
            <div className="mt-4 p-2 bg-blue-50 rounded">
              <p className="tj-b-12 text-blue-600">
                📍 Google Maps에서 보기:{" "}
                <a
                  href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  링크
                </a>
              </p>
            </div>
          </div>
        )}

        {!locationLoading && !locationError && !location && (
          <p className="tj-b-16 text-darkBrown">위치 정보가 없습니다.</p>
        )}

        {/* 지도 표시 (Leaflet - API 키 불필요) */}
        {!locationLoading && !locationError && location && (
          <div className="mt-4">
            <p className="tj-b-16 text-darkBrown mb-2">지도 (OpenStreetMap)</p>
            <div
              ref={mapRef}
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "8px",
                overflow: "hidden",
                zIndex: 0,
              }}
              className="border border-gray-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
