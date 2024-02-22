import React from 'react';

const Mm0402 = () => {
   return (
      <div>
         <h2>기준정보등록</h2>
         <form>
            <div className="mb-4">
               <label htmlFor="inputField" className="block text-sm font-medium text-gray-700">
                  테스트
               </label>
               <input
                  type="text"
                  id="inputField"
                  name="inputField"
                  className="mt-1 p-2 border rounded-md w-full"
               />
            </div>
            <button
               type="submit"
               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
               제출
            </button>
         </form>
      </div>
   );
};

export default Mm0402;
