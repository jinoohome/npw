import React, { useEffect, useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { ChevronDownIcon, StopIcon, Bars3Icon } from "@heroicons/react/24/outline";
import "../css/LeftScrollbar.css";
import { ZZ_MENU_RES } from "../ts/ZZ_MENU";
import { motion } from "framer-motion";

interface LeftProps {
   leftMenus: ZZ_MENU_RES [];
   activeComp: any;
   leftMode: string;
   onLeftMenuClick: (menuItem: ZZ_MENU_RES ) => void;
   onLeftMode: (mode: string) => void;
}

const Left = ({ leftMenus, activeComp, leftMode, onLeftMenuClick, onLeftMode }: LeftProps) => {
   const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

   const handleClick = (menu: ZZ_MENU_RES ) => {
      onLeftMenuClick(menu);
   };

   const handleToggle = (menu: ZZ_MENU_RES ) => {
      setExpandedMenus((prev) => ({
         ...prev,
         [menu.menuId]: !prev[menu.menuId],
      }));
   };

   const handleLeftMode = (mode: string) => {
      onLeftMode(mode);
   };

   const moveToHome = () => { 
      window.location.href = '/Main';
   };

   const renderLogo = () => {
      if (leftMode == "large") {
         return (
            <div className="w-full h-[70px] flex items-center" >
               <span 
                   onClick={() => moveToHome()}
                  className="w-2/3 text-xl text-orange-500 font-bold font-[SUITE-Regular] text-end hover:text-orange-400 cursor-pointer">
                     SOLCOMBINE
               </span>
               <div className="w-1/3 flex justify-center">
                  <Bars3Icon className="text-gray-400/80 w-6 h-6 hover:text-gray-400 cursor-pointer" onClick={() => handleLeftMode("small")}></Bars3Icon>
               </div>
            </div>
         );
      } else {
         return (
            <div className="w-full h-[70px] flex items-center" >
               <span 
                  onClick={() => moveToHome()}
                  className="w-full text-center text-xl text-orange-500 font-bold font-[SUITE-Regular]  hover:text-orange-400 cursor-pointer">SOL</span>
            </div>
         );
      }
   };

   const renderMenuItems = () => {
      if (leftMode === "large" ) {
         // "large" 모드일 때의 메뉴 항목 렌더링
         return (
            <motion.ul 
               initial={{opacity: 0}}
               animate={{opacity: 1}}
               transition={{duration: 0.5, ease: "easeInOut"}}
               className="list-none text-gray-400/80 ">
               {leftMenus.map((menu, index) => {
                  switch (menu.lev) {
                     case 0:
                        return (
                           <li key={index} className="ps-5 py-2 bg-black mb-3  hover:text-gray-400 cursor-pointer">
                              {menu.menuName}
                           </li>
                        );
                     case 1:
                        return (
                           <li key={index}>
                              <div className={`px-2 mb-1 mt-5 cursor-pointer select-none `} 
                              onClick={() => handleToggle(menu)}>
                                 <div className={`flex justify-between p-2 ${menu.menuId === activeComp.paMenuId ? "bg-sky-900/40 rounded-full" : ""}`}>
                                    <div className={`flex ${menu.menuId === activeComp.paMenuId ? "text-white " : ""}`}>
                                       <span dangerouslySetInnerHTML={{ __html: menu.icon }} />
                                       <span className="menu-item ps-3  hover:text-gray-400" data-key={menu.menuId}>
                                          {menu.menuName}
                                       </span>
                                    </div>
                                    {!menu.prgmId && 
                                       <motion.div
                                       animate={{ rotate: expandedMenus[menu.menuId ?? ""] ? 180 : 0 }}
                                       transition={{ duration: 0.2, ease: "easeOut" }}
                                       >
                                       <ChevronDownIcon className={`h-6 w-6 }`} />
                                       </motion.div>   
                                    }

                                 </div>
                              </div>
                           </li>
                        );
                     case 2:
                        return (
                           <motion.li 
                              key={index} 
                              className={`cursor-pointer p-1 mx-2 select-none ${expandedMenus[menu.paMenuId ?? ""] ? "hidden" : ""}`} 
                              animate={{  y: expandedMenus[menu.paMenuId ?? ""] ? -20 : 0, opacity: expandedMenus[menu.paMenuId ?? ""] ? 0 : 1}}
                              transition={{ duration: 0.2, ease: "backInOut" }}
                              onClick={() => handleClick(menu)}
                              >
                              <div className={`menu-link flex items-center space-x-2 ps-4 ${menu.menuId === activeComp.menuId ? "text-white" : ""}`}>
                                 <span>
                                    <StopIcon className="w-3 h-3" />
                                 </span>
                                 <span className="hover:text-gray-400">{menu.menuName}</span>
                              </div>
                           </motion.li>
                        );
                     default:
                        return null;
                  }
               })}
            </motion.ul>
         );
      } else if(leftMode == 'small') {
         // "small" 모드일 때의 메뉴 항목 렌더링
         return (
            <ul className="list-none text-gray-400/80 cursor-pointer" onMouseEnter={()=>{handleLeftMode('over')}}>
               {leftMenus.map((menu, index) => {
                  switch (menu.lev) {
                     case 1:
                        return (
                           <li key={index}>
                              <div className="flex justify-between m-4 mb-16 mt-16 cursor-pointer select-none" onClick={() => handleToggle(menu)}>
                                 <div className={`flex ${menu.menuId === activeComp.paMenuId ? "text-white" : ""}`}>
                                    <span dangerouslySetInnerHTML={{ __html: menu.icon }} />
                                    <span className="menu-item ps-3 hidden " data-key={menu.menuId}>
                                       {menu.menuName}
                                    </span>
                                 </div>
                                 {!menu.prgmId && <ChevronDownIcon className={`h-6 w-6 hidden ${expandedMenus[menu.menuId ?? ""] ? "rotate-180" : ""}`} />}
                              </div>
                           </li>
                        );
                     case 2:
                        return (
                           <li key={index} className={`cursor-pointer p-1 mx-2 select-none hidden ${expandedMenus[menu.paMenuId ?? ""] ? "hidden" : ""}`} onClick={() => handleClick(menu)}>
                              <div className={`menu-link flex items-center space-x-2 ps-4 ${menu.menuId === activeComp.menuId ? "text-white" : ""}`}>
                                 <span>
                                    <StopIcon className="w-3 h-3" />
                                 </span>
                                 <span>{menu.menuName}</span>
                              </div>
                           </li>
                        );
                     default:
                        return null;
                  }
               })}
            </ul>
         );
      } else if(leftMode == 'over') {
         return (
            <motion.ul 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5, ease: "easeInOut"}}
            className="list-none text-gray-400/80"  onMouseLeave={()=>{handleLeftMode('small')}}>
               {leftMenus.map((menu, index) => {
                  switch (menu.lev) {
                     case 0:
                        return (
                           <li key={index} className="ps-5 py-2 bg-black mb-3">
                              {menu.menuName}
                           </li>
                        );
                     case 1:
                        return (
                           <li key={index}>
                              <div className="flex justify-between m-4 mb-2 mt-5 cursor-pointer select-none" onClick={() => handleToggle(menu)}>
                                 <div className={`flex ${menu.menuId === activeComp.paMenuId ? "text-white" : ""}`}>
                                    <span dangerouslySetInnerHTML={{ __html: menu.icon }} />
                                    <span className="menu-item ps-3" data-key={menu.menuId}>
                                       {menu.menuName}
                                    </span>
                                 </div>
                                 {!menu.prgmId && 
                                    <motion.div
                                    animate={{ rotate: expandedMenus[menu.menuId ?? ""] ? 180 : 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                    <ChevronDownIcon className={`h-6 w-6}`} />
                                    </motion.div>   
                                 }
                              </div>
                           </li>
                        );
                     case 2:
                        return (
                          
                           <motion.li key={index} 
                              className={`cursor-pointer p-1 mx-2 select-none ${expandedMenus[menu.paMenuId ?? ""] ? "hidden" : ""}`} 
                              animate={{  y: expandedMenus[menu.paMenuId ?? ""] ? -20 : 0, opacity: expandedMenus[menu.paMenuId ?? ""] ? 0 : 1}}
                              transition={{ duration: 0.2, ease: "backInOut" }}
                              onClick={() => handleClick(menu)}>
                              <div className={`menu-link flex items-center space-x-2 ps-4 ${menu.menuId === activeComp.menuId ? "text-white" : ""}`}>
                                 <span>
                                    <StopIcon className="w-3 h-3" />
                                 </span>
                                 <span>{menu.menuName}</span>
                              </div>
                           </motion.li>
                        );
                     default:
                        return null;
                  }
               })}
            </motion.ul>
         );
      }
   };

   return (
      <div className="h-[98vh] bg-sky-950 overflow-y-scroll hide-scrollbar" >
         {renderLogo()}
         {renderMenuItems()}
      </div>
   );
};

export default Left;
