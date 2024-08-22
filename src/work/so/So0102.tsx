import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, reSizeGrid, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, DateRangePickerComp, date } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
}

const So0206 = ({ item, activeComp, leftMode, userInfo }: Props) => {

   const GridRef1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: date(-1, 'month'),
      endDate: date(),
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };


   const [focusRow, setFocusRow] = useState<any>(0);

   const breadcrumbItem = [{ name: "주문관리" }, { name: "사전상담" }, { name: "사전상담 조회" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
   }, []);


   const setGridData = async () => {
      try {
         await SO0102_S01();
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   // 탭 클릭시 Grid 리사이즈
   useEffect(() => {
      // refreshGrid(GridRef1);
   
   }, [activeComp, leftMode]);

   // Grid 데이터 설정
   useEffect(() => {
      if (GridRef1.current && gridDatas1) {
         let grid1 = GridRef1.current.getInstance();
         grid1.resetData(gridDatas1);

         let focusRowKey = grid1.getFocusedCell()?.rowKey || 0;

         if (gridDatas1.length > 0) {
            grid1.focusAt(focusRowKey, 0, true);
         }
         
         
      } 
   }, [gridDatas1]);

 
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

   const SO0102_S01 = async () => {
      const param = {
         coCd: userInfo.coCd,
         startDt: inputValues.startDate,
         endDt: inputValues.endDate,
         reqNm: searchRef1.current?.value || '999',
         ownNm: searchRef2.current?.value || '999',
         bpNm: searchRef3.current?.value || '999',
      };

      const data = JSON.stringify(param);
      const result = await fetchPost(`SO0102_S01`, { data });
      setGridDatas(result);
      return result;
   };

   //-------------------event--------------------------

   const search = () => {
      setGridData();
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      //setGridData();
      await SO0102_S01();
   };

   //-------------------div--------------------------

   //상단 버튼 div
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>
      </div>
   );

   //검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm">
         <div className="grid gap-y-3  justify-start w-[80%]  2xl:w-[60%]  xl:grid-cols-3 md:grid-cols-2">
         <DateRangePickerComp 
                     title="접수기간"
                     startValue= {inputValues.startDate}
                     endValue= {inputValues.endDate}
                     onChange={(startDate, endDate) => {
                        onInputChange('startDate', startDate);
                        onInputChange('endDate', endDate);   
               }
               
               } /> 
               <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="신청자"></InputComp1>
               <InputComp1 ref={searchRef2} handleCallSearch={handleCallSearch} title="대상자"></InputComp1>
               <InputComp1 ref={searchRef3} handleCallSearch={handleCallSearch} title="고객사"></InputComp1>   
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "접수번호", name: "preRcptNo", align: "center", width: 120, rowSpan: true },
      { header: "접수일시", name: "rcptDt", align: "center", width: 150, rowSpan: true },
      { header: "접수자", name: "rcptUserNm", align: "center", width: 100 },
      { header: "신청자", name: "reqNm", align: "center", width: 100 },
      { header: "고객사", name: "bpNm", width: 120 },
      { header: "대상자", name: "ownNm", align: "center", width: 100 },
      { header: "재직구분", name: "subCodeNm", width: 150 },
      { header: "경조사유", name: "hsNm", width: 150 },
      { header: "메모", name: "consultMemo", whiteSpace: 'pre-wrap' },
   ];

   const Grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">사전상담 리스트</div>
            </div>
         </div>

         <TuiGrid01 columns={grid1Columns} gridRef={GridRef1} />
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
         <div className="w-full h-full md:flex p-2 md:space-x-2 md:space-y-0 space-y-2">
            <div className="w-full" ref={gridGridContainerRef}>{Grid1()}</div>
         </div>
      </div>
   );
};

export default So0206;
