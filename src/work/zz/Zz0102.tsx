import {useEffect, useState, useRef,
   updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, refreshGrid, 
   reSizeGrid, getGridDatas, InputComp, InputComp1, InputComp2, InputSearchComp1, SelectComp1, SelectComp2, SelectSearchComp, SelectPop,
   TextArea, RadioGroup, RadioGroup2, CheckboxGroup, CheckboxGroup1, CheckboxGroup2, Checkbox, CommonModal, DatePickerComp, DateRangePickerComp } from "../../comp/Import";
import { ZZ_CODE_REQ, ZZ_CODE_RES, ZZ_CODE_API } from "../../ts/ZZ_CODE";
import { SwatchIcon, MinusIcon, PlusIcon, MagnifyingGlassIcon, ServerIcon } from "@heroicons/react/24/outline";

interface Props {
   item: any;
   activeComp: any;
   userInfo: any;
}

const Zz0102 = ({ item, activeComp, userInfo }: Props) => {
   //검색창 ref
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);

   const refs = {
      dlvyCd: useRef<any>(null),
      dlvyNm: useRef<any>(null),
      dlvyDiv: useRef<any>(null),
      siDo: useRef<any>(null),
      siDo2: useRef<any>(null),
      siGunGu: useRef<any>(null),
      telNo: useRef<any>(null),
      zipCd: useRef<any>(null),
      addr1: useRef<any>(null),
      addr2: useRef<any>(null),
      useYn: useRef<any>(null),
      insrtUserId: useRef<any>(null),
      insrtDt: useRef<any>(null),
      updtUserId: useRef<any>(null),
      updtDt: useRef<any>(null),
      coCd: useRef<any>(null),
      usrStatus: useRef<any>(null),
      confirmYn: useRef<any>(null),
      check: useRef<any>(null),
   };


   const [gridDatas, setGridDatas] = useState<any[]>();
   const [cd0006Input, setCd0006Input] = useState<ZZ_CODE_RES[]>([]);
   const [wo0002Input, setWo0002Input] = useState<ZZ_CODE_RES[]>([]);
   const [wo0003Input, setWo0003Input] = useState<ZZ_CODE_RES[]>([]);

   const [choice1, setChoice1] = useState<any>();
   const [choice2, setChoice2] = useState<any>();
   const [choice3, setChoice3] = useState<any>();
   const [choice4, setChoice4] = useState<any>();
   const [choice5, setChoice5] = useState<any>();
   
   const [isOpen, setIsOpen] = useState(false);
 

   const breadcrumbItem = [{ name: "관리자" }, { name: "공통" }, { name: "INPUT GROUP" }];

   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
         startDate: "2021-01-01",
         checkGroup:[],
         checkGroup2:[],
   });

   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => ({
          ...prevValues,
          [name]: value,
      }));
    
  };

   // 첫 페이지 시작시 실행
   useEffect(() => {
      setGridData();
   }, []);

 
   //--------------------init---------------------------


   const setGridData = async () => {
      try {
      
         let wo0002Data = await ZZ_CODE({ coCd: "999", majorCode: "WO0002", div: "999" });
         if (wo0002Data != null) {
            let wo0002IntupData = wo0002Data.filter((item) => !(item.value === "999" && item.text === "전체"));
            wo0002IntupData.unshift({ value: "", text: "" });

            setWo0002Input(wo0002IntupData);
         }
   } catch (error) {
         console.error("setGridData Error:", error);
      }
   };


   //---------------------- api -----------------------------

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

   
   //-------------------event--------------------------

   //검색 창 클릭 또는 엔터시 조회
   const handleCallSearch = () => {
      setGridData();
   };

   const handleRaioChange = (value: string) => {
      console.log(value);
   };

   
   const handleCheckChange = (value: string[]) => {
      console.log(value);
   };

   const handleCheckChangeYn = (value: boolean) => {
      console.log(value);
   };


   const handleRaioClick = (value: string) => {
      console.log(value);
   };

   const handleInputSearch = async (e: any) => {
      const target = e.target as HTMLInputElement; 
  
      const param = {
         coCd: userInfo.coCd,
         dlvyNm: target.value || '999',
         useYn: searchRef2.current?.value || '999',
      };

      const data = JSON.stringify(param);
      const result = await fetchPost("MM0401_S01", { data });
      console.log(result);

      if (result.length === 1) {
         console.log(result[0]);
         target.value = result[0].dlvyNm;
         onInputChange('popCd', result[0].dlvyCd);
      } else {
         setIsOpen(true);
      }
   };
   
   const save = () => {
      if (refs.siDo.current) {
         refs.siDo.current.updateChoices(
            wo0002Input.map((item) => ({
              value: item.value,
              label: item.text,
            }))
         );
      };

      refs.siDo2.current.setChoiceByValue("");
      onInputChange('check', 'Y');
      onInputChange('etc', '비고값 변경');
      
      console.log(inputValues);
 
   };
    
   //-------------------div--------------------------

   const buttonDiv = () => (
      <div className="flex justify-end space-x-2">

         <button type="button" onClick={save} className="bg-blue-500 text-white  rounded-lg px-2 py-1 flex items-center shadow">
            <ServerIcon className="w-5 h-5 mr-1" />
            저장
         </button>
      </div>
   );
 
   const searchDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-3 gap-y-3 justify-start w-[60%]">


         <InputComp title="이름"
                     value={inputValues.name}    
                     onChange={(e)=>{
                        console.log('onChange');
                        onInputChange('name', e);
                     }} 
                        //readOnly={true}
                        //type="number"
                        //onkeyDown={()=>{console.log('onkeyDown')}}
                        //handleCallSearch={handleCallSearch} 
                       // setChangeGridData={setGridData}
                        //errorMsg="에러메시지" 
            />
            
           
            
            <SelectSearchComp title="시/도" 
                              ref={refs.siDo}
                              onChange={(label, value) => {
                                    console.log(label, value);
                                    onInputChange('coCd', value);
                                 }}

                              //초기값 세팅시
                             // param={{ coCd: "999", majorCode: "WO0002", div: "999" }}
                             // procedure="ZZ_CODE"  dataKey={{ label: 'codeName', value: 'code' }} 

            />
            <RadioGroup title = "확정여부" 
                         value={inputValues.radio} 
                        options={[ { label: "확정", value: "Y" }, { label: "미확정", value: "N" } ]} 
                        layout="horizontal"
                        onChange={(e)=>{
                           console.log('onChange')
                           onInputChange('radio', e);  
                        }}  
                        onClick={() => {console.log('onClick')}} />

            <CheckboxGroup
               title="확정여부"
               values={inputValues.checkGroup}
               options={[
                  { label: "골프", value: "golf" },
                  { label: "축구", value: "soccer" },
               ]}
               onChange={(values: string[]) => {
                  onInputChange("checkGroup", values);
               }}
            />

            <Checkbox 
               title = "확정여부" 
               value = {inputValues.check}
               //readOnly={true}
               checked={inputValues.check === "Y"} 
               onChange={(e)=>onInputChange('check', e)} 
            />

            <InputSearchComp1 
               title="계약번호" 
               value={inputValues.inputSearch}
               handleInputSearch={handleInputSearch} 
               onChange={(e)=>onInputChange('inputSearch', e)}
               /> 
          
            <DatePickerComp 
                title="계약번호"
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


            <TextArea title="비고" 
                      value={inputValues.etc}
                      onChange={(e)=>{onInputChange('etc', e)}}
                      placeholder="비고를 입력하세요"
            />

      </div>
   </div>
   );

   //input div
   const inputDiv = () => (
      <div className="bg-gray-100 rounded-lg p-5 search text-sm search">
         <div className="grid grid-cols-4 gap-4  justify-start w-[60%]">

         <InputComp title="이름"
                     value={inputValues.dlvyNm}    
                     onChange={(e)=>{
                        console.log('onChange');
                        onInputChange('dlvyNm', e);
                     }} 
                     layout="vertical"
                        //readOnly={true}
                        //type="number"
                        //onkeyDown={()=>{console.log('onkeyDown')}}
                        //handleCallSearch={handleCallSearch} 
                       // setChangeGridData={setGridData}
                        //errorMsg="에러메시지" 
            />
            <SelectSearchComp title="시/도" 
               ref={refs.siDo2}
               value="{inputValues.coCd2}"
               onChange={(label, value) => {
                     console.log(label, value);
                     onInputChange('coCd2', value);
                  }}
               layout="vertical"
                //초기값 세팅시
               param={{ coCd: "999", majorCode: "WO0002", div: "999" }}
               procedure="ZZ_CODE"  dataKey={{ label: 'codeName', value: 'code' }} 

            />
            <RadioGroup title = "확정여부" 
                         value={inputValues.radio2} 
                        options={[ { label: "확정", value: "Y" }, { label: "미확정", value: "N" } ]} 
                        layout="vertical"
                        onChange={(e)=>{
                           console.log('onChange')
                           onInputChange('radio2', e);  
                        }}  
                        onClick={() => {console.log('onClick')}} />

            <CheckboxGroup
               title="확정여부"
               layout="vertical"
               values={inputValues.checkGroup2}
               options={[
                  { label: "골프", value: "golf" },
                  { label: "축구", value: "soccer" },
               ]}
               onChange={(values: string[]) => {
                  onInputChange("checkGroup2", values);
               }}
            />

            <Checkbox 
               title = "확정여부" 
               value = {inputValues.check2}
               layout="vertical"
               onChange={(e)=>onInputChange('check', e)} 
            />


            <DatePickerComp 
                title="계약번호"
                value = {inputValues.date2}
                onChange={(e) => { 
                   onInputChange('date2', e);  
                  }} 
               layout="vertical"
               //format="yyyy-MM-dd HH:mm A"
               //timePicker={true}
            />
            <DateRangePickerComp 
                  title="계약기간"
                  startValue= {inputValues.startDate2}
                  endValue= {inputValues.endDate2}
                  layout="vertical"
               onChange={(startDate, endDate) => {
               onInputChange('startDate2', startDate);
               onInputChange('endDate2', endDate);   
               console.log(startDate); console.log(endDate);
            }
            
            } />
            

            <TextArea title="비고" 
                      layout="vertical"
                      value={inputValues.etc2}
                      onChange={(e)=>{onInputChange('etc2', e)}}
                      placeholder="비고를 입력하세요"
            />
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
            <div>{searchDiv()}</div>
            <div>{inputDiv()} </div>
            
         </div>
         

          <CommonModal isOpen={isOpen} size="md" onClose={() => setIsOpen(false)} title="">
            <div></div>
         </CommonModal>
      </div>
   );
};

export default Zz0102;
