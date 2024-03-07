import React,{Suspense} from "react";
import "../css/scroll.css";

interface WorkProps {
  components: any[];
  activeComp: any;
}

const Work = ({ components, activeComp }: WorkProps) => {
  return (
    <div className="work-scroll w-full max-h-[85vh] overflow-y-auto">
      <div className="w-full h-full ">
        {components.map((item) => (
          <Suspense key={item.id} fallback={<div>Loading Component...</div>}>
            <div className={`${item.id === activeComp.id ? "" : "hidden"} w-full h-full p-5`}>
              <item.Component className='w-full h-full' item={item} activeComp={activeComp} />
            </div>
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default Work;
