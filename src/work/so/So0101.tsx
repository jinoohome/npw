import { set, setTime } from "react-datepicker/dist/date_utils";
import { React, useEffect, useState, useRef, useCallback, initChoice, 
   updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, 
   reSizeGrid, getGridDatas, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, SelectSearchComp,
    RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const SO0101 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridRef2 = useRef<any>(null);
   const gridRef3 = useRef<any>(null);
   const gridRef4 = useRef<any>(null);
   const gridContainerRef = useRef(null);
   const gridContainerRef2 = useRef(null);
   const gridContainerRef3 = useRef(null);
   const gridContainerRef4 = useRef(null);

   //검색창 ref
    const searchRef1 = useRef<any>(null);
   // const searchRef2 = useRef<any>(null);

   const refs = {
      preRcptNo: useRef<any>(null),
      rcptDt: useRef<any>(null),
      rcptUserId: useRef<any>(null),
      reqNm: useRef<any>(null),
      reqTelNo: useRef<any>(null),
      bpCd: useRef<any>(null),
      mou: useRef<any>(null),
      subCode: useRef<any>(null),
      hsCd: useRef<any>(null),
      ownNm: useRef<any>(null),
      coCd: useRef<any>(null),    
   };

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();
   const [gridDatas3, setGridDatas3] = useState<any[]>();
   const [gridDatas4, setGridDatas4] = useState<any[]>();
   const [user, setUser] = useState<any[]>([]);
   const [bpCd, setBpCd] = useState<any[]>([]);


   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      rcptUserId2: "",
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   // const [wo0002Input, setWo0002Input] = useState<ZZ_CODE_RES[]>([]);
   // const [wo0003Input, setWo0003Input] = useState<ZZ_CODE_RES[]>([]);

    const [choice1, setChoice1] = useState<any>();
   // const [choice2, setChoice2] = useState<any>();
   // const [choice3, setChoice3] = useState<any>();
   // const [choice4, setChoice4] = useState<any>();
   // const [choice5, setChoice5] = useState<any>();   
   
   const [focusRow, setFocusRow] = useState<any>(0);
   const [isOpen, setIsOpen] = useState(false);

   const breadcrumbItem = [{ name: "주문관리" }, { name: "사전상담" }, { name: "사전상담등록" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
   }, []);

   useEffect(() => {
      console.log("focusRow changed:", focusRow);
   }, [focusRow]);

   //--------------------init---------------------------

   const setChoiceUI = () => {
      // initChoice(searchRef2, setChoice1, [
      //    { value: "999", label: "전체", selected: true },
      //    { value: "Y", label: "사용" },
      //    { value: "N", label: "미사용" },
      // ]);
      initChoice(refs.rcptUserId, setChoice1);     
      // initChoice(refs.siDo, setChoice3);
      // initChoice(refs.siGunGu, setChoice4);
      // initChoice(refs.useYn, setChoice5, [
      //    { value: "999", label: "전체", selected: true },
      //    { value: "Y", label: "사용" },
      //    { value: "N", label: "미사용" },
      // ]);
   };

   const setGridData = async () => {
      try {          
         // let userData = await ZZ_USER_LIST();

         // if (userData != null) {
         //    userData.unshift({ value: "", text: "" });
         //    setUser(userData);
         // }

         // console.log("user:", userData);
         //await MM0401_S01();
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   //------------------useEffect--------------------------

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(gridRef);
      refreshGrid(gridRef2);
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
      updateChoices(choice1, user, "value", "text");
   }, [user]);


   useEffect(() => {
      console.log("gridDatas4:", gridDatas4);
      if (gridRef4.current && gridDatas4) {
         let grid4 = gridRef4.current.getInstance();
         grid4.resetData(gridDatas4);

         let focusRowKey = grid4.getFocusedCell().rowKey || 0;

         if (gridDatas4.length > 0) {
            grid4.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatas4]);

   // useEffect(() => {
   //    updateChoices(choice3, wo0002Input, "value", "text");
   // }, [wo0002Input]);

   // useEffect(() => {
   //    updateChoices(choice4, wo0003Input, "value", "text");
   // }, [wo0003Input]);

   //---------------------- api -----------------------------
   var ZZ_USER_LIST = async () => {
      try {
         const param = {
            coCd : '100',
            usrId : '999',
            usrDiv : 'ZZ0186',
            useYn : '999',
         };

         const data = JSON.stringify(param);
         console.log('data111:',data);
         const result = await fetchPost(`ZZ_USER_LIST`, { data });

         let formattedResult = Array.isArray(result)
         ? result.map(({ usrId, usrNm2, ...rest }) => ({
              value: usrId,
              text: usrNm2,
              label: usrNm2,
              ...rest,
           }))
         : [];

         return formattedResult;
      } catch (error) {
         console.error("ZZ_USER_LIST Error:", error);
         throw error;
      }
   }

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

   const search = () => {
      setGridData();
   };

   const save = async () => {

      console.log('inputValues',inputValues);
      const data2 = {
         preRcptNo: refs.preRcptNo.current?.value,
         rcptDt: refs.rcptDt.current?.value,
         rcptUserId: refs.rcptUserId.current?.value,
         reqNm: refs.reqNm.current?.value,
         reqTelNo: refs.reqTelNo.current?.value,
         bpCd: refs.bpCd.current?.value,
         mou: refs.mou.current?.value,
         subCode: refs.subCode.current?.value,
         hsCd: refs.hsCd.current?.value,
         ownNm: refs.ownNm.current?.value,
         coCd: refs.coCd.current?.value,
      };
   
      console.log("Input Data:", data2);


      let grid = gridRef.current.getInstance();
      const focusRow = grid.getFocusedCell().rowKey? grid.getFocusedCell().rowKey : 0;
      let rowKey = grid.getValue(focusRow, "isNew")? 0 : focusRow;     
      
      setFocusRow(rowKey);
    
      const data = await getGridValues();
      if (data) {
         let result = await MM0401_U01(data);
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
      //if (!validateData("save", datas)) return false;
    
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
                        useYn: "Y", coCd: "", telNo: "", zipCd: "", addr1: "", addr2: "", isNew: true}, { at: 0 });
      grid.getPagination().movePageTo(0);
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delMajorGridRow = () => {
      let grid = gridRef.current.getInstance();
      const { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };

   const setChangeGridData = (columnName: string, value: any) => {
      
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = () => {
      setGridData();
   };

   const handleDblClick = () => {
      const gridInstance = gridRef4.current.getInstance();
      const { rowKey } = gridInstance.getFocusedCell(); // 현재 선택된 행의 rowKey를 가져옴

      const bpCd = gridInstance.getValue(rowKey, "bpCd"); // 해당 rowKey에서 bpCd 값을 가져옴
      const bpNm = gridInstance.getValue(rowKey, "bpNm"); // 해당 rowKey에서 bpNm 값을 가져옴

      alert(bpCd+">>"+bpNm);

      // InputSearchComp1에 bpNm 값 설정
      if (refs.bpCd.current) {
         refs.bpCd.current.value = bpNm; // InputSearchComp1의 ref를 통해 값 설정
         onInputChange('bpCd', bpCd);
      }
      
      setIsOpen(false);
   };

   const handleChange = (e: any) => {
      console.log('handleChange:', e);
   };

   const onkeydown = (e: any) => {
      console.log('onkeydown:', e);
   };

   const handleCheckChangeYn = (value: boolean) => {
      console.log(value);
   };

   //-------------------div--------------------------
   const modalSearchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
              
            </div>
            <div className="w-[40%] flex justify-end">
               <button type="button" className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>            
         </div>
      </div>
   );

   const modalSearchDiv2 = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-2  gap-y-3  justify-start w-[60%]">
               <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="거래처명"></InputComp1>               
            </div>
            <div className="w-[40%] flex justify-end">
               <button type="button" className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>            
         </div> 
      </div>
   );

   const handleInputSearch = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {
         coCd: userInfo.coCd,
         dlvyNm: target.value || '999',
         useYn: '999',
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("MM0401_S01", { data });
      console.log(result.length)
      if (result.length === 1) {
         console.log(result[0]);
      } else {
         setIsOpen(true);
         
      }
   };

   const handleInputSearch2 = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {
         coCd: '100',
         bpNm: target.value || '999',
         bpDiv: 'ZZ0188',
      };
      console.log(target.value)
      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_B_PO_BP", { data });
      console.log(result)
      setGridDatas4(result);
      if (result.length === 1) {
         console.log(result[0]);
         } else {
            await setIsOpen(true);
            setTimeout(() => {

               refreshGrid(gridRef4);
               //reSizeGrid({ ref: gridRef4, containerRef: gridContainerRef4, sec: 200 });
            }, 100);
      }
   };

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

   //input div
   const inputDiv = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">접수 정보</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-3  gap-6  justify-around items-center ">
               <InputSearchComp1 ref={refs.preRcptNo} title="접수번호" target="preRcptNo" handleInputSearch={handleInputSearch} />
               {/* <InputComp2 ref={refs.preRcptNo} title="접수번호" target="preRcptNo" setChangeGridData={setChangeGridData} readOnly= {true} /> */}
               <InputComp title="접수일시" value={inputValues.rcptDt} readOnly= {true} onChange={(e)=>{
                        console.log('onChange');
                        onInputChange('dlvyNm', e);
                     }} />
               <SelectComp2 ref={refs.rcptUserId} title="접수자" target="rcptUserId" setChangeGridData={setChangeGridData}  />
               <SelectSearchComp title="접수자" 
                              value="{inputValues.rcptUserId2}"
                              onChange={(label, value) => {
                                    console.log(label, value);
                                    onInputChange('rcptUserId2', value);
                                 }}

                              //초기값 세팅시
                              stringify={true}
                              param={ { coCd : '100',
                                       usrId : '999',
                                       usrDiv : 'ZZ0186',
                                       useYn : '999' }}
                              procedure="ZZ_USER_LIST"  dataKey={{ label: 'usrNm2', value: 'usrId' }} 

                              // param={{ coCd: "999", majorCode: "WO0002", div: "999" }}
                              // procedure="ZZ_CODE"  dataKey={{ label: 'codeName', value: 'code' }} 
            />
            </div>
         </div>
      </div>
   );


   //input div
   const inputDiv2 = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">신청자 정보</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-6  justify-around items-center ">
               <InputComp2 ref={refs.reqNm} title="신청자 성명" target="reqNm" />
               <InputComp2 ref={refs.reqTelNo} title="연락처" target="reqTelNo" setChangeGridData={setChangeGridData} />
            </div>
         </div>
      </div>
   );

   //input div
   const inputDiv3 = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center  border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">지원 정보</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-6  justify-around items-center ">
               <InputSearchComp1 ref={refs.bpCd} title="고객사" target="bpCd" handleInputSearch={handleInputSearch2} />
               <Checkbox title = "MOU"  />
               <SelectComp2 ref={refs.subCode} title="재직구분" target="subCode" setChangeGridData={setChangeGridData} />
               <SelectComp2 ref={refs.hsCd} title="경조사유" target="hsCd" setChangeGridData={setChangeGridData} />
               <InputComp2 ref={refs.ownNm} title="대상자" target="ownNm" setChangeGridData={setChangeGridData} />               
            </div>
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "품목코드", name: "itemCd", width: 100, hidden: false },
      { header: "품목명", name: "itemNm" },
      { header: "수량", name: "qty" },
      { header: "복리단가", name: "priceCom" },
      { header: "개별단가", name: "pricePer" },
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">지원품목</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns}  height={window.innerHeight-750} perPageYn = {false}/>
      </div>
   );

   const columns2 = [
      { header: "접수자", name: "insrtUserId", width: 100 },
      { header: "접수일시", name: "insrtDt", width: 100 },
      { header: "메모", name: "consultMemo" },
   ];

   const grid2 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">주요상담내용</div>
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

         <TuiGrid01 gridRef={gridRef2} columns={columns2} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   const columns4 = [
     
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "거래처코드", name: "bpCd", align : "center"},
      { header: "거래처명", name: "bpNm" },
   ];

   const grid4 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">거래처 정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRef4} columns={columns4} handleDblClick={handleDblClick} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   return (
      <div className={`space-y-2 overflow-y-auto `}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
         </div>
         <div className="w-full h-full flex">
            <div className="w-1/2 ">
               <div className="space-x-2 p-1">{inputDiv()}</div> 
               <div className="space-x-2 p-1">{inputDiv2()}</div> 
               <div className="space-x-2 p-1">{inputDiv3()}</div> 
            </div>
            <div className="w-1/2 ">
               <div className="space-x-2 p-1" ref={gridContainerRef}>{grid()}</div> 
               <div className="space-x-2 p-1" ref={gridContainerRef2}>{grid2()}</div>
            </div>
         </div>
         <CommonModal isOpen={isOpen} size="md" onClose={() => setIsOpen(false)} title="">
            {modalSearchDiv2()}
            {grid4()}
         </CommonModal>
         {/* <div className="w-full h-full flex space-x-2 p-2">
            <div className="w-1/2 ">
               <div className="space-x-2 p-2">{inputDiv()}</div> 
               <div className="space-x-2 p-2">{inputDiv2()}</div> 
               <div className="space-x-2 p-2">{inputDiv3()}</div> 
               <div className="space-x-2 p-2" ref={gridContainerRef}>{grid()}</div> 
            </div>
            <div className="w-1/2 ">
               <div className="space-x-2 p-2" ref={gridContainerRef2}>{grid2()}</div>
            </div>
         </div> */}
      </div>
   );
};

export default SO0101;