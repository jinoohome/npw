import {
   React, useEffect, useState, commas, useRef, SelectSearch, getGridCheckedDatas, useCallback, initChoice, updateChoices, alertSwal, InputSearchComp, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, reSizeGrid, getGridDatas, SelectSearchComp, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp, Tabs1, Tabs2,
} from "../../comp/Import";


import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ko'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('ko');

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Sp0108 = ({ item, activeComp, userInfo }: Props) => {
   const breadcrumbItem = [{ name: "수발주관리" }, { name: "수발관리" }, { name: "발주등록" }];
   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      calendarList : []
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => {
         // null, undefined, ""을 하나의 빈 값으로 취급
         const currentValue = prevValues[name] ?? "";
         const newValue = value ?? "";

         // 동일한 값일 경우 상태를 업데이트하지 않음
         if (currentValue === newValue) {
            return prevValues;
         }

         return {
            ...prevValues,
            [name]: newValue,
         };
      });
   };


   const localizer = momentLocalizer(moment);


   //------------------api--------------------------

   const SP0108_S01 = async () => {
      const param = {
         poBpCd: userInfo.coCd,
        
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("SP0108_S01", { data });

      const formattedResult = result.map((event: any) => ({
         ...event,
         start: new Date(event.start),  // 문자열을 Date 객체로 변환
         end: new Date(event.end),      // 문자열을 Date 객체로 변환
      }));

      
      onInputChange("calendarList", formattedResult);

      return result;
   };

   //------------------useEffect--------------------------
   useEffect(() => {
      setGridData();
     
   }, []);

  
   //-------------------event--------------------------
   const setGridData = async () => {
      try {
         SP0108_S01();
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   const generateColorPalette = (size:any) => {
      const colors = [];
      const saturation = 50; // 채도
      const lightness = 60; // 밝기
  
      for (let i = 0; i < size; i++) {
        const hue = Math.floor((360 / size) * i); // Hue 값을 고르게 분배
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`; // HSL 색상
        colors.push(color);
      }
  
      return colors;
    };

    const colorPalette = generateColorPalette(inputValues.calendarList.length);

   const eventPropGetter = (event:any) => {
      const eventIndex = inputValues.calendarList.findIndex((e:any) => e.workCd === event.workCd); 
      const backgroundColor = colorPalette[eventIndex % colorPalette.length]; 

  
      return {
        style: {
          backgroundColor,
        },
      };
    };

   const handleEventClick = (event:any) => {
      console.log("event", event);
   }

   return (
      <div className={`space-y-5 overflow-y-hidden h-screen`}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
            
            </div>
            <Calendar
               localizer={localizer}
               events={inputValues.calendarList}
               eventPropGetter={eventPropGetter} 
               onSelectEvent={handleEventClick} 
               startAccessor="start"
               endAccessor="end"
               style={{ height: 750 }}
               className="text-md"
               />

         </div>
         
      </div>
   );
};

export default Sp0108;
