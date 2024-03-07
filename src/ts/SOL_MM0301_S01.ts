import { fetchPost } from "../util/fetch";

// 프로시저 입력에 해당하는 인터페이스 정의
export interface SOL_MM0301_S01_REQ {
  bpNm: string;
  bpType: string;
  useYn: string;
}

// 프로시저 결과에 해당하는 인터페이스 정의
export interface SOL_MM0301_S01_RES {
  coCd: string;        // 회사 코드
  paCoCd: string;      // 상위 회사 코드
  bpFullNm: string;    // 비즈니스 파트너 전체 이름
  bpNm: string;        // 비즈니스 파트너 이름
  bpType: string;      // 비즈니스 파트너 타입
  repreNm: string;     // 대표자 이름
  bpRgstNo: string;    // 비즈니스 파트너 등록 번호
  indType: string;     // 산업 유형
  cndType: string;     // 조건 유형
  zipCd: string;       // 우편 번호
  addr1: string;       // 주소 1
  addr2: string;       // 주소 2
  telNo: string;       // 전화 번호
  telNo2: string;      // 두 번째 전화 번호
  bankCd: string;      // 은행 코드
  bankAcctNo: string;  // 은행 계좌 번호
  bankHolder: string;  // 계좌 소유자
  payAmt: number;      // 지불 금액
  empCnt: number;      // 직원 수
  idCnt: number;       // 식별자 수
  saveFileNm: string;  // 저장된 파일 이름
  useYn: string;       // 사용 여부
}

// API 호출 함수 정의
export const SOL_MM0301_S01_API = async (param: SOL_MM0301_S01_REQ) => {

  try {
    // 프로시저에 맞는 JSON 형식의 데이터 준비
    const data = JSON.stringify(param);
    // 서버로 전송
    const result = await fetchPost(`SOL_MM0301_S01`, { data });
    return result as SOL_MM0301_S01_RES[]; 
  } catch (error) {
    console.error("SOL_MM0301_S01 Error:", error);
    throw error;
  }
};
