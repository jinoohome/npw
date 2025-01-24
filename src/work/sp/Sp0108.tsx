import {
   React, useEffect, useState, commas, useRef, SelectSearch, getGridCheckedDatas, useCallback, initChoice, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1, Tabs2,
} from "../../comp/Import";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";
import LoadingMask from "../../comp/LoadingMask";

moment.locale("ko");

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Sp0108 = ({ item, activeComp, userInfo }: Props) => {
   const breadcrumbItem = [{ name: "수발주관리" }, { name: "수발주관리" }, { name: "일정조회" }];
   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      calendarList: [],
      dtDiv: "999",
      poBpCd: "999",
      workCd: "999",
      bpCd: "999",
   });

   const [loading, setLoading] = useState(false);
   const localizer = momentLocalizer(moment);
   const [currentDate, setCurrentDate] = useState(new Date()); // State to store the current calendar date

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => {
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

   const fetchEventsForMonth = async (start: Date, end: Date) => {
      try {
         setLoading(true);
         const param = {
            bpCd: inputValues.bpCd,
            poBpCd: inputValues.poBpCd,
            startDate: moment(start).format("YYYY-MM-DD"),
            endDate: moment(end).format("YYYY-MM-DD"),
            workCd: inputValues.workCd,
            dtDiv: inputValues.dtDiv,
         };

         const data = JSON.stringify(param);
         const result = await fetchPost("SP0108_S01", { data });

         const formattedResult = result.map((event: any) => ({
            ...event,
            start: new Date(event.start),
            end: event.end ? new Date(event.end) : new Date(event.start),
         }));

         onInputChange("calendarList", formattedResult);
      } catch (error) {
         console.error("fetchEventsForMonth Error:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      search(); // Initial search
   }, []);

   useEffect(() => {
      search(); // Search when filters change
   }, [inputValues.bpCd, inputValues.poBpCd, inputValues.workCd, inputValues.dtDiv]);

   const handleNavigate = (date: Date) => {
      setCurrentDate(date); // Update the current calendar date
      const startOfMonth = moment(date).startOf("month").toDate();
      const endOfMonth = moment(date).endOf("month").toDate();
      fetchEventsForMonth(startOfMonth, endOfMonth);
   };

   const getColorForDtDiv = (dtDiv: string) => {
      switch (dtDiv) {
         case "H":
            return "#ef4444"; // 빨강 (Tailwind CSS: bg-red-500)
         case "R":
            return "#f97316"; // 주황 (Tailwind CSS: bg-orange-500)
         case "E":
            return "#facc15"; // 노랑 (Tailwind CSS: bg-yellow-400)
         case "F":
            return "#22c55e"; // 초록 (Tailwind CSS: bg-green-500)
         default:
            return "#38bdf8"; // 기본 색상 (파랑, Tailwind CSS: bg-sky-400)
      }
   };

   const eventPropGetter = (event: any) => {
      const backgroundColor = getColorForDtDiv(event.dtDiv); // DT_DIV를 기준으로 색상 지정
      return {
         style: { backgroundColor },
      };
   };

   const handleEventClick = (event: any) => {
      console.log("event", event);
   };

   const search = () => {
      // Use the current calendar date to fetch events
      const startOfMonth = moment(currentDate).startOf("month").toDate();
      const endOfMonth = moment(currentDate).endOf("month").toDate();
      fetchEventsForMonth(startOfMonth, endOfMonth);
   };

   // 상단 버튼 div
   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">
         <button type="button" onClick={search} className="bg-gray-400 text-white rounded-lg px-2 py-1 flex items-center shadow">
            <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
            조회
         </button>
      </div>
   );

   // 검색창 div
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search flex justify-between items-center">
         <div className="grid grid-cols-4 gap-y-3 justify-start w-[70%]">
            <SelectSearch
                       title="사업장"
                       value={inputValues.bpCd}
                       addData={"999"}
                       onChange={(label, value) => {
                           onInputChange("bpCd", value);
                       }}

                       stringify={true}
                       param={{ coCd: "200",bpType : "ZZ0002", bpNm : '999', bpDiv: '999' }}
                       procedure="ZZ_B_PO_BP"
                       dataKey={{ label: "bpNm", value: "bpCd" }}
                   />
            <SelectSearch
               title="협력업체"
               value={inputValues.poBpCd}
               onChange={(label, value) => {
                  onInputChange("poBpCd", value);
               }}
               addData={"999"}
               stringify={true}
               param={{ coCd: "200", bpType: "ZZ0003", bpNm: "999", bpDiv: "999" }}
               procedure="ZZ_B_PO_BP"
               dataKey={{ label: "bpNm", value: "bpCd" }}
            />
            <SelectSearch
               title="작업명"
               value={inputValues.workCd}
               onChange={(label, value) => {
                  onInputChange("workCd", value);
               }}
               addData={"999"}
               stringify={true}
               param={{ coCd: "200" }}
               procedure="ZZ_WORKS"
               dataKey={{ label: "workNm", value: "workCd" }}
            />
            <SelectSearch
               title="일정기준"
               value={inputValues.dtDiv}
               onChange={(label, value) => {
                  onInputChange("dtDiv", value);
               }}
               datas={[
                  { value: "999", label: "전체" },
                  { value: "H", label: "작업희망일" },
                  { value: "R", label: "작업요청일" },
                  { value: "E", label: "작업예정일" },
                  { value: "F", label: "작업완료일" },
               ]}
            />
         </div>
         <div className="flex space-x-4">
            {/* <div className="flex items-center space-x-2">
               <div className="w-4 h-4 bg-red-500"></div>
               <span>작업희망일</span>
            </div>
            <div className="flex items-center space-x-2">
               <div className="w-4 h-4 bg-orange-500"></div>
               <span>작업요청일</span>
            </div> */}
            <div className="flex items-center space-x-2">
               <div className="w-4 h-4 bg-yellow-400"></div>
               <span>작업예정일</span>
            </div>
            <div className="flex items-center space-x-2">
               <div className="w-4 h-4 bg-green-500"></div>
               <span>작업완료일</span>
            </div>
         </div>
      </div>
   );

   return (
      <div className={`space-y-5 overflow-y-hidden h-screen`}>
         <LoadingMask loading={loading} />
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
            <div>{searchDiv()}</div>
            <Calendar
               localizer={localizer}
               events={inputValues.calendarList}
               eventPropGetter={eventPropGetter}
               onSelectEvent={handleEventClick}
               onNavigate={handleNavigate}
               startAccessor="start"
               endAccessor="end"
               selectable={true}
               style={{ height: 750 }}
               defaultView="month"
               className="text-sm"
            />
         </div>
      </div>
   );
};

export default Sp0108;
