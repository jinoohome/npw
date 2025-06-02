import { React, useEffect, useState, useRef, useCallback, commas, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, getGridCheckedDatas, SelectSearch } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const MM0301 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);
   const { fetchWithLoading } = useLoadingFetch();

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);

   const refs = {
      remark1: useRef<any>(null),
   };

   const [gridDatas, setGridDatas] = useState<any[]>();

   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();   
   const [choice3, setChoice3] = useState<any>();   

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      coCd: '',
   });

   const [focusRow, setFocusRow] = useState<any>(0);

   const breadcrumbItem = [{ name: "기준정보" }, { name: "작업관리" }, { name: "시군지부 담당자 등록" }];

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
      initChoice(searchRef3, setChoice1, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "Y" },
         { value: "N", label: "N" },
      ]);
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

   const setGridData = async () => {
      
      await fetchWithLoading(async () => {
         try {
            const result = await MM0302_S01();

            if (!result || result.length === 0) {
               // 데이터가 없을 때 refs 값들 초기화
               Object.keys(refs).forEach((key) => {
                  const ref = refs[key as keyof typeof refs];
                  if (ref?.current) {                  
                        ref.current.value = ""; // 각 ref의 값을 빈 값으로 설정
                  }
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
   }, [activeComp]);

   //Grid 데이터 설정
   useEffect(() => {
      if (gridRef.current && gridDatas) {
         let grid = gridRef.current.getInstance();
         const updatedGridDatas = gridDatas.map(data => ({ ...data, _attributes: { ...data._attributes, checked: true }}));
         grid.resetData(updatedGridDatas);
         if (gridDatas.length > 0) {
            console.log(focusRow);
            let checkFocusRow = grid.getValue(focusRow, "workCd") ? focusRow : 0;
            grid.focusAt(checkFocusRow, 0, true);
            //grid.focusAt(focusRow, 0, true);
         }
      }

   }, [gridDatas]);

   //---------------------- api -----------------------------
   const MM0302_S01 = async () => {
      try {
         const param = {
            codeName:  searchRef1.current?.value   || "999",
            remark1:  searchRef2.current?.value   || "999",
            useYn:  searchRef3.current?.value   || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0302_S01`, { data });

         setGridDatas(result);

         const grid = gridRef.current.getInstance();       

         if(grid.getData().length > 0){
            grid.focusAt(focusRow, 0, true);

         }
     
         return result;
      } catch (error) {
         console.error("MM0302_S01 Error:", error);
         throw error;
      }
   };

   const MM0302_U01 = async (data: any) => {
      try {
         const result = await fetchPost(`MM0302_U01`, data);
         return result;
      } catch (error) {
         console.error("MM0302_U01 Error:", error);
         throw error;
      }
   };

   //-------------------event--------------------------

   const search = () => {
      setGridData();
   };

   const save = async () => {
      await fetchWithLoading(async () => {
         let grid = gridRef.current.getInstance();
         let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      
         setFocusRow(rowKey);

         const data = await getGridValues();

         console.log(data);
       
         if (data) {
            let result = await MM0302_U01(data);
            console.log(result);
            if (result) {
               await returnResult(result);
            }
         }else{
            grid.focusAt(rowKey, 0, true);
         }
      });
   };

   const returnResult = async(result: any) => {
     
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      setGridData();
   
   };

   // 모든 grid Data 내용을 가져옴
   const getGridValues = async () => {
     // let datas = await getGridDatas(gridRef);
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
                     let type = ref.current.getAttribute("data-type");
                     if (type === "number") {
                        ref.current.value = commas(Number(value));
                     } else {
                        ref.current.value = value;
                     }
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
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="시군지부"></InputComp1>
            <InputComp1 ref={searchRef2} handleCallSearch={handleCallSearch} title="담당자"></InputComp1>
            <SelectComp1 ref={searchRef3} title="등록여부" handleCallSearch={handleCallSearch}></SelectComp1>
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
               <div className="">담당자 정보</div>
            </div>
         </div>

         <div className="p-5 space-y-5">
            <div className="grid grid-cols-4  gap-6  justify-around items-center ">
               <SelectSearch
                        title="담당자"
                        value={inputValues.remark1}
                        onChange={(label, value) => {
                              setChangeGridData("remark1", value);
                              onInputChange("remark1", value);
                        }}
                        addData={"empty"}

                        stringify={true}
                        layout="vertical"
                        param={{}}
                        procedure="MM0302_S02"
                        dataKey={{ label: "usrNm", value: "usrId" }}
               />
              
            </div>   
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "코드", name: "code", width: 100, align: "center"},
      { header: "시군지부", name: "codeName", width: 550},
      { header: "등록여부", name: "useYn", align: 'center'},
     
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">시군지부 리스트</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={handleFocusChange} height = {window.innerHeight - 520}/>
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
            <div className="w-1/2 " ref={gridContainerRef}>{grid()}</div>
            <div className="w-1/2 ">{inputDiv()} </div>
         </div>
      </div>
   );
};

export default MM0301;