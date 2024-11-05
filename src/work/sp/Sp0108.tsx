import {
   React, useEffect, useState, commas, useRef, SelectSearch, getGridCheckedDatas, useCallback, initChoice, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1, Tabs2,
} from "../../comp/Import";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";
import LoadingMask from "../../comp/LoadingMask";
import { fi } from "date-fns/locale";

moment.locale("ko");

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Sp0108 = ({ item, activeComp, userInfo }: Props) => {
   const breadcrumbItem = [{ name: "수발주관리" }, { name: "수발관리" }, { name: "발주등록" }];
   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      calendarList: [],
   });

   const [loading, setLoading] = useState(false);
   const localizer = momentLocalizer(moment);

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
      try{
         setLoading(true);
         const param = {
            poBpCd: userInfo.coCd,
            startDate: moment(start).format("YYYY-MM-DD"), // 시작일
            endDate: moment(end).format("YYYY-MM-DD"), // 종료일
         };
   
         const data = JSON.stringify(param);
   
         const result = await fetchPost("SP0108_S01", { data });
     
   
         const formattedResult = result.map((event: any) => ({
            ...event,
            start: new Date(event.start),
            end: event.end ? new Date(event.end) : new Date(event.start),
         }));
   
         onInputChange("calendarList", formattedResult);
      }catch(error){
         console.error("fetchEventsForMonth Error:", error);
      }finally{
         setLoading(false);
      }
   };

   useEffect(() => {
      // 초기에는 현재 월의 데이터를 불러옵니다.
      const now = new Date();
      const startOfMonth = moment(now).startOf("month").toDate();
      const endOfMonth = moment(now).endOf("month").toDate();
      fetchEventsForMonth(startOfMonth, endOfMonth);
   }, []);

   const handleNavigate = (date: Date) => {
      // 달이 변경될 때 해당 월의 데이터를 불러옵니다.
      const startOfMonth = moment(date).startOf("month").toDate();
      const endOfMonth = moment(date).endOf("month").toDate();
      fetchEventsForMonth(startOfMonth, endOfMonth);
   };

   const getColorForWorkCd = (workCd: string) => {
      const colors = [
         "#ff7f7f", // 빨강
         "#f59f76", // 주황
         "#dfdf2a", // 노랑
         "#00d700", // 초록
         "#7fbfff", // 파랑
         "#bf7fff", // 보라
         "#ff7fbf", // 핑크
      ];
      const index = workCd.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
      return colors[index];
   };

   const eventPropGetter = (event: any) => {
      const backgroundColor = getColorForWorkCd(event.workCd);
      return {
         style: { backgroundColor },
      };
   };

   const handleEventClick = (event: any) => {
      console.log("event", event);
   };

   return (
      <div className={`space-y-5 overflow-y-hidden h-screen`}>
         <LoadingMask loading={loading} />
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
            </div>
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
