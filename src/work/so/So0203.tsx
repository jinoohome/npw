// import { useEffect, useState, useRef,
//    alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, 
//    reSizeGrid, getGridDatas, InputComp, InputComp1, SelectSearch, InputSearchComp1, DateRangePickerComp, date, InputSearchComp, commas,
//     RadioGroup, TextArea, Checkbox, CommonModal, DatePickerComp, formatCardNumber, formatExpiryDate, getGridCheckedDatas2 } from "../../comp/Import";
// import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
// import ChoicesEditor from "../../util/ReactSelectEditor";
// import { set } from "date-fns";
// import { setTime } from "react-datepicker/dist/date_utils";

// interface Props {
//    item: any;
//    activeComp: any;
//    userInfo : any;
// }

// const SO0203 = ({ item, activeComp, userInfo }: Props) => {
//    const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
//       startDate: date(-1, 'month'),    //주문팝업
//       endDate: date(),
//       startDate2: date(-1, 'month'),   // 사전상담 팝업
//       endDate2: date(),
//       dealType: 'A',
//       rcptUserId: userInfo.usrId,
//       rcptMeth: "FU0007",
//       zzFU0004 : [], // 청구구분
//       zzFU0005 : [], // 유무상구분
//       zzFU0006 : [], // 무상사유
//       zzFU0007 : [], // 결제방법
//    });

//    const [gridDatas2, setGridDatas2] = useState<any[]>();      // 상품정보
//    const [gridDatas3, setGridDatas3] = useState<any[]>();      // 발주정보
//    const [isOpen2, setIsOpen2] = useState(false);     // 고객사 팝업
//    const [gridDatas1, setGridDatas1] = useState<any[]>();
//    const gridRef2 = useRef<any>(null);    // 상품정보
//    const [gridDatasP2, setGridDatasP2] = useState<any[]>();      // 고객사정보
//    const [gridDatas4, setGridDatas4] = useState<any[]>();      // 사전상담 정보
//    const gridRefP1 = useRef<any>(null);    // 주문팝업
//    const searchRef1 = useRef<any>(null);
//    const [gridDatasP1, setGridDatasP1] = useState<any[]>();
//    const [isOpen, setIsOpen] = useState(false);       // 주문정보 팝업
//    const gridRefP2 = useRef<any>(null);    // 고객사팝업
//    const [gridDatas7, setGridDatas7] = useState<any[]>();      // 재고이동정보
//    const [gridDatas8, setGridDatas8] = useState<any[]>();      // 발주확정정보
//    const breadcrumbItem = [{ name: "주문관리" }, { name: "주문" }, { name: "주문 등록" }];
//    const [gridDatas5, setGridDatas5] = useState<any[]>();      // 결제처리
//    const [gridDatas6, setGridDatas6] = useState<any[]>();      // 메모정보
//    const gridRef3 = useRef<any>(null);    // 발주정보
//    const gridRef7 = useRef<any>(null);    // 재고이동정보
//    const gridRef5 = useRef<any>(null);    // 결제처리
//    const gridRef6 = useRef<any>(null);    // 메모정보
//    const [tabIndex, setTabIndex] = useState(0);



//    const onInputChange = (name: string, value: any) => {
//       setInputValues((prevValues:any) => {
//          // null, undefined, ""을 하나의 빈 값으로 취급
//          const currentValue = prevValues[name] ?? "";
//          const newValue = value ?? "";

//          // 동일한 값일 경우 상태를 업데이트하지 않음
//          if (currentValue === newValue) {
//             return prevValues;
//          }

//          return {
//             ...prevValues,
//             [name]: newValue,
//          };
//       });
//    };

// //--------------------------------------------------------------------------------
// // event function

//    // 주문 팝업
//    const handleInputSearch = async (e: any) => {
//       const param = {    
//          startDt: inputValues.startDate,     
//          endDt: inputValues.endDate,     
//          soNo: '999',
//          ownNm: searchRef1.current?.value || '999',
//       };
//       const data = JSON.stringify(param);
//       const result = await fetchPost("SO0201_P01", { data });
//       setGridDatasP1(result);

//       await setIsOpen(true);
//       setTimeout(() => {

//          refreshGrid(gridRefP1);
//       }, 100);
//    };

//    // 사전상담 조회 (연락처)
//    const handleCallSearch4 = async () => {
//       const param = {         
//          ownTelNo: inputValues.ownTelNo,
//       };
//       const data = JSON.stringify(param);
//       const result = await fetchPost("SO0201_P02", { data });

