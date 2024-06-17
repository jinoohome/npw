import { fetchPost } from "../util/fetch";

// 프로시저 입력에 해당하는 인터페이스 정의
export interface ZZ0101_S01_REQ {
  codeName: string;
  codeDiv: string;
  confirmYn: string;
  minorCodeName: string;
}

// 프로시저 결과에 해당하는 인터페이스 정의
export interface ZZ0101_S01_RES {
  majorCode: string;
  codeName: string;
  codeDiv: string;
  useYn: string;
  status: string;
  updtDt: string;
}

// API 호출 함수 정의
export const ZZ0101_S01_API = async (param: ZZ0101_S01_REQ) => {

  try {
    // JSON 형식의 데이터를 서버로 전송
    const data = JSON.stringify(param);
    const result = await fetchPost(`ZZ0101_S01`, { data });
    return result as ZZ0101_S01_RES[]; 
  } catch (error) {
    console.error("ZZ0101_S01 Error:", error);
    throw error;
  }
};
