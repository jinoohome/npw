import { React, useEffect, useState, useRef, useCallback, initChoice, 
   updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, 
   reSizeGrid, getGridDatas, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, SelectSearchComp, DateRangePickerComp, date, InputSearchComp, commas,
    RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp } from "../../comp/Import";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const SO0201 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef1 = useRef<any>(null);
   const gridRef2 = useRef<any>(null);
   const gridRef3 = useRef<any>(null);
   const gridRef4 = useRef<any>(null);
   const gridRef5 = useRef<any>(null);
   const gridContainerRef1 = useRef(null);
   const gridContainerRef2 = useRef(null);
   const gridContainerRef3 = useRef(null);
   const gridContainerRef4 = useRef(null);
   const gridContainerRef5 = useRef(null);

   //검색창 ref
    const searchRef1 = useRef<any>(null);
    const searchRef2 = useRef<any>(null);

   const [tabIndex, setTabIndex] = useState(0);

   const refs = {
      rcptUserId: useRef<any>(null),
      mouYn: useRef<any>(null),
      subCode: useRef<any>(null),
      hsCd: useRef<any>(null),  
   };

   const [gridDatas1, setGridDatas] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();
   const [gridDatas3, setGridDatas3] = useState<any[]>();
   const [gridDatas4, setGridDatas4] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: date(-1, 'month'),
      endDate: date(),
      dealType: 'Y',
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

   const breadcrumbItem = [{ name: "주문관리" }, { name: "주문" }, { name: "주문 등록" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      reSizeGrid({ ref: gridRef1, containerRef: gridContainerRef1, sec: 200 });
      reSizeGrid({ ref: gridRef2, containerRef: gridContainerRef2, sec: 200 });
      reSizeGrid({ ref: gridRef3, containerRef: gridContainerRef3, sec: 200 });
      reSizeGrid({ ref: gridRef4, containerRef: gridContainerRef4, sec: 200 });
   }, []);

   //--------------------init---------------------------

   //------------------useEffect--------------------------

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      refreshGrid(gridRef1);
      refreshGrid(gridRef2);
      refreshGrid(gridRef3);
      refreshGrid(gridRef4);
   }, [activeComp]);

   //Grid 데이터 설정
   useEffect(() => {
      if (gridRef1.current && gridDatas1) {
         let grid = gridRef1.current.getInstance();
         grid.resetData(gridDatas1);
         if (gridDatas1.length > 0) {
            grid.focusAt(focusRow, 0, true);
         }
      }

   }, [gridDatas1]);

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

   // 팝업조회
   const handleCallSearch4 = async () => {
      const param = {         
         reqTelNo: inputValues.reqTelNo,
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("SO0101_P02", { data });

      if (result.length === 1) {
         search(result[0].preRcptNo);
      }
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

   // 고객사 팝업
   const handleInputSearch3 = async (e: any) => {
      const target = e.target as HTMLInputElement; 
      const param = {
         coCd: '100',
         bpNm: '999',
         bpDiv: 'ZZ0188',
      };
      const data = JSON.stringify(param);
      const result = await fetchPost("ZZ_B_PO_BP", { data });
      setGridDatas4(result);
      
      await setIsOpen(true);
      setTimeout(() => {

         refreshGrid(gridRef4);
      }, 100);
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
         <button type="button" className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            신규
         </button>
         <button type="button" onClick={save} className="bg-blue-500 text-white  rounded-lg px-2 py-1 flex items-center shadow">
            <ServerIcon className="w-5 h-5 mr-1" />
            저장
         </button>
         <button type="button" className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            삭제
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

         <div className="space-y-5">
            <div className="grid grid-cols-2  gap-3  justify-around items-center ">
               <InputSearchComp1 value={inputValues.preRcptNo} readOnly={true} title="접수번호" target="preRcptNo" handleInputSearch={handleInputSearch} />
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
                           }} 
                           handleCallSearch={handleCallSearch4} />
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
               <InputSearchComp title="고객사" value={inputValues.bpNm} target="bpNm" onKeyDown={handleInputSearch2} onIconClick={handleInputSearch3}
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
   const columns1 = [
      { header: "참고사항", name: "tip" },
   ];

   const grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">고객사별 참고사항</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef1} columns={columns1}  height={window.innerHeight-750} perPageYn = {false}/>
      </div>
   );

   const columns2 = [
      { header: "구분", name: "dealType", hidden: true },
      { header: "품목코드", name: "itemCd", width: 100, align: "center" },
      { header: "품목명", name: "itemNm", width: 150, align: "center" },
      { header: "지점명", name: "poBpCd", editor: "text"},
      { header: "수량", name: "soQty", editor: "text"},
      { header: "가용재고", name: "invQty", editor: "text"},
      { header: "단가", name: "soPrice", editor: "text"},
      { header: "금액", name: "soAmt", editor: "text"},
      { header: "공급가액", name: "netAmt", editor: "text"},
      { header: "부가세액", name: "vatAmt", editor: "text"},
      { header: "유/무상", name: "payDiv", editor: "text"},
      { header: "무상사유", name: "reason", editor: "text"},
   ];

   const grid2 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <RadioGroup value={inputValues.dealType} 
                           options={[ { label: "표준", value: "Y" }, { label: "예외", value: "N" } ]} 
                           layout="horizontal"
                           onChange={(e)=>{
                              console.log('onChange')
                              onInputChange('dealType', e);  
                           }}  
                           onClick={() => {console.log('onClick')}} />
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

         <TuiGrid01 gridRef={gridRef2} columns={columns2} rowHeaders={['checkbox','rowNum']} perPageYn = {false} height={window.innerHeight-650} />
      </div>
   );

   const columns3 = [
     
      { header: "품목코드", name: "itemCd" },
      { header: "품목명", name: "itemNm", align : "center"},
      { header: "지점코드", name: "poBpCd", align : "center" },
      { header: "지점명", name: "poBpNm", align : "center" },
      { header: "수량", name: "soQty", editor: "text"},
      { header: "가용재고", name: "invQty", editor: "text"},
      { header: "발주단가", name: "poPrice", editor: "text"},
      { header: "발주금액", name: "poAmt", editor: "text"},
   ];

   const grid3 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">발주정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRef3} columns={columns3} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   const columns4 = [
      { header: "접수자", name: "insrtUserId", hidden: true },
      { header: "접수자", name: "insrtUserNm", width: 100, align: "center" },
      { header: "접수일시", name: "insrtDt", width: 150, align: "center" },
      { header: "메모", name: "consultMemo", editor: "text"},
   ];

   const grid4 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">사전상담 정보</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRef4} columns={columns4} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   const columns5 = [
      { header: "결제방법", name: "insrtUserId", hidden: true },
      { header: "결제금액", name: "insrtUserNm", width: 100, align: "center" },
      { header: "저장유무", name: "insrtDt", width: 150, align: "center" },
   ];

   const grid5 = () => (
      <div className="border rounded-md p-4 space-y-4">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">결제 항목 리스트</div>
            </div>           
         </div>

         <TuiGrid01 gridRef={gridRef5} columns={columns5} perPageYn = {false} height={window.innerHeight-650}/>
      </div>
   );

   const handleTabIndex = async (index: number) => {
      await setTabIndex(index);
      await refreshGrid(gridRef2);
      await refreshGrid(gridRef3);
      await refreshGrid(gridRef4);
   };

   const tabLabels = ['상품정보', '발주정보', '사전상담', '결제처리', '메모정보', '재고이동', '주문확정'];

   return (
      <div className={`space-y-2 overflow-y-auto `}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
         </div>
         <div>
            <div className="w-full h-full flex">
               <div className="w-1/3 ">
                  <div className="space-x-2 p-1">{inputDiv()}</div> 
               </div>
               <div className="w-1/3 ">
                  <div className="space-x-2 p-1">{inputDiv2()}</div> 
               </div>
               <div className="w-1/3 ">
                  <div className="space-x-2 p-1" ref={gridContainerRef1}>{grid1()}</div> 
               </div>
            </div>
            <div className="w-full h-full md:flex md:space-x-2 md:space-y-0 space-y-2">
               <div className="w-full">
                  <div className="flex ">
                     {tabLabels.map((label, index) => (
                           <div
                              key={index} // 고유한 key 속성 추가
                              className={`p-1 px-2  w-auto text-center rounded-t-md  text-sm cursor-pointer border border-b-0
                                 ${tabIndex === index ? "text-white bg-sky-900  " : "text-gray-500"}
                              `}
                              onClick={() => {
                                 handleTabIndex(index);
                              }}
                           >
                              {label}
                           </div>
                     ))}
                  </div>
                  <div className={"w-full md:flex md:space-x-2 md:space-y-0 space-y-2"}>
                     <div className={`w-full ${tabIndex === 0 ? " " : "hidden"}`} ref={gridContainerRef2}>{grid2()} </div>                     
                  </div>
                  <div className={`w-full ${tabIndex === 1 ? " " : "hidden"}`} ref={gridContainerRef3}>{grid3()}</div>
                  <div className={`w-full ${tabIndex === 2 ? " " : "hidden"}`} ref={gridContainerRef4}>{grid4()}</div>
                  {/* <div className={` ${tabIndex === 3 ? " " : "hidden"}`} ref={gridContainerRef5}>{grid5()}</div> */}
                  <div className="w-full flex space-x-2 p-2">
                     {/* <div className={`w-1/3 ${tabIndex === 4 ? " " : "hidden"}`} ref={gridContainerRef6}>{grid6()}</div> */}
                     <div className={`w-full ${tabIndex === 4 ? " " : "hidden"}`} ref={gridContainerRef2}>{grid2()}</div>
                  </div>
               </div>
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

export default SO0201;