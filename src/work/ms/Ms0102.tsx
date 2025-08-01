import { React, useEffect, useState, useRef, SelectSearch, CommonModal, TextArea2, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, commas, reSizeGrid, InputComp, SelectSearchComp, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, DateRangePickerComp, date } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { OptColumn } from "tui-grid/types/options";
import { ChevronRightIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";
import { ZZ_MENU_RES } from "../../ts/ZZ_MENU";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
   handleAddMenuClick: (menuItem: ZZ_MENU_RES ) => void;
   setSoNo: (value: string) => void;
}

const So0202 = ({ item, activeComp, leftMode, userInfo, handleAddMenuClick, setSoNo }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();

   const GridRef1 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);

   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);
   const searchRef5 = useRef<any>(null);
   const searchRef6 = useRef<any>(null);
   const searchRef7 = useRef<any>(null);

   const [gridDatas1, setGridDatas] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      startDate: date(-1, 'month'),
      endDate: date(),
      status: '999',
      mouYn: '999',
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "모니터링" }, { name: "조회" }, { name: "주문진행현황" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
   }, []);


   const setGridData = async () => {
      await fetchWithLoading(async () => {
         try {
            await MS0102_S01();
         } catch (error) {
            console.error("setGridData Error:", error);
         }
      });
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
          await MS0102_S01();
      };
  
      handleSearch();
  }, [inputValues.status, inputValues.startDate, inputValues.endDate, inputValues.mouYn]);

 
   //---------------------- api -----------------------------

   const MS0102_S01 = async () => {
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
         mouYn: inputValues.mouYn || '999',
         itemNm: searchRef7.current?.value || '999',
      };

      const data = JSON.stringify(param);
      const result = await fetchPost(`MS0102_S01`, { data });
      setGridDatas(result);
      return result;
   };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            await MS0102_S01();
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      await fetchWithLoading(async () => {      
         try {
            await MS0102_S01();
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
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
               <SelectSearch  title="지원대상&MOU" 
                  value={inputValues.mouYn}
                  onChange={(label, value) => {
                        onInputChange('mouYn', value);
                     }}                           

                  //초기값 세팅시
                  datas={[{value : '999', label : '전체'},{value : '1', label : 'Y'},{value : '0', label : 'N'}]}
            />
            <InputComp title="품목" ref={searchRef7} value={inputValues.itemNm} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('itemNm', e);
                     }} />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "진행상태", name: "poStatusNm", align: "center", width: 100},
      { header: "주문번호", name: "soNo", align: "center", width: 120},
      { header: "주문일시", name: "orderDt", align: "center", width: 140},
      { header: "구분", name: "rcptMeth", align: "center", width: 80 },
      { header: "접수자", name: "rcptUserNm", align: "center", width: 80 },
      { header: "고객사", name: "bpNm", width: 200 },
      { header: "재직구분", name: "subCodeNm", align: "left", width: 100 },
      { header: "부서", name: "deptNm", align: "left", width: 120 },
      { header: "직급", name: "roleNm", align: "left", width: 100 },
      { header: "신청사유", name: "hsNm", width: 150 },
      { header: "대상자", name: "ownNm", align: "center", width: 80 },
      { header: "주문자", name: "reqNm", align: "center", width: 80 },
      { header: "배송지", name: "dlvyNm", align: "left", width: 200 },
      { header: "호실", name: "roomNo", align: "left", width: 100 },
      { header: "고인명", name: "dNm", align: "center", width: 100 },
      { header: "품목", name: "itemNm", width: 300 },
      // { header: "결제금액", name: "payAmt", align: "right", width: 100, formatter: function(e: any) {if(e.value){return commas(e.value);}} },
      { header: "패키지 접수", name: "pkgYn", align: "center", width: 100 },
      { header: "패키지 결과", name: "resultPkgYn", align: "center", width: 100 },
      { header: "표준/예외", name: "dealType", align: "center", width: 100 },
      { header: "사전상담번호", name: "preRcptNo", align: "left", width: 100 },
      { header: "본부", name: "poBpNm", align: "left", width: 100 },
      { header: "팀장명", name: "empNm", align: "center", width: 100 },
      { header: "상품구분", name: "exDiv", align: "left", width: 100 },
      { header: "패키지명", name: "pkgName", align: "left", width: 100 },
      { header: "패키지금액", name: "pkgAmt", align: "right", width: 100, formatter: function(e: any) {if(e.value){return commas(e.value);}} },
      { header: "관계", name: "relationshipEmp", align: "left", width: 100 },
      { header: "상주명", name: "sangjuNm", align: "left", width: 100 },
      { header: "관리사명수", name: "staffCnt", align: "center", width: 100 },
      { header: "장지구분", name: "jangjiDiv", align: "left", width: 100 },
      { header: "화장장", name: "fhNm", align: "left", width: 200 },
      { header: "화장장 수기입력", name: "fhEtc", align: "left", width: 150 },
      { header: "장지", name: "jangji", align: "left", width: 200 },
      { header: "장지 수기입력", name: "jangjiEtc", align: "left", width: 150 },
      { header: "상조추천인", name: "referrer", align: "left", width: 100 },
      { header: "품목 기타", name: "mouEtc", align: "left", width: 100 },
      { header: "이미지 기타", name: "imageEtc", align: "left", width: 100 },
      { header: "별세일시", name: "dDt1", align: "left", width: 150 },
      { header: "입관일시", name: "dDt2", align: "left", width: 150 },
      { header: "발인일시", name: "dDt3", align: "left", width: 150 },
      { header: "근조도착시간", name: "dDt4", align: "left", width: 150 },
      { header: "근조기 설치시간", name: "dDt5", align: "left", width: 150 },
      { header: "지원대상&MOU", name: "supportDiv", align: "center", width: 120 },
      { header: "매출금액", name: "soAmt", align: "right", width: 100, formatter: function(e: any) {if(e.value){return commas(e.value);}} },
       { header: "발주금액", name: "purchaseAmt", align: "right", width: 100, formatter: function(e: any) {if(e.value){return commas(e.value);}} },
      { header: "계산서입금일", name: "chkReceiptDt", align: "center", width: 120 },
      { header: "카드입금일", name: "chkCardtDt", align: "center", width: 120 },
      { header: "현금입금일", name: "chkCashDt", align: "center", width: 120 },
      { header: "무상사유", name: "reason", width: 200 },
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

         <TuiGrid01 columns={grid1Columns} gridRef={GridRef1} height={window.innerHeight-540} handleDblClick={handleDblClick}/>
      </div>
   );

   const handleDblClick = (e:any) => {
      //주문 상세 화면으로 이동
      const menu: ZZ_MENU_RES = {
         menuId: "3021", // 메뉴 ID
         paMenuId: "3020", // 부모 메뉴 ID (상위 메뉴)
         menuName: "주문 등록", // 메뉴 이름
         description: "", // 메뉴 설명
         prgmId: "SO0201", // 프로그램 ID
         prgmFullPath: "so/So0201", // 프로그램 전체 경로
         prgmPath: "", // 프로그램 폴더 경로
         prgmFileName: "", // 프로그램 파일명
         menuOrdr: "03000 >> 13020 >> 13021", // 메뉴 순서 (상위 메뉴 내 정렬)
         remark: "", // 비고 (추가 설명)
         icon: "", // 아이콘 (사용할 아이콘 이름)
         useYn: "Y", // 사용 여부 ("Y": 사용, "N": 미사용)
         lev: 2, // 메뉴 레벨 (2단계 메뉴)
         zMenuOrdr: "1", // 추가적인 메뉴 정렬 순서
         status: "S"  ,
         menuDiv: ""
      };

      //주문번호를 상위 컴포넌트로 전달
      const grid = GridRef1.current.getInstance();
      const rowData = grid.getRow(e.rowKey);

      setSoNo(rowData.soNo);
      handleAddMenuClick(menu);
    
   }

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
         <div className="w-full h-full md:flex p-2 md:space-x-2 md:space-y-0 space-y-2">
            <div className="w-full" ref={gridGridContainerRef}>{Grid1()}</div>
         </div>
      </div>
   );
};

export default So0202;