//       if (result.length > 0) {
//          onInputChange('preRcptNo', result[0].preRcptNo);

//          // 사전상담
//          let preRcpt = await SO0101_S02({ preRcptNo: result[0].preRcptNo });
//          setGridDatas4(preRcpt);
//       }
//    };

//     // 고객사 팝업
//     const handleInputSearch2 = async (e: any) => {
//       const target = e.target as HTMLInputElement; 
//       const param = {
//          coCd: '100',
//          bpNm: target.value || '999',
//          bpDiv: 'ZZ0188',
//          bpType: '999',
//       };
//       const data = JSON.stringify(param);
//       const result = await fetchPost("ZZ_B_PO_BP", { data });
//       setGridDatasP2(result);
//       if (result.length === 1) {
//             onInputChange('subCode', '');
//             onInputChange('hsCd', '');
//             onInputChange('itemType', '');

//             const bpCd = result[0].bpCd 
//             const bpNm = result[0].bpNm
//             const contNo = result[0].contNo
//             const mouYn = result[0].mouYn

//             // InputSearchComp1에 값 설정
//             onInputChange('bpNm', bpNm);
//             onInputChange('soldToParty', bpCd);
//             onInputChange('contNo', contNo);
//             onInputChange('mouYn', mouYn);

//             // 고객사별 참고사항
//             const param = {       
//                bpCd: bpCd,
//             };
//             const data = JSON.stringify(param);
//             const result2 = await fetchPost("SO0201_P05", { data });

//             setGridDatas1(result2);
//          } else {
//             await setIsOpen2(true);
//             setTimeout(() => {

//                refreshGrid(gridRefP2);
//             }, 100);
//       }
//    };

//     // 고객사 팝업 돋보기 클릭
//     const handleInputSearch3 = async (e: any) => {
//       const param = {
//          coCd: '100',
//          bpNm: e || '999',
//          bpDiv: 'ZZ0188',
//          bpType: '999',
//       };

//       onInputChange('bpNmS', e);
//       const data = JSON.stringify(param);
//       const result = await fetchPost("ZZ_B_PO_BP", { data });

//       setGridDatasP2(result);
      
//       await setIsOpen2(true);
//       setTimeout(() => {

//          refreshGrid(gridRefP2);
//       }, 100);
//    };

//    const handleTabIndex = async (index: number) => {
//       await setTabIndex(index);
//    };


   
//    const create = async () => {
//       setInputValues([]);
      
//       onInputChange('startDate', date(-1, 'month'));
//       onInputChange('endDate', date());
//       onInputChange('startDate2', date(-1, 'month'));
//       onInputChange('endDate2', date());
//       onInputChange('dealType', 'A');     

//       setGridDatas1([]);
//       setGridDatas2([]);
//       setGridDatas3([]);
//       setGridDatas4([]);
//       setGridDatas5([]);
//       setGridDatas6([]);
//       setGridDatas7([]);
//       setGridDatas8([]);
//    };

//    const save = async () => {
//       const gridInstance = gridRef3.current.getInstance();
//       gridInstance.blur();
//       const gridInstance2 = gridRef7.current.getInstance();
//       gridInstance2.blur();
      
//       const data = await getGridValues();

//       if (data) {
//          let result = await SO0201_U05(data);
//          if (result) {
//             await returnResult(result);
//          }
//       }
      
//    };

//    const search = async (soNo:any) => {
//       const param = {    
//          soNo: soNo,
//       };
//       const data = JSON.stringify(param);
//       const result = await fetchPost("SO0201_S01", {data});

//       // 조회된 값이 없으면 함수 종료
//       if (!result || result.length === 0) {
//          return;
//       }

//       handleTabIndex(0);

//       // 고객사별 참고사항
//       let tip = await SO0201_P05({ bpCd: result[0].soldToParty });
//       setGridDatas1(tip);

//       // 상품정보
//       let itemInfo = await SO0201_S02({ soNo: result[0].soNo });

//       // 'MANDATORY_YN' 값이 'Y'인 것만 체크된 상태로 설정
//       let filteredData = itemInfo.map((row:any) => ({
//          ...row,
//          _attributes: {
//             checked: row.mandatoryYn === 'Y',
//          },
        
//       }));

//       setGridDatas2(filteredData);
//       setGridDatas3(filteredData);
//       setGridDatas7(filteredData);
//       setGridDatas8(filteredData);

