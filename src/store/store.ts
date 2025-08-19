import { create } from "zustand";

//Type 정의
interface Store {}

// 선택자 함수들을 하나의 객체로 통합
export const useSelectors = {};

// 스토어 생성
export const useStore = create<Store>(() => ({}));

export default useStore;
