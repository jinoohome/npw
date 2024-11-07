import { React, useEffect, useState, useRef, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, commas, reSizeGrid, InputComp, SelectSearchComp, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, DateRangePickerComp, date } from "../../comp/Import";
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

const So0202 = ({ item, activeComp, leftMode, userInfo }: Props) => {

   const GridRef1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);
   const searchRef5 = useRef<any>(null);
   const searchRef6 = useRef<any>(null);

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

   const breadcrumbItem = [{ name: "주문관리" }, { name: "주문" }, { name: "주문 조회" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
   }, []);


   const setGridData = async () => {
      try {
         await SO0202_S01();
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
         
      } 
   }, [gridDatas1]);

   useEffect(() => {
      // inputValues 중 결제여부 또는 마감여부가 변경되면 검색을 실행
      const handleSearch = async () => {
          await SO0202_S01();
      };
  
      handleSearch();
  }, [inputValues.status]);

 
   //---------------------- api -----------------------------

   const SO0202_S01 = async () => {
      const param = {
         coCd: userInfo.coCd,
         startDt: inputValues.startDate,
         endDt: inputValues.endDate,
         bpNm: searchRef1.current?.value || '999',
         ownNm: searchRef2.current?.value || '999',
         reqNm: searchRef3.current?.value || '999',
         soNo: searchRef4.current?.value || '999',
         status: inputValues.status || '999',
         dlvyNm: searchRef6.current?.value || '999',
      };

      const data = JSON.stringify(param);
      const result = await fetchPost(`SO0202_S01`, { data });
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
      await SO0202_S01();
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
         <div className="grid gap-y-3  justify-start w-[80%]  2xl:w-[80%]  xl:grid-cols-4 md:grid-cols-2">
            <DateRangePickerComp 
                  title="주문일시"
                  startValue= {inputValues.startDate}
                  endValue= {inputValues.endDate}
                  onChange={(startDate, endDate) => {
                     onInputChange('startDate', startDate);
                     onInputChange('endDate', endDate);   
            }
            
            } /> 
            <InputComp title="고객사" ref={searchRef1} value={inputValues.bpNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('bpNmS', e);
                     }} />
            <InputComp title="대상자" ref={searchRef2} value={inputValues.ownNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('ownNmS', e);
                     }} />
            <InputComp title="주문자" ref={searchRef3} value={inputValues.reqNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('reqNmS', e);
                     }} />
            <InputComp title="주문번호" ref={searchRef4} value={inputValues.soNoS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('soNoS', e);
                     }} />
            <SelectSearchComp title="진행상태" 
                              ref={searchRef5}
                              value={inputValues.status}
                              onChange={(label, value) => {
                                    onInputChange('status', value);
                                 }}                           

                              //초기값 세팅시
                              param={{ coCd: "999", majorCode: "FU0009", div: "999" }}
                              procedure="ZZ_CODE"  dataKey={{ label: 'codeName', value: 'code' }} 
               />
               <InputComp title="배송지" ref={searchRef6} value={inputValues.dlvyNmS} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('dlvyNmS', e);
                     }} />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "진행상태", name: "poStatusNm", align: "center", width: 100},
      { header: "주문번호", name: "soNo", align: "center", width: 120},
      { header: "주문일시", name: "orderDt", align: "center", width: 100},
      { header: "구분", name: "rcptMeth", align: "center", width: 80 },
      { header: "접수자", name: "rcptUserNm", align: "center", width: 80 },
      { header: "고객사", name: "bpNm", width: 200 },
      { header: "재직구분", name: "subCodeNm", align: "center", width: 100 },
      { header: "부서", name: "deptNm", align: "center", width: 120 },
      { header: "직급", name: "roleNm", align: "center", width: 100 },
      { header: "신청사유", name: "hsNm", width: 150 },
      { header: "대상자", name: "ownNm", align: "center", width: 80 },
      { header: "주문자", name: "reqNm", align: "center", width: 80 },
      { header: "배송지", name: "dlvyNm", align: "center", width: 200 },
      { header: "호실", name: "roomNo", align: "center", width: 100 },
      { header: "고인명", name: "dNm", align: "center", width: 100 },
      { header: "품목", name: "itemNm", width: 200 },
      { header: "결제금액", name: "payAmt", align: "right", width: 100, formatter: function(e: any) {if(e.value){return commas(e.value);}} },
      { header: "패키지", name: "pkgYn", align: "center", width: 100 },
      { header: "표준/예외", name: "dealType", align: "center", width: 100 },
   ];

   const Grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">주문 리스트</div>
            </div>
         </div>

         <TuiGrid01 columns={grid1Columns} gridRef={GridRef1} height={window.innerHeight-540}/>
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

export default So0202;
