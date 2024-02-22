import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { couldStartTrivia } from "typescript";
import Mm0401 from "../work/Mm0401";

interface WorkProps {
   components: any;
   activeComp: any;
}

const Work = ({ components, activeComp }: WorkProps) => {

   return (
      <div className="w-full max-h-[85vh] overflow-y-auto">
         <Suspense fallback={<div>Loading Component...</div>}>
            <div className="w-full h-full ">
               {components.map((item: any) => (
                  <div key={item.id} className={`${item.id === activeComp.id ? "" : "hidden"} w-full h-full p-5`}>
                     <item.Component className='w-full h-full ' item={item} activeComp={activeComp} />
                  </div>
               ))}
            </div>
         </Suspense>
      </div>
   );
};

export default Work;
