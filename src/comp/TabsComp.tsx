import React, { useState } from 'react';

interface TabsProps {
  labels: string[];
  contents: React.ReactNode[];
  initialTab?: number; // Optional: To set the initial active tab
}

const Tabs1: React.FC<TabsProps> = ({ labels, contents, initialTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="w-full">
      <div className="flex border-b">
        {labels.map((label, index) => (
          <button
            key={index}
            className={`px-4 py-2 focus:outline-none ${
              activeTab === index ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
            onClick={() => handleTabClick(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {contents[activeTab]}
      </div>
    </div>
  );
};


interface TabsProps2 {
   labels: string[];
   contents: React.ReactNode[];
   initialTab?: number; // Optional: To set the initial active tab
 }
 
 const Tabs2: React.FC<TabsProps2> = ({ labels, contents, initialTab = 0 }) => {
   const [activeTab, setActiveTab] = useState(initialTab);
 
   const handleTabClick = (index: number) => {
     setActiveTab(index);
   };
 
   return (
     <div className="w-full">
       <div className="flex border-b">
         {labels.map((label, index) => (
           <button
             key={index}
             className={`px-4 py-2 focus:outline-none ${
               activeTab === index ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
             }`}
             onClick={() => handleTabClick(index)}
           >
             {label}
           </button>
         ))}
       </div>
       <div className="p-4">
         {contents[activeTab]}
       </div>
     </div>
   );
 };

export {Tabs1, Tabs2};