//       // 사전상담
//       let preRcpt = await SO0101_S02({ preRcptNo: result[0].preRcptNo });
//       setGridDatas4(preRcpt);

//       // 결제처리
//       let payInfo = await SO0201_S03({ soNo: result[0].soNo });
//       setGridDatas5(payInfo);

//       // 메모
//       let memo = await SO0201_S04({ soNo: result[0].soNo });
//       setGridDatas6(memo);

//       // InputSearchComp1에 값 설정      
//       onInputChange('coCd', result[0].coCd);
//       onInputChange('soNo', result[0].soNo);
//       onInputChange('rcptMeth', result[0].rcptMeth);
//       onInputChange('orderDt', result[0].orderDt);
//       onInputChange('rcptUserId', result[0].rcptUserId);
//       onInputChange('ownNm', result[0].ownNm);
//       onInputChange('ownTelNo', result[0].ownTelNo);
//       onInputChange('soldToParty', result[0].soldToParty);
//       onInputChange('bpNm', result[0].bpNm);
//       onInputChange('contNo', result[0].contNo);
//       onInputChange('subCode', result[0].subCode);
//       onInputChange('hsCd', result[0].hsCd);
//       onInputChange('itemType', result[0].itemType);
//       onInputChange('deptNm', result[0].deptNm);
//       onInputChange('roleNm', result[0].roleNm);
//       onInputChange('dlvyHopeDt', result[0].dlvyHopeDt);
//       onInputChange('roleNm', result[0].roleNm);
//       onInputChange('dlvyCd', result[0].dlvyCd);
//       onInputChange('dlvyNm', result[0].dlvyNm);
//       onInputChange('preDlvyNm', result[0].dlvyNm);
//       onInputChange('dlvyAddr', result[0].dlvyAddr);
//       onInputChange('roomNo', result[0].roomNo);
//       onInputChange('reqNm', result[0].reqNm);
//       onInputChange('reqTelNo', result[0].reqTelNo);
//       onInputChange('dNm', result[0].dNm);
//       onInputChange('memo', result[0].memo);
//       onInputChange('confirmDt', result[0].confirmDt);
//       onInputChange('preRcptNo', result[0].preRcptNo);
//       onInputChange('pkgYn', result[0].pkgYn);
//       onInputChange('mouYn', result[0].mouYn);
//       onInputChange('dealType', result[0].dealType);
//       onInputChange('payAmt', result[0].payAmt);      

//       setPayAmt();
//    };


//    const returnResult = async(result:any) => {     
//       search(result.soNoOut);
//       alertSwal(result.msgText, result.msgCd, result.msgStatus);
//    };


//    const getGridValues = async () => {
//       if (!inputValues.soNo) {
//          inputValues.status = 'I';
//       } else {
//          inputValues.status = 'U';
//       }

//       let sSoHdr = [inputValues];
//       let sSoDtl = await getGridCheckedDatas2(gridRef2);
//       let sSoPay = await getGridDatas(gridRef5);
//       let sSoMemo = await getGridDatas(gridRef6);
//       let soNo = inputValues.soNo;

//       let data = {
//          menuId: activeComp.menuId,
//          insrtUserId: userInfo.usrId,
//          soNo: soNo,
//          sSoHdr: JSON.stringify(sSoHdr),
//          sSoDtl: JSON.stringify(sSoDtl),
//          sSoPay: JSON.stringify(sSoPay),
//          sSoMemo: JSON.stringify(sSoMemo),
//       };

//       return data;
//    };


//    //--------------------------------------------------------------------------------
//    // api 

//    // 사전상담 조회
//    var SO0101_S02 = async (param : any) => {
//       try {
//          const data = JSON.stringify(param);
//          const result = await fetchPost(`SO0101_S02`, { data });

//          return result;
//       } catch (error) {
//          console.error("SO0101_S02 Error:", error);
//          throw error;
//       }
//    }

//     // 계약품목 조회
//     var SO0201_S10 = async (param : any) => {
//       try {  
//          const data = JSON.stringify(param);
//          const result = await fetchPost(`SO0201_S10`, { data });

//          // 'MANDATORY_YN' 값이 'Y'인 것만 체크된 상태로 설정
//          let filteredData = result.map((row:any) => ({
//             ...row,
//             _attributes: {
//                checked: row.mandatoryYn === 'Y',
//             },
           
//          }));

