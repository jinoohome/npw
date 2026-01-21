import {
   React, useEffect, useState, commas, useRef, SelectSearch, getGridCheckedDatas, useCallback, initChoice, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1, Tabs2,
} from "../../comp/Import";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, CalendarDaysIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import "tui-date-picker/dist/tui-date-picker.css";
import { useLoading } from '../../context/LoadingContext';
import { useLoadingFetch } from '../../hooks/useLoadingFetch';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("ko");

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Sp0115 = ({ item, activeComp, userInfo }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();
   const breadcrumbItem = [{ name: "수발주관리" }, { name: "수발주관리" }, { name: "법인차량 사용내역" }];

   // 관리역 여부 확인 (usrDiv가 'ZZ0220'이면 관리역)
   const isManager = userInfo?.usrDiv === "ZZ0220";

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      gridDatas1: [],
      calendarList: [],
      coCd: "200",
      usrId: isManager ? userInfo?.usrId : "999",
      carCd: "999",
      startDt: moment().startOf("month").format("YYYY-MM-DD"),
      endDt: moment().format("YYYY-MM-DD"),
      // 뷰 모드: "grid" | "calendar"
      viewMode: "calendar",
   });

   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);
   const localizer = momentLocalizer(moment);
   const [currentDate, setCurrentDate] = useState(new Date());

   //------------------api--------------------------
   const SP0115_S01 = async () => {
      const param = {
         coCd: inputValues.coCd,
         usrId: inputValues.usrId || "999",
         carCd: inputValues.carCd || "999",
         startDt: inputValues.startDt || "999",
         endDt: inputValues.endDt || "999",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0115_S01", { data });

      return result;
   };

   //------------------useEffect--------------------------
   useEffect(() => {
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   useEffect(() => {
      refreshGrid(gridRef);
   }, [activeComp]);

   // 검색조건 변경 시 자동 조회
   useEffect(() => {
      if (inputValues.startDt && inputValues.endDt) {
         search();
      }
   }, [inputValues.usrId, inputValues.carCd, inputValues.startDt, inputValues.endDt]);

   useEffect(() => {
      if (gridRef.current && inputValues.gridDatas1) {
         let grid = gridRef.current.getInstance();
         grid.resetData(inputValues.gridDatas1);

         if (inputValues.gridDatas1.length > 0) {
            grid.focusAt(0, 0, true);
         }
      }
   }, [inputValues.gridDatas1]);

   // 뷰 모드 변경 시 그리드 새로고침 및 조회
   useEffect(() => {
      if (inputValues.viewMode === "grid") {
         refreshGrid(gridRef);
         if (inputValues.gridDatas1.length > 0) {
            if (gridRef.current) {
               gridRef.current.getInstance().resetData(inputValues.gridDatas1);
            }
         }
      }
   }, [inputValues.viewMode]);

   //-------------------event--------------------------
   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues: any) => {
         const currentValue = prevValues[name] ?? "";
         const newValue = value ?? "";

         if (currentValue === newValue) {
            return prevValues;
         }

         return {
            ...prevValues,
            [name]: newValue,
         };
      });
   };

   const search = async () => {
      await fetchWithLoading(async () => {
         try {
            const result = await SP0115_S01();
            onInputChange("gridDatas1", result);

            // 캘린더 데이터 변환
            if (result && result.length > 0) {
               const calendarData = result.map((item: any) => ({
                  id: item.logid,
                  title: `${item.usrnm || item.usrid} / ${item.distance || 0}km / ${item.carnm || ""}`,
                  start: new Date(item.logdt),
                  end: new Date(item.logdt),
                  usrNm: item.usrnm,
                  carCd: item.carcd,
                  carNm: item.carnm,
                  distance: item.distance,
               }));
               onInputChange("calendarList", calendarData);
            } else {
               onInputChange("calendarList", []);
            }
         } catch (error) {
            console.error("Search Error:", error);
         }
      });
   };

   // 캘린더 네비게이션 핸들러
   const handleNavigate = (date: Date) => {
      setCurrentDate(date);
      const startOfMonth = moment(date).startOf("month").format("YYYY-MM-DD");
      const endOfMonth = moment(date).endOf("month").format("YYYY-MM-DD");
      onInputChange("startDt", startOfMonth);
      onInputChange("endDt", endOfMonth);
   };

   // 차량별 색상 배열
   const carColors = [
      "#3b82f6", // blue
      "#22c55e", // green
      "#f59e0b", // amber
      "#ef4444", // red
      "#8b5cf6", // violet
      "#ec4899", // pink
      "#06b6d4", // cyan
      "#84cc16", // lime
   ];

   // 차량코드별 색상 매핑
   const getCarColor = (carCd: string) => {
      if (!carCd) return carColors[0];
      const hash = carCd.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return carColors[hash % carColors.length];
   };

   // 캘린더 이벤트 색상
   const eventPropGetter = (event: any) => {
      const backgroundColor = getCarColor(event.carCd);
      return { style: { backgroundColor, fontSize: "12px" } };
   };

   // 캘린더 이벤트 클릭
   const handleEventClick = (event: any) => {
      console.log("선택된 운행기록:", event);
   };

   //-------------------grid----------------------------
   const columns = [
      { header: "로그ID", name: "logid", hidden: true },
      { header: "회사코드", name: "cocd", hidden: true },
      { header: "사용자ID", name: "usrid", hidden: true },
      { header: "차량코드", name: "carcd", hidden: true },
      { header: "차량명", name: "carnm", hidden: true },
      { header: "사용일자", name: "logdt", width: 110, align: "center" },
      { header: "부서", name: "dept", width: 80, align: "center" },
      { header: "직책", name: "position", width: 80, align: "center" },
      { header: "성명", name: "usrnm", width: 80, align: "center" },
      { header: "사용목적", name: "purpose", width: 150 },
      { header: "출발지", name: "startplace", width: 120, align: "center" },
      {
         header: "출발시누적거리",
         name: "startkm",
         width: 110,
         align: "right",
         formatter: (e: any) => commas(e.value)
      },
      { header: "경유지", name: "waypoint", width: 120, align: "center" },
      { header: "도착지", name: "endplace", width: 120, align: "center" },
      {
         header: "도착시누적거리",
         name: "endkm",
         width: 110,
         align: "right",
         formatter: (e: any) => commas(e.value)
      },
      {
         header: "주행거리",
         name: "distance",
         width: 90,
         align: "right",
         formatter: (e: any) => commas(e.value)
      },
      {
         header: "주행거리누계",
         name: "cumudist",
         width: 100,
         align: "right",
         formatter: (e: any) => commas(e.value)
      },
      { header: "비고", name: "remark", width: 150 },
   ];

   const summary = {
      height: 40,
      position: 'top',
      columnContent: {
         purpose: {
            template: () => `<span style="display:block; text-align:right;">합계</span>`
         },
         distance: {
            template: (e: any) => commas(e.sum)
         }
      }
   };

   const grid = () => (
      <div ref={gridContainerRef} className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="min-w-[100px]">차량운행내역</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} headerHeight={30} handleFocusChange={() => {}} perPageYn={false} height={window.innerHeight - 300} summary={summary} />
      </div>
   );

   //-------------------div--------------------------
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button
            type="button"
            onClick={() => onInputChange("viewMode", "calendar")}
            className={`${inputValues.viewMode === "calendar" ? "bg-blue-500" : "bg-gray-300"} text-white rounded-lg px-2 py-1 flex items-center shadow`}
         >
            <CalendarDaysIcon className="w-5 h-5 mr-1" />
            캘린더
         </button>
         <button
            type="button"
            onClick={() => onInputChange("viewMode", "grid")}
            className={`${inputValues.viewMode === "grid" ? "bg-blue-500" : "bg-gray-300"} text-white rounded-lg px-2 py-1 flex items-center shadow`}
         >
            <TableCellsIcon className="w-5 h-5 mr-1" />
            그리드
         </button>
         <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow ">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>
      </div>
   );

   // 캘린더 뷰
   const calendarDiv = () => (
      <div className="border rounded-md p-2 bg-white">
         <Calendar
            localizer={localizer}
            events={inputValues.calendarList}
            eventPropGetter={eventPropGetter}
            onSelectEvent={handleEventClick}
            onNavigate={handleNavigate}
            startAccessor="start"
            endAccessor="end"
            selectable={true}
            style={{ height: 600 }}
            defaultView="month"
            className="text-sm"
         />
      </div>
   );

   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-4 gap-4 justify-start w-[80%]">
            <SelectSearch
               title="관리역"
               value={inputValues.usrId}
               addData={isManager ? "" : "999"}
               onChange={(label, value) => {
                  onInputChange("usrId", value);
               }}
               stringify={true}
               param={{ coCd: "200" }}
               procedure="SP0113_S02"
               dataKey={{ label: "usrnm", value: "usrid" }}
               readonly={isManager}
            />
            <SelectSearch
               title="차량"
               value={inputValues.carCd}
               addData={"999"}
               onChange={(label, value) => {
                  onInputChange("carCd", value);
               }}
               stringify={true}
               param={{ coCd: "200" }}
               procedure="SP0115_S02"
               dataKey={{ label: "carnm", value: "carcd" }}
            />
            <div className="col-span-2">
               <DateRangePickerComp
                  title="조회기간"
                  startValue={inputValues.startDt}
                  endValue={inputValues.endDt}
                  onChange={(start, end) => {
                     onInputChange("startDt", start);
                     onInputChange("endDt", end);
                  }}
               />
            </div>
         </div>
      </div>
   );

   return (
      <div className={`space-y-5 overflow-y-auto h-full work-scroll `}>
         <LoadingSpinner />
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
            <div>{searchDiv()}</div>
            <div>{inputValues.viewMode === "grid" ? grid() : calendarDiv()}</div>
         </div>
      </div>
   );
};

export default Sp0115;
