import { React, useEffect, useState, useRef, useCallback, initChoice, initChoice2, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, getGridDatas, refreshGrid, reSizeGrid, InputComp1, InputComp2, SelectComp3 } from "../comp/Import";
import { SOL_ZZ_MENU_RES } from "../ts/SOL_ZZ_MENU";
import { Bars3Icon, UserIcon, ChevronDownIcon, RectangleStackIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface TopProps {
   loginInfo: any;
   userInfo: any;
   topMenus: SOL_ZZ_MENU_RES[];
   searchMenus: SOL_ZZ_MENU_RES[];
   onTopMenuClick: (menuItem: SOL_ZZ_MENU_RES) => void;
   activeMenu: string;
   leftMode: string;
   onLeftMode: (mode: string) => void;
   onUserChange: (value: string) => void;
   onSearchMenuClick: (menuItem: SOL_ZZ_MENU_RES) => void;
}

const Top = ({loginInfo, userInfo, topMenus, searchMenus, onTopMenuClick, activeMenu, leftMode, onLeftMode , onUserChange, onSearchMenuClick }: TopProps) => {
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);

   const [searchChoice1, setSearchChoice1] = useState<any>();
   const [searchChoice2, setSearchChoice2] = useState<any>();

   const [users, setUsers] = useState<any[]>([]);

   useEffect(() => {
      if (userInfo) {
         setChoiceUI();
         setChoiceData();
      
      }
   }, [userInfo]);

   const setChoiceUI = () => {
      initChoice2(searchRef1, setSearchChoice1);
      initChoice2(searchRef2, setSearchChoice2);
   };

   const setChoiceData = async () => {
      const users = await SOL_ZZ_USERS();
      setUsers(users);
   };

   const handleLeftMode = (mode: string) => {
      onLeftMode(mode);
   };

   
   const handleUserChange = (value:string) => {
      onUserChange(value);
   };
  
   //------------------useEffect--------------------------
   const handleMenuChange = (value:string) => {
      const chosenMenu = searchMenus.filter((e) => e.menuId === value);
      if (chosenMenu.length > 0) {
         onSearchMenuClick(chosenMenu[0]);
      }
    
   };
  
   //------------------useEffect--------------------------

   useEffect(() => {
      if (searchChoice1 && users.length > 0) {
         updateChoices(searchChoice1, users, "usrId", "usrNm");
         
      }
   }, [users]);
  
   useEffect(() => {
      if (searchChoice2 && searchMenus.length > 0) {
         updateChoices(searchChoice2, searchMenus, "menuId", "menuName"); // 변경: 'usrNm'에서 'menuName'으로
      }
   }, [searchChoice2, searchMenus]);

    //---------------------- api -----------------------------

   const SOL_ZZ_USERS = async () => {
      try {
         const param = {
            usrId: "sckcs",
            coCd: "999",
            usrDiv: "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`SOL_ZZ_USERS`, { data });
         return result;
      } catch (error) {
         console.error("SOL_ZZ_USERS Error:", error);
         throw error;
      }
   };



   return (
      <div className="topMenu">
         {loginInfo && userInfo && (
            <div className="bg-white h-[70px] shadow-lg flex justify-between border-b   ">
               <div className="h-full flex gap-7 px-3 items-center">
                  <Bars3Icon
                     className={`w-6 h-6 cursor-pointer 
                              ${leftMode === "large" ? "hidden" : ""} 
                           `}
                     onClick={() => handleLeftMode("large")}
                  ></Bars3Icon>
                  {topMenus.map((e: SOL_ZZ_MENU_RES, i: number) => {
                     return (
                        <div key={e.menuId} className="h-full" onClick={() => onTopMenuClick(e)}>
                           <div
                              className={`h-full cursor-pointer px-3 flex items-center
                                       ${e.menuOrdr === activeMenu ? "text-orange-500 " : ""}
                                       `}
                           >
                              <div>
                                 <span className="hover:text-orange-500">{e.menuName}</span>
                                 <motion.div
                                    animate={{ width: e.menuOrdr === activeMenu ? "100%" : "0%" }}
                                    className={`w-full h-[5px] bg-orange-400 relative top-4 rounded
                                          ${e.menuOrdr === activeMenu ? " " : "hidden"}
                                          `}
                                 ></motion.div>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
               <div className="flex ">
                  <div className="absolute  top-4 right-60">
                     <div className="h-full cursor-pointer px-3 flex items-center  space-x-1 hover:text-gray-500">
                        <div className="relative left-6 ">
                           <UserIcon className={`w-4 h-4 cursor-pointer`}></UserIcon>
                        </div>
                        <div className="relative w-[150px] pt-1  z-20">
                           <SelectComp3 ref={searchRef1} placeholder={`사용자 검색`} handleSelectChange={handleUserChange}></SelectComp3>
                        </div>
                         {/* <div className="relative right-12 z-10">
                           <ChevronDownIcon className={`w-4 h-4 cursor-pointer `}></ChevronDownIcon>
                        </div>  */}
                     </div>
                  </div>

                  <div className="absolute  top-4 right-16">
                     <div className="h-full cursor-pointer px-3 flex items-center  space-x-1 hover:text-gray-500">
                        <div className="relative left-6 ">
                        <RectangleStackIcon className={`w-4 h-4 cursor-pointer`}></RectangleStackIcon>
                        </div>
                        <div className="w-[180px] pt-1">
                           <SelectComp3 ref={searchRef2} placeholder="메뉴검색" handleSelectChange={handleMenuChange}></SelectComp3>
                        </div>
                        {/* <div className="relative -left-24">
                           <ChevronDownIcon className={`w-4 h-4 cursor-pointer`}></ChevronDownIcon>
                        </div> */}
                     </div>
                     {/* <div className="absolute top-full -left-10 bg-gray-200 w-[200px] h-auto">
                  </div> */}
                  </div>

                  {/* <div className="h-full cursor-pointer px-3 flex items-center space-x-1 hover:text-gray-500">
                     <RectangleStackIcon className={`w-4 h-4 cursor-pointer`}></RectangleStackIcon>
                     <span className="text-sm">메뉴검색</span>
                     <ChevronDownIcon className={`w-4 h-4 cursor-pointer`}></ChevronDownIcon>
                  </div> */}
                  <div className="h-full cursor-pointer px-3 flex items-center space-x-2 hover:text-gray-500">
                     {/* <UserCircleIcon className={`w-7 h-7 cursor-pointer`}></UserCircleIcon> */}
                     <div className="text-white rounded-full p-2 bg-blue-400">
                        <UserIcon className={`w-6 h-6 cursor-pointer`}></UserIcon>
                     </div>
                     <div className="text-end">
                        <div className="text-md">{loginInfo.usrNm}</div>
                        <div className="text-xs">{loginInfo.usrId}</div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Top;
