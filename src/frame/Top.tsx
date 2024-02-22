import React, { useEffect, useState } from "react";
import { SOL_ZZ_MENU_RES } from "../ts/SOL_ZZ_MENU";
import {Bars3Icon } from "@heroicons/react/24/outline";

interface TopProps {
   topMenus: SOL_ZZ_MENU_RES[];
   onTopMenuClick: (menuItem: SOL_ZZ_MENU_RES) => void;
   activeMenu : string;
   leftMode: string;
   onLeftMode: (mode: string) => void;
 }

const Top = ({ topMenus, onTopMenuClick, activeMenu, leftMode, onLeftMode }: TopProps) => {
   
   const handleLeftMode = (mode: string) => {
      onLeftMode(mode);
   };

   return (
      <div>
         <div className="bg-white h-[70px] shadow-lg flex border-b ">
            <div className="h-full flex gap-7 px-3 items-center">
               <Bars3Icon className={
                              `w-6 h-6 cursor-pointer 
                              ${leftMode === 'large' ? 'hidden' : ''} 
                           `}  
                           onClick={() => handleLeftMode("large")}
               >
               </Bars3Icon>
               {topMenus.map((e: SOL_ZZ_MENU_RES, i: number) => {
                  return (
                     <div key={e.menuId} className="h-full" onClick={() => onTopMenuClick(e)}>
                        <div className={`h-full cursor-pointer px-3 flex items-center
                                       ${e.menuOrdr === activeMenu ? 'text-orange-500 ' : ''}
                                       `}>
                           <div>
                              <span className="">{e.menuName}</span>
                              <div className={`w-full h-[5px] bg-orange-400 relative top-4 rounded
                                          ${e.menuOrdr === activeMenu ? ' ' : 'hidden'}
                                          `}></div>
                           </div>
                  
                        </div>
                       
                     </div>
                  );
               })}
            </div>
              
         </div>
      </div>
   );
};

export default Top;