//          setGridDatas2(filteredData);
//          setGridDatas3(filteredData);
//          setGridDatas7(filteredData);
//          setGridDatas8(filteredData);

//          return filteredData;
//       } catch (error) {
//          console.error("SO0201_S10 Error:", error);
//          throw error;
//       }
//    }

//    var ZZ_CONT_INFO = async (param : any) => {
//       try {
//          const data = JSON.stringify(param);
//          const result = await fetchPost(`ZZ_CONT_INFO`, { data });

//          return result;
//       } catch (error) {
//          console.error("ZZ_CONT_INFO Error:", error);
//          throw error;
//       }
//    }

//       // 주문저장
//       const SO0201_U05 = async (data: any) => {
//          try {
//             const result = await fetchPost(`SO0201_U05`, data);
//             return result;
//          } catch (error) {
//             console.error("SO0201_U05 Error:", error);
//             throw error;
//          }
//       };

//          // 메모 조회
//     var SO0201_S04 = async (param : any) => {
//       try {
//          const data = JSON.stringify(param);
//          const result = await fetchPost(`SO0201_S04`, { data });

//          return result;
//       } catch (error) {
//          console.error("SO0201_S04 Error:", error);
//          throw error;
//       }
//    }
//     // 고객사별 참고사항
//     var SO0201_P05 = async (param : any) => {
//       try {
//          const data = JSON.stringify(param);
//          const result = await fetchPost(`SO0201_P05`, { data });

//          return result;
//       } catch (error) {
//          console.error("SO0201_P05 Error:", error);
//          throw error;
//       }
//    }
//       // 상품정보, 발주정보
//       var SO0201_S02 = async (param : any) => {
//          try {
//             const data = JSON.stringify(param);
//             const result = await fetchPost(`SO0201_S02`, { data });
   
//             return result;
//          } catch (error) {
//             console.error("SO0201_S02 Error:", error);
//             throw error;
//          }
//       }

//          // 결제처리 조회
//    var SO0201_S03 = async (param : any) => {
//       try {
//          const data = JSON.stringify(param);
//          const result = await fetchPost(`SO0201_S03`, { data });

//          return result;
//       } catch (error) {
//          console.error("SO0201_S03 Error:", error);
//          throw error;
//       }
//    }



//    //--------------------------------------------------------------------------------
//    // div

//      // 주문정보
//      const div1 = () => (
//       <div className="border rounded-md space-y-2 input text-sm">
//          <div className="flex justify-between items-center  border-b">
//             <div className="flex items-center space-x-1 text-orange-500 p-2 ">
//                <div>
//                   <SwatchIcon className="w-5 h-5 "></SwatchIcon>
//                </div>
//                <div className="">주문정보</div>
//             </div>
//          </div>

//          <div className="space-y-5">
//             <div className="grid grid-cols-2  gap-3  justify-around items-center pr-2">
//                <InputSearchComp value={inputValues.soNo} readOnly={true} title="주문번호" target="soNo" onIconClick={handleInputSearch} />
//                <SelectSearch title="접수구분" 
//                               value={inputValues.rcptMeth}
//                               addData={"empty"}
//                               onChange={(label, value) => {
//                                     onInputChange('rcptMeth', value);
//                                  }}

//                               //초기값 세팅시
//                               param={{ coCd: "999", majorCode: "FU0003", div: "-999" }}
//                               procedure="ZZ_CODE"  dataKey={{ label: 'codeName', value: 'code' }} 
//                />
//                <InputComp title="접수일시" value={inputValues.orderDt} readOnly= {true} onChange={(e)=>{
//                         onInputChange('orderDt', e);
//                      }} />               
//                <SelectSearch title="접수자" 
//                               value={inputValues.rcptUserId}
//                               addData={"empty"}
//                               readonly={true}
//                               onChange={(label, value) => {
//                                     onInputChange('rcptUserId', value);
//                                  }}

