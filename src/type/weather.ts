export type WeatherCategory =
  | "PTY"
  | "REH"
  | "RN1"
  | "T1H"
  | "UUU"
  | "VEC"
  | "VVV"
  | "WSD";

export interface WeatherData {
  category: string;
  obsrValue: string;
}
