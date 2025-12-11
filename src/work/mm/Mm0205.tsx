import { React, useEffect, useState, useRef, commas, useCallback, initChoice, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, reSizeGrid, refreshGrid, getGridDatas, InputComp1, InputComp2, SelectComp1, SelectComp2, CommonModal } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { XMarkIcon, SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import ChoicesEditor from "../../util/ChoicesEditor";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo : any;
}

const Mm0205 = ({ item, activeComp, leftMode, userInfo }: Props) => {
   const GridRef1 = useRef<any>(null);
   const GridRef2 = useRef<any>(null);
   const GridRef3 = useRef<any>(null);
   const GridRef4 = useRef<any>(null);
   const GridRef5 = useRef<any>(null);

   const gridGridContainerRef = useRef(null);
   const grid2GridContainerRef = useRef(null);
   const grid4GridContainerRef = useRef(null);

   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const searchRef3 = useRef<any>(null);
   const searchRef4 = useRef<any>(null);
   const searchRef5 = useRef<any>(null);
   const searchRef6 = useRef<any>(null);
   const searchRef7 = useRef<any>(null);
   
   const [gridDatas1, setGridDatas] = useState<any[]>();
   const [gridDatas2, setGridDatas2] = useState<any[]>();
   const [gridDatas3, setGridDatas3] = useState<any[]>();
   const [gridDatas4, setGridDatas4] = useState<any[]>();
   const [gridDatas5, setGridDatas5] = useState<any[]>();
   
   const [focusRow, setFocusRow] = useState<any>(0);
   const [tabIndex, setTabIndex] = useState(0);
   
   const [searchChoices, setSearchChoices] = useState<{ [key: string]: any }>({});
   const [choice1, setChoice1] = useState<any>();

   const breadcrumbItem = [{ name: "기준정보" }, { name: "품목" }, { name: "패키지 품목 등록" }];

   const [isOpen, setIsOpen] = useState(false);
   const [isCustModalOpen, setIsCustModalOpen] = useState(false);
   const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
   const [selectedItems, setSelectedItems] = useState<any[]>([]);

   const [cd0004, setCd0004] = useState<ZZ_CODE_RES[]>([]);
   const [cd0005, setCd0005] = useState<ZZ_CODE_RES[]>([]);
   const [cd0006, setCd0006] = useState<ZZ_CODE_RES[]>([]);

   const { fetchWithLoading } = useLoadingFetch();

   useEffect(() => {
      setChoiceUI();
      setGridData();
      reSizeGrid({ ref: GridRef1, containerRef: gridGridContainerRef, sec: 200 });
      reSizeGrid({ ref: GridRef2, containerRef: grid2GridContainerRef, sec: 200 });
      reSizeGrid({ ref: GridRef4, containerRef: grid4GridContainerRef, sec: 200 });
      
  
   }, []);

   const setChoiceUI = () => {
      initChoice(searchRef2, setChoice1, [
         { value: "999", label: "전체", selected: true },
         { value: "Y", label: "사용" },
         { value: "N", label: "미사용" },
      ]);

      initChoice(searchRef4, (choice) => setSearchChoices((prev) => ({ ...prev, itemGrp: choice })));
      initChoice(searchRef5, (choice) => setSearchChoices((prev) => ({ ...prev, itemDiv: choice })));
      initChoice(searchRef7, (choice) => setSearchChoices((prev) => ({ ...prev, bpType: choice })));
   };

   const setGridData = async () => {
      await fetchWithLoading(async () => {
         try {
            const grid1Result = await MM0205_S01();
            if (grid1Result?.length) {
               const firstRow = grid1Result[0];
               await MM0205_S02({ pkgItemCd: firstRow.pkgItemCd });
               await MM0205_S03({ coCd: firstRow.coCd, pkgItemCd: firstRow.pkgItemCd });
            }

            let cd0004Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0004", div: "999" });
            if (cd0004Data != null) {
               setCd0004(cd0004Data);
            }

            let cd0005Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0005", div: "999" });
            if (cd0005Data != null) {
               setCd0005(cd0005Data);
            }

            let cd0006Data = await ZZ_CODE({ coCd: "999", majorCode: "CD0006", div: "999" });
            if (cd0006Data != null) {
               setCd0006(cd0006Data);
            }

         } catch (error) {
            console.error("setGridData Error:", error);
         }
      });
   };

   useEffect(() => {
      refreshGrid(GridRef1);
      refreshGrid(GridRef2);
      refreshGrid(GridRef4);
   
   }, [activeComp, leftMode]);

   useEffect(() => {
      if (GridRef1.current && gridDatas1) {
         let grid1 = GridRef1.current.getInstance();
         grid1.resetData(gridDatas1);

         let focusRowKey = grid1.getFocusedCell()?.rowKey || 0;

         if (gridDatas1.length > 0) {
            grid1.focusAt(focusRowKey, 0, true);
         }
      } else if (GridRef2.current) {
         GridRef2.current.getInstance().clear();
      }
   }, [gridDatas1]);

   useEffect(() => {
      if (GridRef2.current && gridDatas2) {
         let grid2 = GridRef2.current.getInstance();
         grid2.resetData(gridDatas2);

         let focusRowKey = grid2.getFocusedCell().rowKey || 0;

         if (gridDatas2.length > 0) {
            grid2.focusAt(focusRowKey, 0, true);
         }
      }
   }, [gridDatas2]);

   useEffect(() => {
      if (GridRef3.current && gridDatas3) {
         let grid3 = GridRef3.current.getInstance();
         grid3.resetData(gridDatas3);

         let focusRowKey = grid3.getFocusedCell().rowKey || 0;

         if (gridDatas3.length > 0) {
            grid3.focusAt(focusRowKey, 0, true);
         }
         
      }
   }, [gridDatas3]);

   useEffect(() => {
      if (GridRef4.current && gridDatas4) {
         let grid4 = GridRef4.current.getInstance();
         grid4.resetData(gridDatas4);

         let focusRowKey = grid4.getFocusedCell()?.rowKey || 0;

         if (gridDatas4.length > 0) {
            grid4.focusAt(focusRowKey, 0, true);
         }
      }
   }, [gridDatas4]);

   useEffect(() => {
      updateChoices(searchChoices.itemGrp, cd0004, "value", "text");
   }, [cd0004]);

   useEffect(() => {
      updateChoices(searchChoices.itemDiv, cd0005, "value", "text");
   }, [cd0005]);

   useEffect(() => {
      updateChoices(searchChoices.bpType, cd0006, "value", "text");
   }, [cd0006]);

   useEffect(() => {
      if (GridRef5.current && gridDatas5) {
         let grid5 = GridRef5.current.getInstance();
         grid5.resetData(gridDatas5);

         let focusRowKey = grid5.getFocusedCell()?.rowKey || 0;

         if (gridDatas5.length > 0) {
            grid5.focusAt(focusRowKey, 0, true);
         }
      }
   }, [gridDatas5]);

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

   const MM0205_S01 = async () => {
      const param = {
         coCd: userInfo.coCd,
         pkgName: searchRef1.current?.value || '999',
         useYn: searchRef2.current?.value || '999',
      };
   
      const data = JSON.stringify(param);
      const result = await fetchPost(`MM0205_S01`, { data });
   
      setGridDatas(result);

      if (!result || result.length === 0) {
         GridRef2.current?.getInstance().clear();
      }
   
      return result;
   };
   

   const MM0205_S02 = async (param: { pkgItemCd: string }) => {
      const result2 = await fetchPost(`MM0205_S02`, param);
      setGridDatas2(result2);
   };

   const MM0205_S03 = async (param: { coCd: string; pkgItemCd: string }) => {
      const data = JSON.stringify(param);
      const result3 = await fetchPost(`MM0205_S03`, { data });
      setGridDatas4(result3);
   };

   const MM0205_U05 = async () => {
      try {
         const data = await getGridValues();
         console.log(data);
         const result = await fetchPost(`MM0205_U05`, data);
         return result as any;
      } catch (error) {
         console.error("MM0205_U05 Error:", error);
         throw error;
      }
   };

   const MM0205_P01 = async () => {
      try {
         const param = {
            coCd: userInfo.coCd,
            bpNm: searchRef6.current?.value || "999",
            bpType: "999",
            useYn: "Y",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0205_P01`, { data });
         setGridDatas5(result);

         return result;
      } catch (error) {
         console.error("MM0205_P01 Error:", error);
         throw error;
      }
   };

   const MM0201_S01 = async () => {
      try {
         const param = {
            coCd: "100",
            itemNm: searchRef3.current?.value || "999",
            itemGrp: searchRef4.current?.value || "999",
            itemDiv: searchRef5.current?.value || "999",
            pkgItemYn: "Y",
            subsYn:  "999",
            deduYn:  "999",
            useYn: 'Y',
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`MM0202_S01`, { data });
         setGridDatas3(result);

         return result;
      } catch (error) {
         console.error("MM0201_S01 Error:", error);
         throw error;
      }
   };

   const search = () => {
      setGridData();
   };

   const save = async () => {
      await fetchWithLoading(async () => {
         let result = await MM0205_U05();
         if (result) {
            returnResult(result);
         }
      });
   };
   const returnResult = async(result: any) => {
      alertSwal(result.msgText, result.msgCd, result.msgStatus);
      setGridData();
   };

   const getGridValues = async () => {
      let grid1Data = await getGridDatas(GridRef1);
      let grid2Data = await getGridDatas(GridRef2);
      let grid4Data = await getGridDatas(GridRef4);

      let data = {
         pkgHdr: JSON.stringify(grid1Data),
         pkgDtl: JSON.stringify(grid2Data),
         pkgCust: JSON.stringify(grid4Data),
         menuId: activeComp.menuId,
         insrtUserId: userInfo.usrId,
      };

      return data;
   };

   const addMajorGridRow = () => {
      let grid1 = GridRef1.current.getInstance();
      let grid2 = GridRef2.current.getInstance();

      grid1.appendRow({}, { focus: true, at:0 });
      let { rowKey } = GridRef1.current.getInstance().getFocusedCell();
      grid1.setValue(rowKey, "coCd", userInfo.coCd, false);
      grid1.setValue(rowKey, "useYn", "Y", false);
      grid1.setValue(rowKey, "status", "I", false);

      grid2.clear();
   };

   const delMajorGridRow = () => {
      let grid = GridRef1.current.getInstance();      

      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);
      
      // 행을 삭제
      grid.removeRow(rowKey, {});

      // 남은 행이 있는 경우에만 포커스를 맞춤
      if (grid.getRowCount() > 0) {
         grid.focusAt(rowIndex, 1, true);
      }
   };

   const addMinorGridRow = () => {
      let gridRef1 = GridRef1.current.getInstance();
      let inPkgItemCd = gridRef1.getValue(gridRef1.getFocusedCell().rowKey, "pkgItemCd");

      if (!inPkgItemCd) {
         let title = "패키지 미등록";
         let msg = "패키지 먼저 저장 후에 추가해 주세요";
         alertSwal(title, msg, "warning");
         return;
      }

      openModal();
   };

   const delMinorGridRow = () => {
      let grid = GridRef2.current.getInstance();      

      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);
      
      // 행을 삭제
      grid.removeRow(rowKey, {});

      // 남은 행이 있는 경우에만 포커스를 맞춤
      if (grid.getRowCount() > 0) {
         grid.focusAt(rowIndex, 1, true);
      }
   };

   const handleMajorFocusChange = async ({ rowKey }: any) => {
      if (rowKey === null) {
         rowKey = 0;
     }

      let grid1 = GridRef1.current.getInstance();
      let grid1Row = grid1.getRow(rowKey);
      let pkgItemCd = grid1Row.pkgItemCd;
      let coCd = grid1Row.coCd;
      if (pkgItemCd) {
         await MM0205_S02({ pkgItemCd: pkgItemCd });
         await MM0205_S03({ coCd: coCd, pkgItemCd: pkgItemCd });
      } else {
         GridRef2.current.getInstance().clear();
         GridRef4.current.getInstance().clear();
      }
   };

   const handleTabIndex = (index: number) => {
      setTabIndex(index);
   };

   const addCustomerGridRow = () => {
      let grid1 = GridRef1.current.getInstance();
      let focusedCell = grid1.getFocusedCell();
      
      if (!focusedCell) {
         let title = "행 선택 필요";
         let msg = "패키지를 먼저 선택해 주세요";
         alertSwal(title, msg, "warning");
         return;
      }
      
      let grid1Row = grid1.getRow(focusedCell.rowKey);
      let pkgItemCd = grid1Row.pkgItemCd;

      if (!pkgItemCd) {
         let title = "패키지 미등록";
         let msg = "패키지 먼저 저장 후에 추가해 주세요";
         alertSwal(title, msg, "warning");
         return;
      }

      openCustomerModal();
   };

   const delCustomerGridRow = () => {
      let grid = GridRef4.current.getInstance();      

      let rowKey = grid.getFocusedCell() ? grid.getFocusedCell().rowKey : 0;
      let rowIndex = grid.getIndexOfRow(rowKey) > grid.getRowCount() - 2 ? grid.getRowCount() - 2 : grid.getIndexOfRow(rowKey);
      
      // 행을 삭제
      grid.removeRow(rowKey, {});

      // 남은 행이 있는 경우에만 포커스를 맞춤
      if (grid.getRowCount() > 0) {
         grid.focusAt(rowIndex, 1, true);
      }
   };

   const handleClick = (ev: any) => {
      const { rowKey, columnName } = ev;

      // 체크박스 컬럼 클릭은 무시 (자동으로 처리됨)
      if (columnName === '_checked') return;

      const grid3 = GridRef3.current.getInstance();
      const isChecked = grid3.getCheckedRows().some((row: any) => row.rowKey === rowKey);

      // Toggle the checkbox state by using check and uncheck methods
      if (isChecked) {
         grid3.uncheck(rowKey);
      } else {
         grid3.check(rowKey);
      }
   };

   const handleItemCheck = (ev: any) => {
      if (!GridRef3.current) return;

      const grid3 = GridRef3.current.getInstance();
      const checkedRows = grid3.getCheckedRows();
      const allRows = grid3.getData();
      
      // 현재 그리드에 있는 품목 코드들
      const currentGridItemCds = new Set(allRows.map((row: any) => row.itemCd));
      
      // 기존 선택 중 현재 그리드에 없는 것들 (다른 검색 결과에서 선택한 것들)
      const previousSelections = selectedItems.filter(item => !currentGridItemCds.has(item.itemCd));
      
      // 현재 그리드에서 체크된 것들
      const currentSelections = checkedRows
         .filter((row: any) => row.itemCd && row.itemNm)
         .map((row: any) => ({ itemCd: row.itemCd, itemNm: row.itemNm }));
      
      // 합치고 중복 제거
      const combined = [...previousSelections, ...currentSelections];
      const uniqueItems = Array.from(
         new Map(combined.map(item => [item.itemCd, item])).values()
      );
      
      setSelectedItems(uniqueItems);
   };

   const removeSelectedItem = (itemCd: string) => {
      if (!GridRef3.current) return;

      const grid3 = GridRef3.current.getInstance();
      const allRows = grid3.getData();
      const targetRow = allRows.find((row: any) => row.itemCd === itemCd);
      
      if (targetRow) {
         grid3.uncheck(targetRow.rowKey);
      }
      
      setSelectedItems(prev => prev.filter(item => item.itemCd !== itemCd));
   };

   const handleAfterChange = (ev: any) => {
      const changesArray = ev.changes; // ev.changes가 배열이므로 이를 사용
      
      // 배열을 순회하며 변경 사항 처리
      changesArray.forEach((change: any) => {   
         const gridInstance1 = GridRef1.current.getInstance();
         
         // 현재 변경된 값이 pkgAmt일 때만 처리
         if (change.columnName === "pkgAmt") {
            const rowKey = change.rowKey;
            const value = change.value; // 변경된 값을 가져옴
   
            // 숫자가 아닌 문자를 제거하여 정제
            const sanitizedValue = typeof value === 'string' ? value.replace(/[^0-9.-]/g, '') : value;
   
            // 정제 후 숫자가 아니거나 빈 문자열일 경우 0으로 설정
            const numericValue = (sanitizedValue === '' || isNaN(Number(sanitizedValue))) ? 0 : Number(sanitizedValue);
   
            // 그리드의 데이터 값을 정제된 숫자 값으로 설정
            gridInstance1.setValue(rowKey, change.columnName, numericValue);
         }
      });
   };

   const handleAfterChange2 = (ev: any) => {
      const changesArray = ev.changes;
      
      changesArray.forEach((change: any) => {   
         const gridInstance2 = GridRef2.current.getInstance();
         
         // itemAmt 변경 시 처리
         if (change.columnName === "itemAmt") {
            const rowKey = change.rowKey;
            const value = change.value;
   
            // 숫자가 아닌 문자를 제거하여 정제
            const sanitizedValue = typeof value === 'string' ? value.replace(/[^0-9.-]/g, '') : value;
   
            // 정제 후 숫자가 아니거나 빈 문자열일 경우 0으로 설정
            const numericValue = (sanitizedValue === '' || isNaN(Number(sanitizedValue))) ? 0 : Number(sanitizedValue);
   
            gridInstance2.setValue(rowKey, change.columnName, numericValue);
         }
      });
   };

   const handleCallSearch = async () => {
      const grid1Result = await MM0205_S01();
      if (grid1Result?.length) {
         await MM0205_S02({ pkgItemCd: grid1Result[0].pkgItemCd });
      }
   };

   const handleCallSearchModal = async () => {
      await MM0201_S01();
      
      // 검색 후 이전에 선택된 항목들을 다시 체크
      setTimeout(() => {
         if (GridRef3.current && selectedItems.length > 0) {
            const grid3 = GridRef3.current.getInstance();
            const allRows = grid3.getData();
            allRows.forEach((row: any) => {
               const isSelected = selectedItems.some(item => item.itemCd === row.itemCd);
               if (isSelected) {
                  grid3.check(row.rowKey);
               }
            });
         }
      }, 100);
   };

   const handleDblClick = (ev: any) => {
      const { rowKey } = ev;
  
      const grid3 = GridRef3.current.getInstance();
      const rowData3 = grid3.getRow(rowKey);
  
      const grid1 = GridRef1.current.getInstance();
      const rowData1 = grid1.getRow(grid1.getFocusedCell().rowKey);
  
      const grid2 = GridRef2.current.getInstance();
      const existingItemCds = new Set(grid2.getData().map((row: any) => row.itemCd));
  
      // grid2의 모든 행에서 sort 값을 가져와 그 중 최대 값을 찾음
      const maxSort = Math.max(...grid2.getData().map((row: any) => row.sort || 0), 0);
  
      if (!existingItemCds.has(rowData3.itemCd)) {  // itemCd 중복 확인
          const newRow = {
              coCd: rowData1.coCd,
              pkgItemCd: rowData1.pkgItemCd,
              itemCd: rowData3.itemCd,
              itemNm: rowData3.itemNm,
              sort: maxSort + 1,
              useYn: "Y",
              status: "I"
          };
  
          grid2.appendRow(newRow, { focus: true });
      }
  
      setIsOpen(false);
  };
  
  

   const openModal = async() => {
      setIsOpen(true);
      setSelectedItems([]);
      await MM0201_S01();
      
      setTimeout(() => {
         refreshGrid(GridRef3);
      }, 100);
   };
  
   const closeModal = () => {
      setIsOpen(false);
      setSelectedItems([]);
   };

   const openCustomerModal = async () => {
      setIsCustModalOpen(true);
      setSelectedCustomers([]);
      await MM0205_P01();
      
      setTimeout(() => {
         refreshGrid(GridRef5);
      }, 100);
   };

   const closeCustomerModal = () => {
      setIsCustModalOpen(false);
      setSelectedCustomers([]);
   };

   const handleCallSearchCustomer = async () => {
      await MM0205_P01();
      
      // 검색 후 이전에 선택된 항목들을 다시 체크
      setTimeout(() => {
         if (GridRef5.current && selectedCustomers.length > 0) {
            const grid5 = GridRef5.current.getInstance();
            const allRows = grid5.getData();
            allRows.forEach((row: any) => {
               const isSelected = selectedCustomers.some(c => c.bpCd === row.bpCd);
               if (isSelected) {
                  grid5.check(row.rowKey);
               }
            });
         }
      }, 100);
   };


   const handleCustomerClick = (ev: any) => {
      const { rowKey, columnName } = ev;

      // 체크박스 컬럼 클릭은 무시 (자동으로 처리됨)
      if (columnName === '_checked') return;

      if (!GridRef5.current) return;

      const grid5 = GridRef5.current.getInstance();
      const rowData = grid5.getRow(rowKey);
      
      if (!rowData || !rowData.bpCd) return;

      const isChecked = grid5.getCheckedRows().some((row: any) => row.rowKey === rowKey);

      if (isChecked) {
         grid5.uncheck(rowKey);
      } else {
         grid5.check(rowKey);
      }
   };

   const handleCheckboxChange = (ev: any) => {
      if (!GridRef5.current) return;

      const grid5 = GridRef5.current.getInstance();
      const checkedRows = grid5.getCheckedRows();
      const allRows = grid5.getData();
      
      // 현재 그리드에 있는 고객사 코드들
      const currentGridBpCds = new Set(allRows.map((row: any) => row.bpCd));
      
      // 기존 선택 중 현재 그리드에 없는 것들 (다른 검색 결과에서 선택한 것들)
      const previousSelections = selectedCustomers.filter(c => !currentGridBpCds.has(c.bpCd));
      
      // 현재 그리드에서 체크된 것들
      const currentSelections = checkedRows
         .filter((row: any) => row.bpCd && row.bpNm)
         .map((row: any) => ({ bpCd: row.bpCd, bpNm: row.bpNm }));
      
      // 합치고 중복 제거
      const combined = [...previousSelections, ...currentSelections];
      const uniqueCustomers = Array.from(
         new Map(combined.map(c => [c.bpCd, c])).values()
      );
      
      setSelectedCustomers(uniqueCustomers);
   };

   const removeSelectedCustomer = (bpCd: string) => {
      if (!GridRef5.current) return;

      const grid5 = GridRef5.current.getInstance();
      const allRows = grid5.getData();
      const targetRow = allRows.find((row: any) => row.bpCd === bpCd);
      
      if (targetRow) {
         grid5.uncheck(targetRow.rowKey);
      }
      
      setSelectedCustomers(prev => prev.filter(c => c.bpCd !== bpCd));
   };

   const handleCustomerDblClick = (ev: any) => {
      const { rowKey } = ev;
  
      if (!GridRef5.current || !GridRef1.current || !GridRef4.current) return;

      const grid5 = GridRef5.current.getInstance();
      const rowData5 = grid5.getRow(rowKey);

      if (!rowData5 || !rowData5.bpCd) return;
  
      const grid1 = GridRef1.current.getInstance();
      const focusedCell = grid1.getFocusedCell();
      
      if (!focusedCell) return;
      
      const rowData1 = grid1.getRow(focusedCell.rowKey);
  
      const grid4 = GridRef4.current.getInstance();
      const existingBpCds = new Set(grid4.getData().map((row: any) => row.bpCd).filter(Boolean));
  
      if (!existingBpCds.has(rowData5.bpCd)) {
          const newRow = {
              coCd: rowData1.coCd,
              pkgItemCd: rowData1.pkgItemCd,
              bpCd: rowData5.bpCd,
              bpNm: rowData5.bpNm,
              useYn: "Y",
              status: "I"
          };
  
          grid4.appendRow(newRow, { focus: true });
      }
  
      setIsCustModalOpen(false);
      setSelectedCustomers([]);
   };

   const addCustomers = () => {
      if (!GridRef1.current || !GridRef4.current || !GridRef5.current) return;

      const grid1 = GridRef1.current.getInstance();
      const focusedCell = grid1.getFocusedCell();
      
      if (!focusedCell) return;
      
      const rowData1 = grid1.getRow(focusedCell.rowKey);

      const grid5 = GridRef5.current.getInstance();
      const checkedRows = grid5.getCheckedRows();
  
      const grid4 = GridRef4.current.getInstance();
      const existingBpCds = new Set(grid4.getData().map((row: any) => row.bpCd).filter(Boolean));
  
      checkedRows.forEach((row: any) => {
          if (row.bpCd && !existingBpCds.has(row.bpCd)) {
              const newRow = {
                  coCd: rowData1.coCd,
                  pkgItemCd: rowData1.pkgItemCd,
                  bpCd: row.bpCd,
                  bpNm: row.bpNm,
                  useYn: "Y",
                  status: "I"
              };
  
              grid4.appendRow(newRow, { focus: true });
          }
      });
  
      closeCustomerModal();
   };

   const handleCustomerCheck = (ev: any) => {
      handleCheckboxChange(ev);
   };

   const addItems = () => {
      const grid1 = GridRef1.current.getInstance();
      const rowData1 = grid1.getRow(grid1.getFocusedCell().rowKey);

      const grid3 = GridRef3.current.getInstance();
      const checkedRows = grid3.getCheckedRows();
  
      const grid2 = GridRef2.current.getInstance();
      const existingItemCds = new Set(grid2.getData().map((row: any) => row.itemCd));
  
      // grid2의 모든 행에서 sort 값을 가져와 그 중 최대 값을 찾음
      let maxSort = Math.max(...grid2.getData().map((row: any) => row.sort || 0), 0);
  
      checkedRows.forEach((row: any) => {
          if (!existingItemCds.has(row.itemCd)) {  // itemCd 중복 확인
              const newRow = {
                  coCd: rowData1.coCd,
                  pkgItemCd: rowData1.pkgItemCd,
                  itemCd: row.itemCd,
                  itemNm: row.itemNm,
                  sort: ++maxSort,  // 각 행에 대해 sort 값을 1씩 증가시킴
                  useYn: "Y",
                  status: "I"
              };
  
              grid2.appendRow(newRow, { focus: true });
          }
      });
  
      closeModal();
  };
   
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

   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm">
         <div className="grid gap-y-3  justify-start w-[80%]  2xl:w-[60%]  xl:grid-cols-3 md:grid-cols-2">
            <InputComp1 ref={searchRef1} handleCallSearch={handleCallSearch} title="패키지명"></InputComp1>
            <SelectComp1 ref={searchRef2} title="사용유무" handleCallSearch={handleCallSearch}></SelectComp1>
         </div>
      </div>
   );

   const modalSearchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-3  gap-y-3  justify-start w-[80%]">
               <InputComp1 ref={searchRef3} handleCallSearch={handleCallSearchModal} title="품목명"></InputComp1>
               <SelectComp1 ref={searchRef4} title="품목그룹" handleCallSearch={handleCallSearchModal}></SelectComp1>
               <SelectComp1 ref={searchRef5} title="품목구분" handleCallSearch={handleCallSearchModal}></SelectComp1>
            </div>
            <div className="w-[20%] flex justify-end">
               <button type="button" onClick={handleCallSearchModal} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>
         </div>
      </div>
   );

   const ModalDiv = () => (
      <CommonModal isOpen={isOpen} onClose={closeModal} title="품목등록">
         {modalSearchDiv()}
         {Grid3()}
      </CommonModal>
   );  

   const grid1Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "패키지 코드", name: "pkgItemCd", align: "center", width: 100 },
      { header: "패키지명", name: "pkgName", align: "left", editor: "text", width: 330 },
      { header: "금액", name: "pkgAmt", align: "right", editor: "text", width: 100,
         formatter: function(e: any) {
            if(e.value){return commas(e.value);}
         }
       },
      {
         header: "필수체크",
         name: "mandatoryYn",
         align: "center",
         formatter: "listItemText", 
         width: 100,         
         editor: {
            type: "select",
            options: {
               listItems: [
                  { text: "Y", value: "Y" },
                  { text: "N", value: "N" },
               ],
            },
         },
      },
      {
         header: "사용여부",
         name: "useYn",
         align: "center",
         formatter: "listItemText",
         editor: {
            type: "select",
            options: {
               listItems: [
                  { text: "사용", value: "Y" },
                  { text: "미사용", value: "N" },
               ],
            },
         },
      },
      { header: "상태", name: "status", hidden: true },
      { header: "", name: "updtDt", hidden: true },
   ];

   const grid2Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "패키지 코드", name: "pkgItemCd", align: "center" , hidden: true },
      { header: "품목코드", name: "itemCd", align: "center" },
      { header: "품목명", name: "itemNm", width: 300},
      { header: "금액", name: "itemAmt", align: "right", editor: "text", width: 100,
         formatter: function(e: any) {
            if(e.value){return commas(e.value);}
         }
       },
      { header: "정렬순서", name: "sort", align: "center", editor: "text", width: 100 },
      {
         header: "사용여부",
         name: "useYn",
         align: "center",
         formatter: "listItemText",
         editor: {
            type: "select",
            options: {
               listItems: [
                  { text: "사용", value: "Y" },
                  { text: "미사용", value: "N" },
               ],
            },
         },
      },
      { header: "상태", name: "status", hidden: true },
   ];

   const grid3Columns = [
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "품목코드", name: "itemCd", width: 100, align: "center" },
      { header: "품목명", name: "itemNm", width: 300 },
      { header: "규격", name: "spec", width: 200 },
      { header: "품목그룹", name: "itemGrpNm", width: 100 },
      { header: "품목구분", name: "itemDivNm", width: 100 },
      { header: "판매단가", name: "salePrice", width: 100, align: "right",   
         formatter: function(e: any) {if(e.value){return commas(e.value);} }  },
      { header: "발주단가", name: "costPrice", width: 100, align: "right",  
         formatter: function(e: any) {if(e.value){return commas(e.value);} }  },
      { header: "과세여부", name: "taxYn", width: 100, align: "center" },
      { header: "패키지품목추가", name: "pkgItemYn", hidden: true },
      { header: "대체유무", name: "subsYn", width : 100, align: "center" },
      { header: "공제유무", name: "deduYn", width : 100, align: "center" },
      { header: "사용여부", name: "useYn", hidden: true },
   ];

   const grid4Columns = [
      { header: "", name: "coCd", hidden: true },
      { header: "패키지 코드", name: "pkgItemCd", align: "center", hidden: true },
      { header: "순번", name: "seq", hidden: true },
      { header: "고객사코드", name: "bpCd", align: "center" },
      { header: "고객사명", name: "bpNm", width: 350 },
      {
         header: "사용여부",
         name: "useYn",
         align: "center",
         formatter: "listItemText",
         editor: {
            type: "select",
            options: {
               listItems: [
                  { text: "사용", value: "Y" },
                  { text: "미사용", value: "N" },
               ],
            },
         },
      },
      { header: "상태", name: "status", hidden: true },
   ];

   const grid5Columns = [
      { header: "회사코드", name: "coCd", hidden: true },
      { header: "고객사코드", name: "bpCd", align: "center" },
      { header: "고객사명", name: "bpNm", width: 300 },
      { header: "고객사전체명", name: "bpFullNm", width: 400 },
   ];

   const Grid1 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">패키지 리스트</div>
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

         <TuiGrid01 columns={grid1Columns} handleFocusChange={handleMajorFocusChange} handleAfterChange={handleAfterChange} gridRef={GridRef1} height = {window.innerHeight - 530}/>
      </div>
   );


   const summary2 = {
      height: 40,
      position: 'top', 
      columnContent: {
         itemNm: {
            template: (e: any) => {
               return `합계`;
            }
         },
         itemAmt: {
            template: (e: any) => {                  
               const data = e.sum;
               return `${commas(data)}`;
            }
         }
      }
   };

   const Grid2 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">패키지 정보</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addMinorGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delMinorGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 columns={grid2Columns} gridRef={GridRef2} handleAfterChange={handleAfterChange2} summary={summary2} height = {window.innerHeight - 530} />
      </div>
   );

   const Grid3 = () => (
      <div className="border rounded-md p-2 space-y-2">
         {selectedItems.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
               <div className="flex flex-wrap gap-2">
                  {selectedItems.map((item) => (
                     <div 
                        key={item.itemCd} 
                        className="inline-flex items-center bg-white border border-blue-300 rounded-full px-3 py-1 text-sm shadow-sm hover:shadow-md transition-shadow"
                     >
                        <span className="text-gray-700">{item.itemNm}</span>
                        <button
                           type="button"
                           onClick={() => removeSelectedItem(item.itemCd)}
                           className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                           <XMarkIcon className="w-4 h-4" />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         )}
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>※ 더블클릭 시 단일 품목이 선택 됩니다.</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addItems} className="bg-orange-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  선택등록 ({selectedItems.length})
               </button>
            </div>
         </div>
         <TuiGrid01 gridRef={GridRef3} columns={grid3Columns} rowHeaders={['checkbox','rowNum']} handleClick={handleClick} handleDblClick={handleDblClick} handleCheck={handleItemCheck} height = {window.innerHeight - 530}
         />
      </div>
   );

   const Grid4 = () => (
      <div className="border rounded-md p-2 space-y-2">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="">고객사 정보</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addCustomerGridRow} className="bg-green-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  추가
               </button>
               <button type="button" onClick={delCustomerGridRow} className="bg-rose-500 text-white  rounded-3xl px-2 py-1 flex items-center shadow">
                  <MinusIcon className="w-5 h-5" />
                  삭제
               </button>
            </div>
         </div>

         <TuiGrid01 columns={grid4Columns} gridRef={GridRef4} height = {window.innerHeight - 530} />
      </div>
   );

   const Grid5 = () => (
      <div className="border rounded-md p-2 space-y-2">
         {selectedCustomers.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
               <div className="flex flex-wrap gap-2">
                  {selectedCustomers.map((customer) => (
                     <div 
                        key={customer.bpCd} 
                        className="inline-flex items-center bg-white border border-blue-300 rounded-full px-3 py-1 text-sm shadow-sm hover:shadow-md transition-shadow"
                     >
                        <span className="text-gray-700">{customer.bpNm}</span>
                        <button
                           type="button"
                           onClick={() => removeSelectedCustomer(customer.bpCd)}
                           className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                           <XMarkIcon className="w-4 h-4" />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         )}
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>※ 더블클릭 시 단일 고객사가 선택 됩니다.</div>
            </div>
            <div className="flex space-x-1">
               <button type="button" onClick={addCustomers} className="bg-orange-400 text-white rounded-3xl px-2 py-1 flex items-center shadow">
                  <PlusIcon className="w-5 h-5" />
                  선택등록 ({selectedCustomers.length})
               </button>
            </div>
         </div>
         <TuiGrid01 
            gridRef={GridRef5} 
            columns={grid5Columns} 
            rowHeaders={['checkbox','rowNum']} 
            handleClick={handleCustomerClick}
            handleDblClick={handleCustomerDblClick}
            handleCheck={handleCustomerCheck}
            height = {window.innerHeight - 530}
         />
      </div>
   );

   const customerModalSearchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="w-full flex justify-between">
            <div className="grid grid-cols-2  gap-y-3  justify-start w-[80%]">
               <InputComp1 ref={searchRef6} handleCallSearch={handleCallSearchCustomer} title="고객사명(코드)"></InputComp1>
               <div></div>
            </div>
            <div className="w-[20%] flex justify-end">
               <button type="button" onClick={handleCallSearchCustomer} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  조회
               </button>
            </div>
         </div>
      </div>
   );

   const CustomerModalDiv = () => (
      <CommonModal isOpen={isCustModalOpen} onClose={closeCustomerModal} title="고객사 선택">
         {customerModalSearchDiv()}
         {Grid5()}
      </CommonModal>
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
         <div className="w-full h-full md:flex p-2 md:space-x-2 md:space-y-0 space-y-2">
            <div className="w-1/2" ref={gridGridContainerRef}>{Grid1()}</div>
            <div className="w-1/2">
               <div className="flex ">
                  <div
                     className={`p-1 w-[100px] text-center rounded-t-lg cursor-pointer
                                 ${tabIndex === 0 ? "text-blue-500 border border-b-0 " : "text-gray-500"}
                  `}
                     onClick={() => handleTabIndex(0)}
                  >
                     패키지정보
                  </div>
                  <div
                     className={` p-1 w-[100px] text-center rounded-t-lg cursor-pointer
                                ${tabIndex === 1 ? "text-blue-500 border border-b-0" : "text-gray-500"}
                  `}
                     onClick={() => handleTabIndex(1)}
                  >
                     고객사정보
                  </div>
               </div>
               <div className={tabIndex === 0 ? "" : "hidden"} ref={grid2GridContainerRef}>{Grid2()}</div>
               <div className={tabIndex === 1 ? "" : "hidden"} ref={grid4GridContainerRef}>{Grid4()}</div>
            </div>
         </div>
         {ModalDiv()}
         {CustomerModalDiv()}
      </div>
   );
};

export default Mm0205;
