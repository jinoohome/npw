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
    <div className="work-scroll w-full max-h-[85vh] overflow-y-auto">
      <div className="w-full h-full ">
        {components.map((item) => (
          <Suspense key={item.id} fallback={<div>Loading Component...</div>}>
            <div className={`${item.id === activeComp.id ? "" : "hidden"} w-full h-full p-5`}>
              <item.Component className='w-full h-full' item={item} activeComp={activeComp} leftMode={leftMode} userInfo={userInfo} />
            </div>
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default Work;
