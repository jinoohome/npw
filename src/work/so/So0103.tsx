import { React, useEffect, useState, useRef, SelectSearch, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2 } from "../../comp/Import";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const So0103 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);

   const refs = {
      reqNm: useRef<any>(null),
      insrtUserId: useRef<any>(null),
      insrtDt: useRef<any>(null),
      updtUserId: useRef<any>(null),
      updtDt: useRef<any>(null),
   };

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      searchReqNm: '',
      searchBpCd: '999',
      searchBpNm: '',
   });

   const [gridDatas, setGridDatas] = useState<any[]>([]);
   const [focusRow] = useState<any>(0);
   const [isOpen, setIsOpen] = useState(false);
   const [sensitiveData, setSensitiveData] = useState({ reqTelNo: '' });

   const breadcrumbItem = [{ name: "주문관리" }, { name: "회원관리" }, { name: "회원등록" }];

   const { fetchWithLoading } = useLoadingFetch();

   // 첫 페이지 시작시 실행
   useEffect(() => {
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
      setGridData();
   }, []);

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [gridDatas]);

   //---------------------- api -----------------------------

   const setGridData = async () => {
      await fetchWithLoading(async () => {
         try {
            const result = await SO0103_S01();
            setGridDatas(result);
         } catch (error) {
            alertSwal("오류", "데이터 조회 중 오류가 발생했습니다.", "error");
         }
      });
   };

   const SO0103_S01 = async () => {
      try {
         const param = {
            coCd: '100',
            reqNm: searchRef1.current?.value || "999",
            bpCd: inputValues.searchBpCd || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`SO0103_S01`, { data });

         if (gridRef.current) {
            const grid = gridRef.current.getInstance();
            if (grid && grid.getData().length > 0) {
               grid.focusAt(focusRow, 0, true);
            }
         }

         return result || [];
      } catch (error) {
         return [];
      }
   };

   const SO0103_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`SO0103_U01`, data);
         return result;
      } catch (error) {
         throw error;
      }
   };

   const SO0103_S02 = async (memberId: number, coCd: string) => {
      try {
         const param = { coCd, memberId };
         const data = JSON.stringify(param);
         const result = await fetchPost(`SO0103_S02`, { data });
         return result;
      } catch (error) {
         throw error;
      }
   };

   const SO0103_A01 = async (data: any) => {
      try {
         const result = await fetchPost(`SO0103_A01`, data);
         return result;
      } catch (error) {
         throw error;
      }
   };

   //-------------------event--------------------------

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => {
         const currentValue = prevValues[name] ?? "";
         const newValue = value ?? "";

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
      const data = typeof dataString === "string" ? JSON.parse(dataString) : dataString;
      let result = true;

      if (action === "save") {
         if (data.length < 1) return false;

         for (const item of data) {
            if (["U", "I"].includes(item.status)) {
               if (!item.reqNm) {
                  alertSwal("입력확인", "신청자를 입력해주세요.", "warning");
                  result = false;
               }
               if (!item.reqTelNo) {
                  alertSwal("입력확인", "연락처를 입력해주세요.", "warning");
                  result = false;
               }
               if (!item.bpCd) {
                  alertSwal("입력확인", "고객사를 선택해주세요.", "warning");
                  result = false;
               }
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
            let result = await SO0103_U01(data);
            if (result) {
               await returnResult(result);
            }
         } else {
            grid.focusAt(rowIndex, 0, true);
         }
      });
   };

   const returnResult = async (result: any) => {
      alertSwal(result.msgtext, result.msgcd, result.msgstatus);
      await setGridData();
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
      let datas = await getGridDatas(gridRef);

      if (!validateData("save", datas)) {
         return false;
      }

      if (datas) {
         let data = {
            data: JSON.stringify(datas),
            menuId: activeComp.menuId,
            insrtUserId: userInfo.usrId,
         };

         return data;
      }
   };

   //grid 추가버튼
   const addGridRow = () => {
      let grid = gridRef.current.getInstance();

      grid.appendRow({ reqNm: "", reqTelNo: "", bpCd: "", bpNm: "", useYn: "Y", coCd: "100", isNew: true }, { at: 0 });

      const pagination = grid.getPagination();
      if (pagination) {
         pagination.movePageTo(0);
      }
      grid.focusAt(0, 1, true);
   };

   //grid 삭제버튼
   const delGridRow = () => {
      let grid = gridRef.current.getInstance();

      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);

      grid.removeRow(rowKey, {});

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
      const focusedCell = grid.getFocusedCell();
      if (focusedCell && focusedCell.rowKey !== null) {
         grid.setValue(focusedCell.rowKey, columnName, value);
      }
   };

   const handleCallSearch = () => {
      setGridData();
   };

   // 알림톡 전송
   const sendAlimtalk = async () => {
      const grid = gridRef.current.getInstance();
      const focusedCell = grid.getFocusedCell();

      if (!focusedCell || focusedCell.rowKey === null) {
         alertSwal("알림", "전송할 회원을 선택해주세요.", "warning");
         return;
      }

      const rowData = grid.getRow(focusedCell.rowKey);

      if (!rowData || !rowData.memberId) {
         alertSwal("알림", "저장된 회원만 알림톡을 전송할 수 있습니다.", "warning");
         return;
      }

      if (!rowData.reqTelNo) {
         alertSwal("알림", "연락처가 없는 회원입니다.", "warning");
         return;
      }

      await fetchWithLoading(async () => {
         try {
            const param = {
               memberId: rowData.memberId,
               reqNm: rowData.reqNm,
               reqTelNo: rowData.reqTelNo,
               coCd: rowData.coCd || '100',
               templateCd: 'SJR_247730',
               insrtUserId: userInfo.usrId
            };

            const result = await SO0103_A01(param);
            if (result) {
               alertSwal(result.msgtext, result.msgcd, result.msgstatus);
            }
         } catch (error) {
            alertSwal("오류", "알림톡 전송 중 오류가 발생했습니다.", "error");
         }
      });
   };

   // 민감정보 버튼 클릭 핸들러
   const handleSensitiveInfoClick = async () => {
      const grid = gridRef.current.getInstance();
      const focusedCell = grid.getFocusedCell();
      if (focusedCell && focusedCell.rowKey !== null) {
         const rowData = grid.getRow(focusedCell.rowKey);

         if (rowData && rowData.memberId) {
            await fetchWithLoading(async () => {
               try {
                  const result = await SO0103_S02(rowData.memberId, rowData.coCd || '100');

                  if (result && result.length > 0) {
                     const data = result[0];
                     setSensitiveData({ reqTelNo: data.reqTelNo || '' });
                  }

                  setIsOpen(true);
               } catch (error) {
                  alertSwal("오류", "민감정보 조회 중 오류가 발생했습니다.", "error");
               }
            });
         } else {
            // 신규 행인 경우 빈 값으로 모달 열기
            setSensitiveData({ reqTelNo: rowData?.reqTelNo || '' });
            setIsOpen(true);
         }
      } else {
         alertSwal("알림", "선택된 회원이 없습니다.", "warning");
      }
   };

   // 민감정보 입력 변경 핸들러
   const handleSensitiveInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSensitiveData({ ...sensitiveData, [name]: value });
   };

   // 민감정보 저장 함수
   const saveSensitiveInfo = () => {
      const grid = gridRef.current.getInstance();
      const focusedCell = grid.getFocusedCell();

      if (focusedCell && focusedCell.rowKey !== null) {
         setChangeGridData("reqTelNo", sensitiveData.reqTelNo);
         setIsOpen(false);
         alertSwal("알림", "연락처가 수정되었습니다. 저장 버튼을 눌러 변경사항을 저장하세요.", "success");
      }
   };

   // 민감정보 모달
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
                     <label className="font-medium">연락처</label>
                     <input
                        name="reqTelNo"
                        type="text"
                        className="border rounded-md p-2"
                        value={sensitiveData.reqTelNo}
                        onChange={handleSensitiveInputChange}
                        placeholder="010-0000-0000"
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

   //-------------------div--------------------------

   //상단 버튼 div
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>
         <button type="button" onClick={save} className="bg-blue-500 text-white rounded-lg px-2 py-1 flex items-center shadow">
            <ServerIcon className="w-5 h-5 mr-1" />
            저장
         </button>
         <button type="button" onClick={sendAlimtalk} className="bg-green-500 text-white rounded-lg px-2 py-1 flex items-center shadow">
            <PaperAirplaneIcon className="w-5 h-5 mr-1" />
            알림톡 전송
         </button>
      </div>
   );

   //검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-3 search text-sm search h-full">
         <div className="space-y-2 w-[60%]">
            <div className="grid grid-cols-3 gap-y-2 justify-start ">
               <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="신청자"></InputComp1>
               <SelectSearch
                  title="고객사"
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
                  param={{ coCd: '100', bpNm: "999", bpType: "ZZ0002", bpDiv: "999" }}
                  procedure="ZZ_B_PO_BP"
                  dataKey={{ label: "bpNm", value: "bpCd" }}
               />
            </div>
         </div>
      </div>
   );

   //input div
   const inputDiv = () => (
      <div className="border rounded-md p-2 space-y-2 input text-sm">
         <div className="flex justify-between items-center border-b">
            <div className="flex items-center space-x-1 text-orange-500 p-2 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">회원 등록</div>
            </div>
         </div>
         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4 gap-6 justify-around items-center ">
               <InputComp2 ref={refs.reqNm} title="신청자" target="reqNm" setChangeGridData={setChangeGridData} />
               <button
                  type="button"
                  onClick={handleSensitiveInfoClick}
                  className="bg-purple-500 text-white rounded-lg px-3 py-2 flex items-center justify-center shadow h-10 mt-6"
               >
                  <ServerIcon className="w-5 h-5 mr-1" />
                  민감정보
               </button>
               <SelectSearch
                  title="고객사"
                  value={inputValues.bpCd}
                  onChange={(label, value) => {
                     setChangeGridData("bpCd", value);
                     setChangeGridData("bpNm", label);
                     onInputChange("bpCd", value);
                  }}
                  stringify={true}
                  layout="vertical"
                  addData="empty"
                  param={{ coCd: '100', bpNm: "999", bpType: "ZZ0002", bpDiv: "999" }}
                  procedure="ZZ_B_PO_BP"
                  dataKey={{ label: "bpNm", value: "bpCd" }}
               />
            </div>
            <div className="grid grid-cols-4 gap-6 justify-around items-center ">
               <InputComp2 ref={refs.insrtUserId} title="등록자" target="insrtUserId" setChangeGridData={setChangeGridData} readOnly={true} />
               <InputComp2 ref={refs.insrtDt} title="등록일" target="insrtDt" setChangeGridData={setChangeGridData} readOnly={true} />
               <InputComp2 ref={refs.updtUserId} title="수정자" target="updtUserId" setChangeGridData={setChangeGridData} readOnly={true} />
               <InputComp2 ref={refs.updtDt} title="수정일" target="updtDt" setChangeGridData={setChangeGridData} readOnly={true} />
            </div>
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "회원ID", name: "memberId", hidden: true },
      { header: "신청자", name: "reqNm", width: 100, align: "center" },
      { header: "연락처", name: "reqTelNo", hidden: true },
      { header: "고객사코드", name: "bpCd", hidden: true },
      { header: "고객사", name: "bpNm" },
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "사용여부", name: "useYn", hidden: true },
      { header: "등록자", name: "insrtUserId", hidden: true },
      { header: "등록일", name: "insrtDt", hidden: true },
      { header: "수정자", name: "updtUserId", hidden: true },
      { header: "수정일", name: "updtDt", hidden: true },
      { header: "", name: "isNew", hidden: true },
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">회원 리스트</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delGridRow} className="bg-rose-500 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={handleFocusChange} height={window.innerHeight - 550} />
      </div>
   );

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

export default So0103;
