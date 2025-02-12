import React, { RefObject, useRef,useEffect } from "react";
import "tui-grid/dist/tui-grid.css";
import "tui-pagination/dist/tui-pagination.css";
import Grid from "@toast-ui/react-grid";
import { OptColumn } from "tui-grid/types/options";
import TuiGrid from "tui-grid";
import "../css/tuiGrid.css";
import ChoicesEditor from "../util/ChoicesEditor";
import DOMPurify from "dompurify";

interface Props {
   columns: any[];
   handleEditingStart?: (ev: any) => void;
   handleEditingFinish?: (ev: any) => void;
   handleFocusChange?: (rowKey: any) => void;
   handleAfterChange?: (ev: any) => void; 
   handleClick?: (ev: any) => void; 
   handleDblClick?: (ev: any) => void;
   beforeChange?: (ev: any) => void; 
   afterChange?: (ev: any) => void; 
   check?: (ev: any) => void;
   uncheck?: (ev: any) => void;
   afterRender?: (ev: any) => void;
   gridRef: RefObject<Grid>;
   treeColumnName?: string;
   perPage?: number;
   perPageYn?: boolean;
   height?: any;
   summary? : any;
   rowHeaders?: any;
   headerHeight?: number;
}



const refreshGrid = (ref: any) => {
   if (ref.current) {
      let gridInstance = ref.current.getInstance();
      if (gridInstance) {
         gridInstance.refreshLayout();
    }
   }
};

interface reSizeProps {
   ref: RefObject<Grid>;
   containerRef?: any;
   sec?: number;
}

const reSizeGrid = ({ ref, containerRef = null, sec = 0 }: reSizeProps) => {
   const handleResize = () => {
      setTimeout(() => {
         if (ref.current) {
            let gridInstance = ref.current.getInstance();
            if (gridInstance) {
               gridInstance.refreshLayout();
            }
         }
      }, sec);
   };

   if (containerRef) {
      const resizeObserver = new ResizeObserver(handleResize);
      if (containerRef.current) {
         resizeObserver.observe(containerRef.current);
      }
      return () => {
         if (containerRef.current) {
            resizeObserver.unobserve(containerRef.current);
         }
      };
   }
};

const getGridDatas = (gridRef: any) => {
   let grid = gridRef.current.getInstance();

   if (grid.getRowCount() > 0) {
      grid.blur();      
   }

   let rows = grid.getModifiedRows();
   let datas = rows.createdRows
      .map((e: any) => ({ ...e, status: "I" }))
      .concat(rows.deletedRows.map((e: any) => ({ ...e, status: "D" })))
      .concat(rows.updatedRows.map((e: any) => ({ ...e, status: "U" })));

   // 모든 데이터를 DOMPurify로 sanitize 처리
   // const sanitizedDatas = datas.map((data: any) =>
   //    Object.fromEntries(
   //       Object.entries(data).map(([key, value]) => [key, DOMPurify.sanitize(String(value))])
   //    )
   // );

   return datas;


   
};




const getGridCheckedDatas = (gridRef: any) => {
   const grid = gridRef.current.getInstance();

   if (grid.getRowCount() > 0) {
       grid.blur();
   }

   const allRows = grid.getData();


   const rows = grid.getModifiedRows();
   const prevDatas = [
      ...rows.createdRows.map((e: any) => ({ ...e, status: "I" })),
      ...rows.deletedRows.map((e: any) => ({ ...e, status: "D" })),
      ...rows.updatedRows.map((e: any) => ({ ...e, status: "U" }))
   ];


   const uncheckedRows = allRows.filter((row: any) => !row._attributes.checked);
   

   //기존에 있던 데이터중에 체크가 해제된 데이터는 status를 D로 변경
   const datas = prevDatas.map((data: any) => {
      const uncheckedRow = uncheckedRows.find((row: any) => row.rowKey === data.rowKey);
      return uncheckedRow ? { ...data, status: "D" } : data;
   });

   //체크가 해제된 데이터중에 기존에 없던 데이터는 추가 (status는 D로 설졍)
   uncheckedRows.forEach((row: any) => {
      if (!datas.some((data: any) => data.rowKey === row.rowKey)) {
         datas.push({ ...row, status: "D" });
      }
   });

 


   
   // 모든 데이터를 DOMPurify로 sanitize 처리
   // const sanitizedDatas = datas.map((data: any) =>
   //    Object.fromEntries(
   //       Object.entries(data).map(([key, value]) => [key, DOMPurify.sanitize(String(value))])
   //    )
   // );

   return datas;
};

