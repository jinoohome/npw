import { React, useEffect, useState, useRef, useCallback, initChoice, 
   updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, 
   reSizeGrid, getGridDatas, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, SelectSearchComp, DateRangePickerComp,
    RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp } from "../../comp/Import";
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
    const searchRef2 = useRef<any>(null);

   const refs = {
      preRcptNo: useRef<any>(null),
      rcptDt: useRef<any>(null),
      rcptUserId: useRef<any>(null),
      reqNm: useRef<any>(null),
      reqTelNo: useRef<any>(null),
      bpCd: useRef<any>(null),
      mouYn: useRef<any>(null),
      subCode: useRef<any>(null),
      hsCd: useRef<any>(null),
      ownNm: useRef<any>(null),
      coCd: useRef<any>(null),    
   };

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();
   const [gridDatas3, setGridDatas3] = useState<any[]>();
   const [gridDatas4, setGridDatas4] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: "2024-08-01",
      endDate: "2024-08-31",
      rcptUserId: "",
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const [focusRow, setFocusRow] = useState<any>(0);
   const [isOpen, setIsOpen] = useState(false);
   const [isOpen2, setIsOpen2] = useState(false);

   const breadcrumbItem = [{ name: "주문관리" }, { name: "사전상담" }, { name: "사전상담등록" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      reSizeGrid({ ref: gridRef3, containerRef: gridContainerRef3, sec: 200 });
      reSizeGrid({ ref: gridRef4, containerRef: gridContainerRef4, sec: 200 });
   }, []);

   //--------------------init---------------------------

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
      refreshGrid(gridRef3);
      refreshGrid(gridRef4);
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
      //console.log(inputValues);
   }, [inputValues]);

   useEffect(() => {
      if (gridRef2.current && gridDatas2) {
         let grid2 = gridRef2.current.getInstance();
         grid2.resetData(gridDatas2);

         let focusRowKey = grid2.getFocusedCell().rowKey || 0;

         if (gridDatas2.length > 0) {
            grid2.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatas2]);

   useEffect(() => {
      if (gridRef3.current && gridDatas3) {
         let grid3 = gridRef3.current.getInstance();
         grid3.resetData(gridDatas3);

         let focusRowKey = grid3.getFocusedCell().rowKey || 0;

         if (gridDatas3.length > 0) {
            grid3.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatas3]);

   useEffect(() => {
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
   var ZZ_CONT_INFO = async (param : any) => {
      try {
         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ_CONT_INFO`, { data });

         return result;
      } catch (error) {
         console.error("ZZ_CONT_INFO Error:", error);
         throw error;
      }
   }

   const SO0101_U03 = async (data: any) => {
      try {
         const result = await fetchPost(`SO0101_U03`, data);
         return result;
      } catch (error) {
         console.error("SO0101_U03 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = async (preRcptNo:any) => {
      const param = {    
         preRcptNo: preRcptNo,
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0101_S01", {data});

      let subCodeIn = await ZZ_CONT_INFO({ contNo: result[0].contNo, bpCd: result[0].bpCd, subCode: result[0].subCode, searchDiv: "SUB" });

      if (refs.subCode.current) {
         refs.subCode.current.updateChoices(
            subCodeIn.map((item:any) => ({
              value: item.subCode,
              label: item.subCodeNm,
            }))
         );
      };

      let hsCdIn = await ZZ_CONT_INFO({ contNo: result[0].contNo, bpCd: result[0].bpCd, subCode: result[0].subCode, searchDiv: "HS" });

      if (refs.hsCd.current) {
         refs.hsCd.current.updateChoices(
            hsCdIn.map((item:any) => ({
            value: item.hsCode,
            label: item.hsNm,
            }))
         );
      };

      let itemIn = await ZZ_CONT_INFO({ contNo: result[0].contNo, bpCd: result[0].bpCd, subCode: result[0].subCode, searchDiv: "ITEM", hsCd: result[0].hsCd});

      setGridDatas(itemIn);

      const result2 = await fetchPost("SO0101_S02", {data});

      setGridDatas2(result2);

      // InputSearchComp1에 값 설정      
      console.log(result);
      onInputChange('preRcptNo', result[0].preRcptNo);
      onInputChange('reqNm', result[0].reqNm);
      onInputChange('rcptUserId', result[0].rcptUserId);
      refs.rcptUserId.current.setChoiceByValue(result[0].rcptUserId);
      onInputChange('reqTelNo', result[0].reqTelNo);
      onInputChange('bpCd', result[0].bpCd);
      onInputChange('bpNm', result[0].bpNm);
      onInputChange('mouYn', result[0].mouYn);
      onInputChange('rcptDt', result[0].rcptDt);
      onInputChange('subCode', result[0].subCode);
      refs.subCode.current.setChoiceByValue(result[0].subCode);
      onInputChange('hsCd', result[0].hsCd);
      refs.hsCd.current.setChoiceByValue(result[0].hsCd);
      onInputChange('ownNm', result[0].ownNm);
   };

   const save = async () => {
      const data = await getGridValues();
      if (data) {
         let result = await SO0101_U03(data);
         if (result) {
            await returnResult(result);
         }
      }
   };
   const returnResult = async(result:any) => {     
      search(result.preRcptNoOut);
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      if (!inputValues.preRcptNo) {
         inputValues.status = 'I';
      } else {
         inputValues.status = 'U';
      }

      console.log(inputValues);

      let preConsultHdr = [inputValues];
      let preConsultDtl = await getGridDatas(gridRef2);
      let preRcptNo = inputValues.preRcptNo;

      let data = {
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
         preRcptNo: preRcptNo,
         preConsultHdr: JSON.stringify(preConsultHdr),
         preConsultDtl: JSON.stringify(preConsultDtl),
      };

      return data;
   };

   //grid 추가버튼
   const addGridRow = () => {
      let grid = gridRef2.current.getInstance();

      grid.appendRow({  useYn: "Y", coCd: "100", isNew: true}, { at: 0 });

      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delGridRow = () => {
      let grid = gridRef2.current.getInstance();
      const { rowKey } = grid.getFocusedCell();
      grid.removeRow(rowKey, {});
   };

   //사전상담 팝업조회
   const handleCallSearch2 = async () => {
      const param = {    
         startDt: inputValues.startDate,     
         endDt: inputValues.endDate,     
         reqNm: '999',
         ownNm: searchRef2.current?.value || '999',
         bpNm: '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0101_P01", { data });
      setGridDatas3(result);
   };

   //고객사 팝업조회
   const handleCallSearch3 = async () => {
      const param = {
         coCd: '100',
         bpNm: searchRef1.current?.value || '999',
         bpDiv: 'ZZ0188',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_B_PO_BP", { data });
      setGridDatas4(result);
   };

   const handleDblClick = async () => {
      refs.subCode.current.setChoiceByValue("");
      onInputChange('subCode', '');
      refs.hsCd.current.setChoiceByValue("");
      onInputChange('hsCd', '');
      setGridDatas([]);

      const gridInstance = gridRef4.current.getInstance();
      const { rowKey } = gridInstance.getFocusedCell(); // 현재 선택된 행의 rowKey를 가져옴

      const bpCd = gridInstance.getValue(rowKey, "bpCd"); // 해당 rowKey에서 bpCd 값을 가져옴
      const bpNm = gridInstance.getValue(rowKey, "bpNm"); // 해당 rowKey에서 bpNm 값을 가져옴
      const contNo = gridInstance.getValue(rowKey, "contNo"); // 해당 rowKey에서 bpNm 값을 가져옴
      const mouYn = gridInstance.getValue(rowKey, "mouYn"); // 해당 rowKey에서 bpNm 값을 가져옴

      // InputSearchComp1에 값 설정
      onInputChange('bpNm', bpNm);
      onInputChange('bpCd', bpCd);
      onInputChange('contNo', contNo);
      onInputChange('mouYn', mouYn);

      let subCodeIn = await ZZ_CONT_INFO({ contNo: contNo, bpCd: bpCd, subCode: "999", searchDiv: "SUB" });

      if (refs.subCode.current) {
         refs.subCode.current.updateChoices(
            subCodeIn.map((item:any) => ({
              value: item.subCode,
              label: item.subCodeNm,
            }))
         );
      };

      refs.hsCd.current.updateChoices();
      
      setIsOpen(false);
   };

   const handleDblClick2 = async () => {
      const gridInstance = gridRef3.current.getInstance();
      const { rowKey } = gridInstance.getFocusedCell(); // 현재 선택된 행의 rowKey를 가져옴

      const preRcptNo = gridInstance.getValue(rowKey, "preRcptNo"); // 해당 rowKey에서 bpCd 값을 가져옴
      
      search(preRcptNo);

      setIsOpen2(false);
   };

   // 사전상담 팝업
   const handleInputSearch = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {    
         startDt: inputValues.startDate,     
         endDt: inputValues.endDate,     
         reqNm: '999',
         ownNm: searchRef2.current?.value || '999',
         bpNm: '999',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0101_P01", { data });
      setGridDatas3(result);

      await setIsOpen2(true);
      setTimeout(() => {

         refreshGrid(gridRef3);
      }, 100);
   };

   // 고객사 팝업
   const handleInputSearch2 = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {
         coCd: '100',
         bpNm: target.value || '999',
         bpDiv: 'ZZ0188',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_B_PO_BP", { data });
      setGridDatas4(result);
      if (result.length === 1) {
            refs.subCode.current.setChoiceByValue("");
            onInputChange('subCode', '');
            refs.hsCd.current.setChoiceByValue("");
            onInputChange('hsCd', '');
            setGridDatas([]);

            const bpCd = result[0].bpCd 
            const bpNm = result[0].bpNm
            const contNo = result[0].contNo
            const mouYn = result[0].mouYn

            // InputSearchComp1에 값 설정
            onInputChange('bpNm', bpNm);
            onInputChange('bpCd', bpCd);
            onInputChange('contNo', contNo);
            onInputChange('mouYn', mouYn);

            let subCodeIn = await ZZ_CONT_INFO({ contNo: contNo, bpCd: bpCd, subCode: "999", searchDiv: "SUB" });

            if (refs.subCode.current) {
               refs.subCode.current.updateChoices(
                  subCodeIn.map((item:any) => ({
                  value: item.subCode,
                  label: item.subCodeNm,
                  }))
               );
            };

            refs.hsCd.current.updateChoices();
         } else {
            await setIsOpen(true);
            setTimeout(() => {

               refreshGrid(gridRef4);
            }, 100);
      }
   };

   //-------------------div--------------------------
   const modalSearchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-2 justify-start ">
               <DateRangePickerComp 
                     title="접수기간"
                     startValue= {inputValues.startDate}
                     endValue= {inputValues.endDate}
                     onChange={(startDate, endDate) => {
                        onInputChange('startDate', startDate);
                        onInputChange('endDate', endDate);   
               }
               
               } /> 
               <InputComp1 ref={searchRef2} handleCallSearch={handleCallSearch2} title="대상자"></InputComp1>              
            </div>
            <div className="w-[20%] flex justify-end">
               <button type="button" onClick={handleCallSearch2} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
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
               <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch3} title="거래처명"></InputComp1>               
            </div>
            <div className="w-[40%] flex justify-end">
               <button type="button" onClick={handleCallSearch3} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>            
         </div> 
      </div>
   );

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
            <div className="grid grid-cols-3  gap-3  justify-around items-center ">
               <InputSearchComp1 value={inputValues.preRcptNo} title="접수번호" target="preRcptNo" handleInputSearch={handleInputSearch} />
               <InputComp title="접수일시" value={inputValues.rcptDt} readOnly= {true} onChange={(e)=>{
                        onInputChange('rcptDt', e);
                     }} />
               <SelectSearchComp title="접수자" 
                              ref={refs.rcptUserId}
                              value={inputValues.rcptUserId}
                              onChange={(label, value) => {
                                    onInputChange('rcptUserId', value);
                                 }}

                              //초기값 세팅시
                              stringify={true}
                              param={ { coCd : '100',
                                       usrId : '999',
                                       usrDiv : 'ZZ0186',
                                       useYn : '999' }}
                              procedure="ZZ_USER_LIST"  dataKey={{ label: 'usrNm2', value: 'usrId' }} 
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
            <div className="grid grid-cols-3  gap-3  justify-around items-center ">
               <InputComp value={inputValues.reqNm} title="신청자 성명" target="reqNm" 
                          onChange={(e) => {
                           onInputChange('reqNm', e);                           
                        }}   />
               <InputComp value={inputValues.reqTelNo} title="연락처" target="reqTelNo"
                           onChange={(e) => {
                              onInputChange('reqTelNo', e);                           
                           }} />
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
            <div className="grid grid-cols-3  gap-3  justify-around items-center ">
               <InputSearchComp1 title="고객사" value={inputValues.bpNm} target="bpNm" handleInputSearch={handleInputSearch2}
                                 onChange={(e) => {
                                    onInputChange('bpNm', e);                           
                                }} />
               <Checkbox  title = "MOU" value={inputValues.mouYn}  checked={inputValues.mouYn == 'Y'} readOnly={true} />
               <SelectSearchComp title="재직구분" 
                              ref={refs.subCode}
                              value={inputValues.subCode}
                              onChange={async (label, value) => {
                                    onInputChange('subCode', value);
                                    onInputChange('hsCd', '');
                                    refs.hsCd.current.setChoiceByValue("");

                                    let hsCdIn = await ZZ_CONT_INFO({ contNo: inputValues.contNo, bpCd: inputValues.bpCd, subCode: value, searchDiv: "HS" });

                                    if (refs.hsCd.current) {
                                       refs.hsCd.current.updateChoices(
                                          hsCdIn.map((item:any) => ({
                                          value: item.hsCode,
                                          label: item.hsNm,
                                          }))
                                       );
                                    };

                                    let itemIn = await ZZ_CONT_INFO({ contNo: inputValues.contNo, bpCd: inputValues.bpCd, subCode: value, searchDiv: "ITEM", hsCd: inputValues.hsCd});

                                    setGridDatas(itemIn);
                                 }}   
               />                           
               <SelectSearchComp title="경조사유" 
                              ref={refs.hsCd}
                              value={inputValues.hsCd}
                              onChange={async (label, value) => {                                    
                                    onInputChange('hsCd', value);

                                    // const foundItem = hsCode.find((item: { hsCode: string; }) => item.hsCode === value);
                                    // const foundhsType = foundItem ? foundItem.hsType : null;

                                    let itemIn = await ZZ_CONT_INFO({ contNo: inputValues.contNo, bpCd: inputValues.bpCd, subCode: inputValues.subCode, searchDiv: "ITEM", hsCd: value});

                                    setGridDatas(itemIn);
                                 }}
               />
               <InputComp value={inputValues.ownNm} title="대상자" target="ownNm" 
                          onChange={(e) => {
                              onInputChange('ownNm', e);                           
                          }}/>               
            </div>
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "품목코드", name: "itemCd", align:"center", width: 100, hidden: false },
      { header: "품목명", name: "itemNm", width: 350 },
      { header: "수량", name: "qty", align:"center" },
      { header: "복리단가", name: "priceCom", align:"right" },
      { header: "개별단가", name: "pricePer", align:"right" },
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
      { header: "접수자", name: "insrtUserId", hidden: true },
      { header: "접수자", name: "insrtUserNm", width: 100, align: "center" },
      { header: "접수일시", name: "insrtDt", width: 150, align: "center" },
      { header: "메모", name: "consultMemo", editor: "text"},
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
               <button type="button" onClick={addGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef2} columns={columns2} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   const columns3 = [
     
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "접수번호", name: "preRcptNo", align : "center"},
      { header: "신청자", name: "reqNm", align : "center" },
      { header: "대상자", name: "ownNm", align : "center" },
      { header: "고객사", name: "bpNm", align : "center" },
   ];

   const grid3 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">사전상담 접수정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRef3} columns={columns3} handleDblClick={handleDblClick2} perPageYn = {false} height={window.innerHeight-650}/>
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
         <CommonModal isOpen={isOpen2} size="md" onClose={() => setIsOpen2(false)} title="">
            {modalSearchDiv()}
            {grid3()}
         </CommonModal>
      </div>
   );
};

export default SO0101;