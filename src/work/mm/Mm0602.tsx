import { React, useEffect, useState, useRef, useCallback, initChoice, 
   updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, 
   reSizeGrid, getGridDatas, SelectSearchComp, InputComp,  InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2,
   TextArea, RadioGroup, RadioGroup2, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp,
   Tabs1, Tabs2
} from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";
import 'tui-date-picker/dist/tui-date-picker.css';
import DatePicker from 'tui-date-picker';


interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const MM0602 = ({ item, activeComp, userInfo }: Props) => {

   const breadcrumbItem = [{ name: "기준정보" }, { name: "계약관리" }, { name: "계약등록" }];
   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
    
   });


   const gridRef = useRef<any>(null);
   const gridContainerRef = useRef(null); 
   const [gridDatas, setGridDatas] = useState<any[]>();



   useEffect(() => {
      setGridData();
      reSizeGrid({ ref: gridRef, containerRef: gridContainerRef, sec: 200 });
   }, []);


   const setGridData = async () => {
      try {
        
      } catch (error) {
         console.error("setGridData Error:", error);
      }
   };

   //------------------useEffect--------------------------

   useEffect(() => {
      if (gridRef.current && gridDatas) {
         let grid = gridRef.current.getInstance();
         grid.resetData((gridDatas));
         if (gridDatas.length > 0) {
            // grid.focusAt(focusRow, 0, true);
         }
      }
   }, [gridDatas]);


    //-------------------event--------------------------
    const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
         ...prevValues,
         [name]: value,
      }));
   }; 

   const save = () => {
      console.log(inputValues);
   };

   const handleInputSearch = () => {
      console.log();
   };

      //-------------------grid----------------------------
      const columns = [
         { header: "경조코드", name: "coCd" },
         { header: "경조명", name: "bpCd", width: 100, align: "center" },

      ];
   
      const grid1 = () => (
         <div className="border rounded-md p-2 space-y-2 w-full">
            <div className="flex justify-between items-center text-sm">
               <div className="flex items-center space-x-1 text-orange-500 ">
                  <div>
                     <SwatchIcon className="w-5 h-5 "></SwatchIcon>
                  </div>
                  <div className="">거래처 조회</div>
               </div>            
            </div>
   
            <TuiGrid01 gridRef={gridRef} columns={columns} handleFocusChange={()=>{}} perPageYn={false} height={window.innerHeight - 440} />
         </div>
      );

      
   //-------------------div--------------------------

   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">

         <button type="button" onClick={save} className="bg-blue-500 text-white  rounded-lg px-2 py-1 flex items-center shadow">
            <ServerIcon className="w-5 h-5 mr-1" />
            저장
         </button>
      </div>
   );
   
   const div1 = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3 gap-y-3 justify-start w-[60%]">
            <InputSearchComp1 title="계약번호" handleInputSearch={handleInputSearch}/> 
            <InputComp  title="계약명" value={inputValues.contractNo} onChange={onInputChange} />
            
            <RadioGroup title = "확정여부" 
               value={inputValues.radio} 
               options={[ { label: "확정", value: "Y" }, { label: "미확정", value: "N" } ]} 
               onChange={(e)=>{
                  console.log('onChange')
                  onInputChange('radio', e);  
                }}  
               onClick={() => {console.log('onClick')}} />

            <InputSearchComp1 title="고객사" handleInputSearch={handleInputSearch}/> 

            <SelectSearchComp title="계약종류" 
                               onChange={(label, value) => {
                                    console.log(label, value);
                                    onInputChange('coCd', value);
                                 }}

                              //초기값 세팅시
                             // param={{ coCd: "999", majorCode: "WO0002", div: "999" }}
                             // procedure="ZZ_CODE"  dataKey={{ label: 'codeName', value: 'code' }} 

            />

            <DatePickerComp 
                title="계약체결일"
                value = {inputValues.date}
                onChange={(e) => { 
                   onInputChange('date', e);  
                  }} 
               //format="yyyy-MM-dd HH:mm A"
               //timePicker={true}
            />


            <DateRangePickerComp 
                  title="계약기간"
                  startValue= {inputValues.startDate}
                  endValue= {inputValues.endDate}
             onChange={(startDate, endDate) => {
               onInputChange('startDate', startDate);
               onInputChange('endDate', endDate);   
               console.log(startDate); console.log(endDate);
            }
            
            } />

            <SelectSearchComp title="청구조건" 
                  onChange={(label, value) => {
                     console.log(label, value);
                     onInputChange('coCd', value);
                  }}

                  //초기값 세팅시
                  // param={{ coCd: "999", majorCode: "WO0002", div: "999" }}
                  // procedure="ZZ_CODE"  dataKey={{ label: 'codeName', value: 'code' }} 
            />
             <Checkbox 
               title = "확정여부" 
               value = {inputValues.check}
               //readOnly={true}
               checked={inputValues.check === "Y"} 
               onChange={(e)=>onInputChange('check', e)} 
            />


         </div>
      </div>
   );    

   const div2 = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="space-y-3 w-[60%]">
            <div className="grid grid-cols-2 gap-y-2">
               <RadioGroup title = "완료문자이미지 전송 여부" 
                  value={inputValues.radio} 
                  options={[ { label: "확정", value: "Y" }, { label: "미확정", value: "N" } ]} 
                  onChange={(e)=>{
                     console.log('onChange')
                     onInputChange('radio', e);  
                  }}  
                  onClick={() => {console.log('onClick')}} />

               <RadioGroup title = "기타이미지 전송 여부" 
                  value={inputValues.radio} 
                  options={[ { label: "확정", value: "Y" }, { label: "미확정", value: "N" } ]} 
                  onChange={(e)=>{
                     console.log('onChange')
                     onInputChange('radio', e);  
                  }}  
                  onClick={() => {console.log('onClick')}} />
            </div>
            <div className="w-full">
               <TextArea title="비고"
                     display="flex"
                     labelWidth="1/6"
                     width="5/6"
               />
            </div>
         </div>
      </div>
   );   
      

   return (
      <div className={`space-y-5 overflow-y-hidden h-screen`}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
  
          
        
            <div>{div1()}</div>
            <div>{div2()}</div>
            <div>{grid1()}</div>
           
            
         </div>
         

          
      </div>
   );


};

export default MM0602;
