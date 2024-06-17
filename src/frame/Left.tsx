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
   onTopMode: (mode: string) => void;
}

const Left = ({ leftMenus, activeComp, leftMode, onLeftMenuClick, onLeftMode, onTopMode }: LeftProps) => {
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

   const handleTopMode = (mode: string) => {
      onTopMode(mode);
   };

   const moveToHome = () => { 
      window.location.href = '/Main';
   };

   const renderLogo = () => {
      if (leftMode == "large") {
         return (
            <div className="w-full h-[70px] flex items-center " >

               <div 
                   onClick={() => moveToHome()}
                  className="flex items-center w-2/3 space-x-1 justify-end">

                  <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M8.93719 0.499962L6.00684 1.98478L3.0769 0.499962L6.00684 6.12256L8.93719 0.499962Z" fill="#FAC000"/>
                     <path d="M9.9623 4.84571L9.91819 4.80636L12.0077 3.91907V0.952124L8.37473 2.51544C8.37473 2.51544 6.40879 6.27751 6.36241 6.36346C7.90423 6.54987 9.0611 7.85491 9.0611 9.42506C9.0611 11.1274 7.69103 12.5123 6.00661 12.5123C4.32116 12.5123 2.95028 11.1274 2.95028 9.42506C2.95028 7.85491 4.10653 6.54987 5.64752 6.36346C5.6032 6.27751 3.63808 2.51544 3.63808 2.51544L0.00946262 0.952124V3.91907L2.09955 4.80636L2.0542 4.84571C0.744255 6.00204 -0.00756836 7.6712 -0.00756836 9.42506C-0.00756836 12.7746 2.68927 15.5 6.00661 15.5C9.32272 15.5 12.0224 12.7746 12.0224 9.42506C12.0224 7.67285 11.2716 6.00329 9.9623 4.84571Z" fill="#FAC000"/>
                     </svg>

                  <span 
                    
                     className=" text-xl text-[#00A950]  font-[농협체M] text-end hover:text-[#03c55f] cursor-pointer">
                     농협파트너스
                  </span>

               </div>
               <div className="w-1/3 flex justify-center">
                  <Bars3Icon className="text-gray-400/80 w-6 h-6 hover:text-gray-400 cursor-pointer" 
                  onClick={() => { handleLeftMode('small'); 
                                    handleTopMode("over");
                                 }
                           }></Bars3Icon>
               </div>
            </div>
         );
      } else if(leftMode == 'small') {
         return (
            <div className="w-full min-w-[60px] h-[70px] flex items-center" >
               <span 
                  onClick={() => moveToHome()}
                  className="w-full text-center flex justify-center text-xl text-[#00A950] font-bold font-[SUITE-Regular]  hover:text-[#03c55f] cursor-pointer">  
                     <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M14.3944 0.749942L9.99891 2.97717L5.604 0.749942L9.99891 9.18384L14.3944 0.749942Z" fill="#FAC000"/>
                     <path d="M15.9321 7.26856L15.8659 7.20954L19.0001 5.87861V1.42818L13.5507 3.77316C13.5507 3.77316 10.6018 9.41626 10.5323 9.54519C12.845 9.8248 14.5803 11.7824 14.5803 14.1376C14.5803 16.691 12.5252 18.7685 9.99856 18.7685C7.47039 18.7685 5.41406 16.691 5.41406 14.1376C5.41406 11.7824 7.14845 9.8248 9.45993 9.54519C9.39345 9.41626 6.44577 3.77316 6.44577 3.77316L1.00284 1.42818V5.87861L4.13797 7.20954L4.06995 7.26856C2.10503 9.00306 0.977295 11.5068 0.977295 14.1376C0.977295 19.1618 5.02255 23.25 9.99856 23.25C14.9727 23.25 19.0223 19.1618 19.0223 14.1376C19.0223 11.5093 17.8961 9.00493 15.9321 7.26856Z" fill="#FAC000"/>
                     </svg>


                  </span>
            </div>
         );
      } else if(leftMode == 'over') {
         return (
            <div className="w-full h-[70px] flex items-center" >

               <div 
                   onClick={() => moveToHome()}
                  className="flex items-center w-2/3 space-x-1 justify-end">

                  <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M8.93719 0.499962L6.00684 1.98478L3.0769 0.499962L6.00684 6.12256L8.93719 0.499962Z" fill="#FAC000"/>
                     <path d="M9.9623 4.84571L9.91819 4.80636L12.0077 3.91907V0.952124L8.37473 2.51544C8.37473 2.51544 6.40879 6.27751 6.36241 6.36346C7.90423 6.54987 9.0611 7.85491 9.0611 9.42506C9.0611 11.1274 7.69103 12.5123 6.00661 12.5123C4.32116 12.5123 2.95028 11.1274 2.95028 9.42506C2.95028 7.85491 4.10653 6.54987 5.64752 6.36346C5.6032 6.27751 3.63808 2.51544 3.63808 2.51544L0.00946262 0.952124V3.91907L2.09955 4.80636L2.0542 4.84571C0.744255 6.00204 -0.00756836 7.6712 -0.00756836 9.42506C-0.00756836 12.7746 2.68927 15.5 6.00661 15.5C9.32272 15.5 12.0224 12.7746 12.0224 9.42506C12.0224 7.67285 11.2716 6.00329 9.9623 4.84571Z" fill="#FAC000"/>
                     </svg>

                  <span 
                    
                     className=" text-xl text-[#00A950]  font-[농협체M] text-end hover:text-[#03c55f] cursor-pointer">
                     농협파트너스
                  </span>

               </div>
              
            </div>
         );

      }else if (leftMode == "mobileOpen") {
         return (
            <div className="w-full h-[70px] flex items-center " >

               <div 
                   onClick={() => moveToHome()}
                  className="flex items-center w-2/3 space-x-1 justify-end">

                  <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M8.93719 0.499962L6.00684 1.98478L3.0769 0.499962L6.00684 6.12256L8.93719 0.499962Z" fill="#FAC000"/>
                     <path d="M9.9623 4.84571L9.91819 4.80636L12.0077 3.91907V0.952124L8.37473 2.51544C8.37473 2.51544 6.40879 6.27751 6.36241 6.36346C7.90423 6.54987 9.0611 7.85491 9.0611 9.42506C9.0611 11.1274 7.69103 12.5123 6.00661 12.5123C4.32116 12.5123 2.95028 11.1274 2.95028 9.42506C2.95028 7.85491 4.10653 6.54987 5.64752 6.36346C5.6032 6.27751 3.63808 2.51544 3.63808 2.51544L0.00946262 0.952124V3.91907L2.09955 4.80636L2.0542 4.84571C0.744255 6.00204 -0.00756836 7.6712 -0.00756836 9.42506C-0.00756836 12.7746 2.68927 15.5 6.00661 15.5C9.32272 15.5 12.0224 12.7746 12.0224 9.42506C12.0224 7.67285 11.2716 6.00329 9.9623 4.84571Z" fill="#FAC000"/>
                     </svg>

                  <span 
                    
                     className=" text-xl text-[#00A950]  font-[농협체M] text-end hover:text-[#03c55f] cursor-pointer">
                     농협파트너스
                  </span>

               </div>
               <div className="w-1/3 flex justify-center">
                  <Bars3Icon className="text-gray-400/80 w-6 h-6 hover:text-gray-400 cursor-pointer" 
                  onClick={() => { handleLeftMode('mobileClose'); 
                                    handleTopMode("mobileClose");
                                 }
                           }></Bars3Icon>
               </div>
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
               className="list-none text-gray-400/80  ">
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
      }else if(leftMode === "mobileOpen" ) {
         return (
            <motion.ul 
               initial={{opacity: 0}}
               animate={{opacity: 1}}
               transition={{duration: 0.5, ease: "easeInOut"}}
               className="list-none text-gray-400/80  ">
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
