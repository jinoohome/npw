import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, TextArea, SelectSearch, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import DaumPostcodeComp from "../../comp/DaumPostcodeComp";  // DaumPostcodeComp 컴포넌트 임포트


interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const MM0401 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);


   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      coCd: '',
   });

   const refs = {
      dlvyCd: useRef<any>(null),
      dlvyNm: useRef<any>(null),
      dlvyDiv: useRef<any>(null),
      siDo: useRef<any>(null),
      siGunGu: useRef<any>(null),
      telNo: useRef<any>(null),
      zipCd: useRef<any>(null),
      addr1: useRef<any>(null),
      addr2: useRef<any>(null),
      remark: useRef<any>(null),
      useYn: useRef<any>(null),
      insrtUserId: useRef<any>(null),
      insrtDt: useRef<any>(null),
      updtUserId: useRef<any>(null),
      updtDt: useRef<any>(null),
      coCd: useRef<any>(null),
      usrStatus: useRef<any>(null),
    
   };

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [cd0006Input, setCd0006Input] = useState<ZZ_CODE_RES[]>([]);
   const [wo0002Input, setWo0002Input] = useState<ZZ_CODE_RES[]>([]);
   const [wo0003Input, setWo0003Input] = useState<ZZ_CODE_RES[]>([]);

   const [choice1, setChoice1] = useState<any>(); 
   
   const [focusRow, setFocusRow] = useState<any>(0);

   const breadcrumbItem = [{ name: "기준정보" }, { name: "배송지 관리" }, { name: "배송지 등록" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   useEffect(() => {
      console.log("focusRow changed:", focusRow);
   }, [focusRow]);

   //--------------------init---------------------------

   const setChoiceUI = () => {
      initChoice(searchRef2, setChoice1, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
   };

   const setGridData = async () => {
      try {          
         let cd0006Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0006", div: "999" });
         if (cd0006Data != null) {  
            let cd0006IntupData = cd0006Data.filter(item => !(item.value === "999" && item.text === "전체"));
            cd0006IntupData.unshift({ value: "", text: "" });

            setCd0006Input(cd0006IntupData);   
         }      

         let wo0002Data = await ZZ_CODE({ coCd: "999", majorCode: "WO0002", div: "999" });
         if (wo0002Data != null) {  
            let wo0002IntupData = wo0002Data.filter(item => !(item.value === "999" && item.text === "전체"));
            wo0002IntupData.unshift({ value: "", text: "" });

            setWo0002Input(wo0002IntupData);   
         }      

         let wo0003Data = await ZZ_CODE({ coCd: "999", majorCode: "WO0003", div: "999" });
         if (wo0003Data != null) {  
            let wo0003IntupData = wo0003Data.filter(item => !(item.value === "999" && item.text === "전체"));
            wo0003IntupData.unshift({ value: "", text: "" });

            setWo0003Input(wo0003IntupData);   
         }       

         const result = await MM0401_S01();

         if (!result || result.length === 0) {
            // 데이터가 없을 때 refs 값들 초기화
            Object.keys(refs).forEach((key) => {
               const ref = refs[key as keyof typeof refs];
               if (ref?.current) {                  
                     ref.current.value = ""; // 각 ref의 값을 빈 값으로 설정
               }
            });

            setInputValues([]);
         }
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
         grid.resetData(gridDatas);
         if (gridDatas.length > 0) {
            grid.focusAt(focusRow, 0, true);
         }
      }

   }, [gridDatas]);
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

   const MM0401_S01 = async () => {
      try {
         const param = {
            coCd:  userInfo.coCd,
            dlvyNm:  searchRef1.current?.value   || "999",
            useYn: searchRef2.current?.value   || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0401_S01`, { data });

         setGridDatas(result);

         const grid = gridRef.current.getInstance();

   
         if(grid.getData().length > 0){
            grid.focusAt(focusRow, 0, true);

         }
       
     
         return result;
      } catch (error) {
         console.error("MM0401_S01 Error:", error);
         throw error;
      }
   };

   const MM0401_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`MM0401_U01`, data);
         return result;
      } catch (error) {
         console.error("MM0401_U01 Error:", error);
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

      let grid = gridRef.current.getInstance();
      const focusRow = grid.getFocusedCell().rowKey? grid.getFocusedCell().rowKey : 0;
      let rowKey = grid.getValue(focusRow, "isNew")? 0 : focusRow;     
      
      setFocusRow(rowKey);
    
      const data = await getGridValues();
      console.log(data);
      if (data) {
         let result = await MM0401_U01(data);
         if (result) {
            await returnResult(result);
         }
      }else{

         grid.focusAt(rowKey, 0, true);
      }
   };
   const returnResult = async(result: any) => {
     
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      await setGridData();
   
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let datas = await getGridDatas(gridRef);
    
      if(datas){
         let data = {
            data: JSON.stringify(datas),
            menuId: activeComp.menuId,
            insrtUserId: userInfo.usrId,
         };
   
         return data;
      }
   };

   //grid 추가버튼
   const addMajorGridRow = () => {
      let grid = gridRef.current.getInstance();

      grid.appendRow({  dlvyCd: "", dlvyNm: "", dlvyDiv: "", siDo: "", siGunGu: "",
                        useYn: "Y", coCd: "", telNo: "", zipCd: "", addr1: "", addr2: "",remark:""  ,isNew: true}, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let grid = gridRef.current.getInstance();
      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);
    
      grid.removeRow(rowKey, {});
      if(rowIndex > -1) grid.focusAt(rowIndex, 1, true);
   };

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef.current) {
         const grid = gridRef.current.getInstance();
         const rowData = grid.getRow(rowKey);

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {
               
               onInputChange(key, value);
            }); 
         }

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {
               const ref = refs[key as keyof typeof refs]; // Add index signature to allow indexing with a string
               if (ref && ref.current) {
                  ref.current.value = value;
               }               
            });
         }
      }
   };

   const setChangeGridData = (columnName: string, value: any) => {
      const grid = gridRef.current.getInstance();
      const { rowKey } = grid.getFocusedCell();
      console.log("setChangeGridData", rowKey, columnName, value);
      grid.setValue(rowKey, columnName, value, false);

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
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="배송지명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
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
               <div className="">배송지 정보</div>
            </div>
         </div>
   
         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-6  justify-around items-center ">
               <InputComp2 ref={refs.dlvyCd} title="배송지코드" target="dlvyCd" setChangeGridData={setChangeGridData} readOnly={true} />
               <InputComp2 ref={refs.dlvyNm} title="배송지명" target="dlvyNm" setChangeGridData={setChangeGridData} />
               <SelectSearch
                  title="배송지구분"
                  value={inputValues.dlvyDiv}
                  layout="vertical"
                  onChange={(label, value) => {
                     setChangeGridData("dlvyDiv", value);
                     onInputChange("dlvyDiv", value);
                  }}
                  param={{ coCd: "999", majorCode: "CD0006", div: "" }}
                  procedure="ZZ_CODE"
                  dataKey={{ label: "codeName", value: "code" }}
               />
               <SelectSearch
                  title="시/도"
                  value={inputValues.siDo}
                  layout="vertical"
                  onChange={(label, value) => {
                     setChangeGridData("siDo", value);
                     onInputChange("siDo", value);
                  }}
                  param={{ coCd: "999", majorCode: "WO0002", div: "" }}
                  procedure="ZZ_CODE"
                  dataKey={{ label: "codeName", value: "code" }}
               />
               <SelectSearch
                  title="시/군/구"
                  value={inputValues.siGunGu}
                  layout="vertical"
                  onChange={(label, value) => {
                     setChangeGridData("siGunGu", value);
                     onInputChange("siGunGu", value);
                  }}
                  param={{ coCd: "999", majorCode: "WO0003", div: "" }}
                  procedure="ZZ_CODE"
                  dataKey={{ label: "codeName", value: "code" }}
               />
               <InputComp2 ref={refs.telNo} title="전화번호" target="telNo" setChangeGridData={setChangeGridData} />
   
               {/* 우편번호 및 주소 입력 필드와 DaumPostcodeComp 추가 */}
               <div className="flex space-x-2 items-end col-span-2">
                  <InputComp2 ref={refs.zipCd} title="우편번호" target="zipCd" setChangeGridData={setChangeGridData} />
                  <DaumPostcodeComp onComplete={handleAddressSelect} /> {/* Daum 주소 검색 버튼 */}
               </div>
   
               <InputComp2 ref={refs.addr1} title="주소" target="addr1" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.addr2} title="상세주소" target="addr2" setChangeGridData={setChangeGridData} />
               <SelectSearch
                  title="사용여부"
                  value={inputValues.useYn}
                  layout="vertical"
                  onChange={(label, value) => {
                     setChangeGridData("useYn", value);
                     onInputChange("useYn", value);
                  }}
                  datas={[
                     { value: "", label: "" },
                     { value: "Y", label: "사용" },
                     { value: "N", label: "미사용" },
                  ]}
               />
            </div>
            <div className="gap-6  justify-around items-center ">
                  <TextArea title="특이사항" value={inputValues.remarkDtl} 
                     onChange={
                        (e) => {
                           setChangeGridData("remark", e);
                           onInputChange("remark", e);
                        }
                  } 
                     layout="vertical" textAlign="left"
                     ref={refs.remark}
                     
               ></TextArea>
            </div>
           
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "배송지코드", name: "dlvyCd", width: 100, align: "center", hidden: false },
      { header: "배송지명", name: "dlvyNm", hidden: false },
      { header: "배송지구분", name: "dlvyDiv", hidden: true },
      { header: "시/도", name: "siDo", hidden: true },
      { header: "시/군/구", name: "siGunGu", hidden: true },
      { header: "전화번호", name: "telNo", hidden: true },
      { header: "우편번호", name: "zipCd", hidden: true },
      { header: "주소", name: "addr1", hidden: true },
      { header: "상세주소", name: "addr2", hidden: true },
      { header: "특이사항", name: "remark", hidden: true },
      { header: "사용여부", name: "useYn", align: 'center', hidden: true },
      { header: "", name: "isNew", hidden: true },   
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">배송지 리스트</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addMajorGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
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
      <div className={`space-y-5 overflow-y-auto `}>
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

export default MM0401;