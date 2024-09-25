import React,{Suspense, useEffect} from "react";
import "../css/scroll.css";

interface WorkProps {
  components: any[];
  activeComp: any;
  leftMode: any;
  userInfo: any;
}

const Work = ({ components, activeComp, leftMode, userInfo }: WorkProps) => {


  return (
    <div className="max-h-[85vh] overflow-y-auto work-scroll">
      <div className="w-full h-full  overflow-y-hidden">
        {components.map((item) => (
          <Suspense key={item.id} fallback={<div>Loading Component...</div>}>
            <div className={`${item.id === activeComp.id ? "" : "hidden"} w-full h-full p-5 overflow-y-hidden`}>
              <item.Component className='w-full h-full overflow-y-hidden  ' item={item} activeComp={activeComp} leftMode={leftMode} userInfo={userInfo} />
            </div>
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default Work;