//                               //초기값 세팅시
//                               stringify={true}
//                               param={ { coCd : '999',
//                                        usrId : '999',
//                                        usrDiv : '999',
//                                        useYn : '999' }}
//                               procedure="ZZ_USER_LIST"  dataKey={{ label: 'usrNm2', value: 'usrId' }} 
//                />
//                <InputComp value={inputValues.ownNm} title="대상자" target="ownNm" 
//                           onChange={(e) => {
//                            onInputChange('ownNm', e);                           
//                         }}   />
//                <InputComp value={inputValues.ownTelNo} title="연락처" target="ownTelNo" 
//                            onChange={(e) => {
//                               onInputChange('ownTelNo', e);                      
//                            }} 
//                            handleCallSearch={handleCallSearch4} />
//                <InputSearchComp title="고객사" value={inputValues.bpNm} target="bpNm" onKeyDown={handleInputSearch2} onIconClick={handleInputSearch3}
//                                  onChange={(e) => {
//                                     onInputChange('bpNm', e);                           
//                                 }} />
//                <InputComp value={inputValues.contNo} readOnly={true} title="계약번호" target="contNo" 
//                           onChange={(e) => {
//                            onInputChange('contNo', e);                           
//                         }}   />               
//                <SelectSearch title="재직구분" 
//                               value={inputValues.subCode}
//                               onChange={async (label, value) => {                                       
//                                     const grid = gridRef2.current.getInstance();
//                                     const firstRow = grid.getRow(0); // 첫 번째 행 가져오기 

//                                     const updateItemType = async (value:any) => {
//                                        onInputChange('subCode', value);
//                                        onInputChange('subCodeNm', label);
//                                        onInputChange('hsCd', '');      
//                                        onInputChange('itemType', '');
   
//                                        await SO0201_S10({
//                                        soNo: inputValues.soNo, 
//                                        bpCd: inputValues.soldToParty,
//                                        contNo: inputValues.contNo,
//                                        subCode: inputValues.subCode,
//                                        hsCd: '',
//                                        itemType: '',
//                                        dlvyCd: inputValues.dlvyCd,
//                                        dealType: inputValues.dealType
//                                        });
//                                     };
                                    
//                                     if (firstRow && firstRow.chkYn === 'Y') {
//                                        alertSwal("상품조회", "계약조건이 변경되어 상품정보가 삭제 후 다시 조회 됩니다. 계속 하시겠습니까?", "warning", true).then(async (result) => {
//                                        if (result.isConfirmed) {
//                                           await updateItemType(value);
//                                        } else if (result.isDismissed) {
//                                           //refs.hsCd.current.setChoiceByValue(inputValues.hsCd);
//                                        }
//                                        });
//                                     } else {
//                                        await updateItemType(value);
//                                     }
//                                  }}  

//                               //초기값 세팅시
//                               stringify={true}
//                               param={{ contNo : inputValues.contNo,
//                                        bpCd : inputValues.bpCd,
//                                        subCode : "999",
//                                        searchDiv : 'SUB' }}
//                               procedure="ZZ_CONT_INFO"  dataKey={{ label: 'subCodeNm', value: 'subCode' }} 
//                />         
//                <SelectSearch title="신청사유" 
//                               value={inputValues.hsCd}
//                               onChange={async (label, value) => {                                    
//                                  const grid = gridRef2.current.getInstance();
//                                  const firstRow = grid.getRow(0); // 첫 번째 행 가져오기

//                                  const updateHSCode = async (value:any) => {
//                                     onInputChange('hsCd', value);
//                                     onInputChange('itemType', '');  
//                                     const [hsDiv] = label.split(':'); // ":" 기준으로 분리, 첫 번째 값 추출
//                                     onInputChange('hsDiv', hsDiv); // 추출한 값으로 hsDiv 업데이트

//                                     let hsCode = await ZZ_CONT_INFO({ 
//                                     contNo: inputValues.contNo, 
//                                     bpCd: inputValues.soldToParty, 
//                                     subCode: inputValues.subCode, 
//                                     searchDiv: "HS" 
//                                     });

//                                     const foundItem = hsCode.find((item: { hsCode: string; }) => item.hsCode === value);
//                                     const foundhsType = foundItem ? foundItem.hsType : null;

//                                     onInputChange('hsType', foundhsType);
         
//                                     await SO0201_S10({
//                                        soNo: inputValues.soNo, 
//                                        bpCd: inputValues.soldToParty,
//                                        contNo: inputValues.contNo,
//                                        subCode: inputValues.subCode,
//                                        hsCd: value,
//                                        itemType: '',
//                                        dlvyCd: inputValues.dlvyCd,
//                                        dealType: inputValues.dealType
//                                        });
                                    
//                                  };

