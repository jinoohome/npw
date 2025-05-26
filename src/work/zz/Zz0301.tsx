import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, SelectSearchComp, SelectSearch, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';

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

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      coCd: '',
      searchBpCd: '999',
      searchBpNm: '',
      searchUseYn: '999',
  });

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [bpCdsIn, setBpCdsIn] = useState<any>([]);

   const [focusRow, setFocusRow] = useState<any>(0);
   const [isOpen, setIsOpen] = useState(false);

   const [isUsrIdReadOnly, setUsrIdReadOnly] = useState<boolean>(false);
   const [isCoCdReadOnly, setCoCdReadOnly] = useState<boolean>(false);

   const breadcrumbItem = [{ name: "관리자" }, { name: "사용자" }, { name: "사용자등록" }];

   const { fetchWithLoading } = useLoadingFetch();

   // 첫 페이지 시작시 실행
   useEffect(() => {
      // setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   useEffect(() => {
      console.log("focusRow changed:", focusRow);
   }, [focusRow]);

   //--------------------init---------------------------

   const setChoiceUI = () => {
      // 기존 initChoice 호출 제거
   };

   const setGridData = async () => {
      await fetchWithLoading(async () => {
         try {
            // 병렬로 API 호출 실행
            // const [sosocDataIn, result] = await Promise.all([
            //    MM0101_S01(),
            //    ZZ0301_S01()
            // ]);
            const result = await ZZ0301_S01();
           // console.log("result", result);

           // 데이터 처리
            // if (sosocDataIn) {
            //    // 새 배열을 생성하여 불변성 유지
             
            //    setBpCdsIn(sosocDataIn);
            // }

            // 결과 데이터 처리
            // if (!result?.length) {
            //    const emptyRefs = Object.fromEntries(
            //       Object.keys(refs).map(key => [key, ""])
            //    );
            //    setInputValues(emptyRefs);
               
            //    // refs 일괄 업데이트
            //    Object.values(refs).forEach(ref => {
            //       if (ref?.current) ref.current.value = "";
            //    });
            // }

            setGridDatas(result);
         } catch (error) {
            console.error("setGridData Error:", error);
            alertSwal("오류", "데이터 조회 중 오류가 발생했습니다.", "error");
         }
      });
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

   // useEffect(() => {
   //     updateChoices(choice1, bpCdsIn, "value", "text");
   // }, [bpCdsIn]);

   //---------------------- api -----------------------------   

   const ZZ0301_S01 = async () => {
      try {
         const param = {
            coCd:  userInfo.coCd,
            usrId:  searchRef1.current?.value   || "999",
            usrNm:  searchRef4.current?.value   || "999",
            usrDiv: "999",
            sysDiv: "999",
            bpNm:  inputValues.searchBpCd || "999",
            useYn: inputValues.searchUseYn || "999"
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
         const result = await fetchPost(`ZZ0301_U01_V2`, data);
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

   const validateData = (action: string, dataString: any) => {
      // dataString이 문자열이면 JSON.parse()를 사용, 그렇지 않으면 직접 사용
      const data = typeof dataString === "string" ? JSON.parse(dataString) : dataString;
      let result = true;

      if (action === "save") {
         if (data.length < 1) return false;

         for (const item of data) {
            if (["U", "I"].includes(item.status)) {
               if (!item.coCd) {
                  alertSwal("입력확인", "사업부서를 선택해주세요.", "warning"); // 사용자에게 알림
                  result = false;
               }
               if (!item.usrId) {
                  alertSwal("입력확인", "사번을 입력해주세요.", "warning"); // 사용자에게 알림
                  result = false;
               }
               // if (!item.pwd) {
               //    alertSwal("입력확인", "비밀번호를 입력해주세요.", "warning"); // 사용자에게 알림
               //    result = false;
               // }
            }
         }
      }

      return result;
   };

   const save = async () => {
      await fetchWithLoading(async () => {
         let grid = gridRef.current.getInstance();
         let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
         let rowIndex = grid.getIndexOfRow(rowKey);
       
         const data = await getGridValues();
         if (data) {
            console.log("data", data);
            let result = await ZZ0301_U01(data);
            if (result) {
               await returnResult(result);
            }
         } else {
            grid.focusAt(rowIndex, 0, true);
         }
      });
   };
   const returnResult = async(result: any) => {
     
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
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

      const coCdValue = userInfo.coCd !== '999' ? userInfo.coCd : '';

      grid.appendRow({  usrId: "", usrNm: "", pwd: "",email: "",hp: "",
                        useYn: "Y", coCd: coCdValue, bpCd: "", bpNm: "", usrDiv: "", isNew: true}, { at: 0 });
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

            if(rowData.usrId){
               setUsrIdReadOnly(true);
            }else{
               setUsrIdReadOnly(false);
            }

            if(rowData.insrtUserId || userInfo.coCd !== '999'){
               setCoCdReadOnly(true);
            }else{
               setCoCdReadOnly(false);
            }

            if (rowData) {
               Object.entries(rowData).forEach(([key, value]) => {
                  onInputChange(key, value);
               }); 
            }

            if (rowData) {
               Object.entries(rowData).forEach(([key, value]) => {
                  const ref = refs[key as keyof typeof refs];
                  if (ref && ref.current) {                 
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
      <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
         <div className="space-y-2 w-[60%]">
            <div className="grid grid-cols-3 gap-y-2 justify-start ">
               <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="사번"></InputComp1>
               <InputComp1 ref={searchRef4} handleCallSearch={handleCallSearch} title="사용자명"></InputComp1>
               <SelectSearch
                  title="소속"
                  value={inputValues.searchBpCd}
                  onChange={(label, value) => {
                     setInputValues(prev => ({
                        ...prev,
                        searchBpCd: value,
                        searchBpNm: label || ''
                     }));
                  }}
                  stringify={true}
                  addData="999"
                  param={{ coCd: inputValues.coCd, bpNm: "999", bpType: "999", useYn: "Y" }}
                  procedure="MM0101_S01"
                  dataKey={{ label: "bpNm", value: "bpCd" }}
               />
               <SelectSearch
                  title="사용유무"
                  value={inputValues.searchUseYn}
                  onChange={(label, value) => {
                     setInputValues(prev => ({
                        ...prev,
                        searchUseYn: value
                     }));
                  }}
                  datas={[
                     { value: "999", label: "전체" },
                     { value: "Y", label: "사용" },
                     { value: "N", label: "미사용" }
                  ]}
               />
            </div>
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
               <SelectSearch
                       title="사업부서"
                       value={inputValues.coCd}
                       readonly={isCoCdReadOnly}
                       onChange={(label, value) => {
                           setChangeGridData("coCd", value);
                           onInputChange("coCd", value);
                       }}

                       stringify={true}
                       layout="vertical"
                       param={{ coCd: userInfo.coCd }}
                       procedure="ZZ_B_BIZ"
                       dataKey={{ label: "bpNm", value: "coCd" }}
                   />
               <InputComp2 ref={refs.usrId} title="사번" target="usrId" setChangeGridData={setChangeGridData}  readOnly={isUsrIdReadOnly} />
               <InputComp2 ref={refs.usrNm} title="이름" target="usrNm" setChangeGridData={setChangeGridData} />
               <button
                  type="button"
                  onClick={handleSensitiveInfoClick}
                  className="bg-purple-500 text-white rounded-lg px-3 py-2 flex items-center justify-center shadow h-10 mt-6"
               >
                  <ServerIcon className="w-5 h-5 mr-1" />
                  민감정보
               </button>
               <SelectSearch
                       title="사용자구분"
                       value={inputValues.usrDiv}
                       layout="vertical"
                       onChange={(label, value) => {
                           setChangeGridData("usrDiv", value);
                           onInputChange("usrDiv", value);
                       }}

                       param={{ coCd: "999", majorCode: "ZZ0002", div: "" }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}

                   />
               <SelectSearch
                       title="소속"
                       value={inputValues.bpCd}
                       onChange={(label, value) => {
                           setChangeGridData("bpCd", value);
                           setChangeGridData("bpNm", label);
                           onInputChange("bpCd", value);
                       }}

                       stringify={true}
                       layout="vertical"
                       addData="empty" // 빈 값을 추가
                       param={{ coCd: inputValues.coCd, bpNm: "999", bpType: "999", useYn: "Y", }}
                       procedure="MM0101_S01"
                       dataKey={{ label: "bpNm", value: "bpCd" }}
                   />
               <InputComp2 ref={refs.email} title="이메일" target="email" setChangeGridData={setChangeGridData} />
               <SelectSearch title="사용여부" 
                              value={inputValues.useYn}
                              layout="vertical"
                              onChange={(label, value) => {
                                    setChangeGridData("useYn", value);
                                    onInputChange('useYn', value);
                                 }}                           

                              //초기값 세팅시
                              datas={[{value : '', label : ''},{value : 'Y', label : '사용'},{value : 'N', label : '미사용'}]}
                              />
               <SelectSearch title="알림톡 발송여부" 
                              value={inputValues.alarmYn}
                              layout="vertical"
                              onChange={(label, value) => {
                                    setChangeGridData("alarmYn", value);
                                    onInputChange('alarmYn', value);
                                 }}                           

                              //초기값 세팅시
                              datas={[{value : '', label : ''},{value : 'Y', label : '사용'},{value : 'N', label : '미사용'}]}
                              />
               <SelectSearch title="담당자여부" 
                              value={inputValues.alarmDiv}
                              layout="vertical"
                              onChange={(label, value) => {
                                    setChangeGridData("alarmDiv", value);
                                    onInputChange('alarmDiv', value);
                                 }}                           

                              //초기값 세팅시
                              datas={[{value : '', label : ''},{value : 'Y', label : '사용'},{value : 'N', label : '미사용'}]}
                              />
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
      { header: "사번", name: "usrId", hidden: false, width: 130 },
      { header: "이름", name: "usrNm", hidden: false, width: 100 },
      { header: "비밀번호", name: "pwd", hidden: true },
      { header: "사용자구분", name: "usrDiv", hidden: true },
      { header: "소속", name: "bpCd", hidden: true },
      { header: "소속", name: "bpNm", hidden: false },
      { header: "이메일", name: "email", hidden: true },
      { header: "연락처", name: "hp", hidden: true },
      { header: "사용여부", name: "useYn", align: 'center', hidden: true },
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

         <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={handleFocusChange} height={window.innerHeight - 550} />
      </div>
   );

   // 상태 변경 감지를 위한 useEffect 추가
   useEffect(() => {
      if (inputValues.searchBpNm !== undefined || inputValues.searchUseYn !== undefined) {
         setGridData();
      }
   }, [inputValues.searchBpNm, inputValues.searchUseYn]);

   // 민감정보 관련 상태 추가
   const [sensitiveData, setSensitiveData] = useState({
      pwd: '',
      hp: ''
   });

   // 민감정보 버튼 클릭 핸들러
   const handleSensitiveInfoClick = async () => {
      const grid = gridRef.current.getInstance();
      const { rowKey } = grid.getFocusedCell();
      if (rowKey !== null) {
         const rowData = grid.getRow(rowKey);
         
         if (rowData && rowData.usrId) {
            await fetchWithLoading(async () => {
               try {
                  // ZZ0301_S02 API 호출
                  const result = await ZZ0301_S02(rowData.usrId, rowData.coCd || userInfo.coCd);
                  console.log("result", result);
                  
                  if (result && result.length > 0) {
                     // API 결과로 민감정보 상태 업데이트
                     const data = result[0];
                     setSensitiveData({
                        pwd: data.pwd || '',
                        hp: data.hp || ''
                     });
                  }
                  
                  // 모달 열기
                  setIsOpen(true);
               } catch (error) {
                  console.error("민감정보 조회 중 오류:", error);
                  alertSwal("오류", "민감정보 조회 중 오류가 발생했습니다.", "error");
               }
            });
         } else {
            alertSwal("알림", "선택된 사용자가 없습니다.", "warning");
         }
      } else {
         alertSwal("알림", "선택된 사용자가 없습니다.", "warning");
      }
   };

   // 민감정보 입력 변경 핸들러
   const handleSensitiveInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSensitiveData({
         ...sensitiveData,
         [name]: value
      });
   };

   // 민감정보 저장 함수
   const saveSensitiveInfo = () => {
      const grid = gridRef.current.getInstance();
      const { rowKey } = grid.getFocusedCell();
      
      if (rowKey !== null) {
         // 비밀번호와 연락처 값 그리드에 업데이트
         if (sensitiveData.pwd) {
            setChangeGridData("pwd", sensitiveData.pwd);
         }
         
         // 연락처 값은 빈 값이어도 항상 업데이트
         setChangeGridData("hp", sensitiveData.hp);
         
         setIsOpen(false);
         alertSwal("알림", "민감정보가 수정되었습니다. 저장 버튼을 눌러 변경사항을 저장하세요.", "success");
      }
   };

   // Add a modal component for sensitive information
   const sensitiveInfoModal = () => (
      isOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-1/3 space-y-4">
               <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">민감정보 변경</h3>
                  <button 
                     onClick={() => setIsOpen(false)}
                     className="text-gray-500 hover:text-gray-700"
                  >
                     <XMarkIcon className="w-5 h-5" />
                  </button>
               </div>
               <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                     <label className="font-medium">비밀번호</label>
                     <input 
                        name="pwd"
                        type="password"
                        className="border rounded-md p-2"
                        value={sensitiveData.pwd}
                        onChange={handleSensitiveInputChange}
                     />
                  </div>
                  <div className="flex flex-col space-y-2">
                     <label className="font-medium">연락처</label>
                     <input 
                        name="hp"
                        type="text"
                        className="border rounded-md p-2"
                        value={sensitiveData.hp}
                        onChange={handleSensitiveInputChange}
                     />
                  </div>
               </div>
               <div className="flex justify-end space-x-2">
                  <button
                     type="button"
                     onClick={() => setIsOpen(false)}
                     className="bg-gray-400 text-white rounded-lg px-3 py-2"
                  >
                     취소
                  </button>
                  <button
                     type="button"
                     onClick={saveSensitiveInfo}
                     className="bg-blue-500 text-white rounded-lg px-3 py-2"
                  >
                     저장
                  </button>
               </div>
            </div>
         </div>
      )
   );

   // 민감정보 조회 API
   const ZZ0301_S02 = async (usrId: string, coCd: string) => {
      try {
         const param = {
            coCd: coCd,
            usrId: usrId
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ0301_S02`, { data });
         return result;
      } catch (error) {
         console.error("ZZ0301_S02 Error:", error);
         throw error;
      }
   };

   return (
      <div className={`space-y-5 overflow-y-auto`}>
         <LoadingSpinner />
         {sensitiveInfoModal()}
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