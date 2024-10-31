import React, { useEffect } from "react";

interface DaumPostcodeCompProps {
   onComplete: (data: any) => void;
}

const DaumPostcodeComp: React.FC<DaumPostcodeCompProps> = ({ onComplete }) => {
   useEffect(() => {
      // Daum 주소 API 스크립트를 동적으로 로드
      const script = document.createElement("script");
      script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
         // 컴포넌트가 언마운트될 때 스크립트 제거
         document.body.removeChild(script);
      };
   }, []);

   const handleClick = () => {
      if (window.daum && window.daum.Postcode) {
         new window.daum.Postcode({
            oncomplete: function (data: any) {
               onComplete(data);
            }
         }).open();
      } else {
         console.error("Daum Postcode API가 로드되지 않았습니다.");
      }
   };

   return (
      <button
         type="button"
         onClick={handleClick}
         className="bg-blue-500 text-white  rounded-lg px-2 py-1 flex items-center shadow"
      >
         주소 검색
      </button>
   );
};

export default DaumPostcodeComp;