//                                  if (firstRow && firstRow.chkYn === 'Y') {
//                                     alertSwal("상품조회", "계약조건이 변경되어 상품정보가 삭제 후 다시 조회 됩니다. 계속 하시겠습니까?", "warning", true).then(async (result) => {
//                                     if (result.isConfirmed) {
//                                        await updateHSCode(value);
//                                     } else if (result.isDismissed) {
//                                        //refs.hsCd.current.setChoiceByValue(inputValues.hsCd);
//                                     }
//                                     });
//                                  } else {
//                                     await updateHSCode(value);
//                                  }
//                               }}

//                               //초기값 세팅시
//                               stringify={true}
//                               param={{ contNo : inputValues.contNo,
//                                        bpCd : inputValues.soldToParty,
//                                        subCode : inputValues.subCode,
//                                        searchDiv : 'HS' }}
//                               procedure="ZZ_CONT_INFO"  dataKey={{ label: 'hsNm', value: 'hsCode' }} 
//                />
//                </div>
//                <div className="grid grid-cols-1 pr-2">
//                      <SelectSearch title="지원타입" 
//                                     value={inputValues.itemType}
//                                     minWidth="80px"
//                                     layout="flex"
//                                     textAlign="right"
//                                     onChange={async (label, value) => {
//                                        const grid = gridRef2.current.getInstance();
//                                        const firstRow = grid.getRow(0); // 첫 번째 행 가져오기 

//                                        const updateItemType = async (value:any) => {
//                                           onInputChange('itemType', value);
      
                                        
//                                        };
                                       
//                                        if (firstRow && firstRow.chkYn === 'Y') {
//                                           alertSwal("상품조회", "계약조건이 변경되어 상품정보가 삭제 후 다시 조회 됩니다. 계속 하시겠습니까?", "warning", true).then(async (result) => {
//                                           if (result.isConfirmed) {
//                                              await updateItemType(value);
//                                           } else if (result.isDismissed) {
//                                              //refs.hsCd.current.setChoiceByValue(inputValues.hsCd);
//                                           }
//                                           });
//                                        } else {
//                                           await updateItemType(value);
//                                        }

                                     
//                                     }}   

//                                     //초기값 세팅시
//                                     stringify={true}
//                                     param={{ contNo : inputValues.contNo,
//                                              bpCd : inputValues.soldToParty,
//                                              subCode : inputValues.subCode,
//                                              hsCd : inputValues.hsCd,
//                                              searchDiv : 'ITEM_TYPE' }}
//                                     procedure="ZZ_CONT_INFO"  dataKey={{ label: 'itemTypeNm', value: 'itemType' }} 
//                   /> 
//                </div>
//                <div className="grid grid-cols-2 pb-2 pr-2">
//                <InputComp value={inputValues.deptNm} title="부서" target="deptNm" 
//                           onChange={(e) => {
//                            onInputChange('deptNm', e);                           
//                         }}   />
//                <InputComp value={inputValues.roleNm} title="직급" target="roleNm" 
//                           onChange={(e) => {
//                            onInputChange('roleNm', e);                           
//                         }}   />               
//             </div>
//          </div>
//       </div>
//    );


//    const buttonDiv = () => (
//       <div className="flex justify-end space-x-2">
//          <button type="button" onClick={create} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
//             <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
//             신규
//          </button>
//          <button type="button" onClick={save} className="bg-blue-500 text-white  rounded-lg px-2 py-1 flex items-center shadow">
//             <ServerIcon className="w-5 h-5 mr-1" />
//             저장
//          </button>
//       </div>
//    );

//    return (

//       <div className={`space-y-2 overflow-y-auto `}>
//          <div className="space-y-2">
//             <div className="flex justify-between">
//                <Breadcrumb items={breadcrumbItem} />
//                {buttonDiv()}
//             </div>
//          </div>
//          <div>
//             <div className="w-full h-full flex">
//                <div className="w-1/3 ">
//                   <div className="space-x-2 p-1">{div1()}</div> 
//                </div>
//                <div className="w-1/3 ">
//                   <div className="space-x-2 p-1">{}</div> 
//                </div>
//                <div className="w-1/3 ">
                  
//                </div>
//             </div>
//             <div className="w-full h-full md:flex md:space-x-2 md:space-y-0 space-y-2">
//                <div className="w-full">
//                   <div className="flex ">
                     
//                   </div>
//                   <div className={"w-full md:flex md:space-x-2 md:space-y-0 space-y-2"}>
//                   </div>
//                   <div className="w-full flex space-x-2">
//                   </div>
//                </div>
//             </div>
//          </div>
//       </div>
        
//    );
   
// };

// export default SO0203;
export {};