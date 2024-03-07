import React, { RefObject } from "react";
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
   gridRef: RefObject<Grid>;
   treeColumnName? : string;
   perPage?: number;
   perPageYn?: boolean;
   height? : number;
}

const refreshGrid = (ref:any) => {
   if(ref.current){
      let gridInstance = ref.current.getInstance();
      gridInstance.refreshLayout();
   }
}



const getGridDatas = (gridRef: any) => {
      let grid = gridRef.current.getInstance();

      if (grid.getRowCount() > 0) {
         let focusRowKey1 = grid.getFocusedCell().rowKey || 0;
         grid.focusAt(focusRowKey1, 0, true);
      }

      let rows = grid.getModifiedRows();
      let datas = rows.createdRows
         .map((e: any) => ({ ...e, status: "I" }))
         .concat(rows.deletedRows.map((e: any) => ({ ...e, status: "D" })))
         .concat(rows.updatedRows.map((e: any) => ({ ...e, status: "U" })));

      return datas;
};

const TuiGrid01 = ({ columns, handleFocusChange, gridRef, treeColumnName, perPageYn=true, 
   perPage = 50, height = window.innerHeight - 450 }: Props) => {
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
   };

   if (handleFocusChange) {
      // handleFocusChange가 제공되었을 경우에만 설정합니다.
      gridProps.onFocusChange = handleFocusChange;
   }

   return <Grid {...gridProps} />;
};

export { TuiGrid01, getGridDatas, refreshGrid };