const getGridCheckedDatas2 = (gridRef: any) => {
   const grid = gridRef.current.getInstance();

   if (grid.getRowCount() > 0) {
       grid.blur();
   }

   const allRows = grid.getData();


   const rows = grid.getModifiedRows();
   const prevDatas = [
      //...rows.createdRows.map((e: any) => ({ ...e, status: "I" })),
      ...rows.deletedRows.map((e: any) => ({ ...e, status: "D" })),
      //...rows.updatedRows.map((e: any) => ({ ...e, status: "I" }))
   ];


   const uncheckedRows = allRows.filter((row: any) => !row._attributes.checked);
   const checkedRows = allRows.filter((row: any) => row._attributes.checked);
   

   //기존에 있던 데이터중에 체크가 해제된 데이터는 status를 D로 변경
   const datas = prevDatas.map((data: any) => {
      const uncheckedRow = uncheckedRows.find((row: any) => row.rowKey === data.rowKey);
      return uncheckedRow ? { ...data, status: "D" } : data;
   });

   //체크가 해제된 데이터중에 기존에 없던 데이터는 추가 (status는 D로 설졍)
   uncheckedRows.forEach((row: any) => {
      if (!datas.some((data: any) => data.rowKey === row.rowKey)) {
         datas.push({ ...row, status: "D" });
      }
   });

   checkedRows.forEach((row: any) => {
      if (!datas.some((data: any) => data.rowKey === row.rowKey)) {
         datas.push({ ...row, status: "I" });
      }
   });

   const updatedDatas = datas.map((data: any) => {
      const checkedRow = checkedRows.find((row: any) => row.rowKey === data.rowKey);
      return checkedRow ? { ...data, status: "I" } : data;
   });

   // const sanitizedDatas = updatedDatas.map((data: any) =>
   // Object.fromEntries(
   //    Object.entries(data).map(([key, value]) => [key, DOMPurify.sanitize(String(value))])
   //    )
   // );

   return updatedDatas;
};

const TuiGrid01 = ({ columns, handleEditingStart, handleEditingFinish, handleFocusChange, handleAfterChange, handleClick, handleDblClick, beforeChange, afterChange, check, uncheck, afterRender, headerHeight = 40,
                     gridRef, treeColumnName, perPageYn = true, perPage = 50, height = window.innerHeight - 450, summary ,rowHeaders=["rowNum"] }: Props) => {
   // 고유한 key 생성을 위해 Math.random() 사용
   TuiGrid.applyTheme("default", {
      cell: {
         header: {
            background: "#fff",
            border: "#ccc",
            showVerticalBorder: true,
         },
         evenRow: {
            background: "#f9f9f9",
         },
         oddRow: {
            background: "#fff",
         },
         selectedRowHeader: {
            background: "#f9f9f9",
         },
      },
      row: {
         hover: {
            background: "#f9f9f9",
         },
      },
   });

   const gridProps: any = {
      // GridProps의 부분 집합을 사용합니다.
      ref: gridRef,
      editingEvent: "click", // EditingEvent 타입으로 캐스팅합니다.
      columns,
      header : {height : headerHeight},
      bodyHeight: height,
      rowHeight: 'auto', 
      scrollX: true,
      scrollY: true,
      columnOptions: { resizable: true },
      heightResizable: true,
      rowHeaders: rowHeaders,
      oneTimeBindingProps: ["data", "columns"],

      ...(perPageYn && {
         pageOptions: {
            useClient: true,
            perPage: perPage,
         },
      }),
      treeColumnOptions: {
         name: treeColumnName,
      },
      summary : summary
   };

   if (handleFocusChange) {
      // handleFocusChange가 제공되었을 경우에만 설정합니다.
      gridProps.onFocusChange = handleFocusChange;
   }

   if (handleAfterChange) {
      // handleAfterChange가 제공되었을 경우에만 설정합니다.
      gridProps.onAfterChange = handleAfterChange;
   }

   if (handleClick) {
      // handleClick이 제공되었을 경우에만 설정합니다.
      gridProps.onClick = handleClick;
   }

   if (handleDblClick) {
      // handleDblClick이 제공되었을 경우에만 설정합니다.
      gridProps.onDblclick = handleDblClick;
   }

   if (beforeChange) {
      // beforeChange가 제공되었을 경우에만 설정합니다.
      gridProps.onBeforeChange = beforeChange;
   }

   if (afterChange) {
      // afterChange가 제공되었을 경우에만 설정합니다.
      gridProps.onAfterChange = afterChange;
   }

   if (check) {
      // check가 제공되었을 경우에만 설정합니다.
      gridProps.onCheck = check;
   }

   if (uncheck) {
      // uncheck가 제공되었을 경우에만 설정합니다.
      gridProps.onUncheck = uncheck;
   }

   if (afterRender) {
      // uncheck가 제공되었을 경우에만 설정합니다.
      gridProps.refreshLayout();
   }
   
   if (handleEditingStart) {
      gridProps.onEditingStart = handleEditingStart;
   }

   if (handleEditingFinish) {
      gridProps.onEditingFinish = handleEditingFinish;
   }
   


   return <Grid {...gridProps} />;
};

export { TuiGrid01, getGridDatas, getGridCheckedDatas,getGridCheckedDatas2, refreshGrid, reSizeGrid };
