import { fetchPost } from "../util/fetch";

// 프로시저 입력에 해당하는 인터페이스 정의
export interface ZZ0101_S02_REQ {
  majorCode: string;
}

// 프로시저 결과에 해당하는 인터페이스 정의
export interface ZZ0101_S02_RES {
  majorCode: string;
  code: string;
  codeName: string;
  paCode: string;
  lev: number;
  remark1: string;
  remark2: string;
  remark3: string;
  sort: number;
  useYn: string;
  status: string;
}

// API 호출 함수 정의
export const ZZ0101_S02_API = async (param: ZZ0101_S02_REQ) => {

  try {
    const result = await fetchPost(`ZZ0101_S02`, param);
    return result as ZZ0101_S02_RES[]; // 결과를 SOLMM0401S02Res 타입으로 캐스팅
  } catch (error) {
    console.error("ZZ0101_S02 Error:", error);
    throw error;
  }
};
