import { userInfo } from "os";
import { React, useEffect, useState, useRef, useCallback, initChoice, SelectSearch, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, getGridDatas, refreshGrid, reSizeGrid,  InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, QrCodeIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const Mm0104 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null); 

   const searchRef1 = useRef<any>(null);

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      coCd: '',
      bpType: '999',
      bpDiv: '999',
      useYn: '999',
   });

   const [gridDatas, setGridDatas] = useState<any[]>();

   const breadcrumbItem = [{ name: "기준정보" }, { name: "거래처" }, { name: "거래처 조회 (유지보수)" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   const setGridData = async () => {
      try {
         await MM0102_S01();
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };
   //------------------useEffect--------------------------

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
     refreshGrid(gridRef);
   }, [activeComp]);

   //Grid 데이터 설정
   useEffect(() => {
      if (gridRef.current && gridDatas) {
         let grid = gridRef.current.getInstance();
         grid.resetData((gridDatas));
         if (gridDatas.length > 0) {
            // grid.focusAt(focusRow, 0, true);
         }
      }
   }, [gridDatas]);

   useEffect(() => {
      setGridData();
   }, [inputValues.bpType, inputValues.bpDiv, inputValues.useYn]);

   //---------------------- api -----------------------------
   const ZZ_CODE = async (param: ZZ_CODE_REQ) => {
      const result3 = await ZZ_CODE_API(param);
      let formattedResult = Array.isArray(result3)
         ? result3.map(({ code, codeName, ...rest }) => ({
              value: code,
              text: codeName,
              label: codeName,
              ...rest,
           }))
         : [];

      return formattedResult;
   };

   const MM0102_S01 = async () => {
      try {
         const param = {
            coCd: "200",
            bpNm: searchRef1.current?.value || "999",
            bpType: inputValues.bpType || "999",
            bpDiv: inputValues.bpDiv || "999",
            useYn: inputValues.useYn || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0102_S01`, { data });
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("MM0102_S01 Error:", error);
         throw error;
      }
   };
  
 
   
   //-------------------event--------------------------
   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => {
          // null, undefined, ""을 하나의 빈 값으로 취급
          const currentValue = prevValues[name] ?? "";
          const newValue = value ?? "";
  
          // 동일한 값일 경우 상태를 업데이트하지 않음
          if (currentValue === newValue) {
              return prevValues;
          }
  
          return {
              ...prevValues,
              [name]: newValue,
          };
      });
   };

   const search = () => {
      setGridData();
   };

   

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef.current) {
         const grid = gridRef.current.getInstance();
         const rowData = grid.getRow(rowKey);

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {});
         }
      }
   };

   //-------------------div--------------------------

   //상단 버튼 div
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>
      </div>
   );

   //검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-4  gap-y-3  justify-start w-[60%]">
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="회사약명"></InputComp1>
            <SelectSearch
                       title="회사구분"
                       value={inputValues.bpType}
                       addData={"999"}
                       onChange={(label, value) => {
                           onInputChange("bpType", value);
                       }}

                       param={{ coCd: "999", majorCode: "ZZ0005", div: "-999" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
            <SelectSearch
                       title="회사종류"
                       value={inputValues.bpDiv}
                       addData={"999"}
                       onChange={(label, value) => {
                           onInputChange("bpDiv", value);
                       }}

                       param={{ coCd: "999", majorCode: "ZZ0019", div: "-999" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
            <SelectSearch title="사용유무" 
                        value={inputValues.useYn}
                        onChange={(label, value) => {
                              onInputChange('useYn', value);
                           }}                           

                        //초기값 세팅시
                        datas={[{value : '999', label : '전체'},{value : 'Y', label : '사용'},{value : 'N', label : '미사용'}]}
                     />
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "사업부서", name: "coCd", hidden: true },
      { header: "회사코드", name: "bpCd", width: 100, align: "center" },
      { header: "그룹사코드", name: "paCoCd", hidden: true },
      { header: "회사전명", name: "bpFullNm", width: 200 },
      { header: "회사약명", name: "bpNm", width: 200 },
      { header: "지본", name: "jiBon", align: "center", width: 120, hidden: true },
      { header: "지본", name: "jiBonNm", align: "center", width: 120 },
      { header: "시군지부", name: "siGun", width: 120, hidden: true },
      { header: "시군지부", name: "siGunNm", width: 120 },
      { header: "회사구분", name: "bpType", align: "center", width: 100 },
      { header: "회사종류", name: "bpDiv", align: "center", width: 100 },
      { header: "대표자", name: "repreNm", width: 120 },
      { header: "사업자등록번호", name: "bpRgstNo", align: "center", width: 130 },
      { header: "업종", name: "indType" , width: 200},
      { header: "업태", name: "cndType" , width: 200},
      { header: "우편번호", name: "zipCd", align:"center" , width: 80},
      { header: "주소", name: "addr1" , width: 200},
      { header: "상세주소", name: "addr2" , width: 200},
      { header: "담당자", name: "prsnNm", width: 120 },
      { header: "연락처", name: "telNo" , width: 120},
      { header: "연락처2", name: "telNo2" , width: 120},
      { header: "", name: "bankCd", hidden: true },
      { header: "", name: "bankAcctNo", hidden: true },
      { header: "", name: "bankHolder", hidden: true },
      { header: "사용여부", name: "useYn", hidden: true },
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">거래처 조회</div>
            </div>            
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={handleFocusChange} perPageYn={false} height={window.innerHeight - 440} />
      </div>
   );

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = () => {
      setGridData();
   };

   return (
      <div className={`space-y-5 overflow-y-auto `}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
            <div>{searchDiv()}</div>
         </div>
         <div className="w-full h-full flex space-x-2 p-2">
            <div className="w-full" ref={gridContainerRef}>{grid()}</div>
         </div>
      </div>
   );
};

export default Mm0104;
