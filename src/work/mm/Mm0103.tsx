import { userInfo } from "os";
import { React, useEffect, useState, useRef, SelectSearch, InputComp, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import DaumPostcodeComp from "../../comp/DaumPostcodeComp";  // DaumPostcodeComp 컴포넌트 임포트
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
}

const Mm0103 = ({ item, activeComp, leftMode, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);

   const refs = {
      coCd: useRef<any>(null),
      bpCd: useRef<any>(null),
      paBpCd: useRef<any>(null),
      bpType: useRef<any>(null),
      bpDiv: useRef<any>(null),
      prsnNm: useRef<any>(null),
      bpFullNm: useRef<any>(null),
      bpNm: useRef<any>(null),
      indType: useRef<any>(null),
      cndType: useRef<any>(null),
      repreNm: useRef<any>(null),
      bpRgstNo: useRef<any>(null),
      telNo: useRef<any>(null),
      telNo2: useRef<any>(null),
      bankCd: useRef<any>(null),
      bankAcctNo: useRef<any>(null),
      bankHolder: useRef<any>(null),
      zipCd: useRef<any>(null),
      addr1: useRef<any>(null),
      addr2: useRef<any>(null),
      jiBon: useRef<any>(null),
      siGun: useRef<any>(null),
      erpCode: useRef<any>(null),
   };

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      coCd: '',
   });

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [zz0005, setZz0005] = useState<ZZ_CODE_RES[]>([]);
   const [cd0008, setCd0008] = useState<ZZ_CODE_RES[]>([]);
   const [zz0009, setZZ0009] = useState<ZZ_CODE_RES[]>([]);
   const [zz0019, setZZ0019] = useState<ZZ_CODE_RES[]>([]);
   const [coCds, setCoCds] = useState<any>([]);
   const [paBpCds, setPaBpCds] = useState<any>([]);

   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();

   const [focusRow, setFocusRow] = useState<any>(0);

   const breadcrumbItem = [{ name: "기준정보" }, { name: "거래처" }, { name: "거래처등록 (유지보수)" }];

   const { fetchWithLoading } = useLoadingFetch();

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   //--------------------init---------------------------

   const setChoiceUI = () => {
      initChoice(searchRef2, setChoice1);
      initChoice(searchRef3, setChoice2, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
   };

   const setGridData = async () => {
      await fetchWithLoading(async () => {
         try {
            let zz0005Data = await ZZ_CODE({ coCd: "999", majorCode: "ZZ0005", div: "999" });
            if (zz0005Data != null) {            
               setZz0005(zz0005Data);
            }

            const result = await MM0101_S01();

            if (!result?.length) {
               const emptyValues = Object.fromEntries(
                  Object.keys(refs).map(key => [key, ""])
               );
               setInputValues(emptyValues);
               
               Object.values(refs).forEach(ref => {
                  if (ref?.current) ref.current.value = "";
               });
            }
         } catch (error) {
            console.error("setGridData Error:", error);
         }
      });
   };

   //------------------useEffect--------------------------

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(gridRef);
   }, [activeComp, leftMode]);

   //Grid 데이터 설정
   useEffect(() => {
      if (gridRef.current && gridDatas) {
         let grid = gridRef.current.getInstance();
         grid.resetData(gridDatas);
         if (gridDatas.length > 0) {
            grid.focusAt(focusRow, 0, true);
         }
      }      
   }, [gridDatas]);

   //inputChoicejs 데이터 설정
   useEffect(() => {
      updateChoices(choice1, zz0005, "value", "text");
   }, [zz0005]);

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

   const MM0101_S01 = async () => {
      try {
         const param = {
            coCd: "200",
            bpNm: searchRef1.current?.value || "999",
            bpType: searchRef2.current?.value || "999",
            useYn: searchRef3.current?.value || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0101_S01`, { data });
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("MM0101_S01 Error:", error);
         throw error;
      }
   };

   const MM0101_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`MM0101_U01`, data);
         return result;
      } catch (error) {
         console.error("MM0101_U01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------
   const handleAddressSelect = (data: any) => {
      const { zonecode, roadAddress, jibunAddress } = data;
      const selectedAddress = roadAddress || jibunAddress;
   
      // 우편번호와 주소 필드에 값을 설정
      refs.zipCd.current.value = zonecode;
      refs.addr1.current.value = selectedAddress;
   
      // 그리드 데이터 변경
      setChangeGridData("zipCd", zonecode);
      setChangeGridData("addr1", selectedAddress);
   };

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

   const save = async () => {
      await fetchWithLoading(async () => {
         const data = await getGridValues();
         if (data) {
            let result = await MM0101_U01(data);
            if (result) {
               returnResult();
            }
         }
      });
   };

   const returnResult = () => {
      let grid = gridRef.current.getInstance();
      let focusMajorRowKey = grid.getFocusedCell().rowKey || 0;
      setFocusRow(focusMajorRowKey);
      alertSwal("저장완료", "저장이 완료되었습니다.", "success");
      setGridData();
      grid.focusAt(focusMajorRowKey, 0, true);
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let datas = await getGridDatas(gridRef);

      let data = {
         data: JSON.stringify(datas),
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
      };

      return data;
   };

   //grid 추가버튼
   const addGridRow = () => {
      let grid = gridRef.current.getInstance();

      grid.appendRow({ coCd: "200", bpDiv: "", paBpCd: "", bpType: "", bankCd: "", useYn: "Y" }, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let grid = gridRef.current.getInstance();      

      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);
      
      // 행을 삭제
      grid.removeRow(rowKey, {});

      // 남은 행이 있는 경우에만 포커스를 맞춤
      if (grid.getRowCount() > 0) {
         grid.focusAt(rowIndex, 1, true);
      }
   };

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      await fetchWithLoading(async () => {
         if (rowKey !== null && gridRef.current) {
            const grid = gridRef.current.getInstance();
            const rowData = grid.getRow(rowKey);

            if (rowData) {
               Object.entries(rowData).forEach(([key, value]) => {
                  onInputChange(key, value);
               }); 

               Object.entries(rowData).forEach(([key, value]) => {
                  const ref = refs[key as keyof typeof refs];
                  if (ref?.current) {
                     ref.current.value = value;
                  }
               });
            }
         }
      });
   };

   const setChangeGridData = (columnName: string, value: any) => {

      
      const grid = gridRef.current.getInstance();
      const { rowKey } = grid.getFocusedCell();

      grid.setValue(rowKey, columnName, value, false);
      //grid.setValue(5, 'bpNm', 'test', false);
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = () => {
      setGridData();
   };

   //-------------------div--------------------------

   //상단 버튼 div
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>
         <button type="button" onClick={save} className="bg-blue-500 text-white  rounded-lg px-2 py-1 flex items-center shadow">
            <ServerIcon className="w-5 h-5 mr-1" />
            저장
         </button>
      </div>
   );

   //검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="회사약명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="회사구분" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef3} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
         </div>
      </div>
   );
   //input div
   const inputDiv = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">회사 등록</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-12  justify-around items-center ">
            <SelectSearch
                        title="사업부서"
                        value={inputValues.coCd}
                        readonly={true}
                        onChange={(label, value) => {
                              setChangeGridData("coCd", value);
                              onInputChange("coCd", value);
                        }}

                        stringify={true}
                        layout="vertical"
                        param={{ coCd: "200" }}
                        procedure="ZZ_B_BIZ"
                        dataKey={{ label: "bpNm", value: "coCd" }}
               />
               <InputComp title="회사코드" readOnly={true} layout="vertical" value={inputValues.bpCd} onChange={(e)=> onInputChange('bpCd',e)} />
               <SelectSearch
                        title="그룹사코드"
                        value={inputValues.paBpCd}
                        onChange={(label, value) => {
                              setChangeGridData("paBpCd", value);
                              onInputChange("paBpCd", value);
                        }}
                        addData={"empty"}
                        stringify={true}
                        layout="vertical"
                        param={{ coCd: "200",
                                 bpNm: "999",
                                 bpType: searchRef2.current?.value || "999",
                                 useYn: "Y", }}
                        procedure="MM0101_S01"
                        dataKey={{ label: "bpNm", value: "bpCd" }}
               />
               <SelectSearch
                       title="회사구분"
                       value={inputValues.bpType}
                       readonly={inputValues.bpCd}
                       layout="vertical"
                       onChange={(label, value) => {
                           setChangeGridData("bpType", value);
                           onInputChange("bpType", value);
                       }}

                       param={{ coCd: "999", majorCode: "ZZ0005", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
            </div>

            <div className="grid grid-cols-2  gap-12  justify-around items-center">
               <InputComp2 ref={refs.bpFullNm} title="회사전명" target="bpFullNm" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bpNm} title="회사약명" target="bpNm" setChangeGridData={setChangeGridData} />
            </div>

            <div className="grid grid-cols-4  gap-6  justify-around items-center">
               <SelectSearch
                       title="회사종류"
                       value={inputValues.bpDiv}
                       layout="vertical"
                       onChange={(label, value) => {
                           setChangeGridData("bpDiv", value);
                           onInputChange("bpDiv", value);
                       }}

                       param={{ coCd: "999", majorCode: "ZZ0019", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
               <InputComp2 ref={refs.indType} title="업종" target="indType" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.cndType} title="업태" target="cndType" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.repreNm} title="대표자명" target="repreNm" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bpRgstNo} title="사업자등록번호" target="bpRgstNo" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.prsnNm} title="담당자명" target="prsnNm" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.telNo} title="전화번호1" target="telNo" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.telNo2} title="전화번호2" target="telNo2" setChangeGridData={setChangeGridData} /> 
               <SelectSearch
                       title="지본"
                       value={inputValues.jiBon}
                       layout="vertical"
                       onChange={(label, value) => {
                           setChangeGridData("jiBon", value);
                           onInputChange("jiBon", value);
                       }}

                       param={{ coCd: "999", majorCode: "MA0002", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
               <SelectSearch
                       title="시군지부"
                       value={inputValues.siGun}
                       layout="vertical"
                       onChange={(label, value) => {
                           setChangeGridData("siGun", value);
                           onInputChange("siGun", value);
                       }}

                       param={{ coCd: "999", majorCode: "MA0003", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
               <InputComp2 ref={refs.erpCode} title="ERP코드(업로드용)" target="erpCode" setChangeGridData={setChangeGridData} /> 
               <SelectSearch title="정산처" 
                        value={inputValues.billBpCd}
                        onChange={(label, value) => {
                              setChangeGridData("billBpCd", value);
                              onInputChange('billBpCd', value);
                           }}
                        layout="vertical"                           
                        //초기값 세팅시
                        datas={[{value : '', label : ''},{value : 'A1001', label : '농협경제지주(주) 에너지사업부'},{value : 'A3969', label : '농협은행'}]}
                     />  
            </div>

            <div className="grid grid-cols-3  gap-12  justify-around items-center">
               <div className="flex space-x-2 items-end">
                  <InputComp2 ref={refs.zipCd} title="우편번호" target="zipCd" setChangeGridData={setChangeGridData} />
                  <DaumPostcodeComp onComplete={handleAddressSelect} /> {/* Daum 주소 검색 버튼 */}
               </div>
               <InputComp2 ref={refs.addr1} title="주소" target="addr1" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.addr2} title="상세주소" target="addr2" setChangeGridData={setChangeGridData} />
            </div>

            <div className="grid grid-cols-4  gap-12  justify-around items-center">
               <SelectSearch
                       title="은행"
                       value={inputValues.bankCd}
                       layout="vertical"
                       onChange={(label, value) => {
                           setChangeGridData("bankCd", value);
                           onInputChange("bankCd", value);
                       }}

                       param={{ coCd: "999", majorCode: "ZZ0009", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
               <InputComp2 ref={refs.bankAcctNo} title="은행계좌번호" target="bankAcctNo" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.bankHolder} title="예금주" target="bankHolder" setChangeGridData={setChangeGridData} />    
               <SelectSearch title="사용유무" 
                        value={inputValues.useYn}
                        onChange={(label, value) => {
                              setChangeGridData("useYn", value);
                              onInputChange('useYn', value);
                           }}
                        layout="vertical"                           
                        //초기값 세팅시
                        datas={[{value : '999', label : '전체'},{value : 'Y', label : '사용'},{value : 'N', label : '미사용'}]}
                     />  
            </div>
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "사업부서", name: "coCd", hidden: true },
      { header: "회사코드", name: "bpCd", width: 100, align: "center" },
      { header: "그룹사코드", name: "paBpCd", hidden: true },
      { header: "회사명", name: "bpFullNm", hidden: true },
      { header: "회사약명", name: "bpNm" },
      { header: "회사구분", name: "bpType", hidden: true },
      { header: "정산처", name: "billBpCd", hidden: true },
      { header: "회사종류", name: "bpDiv", hidden: true },
      { header: "", name: "repreNm", hidden: true },
      { header: "", name: "bpRgstNo", hidden: true },
      { header: "", name: "indType", hidden: true },
      { header: "", name: "cndType", hidden: true },
      { header: "우편번호", name: "zipCd", hidden: true },
      { header: "지본", name: "jiBon", hidden: true },
      { header: "시군지부", name: "siGun", hidden: true },
      { header: "주소1", name: "addr1", hidden: true },
      { header: "주소2", name: "addr2", hidden: true },
      { header: "담당자명", name: "prsnNm", hidden: true },
      { header: "연락처", name: "telNo", hidden: true },
      { header: "연락처2", name: "telNo2", hidden: true },
      { header: "", name: "bankCd", hidden: true },
      { header: "", name: "bankAcctNo", hidden: true },
      { header: "", name: "bankHolder", hidden: true },
      { header: "", name: "erpCode", hidden: true },
      { header: "사용여부", name: "useYn", hidden: true },
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">거래처 정보</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delMajorGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={handleFocusChange} height={window.innerHeight - 520}/>
      </div>
   );

   return (
      <div className={`space-y-5 overflow-y-auto`}>
         <LoadingSpinner />
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
            <div>{searchDiv()}</div>
         </div>
         <div className="w-full h-full flex space-x-2 p-2">
            <div className="w-1/3 " ref={gridContainerRef}>{grid()}</div>
            <div className="w-2/3 ">{inputDiv()} </div>
         </div>
      </div>
   );
};

export default Mm0103;