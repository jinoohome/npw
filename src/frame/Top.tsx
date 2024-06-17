import { React, useEffect, useState, useRef, useCallback, initChoice, initChoice2, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, getGridDatas, refreshGrid, reSizeGrid, InputComp1, InputComp2, SelectComp3 } from "../comp/Import";
import { ZZ_MENU_RES  } from "../ts/ZZ_MENU";
import { Bars3Icon, UserIcon, ChevronDownIcon, RectangleStackIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { motion, useDragControls  } from "framer-motion";
import "../css/TopScrollbar.css";
import { useDraggable } from "react-use-draggable-scroll";

interface TopProps {
   loginInfo: any;
   userInfo: any;
   topMenus: ZZ_MENU_RES [];
   searchMenus: ZZ_MENU_RES [];
   onTopMenuClick: (menuItem: ZZ_MENU_RES ) => void;
   activeMenu: string;
   topMode: string;
   onLeftMode: (mode: string) => void;
   onTopMode: (mode: string) => void;
   onUserChange: (value: string) => void;
   onSearchMenuClick: (menuItem: ZZ_MENU_RES ) => void;
}

const Top = ({loginInfo, userInfo, topMenus, searchMenus, onTopMenuClick, activeMenu, topMode, onLeftMode, onTopMode, onUserChange, onSearchMenuClick }: TopProps) => {
   const searchRef1 = useRef<any>(null);
   const searchRef2 = useRef<any>(null);
   const dragRef = useRef<any>(null);

   const [searchChoice1, setSearchChoice1] = useState<any>();
   const [searchChoice2, setSearchChoice2] = useState<any>();

   const [users, setUsers] = useState<any[]>([]);
   const { events } = useDraggable(dragRef);

 

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
      const users = await ZZ_USERS();
      setUsers(users);
   };

   const handleLeftMode = (mode: string) => {
      onLeftMode(mode);
   };
   const handleTopMode = (mode: string) => {
      onTopMode(mode);
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

   const ZZ_USERS = async () => {
      try {
         const param = {
            usrId: "sckcs",
            coCd: "999",
            usrDiv: "999",
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ_USERS`, { data });
         return result;
      } catch (error) {
         console.error("ZZ_USERS Error:", error);
         throw error;
      }
   };

   //---------------------- render -----------------------------
   const renderTopMenu = () => {
      if(topMode === "large") {
         return(
            <div className="flex gap-7 px-3 items-center h-full">
              
               {topMenus.map((e: ZZ_MENU_RES , i: number) => {
                  return (
                     <div key={e.menuId} className="h-full" onClick={() => onTopMenuClick(e)}>
                        <div
                           className={`h-full cursor-pointer px-3 flex items-center
                                    ${e.menuOrdr === activeMenu ? "text-orange-500 " : ""}
                                    `}
                        >
                           <div>
                              <span className="hover:text-orange-500 select-none">{e.menuName}</span>
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
         );

      }else if(topMode ==='over'){
         return(
            <div className="flex gap-7 px-3 items-center h-full">
               <Bars3Icon
                  className={`w-6 h-6 cursor-pointer 
                        
                        `}
                  onClick={() => {
                                    handleLeftMode("large");
                                    handleTopMode("large");
                              }
                           }
               ></Bars3Icon>
               {topMenus.map((e: ZZ_MENU_RES , i: number) => {
                  return (
                     <div key={e.menuId} className="h-full" onClick={() => onTopMenuClick(e)}>
                        <div
                           className={`h-full cursor-pointer px-3 flex items-center
                                    ${e.menuOrdr === activeMenu ? "text-orange-500 " : ""}
                                    `}
                        >
                           <div>
                              <span className="hover:text-orange-500 select-none">{e.menuName}</span>
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
         );


      }else if(topMode ==='mobileClose'){
         return(
            <div className="flex gap-7 px-3 items-center h-full">
               <Bars3Icon
                  className={`w-6 h-6 cursor-pointer                           
                        `}
                  onClick={() => {
                        handleTopMode("mobileOpen");
                        handleLeftMode("mobileOpen");
                     }
                  }
               ></Bars3Icon>
            </div>
         );

      }else if(topMode ==='mobileOpen'){
         return(
            <div className="flex gap-7 px-3 items-center h-full">
         
            </div>
         );


      }

   };

   const renderUserSearch = () => {

      
         return (
            <div className="relative left-36 md:left-28 z-30">
               <div className="h-full cursor-pointer flex items-center hover:text-gray-500">
                  <div className="relative left-6 ">
                     <UserIcon className={`w-4 h-4 cursor-pointer`}></UserIcon>
                  </div>
                  <div className=" w-[150px] pt-1  ">
                     <SelectComp3 ref={searchRef1} placeholder={`사용자 검색`} handleSelectChange={handleUserChange}></SelectComp3>
                  </div>
               </div>
            </div>
         );



   };


   const renderMenuSearch = () => {
      return(
         <div className="relative left-24 md:left-20 z-20">
            <div className="h-full cursor-pointer flex items-center  hover:text-gray-500">
               <div className="relative left-6 ">
               <RectangleStackIcon className={`w-4 h-4 cursor-pointer`}></RectangleStackIcon>
               </div>
               <div className="w-[180px] pt-1">
                  <SelectComp3 ref={searchRef2} placeholder="메뉴검색" handleSelectChange={handleMenuChange}></SelectComp3>
               </div>
            </div>
         </div>


      )

   };


   
   const renderMyMenu = () => {

      return(
         <div className=" relative z-30 h-full cursor-pointer px-3 flex items-center space-x-2 hover:text-gray-500">
            <div className="text-white rounded-full p-2 bg-blue-400">
               <UserIcon className={`w-6 h-6 cursor-pointer`}></UserIcon>
            </div>
            <div className="text-end min-w-[60px]">
               <div className="text-md">{loginInfo.usrNm}</div>
               <div className="text-xs">{loginInfo.usrId}</div>
            </div>
         </div>
         )
   };





   return (
      <div className="topMenu w-full">
         {loginInfo && userInfo && (
            <div className="bg-white h-[70px] shadow-lg flex justify-between border-b w-full  ">
               <div {...events} ref={dragRef} className="w-[65%] h-full  overflow-x-auto  overflow-y-hidden whitespace-nowrap top-scroll ">
                  {renderTopMenu()}
               </div>
               <div className="w-[35%] min-w-[200px] lg:min-w-[450px] flex justify-end ">
                  {renderUserSearch()}
                  {renderMenuSearch()} 
                  {renderMyMenu()}
                  
               </div>
            </div>
         )}
      </div>
   );
};

export default Top;
