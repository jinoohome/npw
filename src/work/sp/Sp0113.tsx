import {
   React, useEffect, useState, commas, useRef, SelectSearch, getGridCheckedDatas, useCallback, initChoice, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1, Tabs2,
} from "../../comp/Import";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon, CalendarDaysIcon, TableCellsIcon, UserGroupIcon, UserIcon, ClockIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
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

const Sp0113 = ({ item, activeComp, userInfo }: Props) => {
   const { fetchWithLoading } = useLoadingFetch();
   const breadcrumbItem = [{ name: "수발주관리" }, { name: "수발주관리" }, { name: "출결조회" }];

   // 관리역 여부 확인 (usrDiv가 'ZZ0220'이면 관리역)
   const isManager = userInfo?.usrDiv === "ZZ0220";

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      gridDatas1: [],
      calendarList: [],
      coCd: "200",
      usrId: isManager ? userInfo?.usrId : "999",
      startDt: moment().startOf("month").format("YYYY-MM-DD"),
      endDt: moment().format("YYYY-MM-DD"),
      // 요약 데이터
      totalCnt: 0,
      checkInCnt: 0,
      notCheckInCnt: 0,
      lateCnt: 0,
      // 뷰 모드: "grid" | "calendar"
      viewMode: "calendar",
   });

   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null);
   const localizer = momentLocalizer(moment);
   const [currentDate, setCurrentDate] = useState(new Date());

   //------------------api--------------------------
   const SP0113_S01 = async () => {
      const param = {
         coCd: inputValues.coCd,
         usrId: inputValues.usrId || "999",
         startDt: inputValues.startDt || "999",
         endDt: inputValues.endDt || "999",
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0113_S01", { data });

      return result;
   };

   //------------------useEffect--------------------------
   useEffect(() => {
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);

   useEffect(() => {
      refreshGrid(gridRef);
   }, [activeComp]);

   // 날짜 형식 유효성 검사 (YYYY-MM-DD)
   const isValidDateFormat = (dateStr: string): boolean => {
      if (!dateStr) return false;
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return regex.test(dateStr);
   };

   // 조회 트리거 (달력 선택, 엔터, 포커스아웃 시에만 조회)
   const [searchTrigger, setSearchTrigger] = useState(0);

   const triggerSearch = () => {
      setSearchTrigger(prev => prev + 1);
   };

   // 관리역 변경 시 자동 조회
   useEffect(() => {
      if (isValidDateFormat(inputValues.startDt) && isValidDateFormat(inputValues.endDt)) {
         search();
      }
   }, [inputValues.usrId]);

   // 트리거 발생 시 조회
   useEffect(() => {
      if (searchTrigger > 0 && isValidDateFormat(inputValues.startDt) && isValidDateFormat(inputValues.endDt)) {
         search();
      }
   }, [searchTrigger]);

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
            // 데이터가 있으면 그리드 리셋
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
            const result = await SP0113_S01();
            onInputChange("gridDatas1", result);

            // 요약 데이터 계산
            if (result && result.length > 0) {
               const totalCnt = result.length;
               const checkInCnt = result.filter((item: any) => item.checkin).length;
               const notCheckInCnt = result.filter((item: any) => !item.checkin).length;
               const lateCnt = result.filter((item: any) => item.lateyn === "Y").length;

               onInputChange("totalCnt", totalCnt);
               onInputChange("checkInCnt", checkInCnt);
               onInputChange("notCheckInCnt", notCheckInCnt);
               onInputChange("lateCnt", lateCnt);

               // 캘린더 데이터 변환
               const calendarData = result.map((item: any) => ({
                  id: item.attid,
                  title: `${item.usrnm || item.usrid} ${item.checkin ? item.checkin.substring(11, 16) : "미출근"}`,
                  start: new Date(item.attdt),
                  end: new Date(item.attdt),
                  usrNm: item.usrnm,
                  checkIn: item.checkin,
                  checkOut: item.checkout,
                  lateYn: item.lateyn,
               }));
               onInputChange("calendarList", calendarData);
            } else {
               onInputChange("totalCnt", 0);
               onInputChange("checkInCnt", 0);
               onInputChange("notCheckInCnt", 0);
               onInputChange("lateCnt", 0);
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

   // 캘린더 이벤트 색상
   const eventPropGetter = (event: any) => {
      let backgroundColor = "#22c55e"; // 기본: 초록 (출근)
      if (!event.checkIn) {
         backgroundColor = "#ef4444"; // 빨강 (미출근)
      }
      return { style: { backgroundColor, fontSize: "12px" } };
   };

   // 캘린더 이벤트 클릭
   const handleEventClick = (event: any) => {
      console.log("선택된 출결:", event);
   };

   // 입력값을 날짜로 파싱 (20260125 -> Date)
   const parseInputToDate = (input: string): string | null => {
      const numbers = input.replace(/[^0-9]/g, '');
      if (numbers.length === 8) {
         const year = parseInt(numbers.slice(0, 4));
         const month = parseInt(numbers.slice(4, 6));
         const day = parseInt(numbers.slice(6, 8));
         // 유효한 날짜인지 확인
         const date = new Date(year, month - 1, day);
         if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
         }
      }
      return null;
   };

   // 시작일 입력 완료 시 (포커스 아웃)
   const handleStartBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) {
         const parsedDate = parseInputToDate(value);
         if (parsedDate) {
            onInputChange("startDt", parsedDate);
            triggerSearch();
         }
      }
   };

   // 종료일 입력 완료 시 (포커스 아웃)
   const handleEndBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) {
         const parsedDate = parseInputToDate(value);
         if (parsedDate) {
            onInputChange("endDt", parsedDate);
            triggerSearch();
         }
      }
   };

   //-------------------grid----------------------------
   const formatWorkTime = (minutes: number) => {
      if (!minutes) return "";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}시간 ${mins}분`;
   };

   const columns = [
      { header: "출결ID", name: "attid", hidden: true },
      { header: "회사코드", name: "cocd", hidden: true },
      { header: "사용자ID", name: "usrid", width: 120, align: "center" },
      { header: "사용자명", name: "usrnm", width: 120, align: "center" },
      { header: "출퇴근일자", name: "attdt", width: 120, align: "center" },
      {
         header: "출근시간",
         name: "checkin",
         width: 150,
         align: "center",
         formatter: (e: any) => {
            if (!e.value) return "";
            const cleaned = e.value.replace(/\r\n/g, '').replace(/\s+/g, ' ').trim();
            const timePart = cleaned.split(' ')[1];
            return timePart || "";
         }
      },
      {
         header: "퇴근시간",
         name: "checkout",
         width: 150,
         align: "center",
         formatter: (e: any) => {
            if (!e.value) return "";
            const cleaned = e.value.replace(/\r\n/g, '').replace(/\s+/g, ' ').trim();
            const timePart = cleaned.split(' ')[1];
            return timePart || "";
         }
      },
      {
         header: "근무시간",
         name: "workminutes",
         width: 120,
         align: "center",
         formatter: (e: any) => formatWorkTime(e.value)
      },
      { header: "비고", name: "remark", width: 250 },
      { header: "등록일시", name: "regdt", width: 150, align: "center", hidden: true },
   ];

   const grid = () => (
      <div ref={gridContainerRef} className="border rounded-md p-2 space-y-2 w-full">
         <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1 text-orange-500 ">
               <div>
                  <SwatchIcon className="w-5 h-5 "></SwatchIcon>
               </div>
               <div className="min-w-[100px]">출결현황</div>
            </div>
         </div>

         <TuiGrid01 gridRef={gridRef} columns={columns} headerHeight={30} handleFocusChange={() => {}} perPageYn={false} height={window.innerHeight - 300} />
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

   // 요약 카드
   const summaryCardDiv = () => (
      <div className="grid grid-cols-4 gap-4">
         <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-sm text-gray-500">총 인원</p>
                  <p className="text-2xl font-bold text-gray-800">{inputValues.totalCnt}명</p>
               </div>
               <div className="bg-blue-100 p-3 rounded-full">
                  <UserGroupIcon className="w-6 h-6 text-blue-500" />
               </div>
            </div>
         </div>
         <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-sm text-gray-500">출근</p>
                  <p className="text-2xl font-bold text-green-600">{inputValues.checkInCnt}명</p>
               </div>
               <div className="bg-green-100 p-3 rounded-full">
                  <UserIcon className="w-6 h-6 text-green-500" />
               </div>
            </div>
         </div>
         <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-sm text-gray-500">미출근</p>
                  <p className="text-2xl font-bold text-red-600">{inputValues.notCheckInCnt}명</p>
               </div>
               <div className="bg-red-100 p-3 rounded-full">
                  <ClockIcon className="w-6 h-6 text-red-500" />
               </div>
            </div>
         </div>
         <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-sm text-gray-500">지각</p>
                  <p className="text-2xl font-bold text-orange-600">{inputValues.lateCnt}명</p>
               </div>
               <div className="bg-orange-100 p-3 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />
               </div>
            </div>
         </div>
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
         <div className="flex justify-end space-x-4 mt-2 text-sm">
            <div className="flex items-center space-x-1">
               <div className="w-3 h-3 bg-green-500 rounded"></div>
               <span>출근</span>
            </div>
            <div className="flex items-center space-x-1">
               <div className="w-3 h-3 bg-red-500 rounded"></div>
               <span>미출근</span>
            </div>
         </div>
      </div>
   );

   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3 gap-4 justify-start w-[80%]">
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
            <div className="col-span-2">
               <DateRangePickerComp
                  title="조회기간"
                  startValue={inputValues.startDt}
                  endValue={inputValues.endDt}
                  onChange={(start, end) => {
                     onInputChange("startDt", start);
                     onInputChange("endDt", end);
                  }}
                  onCalendarSelect={triggerSearch}
                  onStartBlur={handleStartBlur}
                  onEndBlur={handleEndBlur}
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

export default Sp0113;
