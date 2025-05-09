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

const Zz0302 = ({ item, activeComp, leftMode, userInfo, handleAddMenuClick, setSoNo }: Props) => {
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

   const [gridDatas1, setGridDatas] = useState<any[]>();

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      status: '999',
      coCd: userInfo.coCd || '999',
      usrDiv: '999',
      bpNm: '999',
      useYn: '999',
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   const breadcrumbItem = [{ name: "관리자" }, { name: "사용자" }, { name: "사용자 조회" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
   }, []);


   const setGridData = async () => {
      await fetchWithLoading(async () => {
         try {
            await ZZ0301_S01();
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
          await ZZ0301_S01();
      };
  
      handleSearch();
  }, [inputValues.coCd, inputValues.usrDiv, inputValues.bpNm, inputValues.useYn]);

 
   //---------------------- api -----------------------------

   const ZZ0301_S01 = async () => {
      const param = {
         coCd:  inputValues.coCd,
         usrId:  "999",
         usrNm:  inputValues.usrNm || "999",
         usrDiv: inputValues.usrDiv || "999",
         sysDiv: "999",
         bpNm:  inputValues.bpNm || "999",
         useYn: inputValues.useYn || "999"
      };

      const data = JSON.stringify(param);
      const result = await fetchPost(`ZZ0301_S01`, { data });
      setGridDatas(result);
      return result;
   };

   //-------------------event--------------------------

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            await ZZ0301_S01();
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = async () => {
      await fetchWithLoading(async () => {      
         try {
            await ZZ0301_S01();
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
            <SelectSearch
                       title="사업부서"
                       value={inputValues.coCd}
                       onChange={(label, value) => {
                           onInputChange("coCd", value);
                       }}

                       stringify={true}

                       param={{ coCd: userInfo.coCd }}
                       procedure="ZZ_B_BIZ"
                       dataKey={{ label: "bpNm", value: "coCd" }}
                   />
            <InputComp title="사용자명" ref={searchRef2} value={inputValues.usrNm} handleCallSearch={handleCallSearch} 
                          onChange={(e)=>{
                          onInputChange('usrNm', e);
                     }} />
            <SelectSearch
                       title="사용자구분"
                       value={inputValues.usrDiv}
                       onChange={(label, value) => {
                           onInputChange("usrDiv", value);
                       }}

                       param={{ coCd: "999", majorCode: "ZZ0002", div: '999' }}
                       procedure="ZZ_CODE"
                       dataKey={{ label: "codeName", value: "code" }}
                   />
            <SelectSearch
                       title="소속"
                       value={inputValues.bpNm}
                       onChange={(label, value) => {
                           onInputChange("bpNm", value);
                       }}

                       stringify={true}
                       addData={'999'}

                       param={{ coCd: inputValues.coCd, bpNm: "999", bpType: "999", useYn: "Y", }}
                       procedure="MM0101_S01"
                       dataKey={{ label: "bpNm", value: "bpCd" }}
                   />
            <SelectSearch
                       title="사용유무"
                       value={inputValues.useYn}
                       onChange={(label, value) => {
                           onInputChange("useYn", value);
                       }}

                       datas={[{value : '999', label : '전체'},{value : 'Y', label : '사용'},{value : 'N', label : '미사용'}]}
                   />
         </div>
      </div>
   );

   //-------------------grid----------------------------

   const grid1Columns = [
      { header: "사번", name: "usrId", width: 130 },
      { header: "이름", name: "usrNm", width: 150 },
      { header: "사용자구분", name: "usrDivNm" },
      { header: "소속", name: "bpNm" },
      { header: "이메일", name: "email", hidden: false, width: 230 },
      { header: "알림톡 발송여부", name: "alarmDivNm", hidden: false, width: 130 },
      { header: "담당자 여부", name: "alarmYnNm", hidden: false, width: 130 },
      { header: "사용여부", name: "useYn", align: 'center', hidden: true },
      { header: "회사구분", name: "coCd", hidden: true },
      { header: "등록일", name: "insrtDt", hidden: true },
      { header: "수정일", name: "updtDt", hidden: true },
      { header: "등록자", name: "insrtUserId", hidden: true },
      { header: "수정자", name: "updtUserId", hidden: true },
      { header: "", name: "isNew", hidden: true },
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

export default Zz0302;
