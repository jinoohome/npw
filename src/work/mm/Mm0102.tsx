import { useEffect, useState, useRef,  initChoice, updateChoices,  fetchPost, Breadcrumb, TuiGrid01, getGridDatas, refreshGrid, reSizeGrid,  InputComp1, SelectComp1 } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo : any;
}

const Mm0102 = ({ item, activeComp, userInfo }: Props) => {
   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null); 

   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);

   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();

   const [gridDatas, setGridDatas] = useState<any[]>();
   const [zz0005, setZz0005] = useState<ZZ_CODE_RES[]>([]);

   const breadcrumbItem = [{ name: "관리자" }, { name: "거래처관리" }, { name: "거래처 조회" }];

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   const setChoiceUI = () => {
      initChoice(searchRef2, setChoice1);
      initChoice(searchRef3, setChoice2, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);
   };

   const setGridData = async () => {
      try {
         let zz0005Data = await ZZ_CODE({ coCd: "999", majorCode: "ZZ0005", div: "999" });
 
         if (zz0005Data != null) {
            setZz0005(zz0005Data);
         }
         await MM0102_S01();
      } catch (error) {
         console.error("setGridData Error:", error);
      }
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
         grid.resetData((gridDatas));
         if (gridDatas.length > 0) {
            // grid.focusAt(focusRow, 0, true);
         }
      }
   }, [gridDatas]);

   //inputChoicejs 데이터 설정
   useEffect(() => {
      updateChoices(choice1, zz0005, "value", "text");
   }, [zz0005]);

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

   const MM0102_S01 = async () => {
      try {
         const param = {
            //coCd: userInfo.coCd,
            coCd: "100",
            bpNm: searchRef1.current?.value || "999",
            bpType: searchRef2.current?.value || "999",
            useYn: searchRef3.current?.value || "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0102_S01`, { data });
         setGridDatas(result);
         return result;
      } catch (error) {
         console.error("MM0102_S01 Error:", error);
         throw error;
      }
   };
  
 
   
   //-------------------event--------------------------
   const search = () => {
      setGridData();
   };

   

   //grid 포커스변경시
   const handleFocusChange = async ({ rowKey }: any) => {
      if (rowKey !== null && gridRef.current) {
         const grid = gridRef.current.getInstance();
         const rowData = grid.getRow(rowKey);

         if (rowData) {
            Object.entries(rowData).forEach(([key, value]) => {});
         }
      }
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
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3  gap-y-3  justify-start w-[60%]">
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="회사약명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="회사구분" handleCallSearch={handleCallSearch}></SelectComp1>
            <SelectComp1 ref={searchRef3} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
          
         </div>
      </div>
   );

   //-------------------grid----------------------------
   const columns = [
      { header: "사업부서", name: "coCd", hidden: true },
      { header: "회사코드", name: "bpCd", width: 100, align: "center" },
      { header: "그룹사코드", name: "paCoCd", hidden: true },
      { header: "회사명", name: "bpFullNm", width: 200 },
      { header: "회사약명", name: "bpNm", width: 200 },
      { header: "회사구분", name: "bpType", align: "center", width: 120 },
      { header: "회사종류", name: "bpDiv", align: "center", width: 120 },
      { header: "대표자", name: "repreNm", width: 120 },
      { header: "사업자등록번호", name: "bpRgstNo", width: 130 },
      { header: "업종", name: "indType" , width: 100},
      { header: "업태", name: "cndType" , width: 100},
      { header: "우편번호", name: "zipCd", align:"center" , width: 80},
      { header: "주소1", name: "addr1" , width: 200},
      { header: "주소2", name: "addr2" , width: 200},
      { header: "연락처", name: "telNo" , width: 120},
      { header: "연락처2", name: "telNo2" , width: 120},
      { header: "", name: "bankCd", hidden: true },
      { header: "", name: "bankAcctNo", hidden: true },
      { header: "", name: "bankHolder", hidden: true },
      { header: "사용여부", name: "useYn", hidden: true },
   ];

   const grid = () => (
      <div className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">거래처 조회</div>
            </div>            
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={handleFocusChange} perPageYn={false} height={window.innerHeight - 440} />
      </div>
   );

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = () => {
      setGridData();
   };

   return (
      <div className={`space-y-5 overflow-y-auto `}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
            <div>{searchDiv()}</div>
         </div>
         <div className="w-full h-full flex space-x-2 p-2">
            <div className="w-full" ref={gridContainerRef}>{grid()}</div>
         </div>
      </div>
   );
};

export default Mm0102;
