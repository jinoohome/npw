import React, { RefObject, useRef } from "react";
import "tui-grid/dist/tui-grid.css";
import "tui-pagination/dist/tui-pagination.css";
import Grid from "@toast-ui/react-grid";
import { OptColumn } from "tui-grid/types/options";
import TuiGrid from "tui-grid";
import "../css/tuiGrid.css";
import ChoicesEditor from "../util/ChoicesEditor";

interface Props {
   columns: any[];
   handleFocusChange?: (rowKey: any) => void;
   handleAfterChange?: (ev: any) => void; // 추가된 이벤트 핸들러
   handleClick?: (ev: any) => void; // 추가된 이벤트 핸들러
   gridRef: RefObject<Grid>;
   treeColumnName?: string;
   perPage?: number;
   perPageYn?: boolean;
   height?: number;
   summary? : any;
}



const refreshGrid = (ref: any) => {
   if (ref.current) {
      let gridInstance = ref.current.getInstance();
      gridInstance.refreshLayout();
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
            gridInstance.refreshLayout();
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

   return datas;
};

const TuiGrid01 = ({ columns, handleFocusChange, handleAfterChange, handleClick,  gridRef, treeColumnName, perPageYn = true, perPage = 50, height = window.innerHeight - 450, summary }: Props) => {
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
      bodyHeight: height,
      scrollX: true,
      scrollY: true,
      columnOptions: { resizable: true },
      heightResizable: true,
      rowHeaders: ["rowNum"],
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


   return <Grid {...gridProps} />;
};

export { TuiGrid01, getGridDatas, refreshGrid, reSizeGrid };
