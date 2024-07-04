import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const Zz0301 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);


   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);

   const refs = {
      usrId: useRef<any>(null),
      usrNm: useRef<any>(null),
      pwd: useRef<any>(null),
      usrDiv: useRef<any>(null),
      bpCd: useRef<any>(null),
      hp: useRef<any>(null),
      email: useRef<any>(null),
      useYn: useRef<any>(null),
      insrtUserId: useRef<any>(null),
      insrtDt: useRef<any>(null),
      updtUserId: useRef<any>(null),
      updtDt: useRef<any>(null),
      coCd: useRef<any>(null),
      usrStatus: useRef<any>(null),
    
   };

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [zz0002Input, setZz0002Input] = useState<ZZ_CODE_RES[]>([]);
   const [coCds, setCoCds] = useState<any>([]);
   const [bpCds, setBpCds] = useState<any>([]);

   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();
   const [choice3, setChoice3] = useState<any>();
   const [choice4, setChoice4] = useState<any>();
   const [choice5, setChoice5] = useState<any>();
   const [choice6, setChoice6] = useState<any>();
   const [choice7, setChoice7] = useState<any>();
   
   
   const [focusRow, setFocusRow] = useState<any>(0);

   const [isUsrIdReadOnly, setUsrIdReadOnly] = useState<boolean>(false);

   const breadcrumbItem = [{ name: "관리자" }, { name: "사용자" }, { name: "사용자등록" }];

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
      initChoice(searchRef2, setChoice1);
      initChoice(searchRef3, setChoice2, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
     
       initChoice(refs.useYn, setChoice4, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
      initChoice(refs.coCd, setChoice5);
      initChoice(refs.usrDiv, setChoice6);
      initChoice(refs.bpCd, setChoice7);
   };

   const setGridData = async () => {
      try {          
         let zz0002Data = await ZZ_CODE({ coCd: "999", majorCode: "ZZ0002", div: "999" });
         if (zz0002Data != null) {  
            let zz0002IntupData = zz0002Data.filter(item => !(item.value === "999" && item.text === "전체"));
            zz0002IntupData.unshift({ value: "", text: "" });

            setZz0002Input(zz0002IntupData);   
         }

         let sosocData = await MM0101_S01();

         if (sosocData != null) {
            sosocData.unshift({ value: "", text: "" });
            setBpCds(sosocData);
         }

         let coCdData = await ZZ_B_BIZ();
         if (coCdData != null) {
            coCdData.unshift({ value: "", text: "" });
             setCoCds(coCdData);
         }

         await ZZ0301_S01();
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

   useEffect(() => {
      updateChoices(choice6, zz0002Input, "value", "text");
   }, [zz0002Input]);

   useEffect(() => {
      updateChoices(choice5, coCds, "value", "text");
   }, [coCds]);

   useEffect(() => {
      if (Array.isArray(bpCds) && bpCds.length > 0) {
         const updatedBpCds = [
           { value: "999", text: "전체", label: "전체" },
           ...bpCds.map(({ bpCd, bpNm, ...rest }) => ({
             value: bpCd,
             text: bpNm,
             label: bpNm,
             ...rest,
           })),
         ];
     
         updateChoices(choice1, updatedBpCds, "value", "text");
       } else {
         updateChoices(choice7, bpCds, "value", "text");
       }
   }, [bpCds]);

   useEffect(() => {
      updateChoices(choice7, bpCds, "value", "text");
   }, [bpCds]);

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

   var ZZ_B_BIZ = async () => {
      try {
         const param = {
            coCd: userInfo.coCd,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ_B_BIZ`, { data });

         let formattedResult = Array.isArray(result)
         ? result.map(({ coCd, bpNm, ...rest }) => ({
              value: coCd,
              text: bpNm,
              label: bpNm,
              ...rest,
           }))
         : [];
     
         return formattedResult;
      } catch (error) {
         console.error("ZZ_B_BIZ Error:", error);
         throw error;
      }
   }

   const ZZ0301_S01 = async () => {
      try {
         const param = {
            coCd:  userInfo.coCd,
            usrId:  searchRef1.current?.value   || "999",
            usrNm:  searchRef4.current?.value   || "999",
            usrDiv: "999",
            sysDiv: "999",
            bpNm:  searchRef2.current?.value   || "999",
            useYn: searchRef3.current?.value   || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ0301_S01`, { data });

         setGridDatas(result);

         const grid = gridRef.current.getInstance();

   
         if(grid.getData().length > 0){
            grid.focusAt(focusRow, 0, true);

         }
       
     
         return result;
      } catch (error) {
         console.error("ZZ0301_S01 Error:", error);
         throw error;
      }
   };

   const ZZ0301_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`ZZ0301_U01`, data);
         return result;
      } catch (error) {
         console.error("ZZ0301_U01 Error:", error);
         throw error;
      }
   };

   const MM0101_S01 = async () => {
      try {
         const param = {
            coCd: userInfo.coCd,
            bpNm: "999",
            bpType: "999",
            useYn: "Y",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0101_S01`, { data });

         let formattedResult = Array.isArray(result)
         ? result.map(({ bpCd, bpNm, ...rest }) => ({
              value: bpCd,
              text: bpNm,
              label: bpNm,
              ...rest,
           }))
         : [];         
     
         return formattedResult;
      } catch (error) {
         console.error("MM0101_S01 Error:", error);
         throw error;
      }
   };

   const MM0101_S01_2 = async () => {
      try {
         const param = {
            coCd: refs.coCd.current?.value || userInfo.coCd,
            bpNm: "999",
            bpType: "999",
            useYn: "Y",
         };

         console.log(param);

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0101_S01`, { data });

         let formattedResult = Array.isArray(result)
         ? result.map(({ bpCd, bpNm, ...rest }) => ({
              value: bpCd,
              text: bpNm,
              label: bpNm,
              ...rest,
           }))
         : [];         
     
         return formattedResult;
      } catch (error) {
         console.error("MM0101_S01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = () => {
      setGridData();
   };

   const validateData = (action: string, dataString: any) => {
      // dataString이 문자열이면 JSON.parse()를 사용, 그렇지 않으면 직접 사용
      const data = typeof dataString === "string" ? JSON.parse(dataString) : dataString;

      if (action === "save") {
         if (data.length < 1) return false;

         for (const item of data) {
            if (["U", "I"].includes(item.status)) {
               if (!item.coCd) {
                  alertSwal("입력확인", "사업부서를 선택해주세요.", "warning"); // 사용자에게 알림
                  return false;
               }
               if (!item.usrId) {
                  alertSwal("입력확인", "사번을 입력해주세요.", "warning"); // 사용자에게 알림
                  return false;
               }
            }
         }
      }

      return true;
   };

   const save = async () => {

      let grid = gridRef.current.getInstance();
      const focusRow = grid.getFocusedCell().rowKey? grid.getFocusedCell().rowKey : 0;
      let rowKey = grid.getValue(focusRow, "isNew")? 0 : focusRow; 

     
      
      setFocusRow(rowKey);
    
      const data = await getGridValues();
      if (data) {
         let result = await ZZ0301_U01(data);
         if (result) {
            await returnResult();
         }
      }else{

         grid.focusAt(rowKey, 0, true);
      }

    
    
   };
   const returnResult = async() => {
     
      alertSwal("저장완료", "저장이 완료되었습니다.", "success");
      await setGridData();
   
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let datas = await getGridDatas(gridRef);
      if (!validateData("save", datas)) return false;
    
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

      grid.appendRow({  usrId: "", usrNm: "", pwd: "",email: "",hp: "",
                        useYn: "Y", coCd: "", bpCd: "", bpNm: "", usrDiv: "", isNew: true}, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let grid = gridRef.current.getInstance();
      const { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef.current) {
         const grid = gridRef.current.getInstance();
         const rowData = grid.getRow(rowKey);

         if(rowData.usrId){
            setUsrIdReadOnly(true);
         }else{
            setUsrIdReadOnly(false);

         }

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {
               const ref = refs[key as keyof typeof refs]; // Add index signature to allow indexing with a string
               if (ref && ref.current) {
                 
                  if (key === "coCd") {
                     setTimeout(function () {
                        choice5?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "usrDiv") {
                     setTimeout(function () {
                        choice6?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "bpCd") {
                     setTimeout(function () {
                        choice7?.setChoiceByValue(value);
                     }, 100);
                  } else if (key === "useYn") {
                    
                     setTimeout(function () {
                        choice4?.setChoiceByValue(value);
                     }, 100);
               
                  } else {
                     ref.current.value = value;
                  }
               }
               
            });
         }
      }
   };

   const setSosocData = async () => {
      let sosocData = await MM0101_S01_2();

         if (sosocData != null) {
            sosocData.unshift({ value: "", text: "" });
            setBpCds(sosocData);
         }
   }

   const setChangeGridData = (columnName: string, value: any) => {
      const grid = gridRef.current.getInstance();
      const { rowKey } = grid.getFocusedCell();
      grid.setValue(rowKey, columnName, value, false);

      if(columnName === "coCd"){
         setSosocData();         
      }
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
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="사번"></InputComp1>
            <InputComp1 ref={searchRef4} handleCallSearch={handleCallSearch} title="사용자명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="소속" handleCallSearch={handleCallSearch}></SelectComp1>
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
               <div className="">사용자 등록</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-6  justify-around items-center ">
               <SelectComp2 ref={refs.coCd} title="사업부서" target="coCd" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.usrId} title="사번" target="usrId" setChangeGridData={setChangeGridData}  readOnly={isUsrIdReadOnly} />
               <InputComp2 ref={refs.usrNm} title="이름" target="usrNm" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.pwd} title="비밀번호" target="pwd" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.usrDiv} title="사용자구분" target="usrDiv" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.bpCd} title="소속" target="bpCd" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.email} title="이메일" target="email" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.hp} title="연락처" target="hp" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.useYn} title="사용여부" target="useYn" setChangeGridData={setChangeGridData} />
              
            </div>

            <div className="grid grid-cols-4  gap-6  justify-around items-center ">
              
               <InputComp2 ref={refs.insrtUserId} title="등록자" target="insrtUserId" setChangeGridData={setChangeGridData}  readOnly={true} />
               <InputComp2 ref={refs.insrtDt} title="등록일" target="insrtDt" setChangeGridData={setChangeGridData} readOnly={true}/>
               <InputComp2 ref={refs.updtUserId} title="수정자" target="updtUserId" setChangeGridData={setChangeGridData}  readOnly={true}/>
               <InputComp2 ref={refs.updtDt} title="수정일" target="updtDt" setChangeGridData={setChangeGridData}  readOnly={true} />

            </div>

         

           
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "사번", name: "usrId", hidden: false },
      { header: "이름", name: "usrNm", hidden: false },
      { header: "비밀번호", name: "pwd", hidden: true },
      { header: "사용자구분", name: "usrDiv", hidden: true },
      { header: "소속", name: "bpCd", hidden: true },
      { header: "소속", name: "bpNm", hidden: false },
      { header: "이메일", name: "email", hidden: true },
      { header: "연락처", name: "hp", hidden: true },
      { header: "사용여부", name: "useYn", align: 'center', hidden: false },
      { header: "회사구분", name: "coCd", hidden: true },
      { header: "등록일", name: "insrtDt", hidden: true },
      { header: "수정일", name: "updtDt", hidden: true },
      { header: "등록자", name: "insrtUserId", hidden: true },
      { header: "수정자", name: "updtUserId", hidden: true },
      { header: "", name: "isNew", hidden: true },
    
     
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">사용자 리스트</div>
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

         <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={handleFocusChange} />
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

export default Zz0301;