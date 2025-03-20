import React,{Suspense, useEffect, useState} from "react";
import "../css/scroll.css";
import { ZZ_MENU_RES } from "../ts/ZZ_MENU";

interface WorkProps {
  components: any[];
  activeComp: any;
  leftMode: any;
  userInfo: any;
  handleAddMenuClick: (menuItem: ZZ_MENU_RES) => void;
  soNo: string;
  soSeq: string;
  setSoNo: (soNo: string) => void;
  setSoSeq: (soSeq: string) => void;
}

const Work = ({ components, activeComp, leftMode, userInfo, handleAddMenuClick, soNo, soSeq, setSoNo, setSoSeq }: WorkProps) => {
  
  
  

  return (
    <div className="max-h-[85vh] overflow-y-auto work-scroll">
      <div className="w-full h-full  overflow-y-hidden">
        {components.map((item) => (
          <Suspense key={item.id} fallback={<div>Loading Component...</div>}>
            <div className={`${item.id === activeComp.id ? "" : "hidden"} w-full h-full p-5 overflow-y-hidden`}>
              <item.Component className='w-full h-full overflow-y-hidden  ' 
                          item={item} activeComp={activeComp} 
                          leftMode={leftMode} userInfo={userInfo} 
                          handleAddMenuClick={handleAddMenuClick}
                          soNo={soNo} soSeq={soSeq} setSoNo={setSoNo}
                          setSoSeq={setSoSeq}
                          />
            </div>
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default Work;
