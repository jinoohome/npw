// LoadingMask.tsx
import React from "react";
import BounceLoader  from "react-spinners/BounceLoader";

interface LoadingMaskProps {
   loading: boolean;
}

const LoadingMask: React.FC<LoadingMaskProps> = ({ loading }) => {
   if (!loading) return null; // loading이 false이면 아무것도 렌더링하지 않음

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
         <div className="text-white text-lg font-bold px-5 py-3 rounded-lg">
            <BounceLoader
               color="#fb923c"
               loading={loading} 
               size={50}
               aria-label="Loading Spinner"
               data-testid="loader"
      />
         </div>
      </div>
   );
};

export default LoadingMask;
