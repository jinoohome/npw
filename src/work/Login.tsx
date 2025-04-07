import { React, useEffect, useState, useRef, useCallback, initChoice, initChoice2, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, getGridDatas, refreshGrid, reSizeGrid, InputComp1, InputComp2, SelectComp3 } from "../comp/Import";

import { useNavigate } from "react-router-dom";

import { UserIcon ,KeyIcon } from "@heroicons/react/24/outline";
import { useLoading } from '../context/LoadingContext';
import { useLoadingFetch } from '../hooks/useLoadingFetch';
import LoadingSpinner from '../components/LoadingSpinner';



const Login = () => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const navigate = useNavigate();
   const { fetchWithLoading } = useLoadingFetch();

   // 엔터키 이벤트 핸들러
   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
         handleLogin();
      }
   };

   const handleLogin = async () => {
      await fetchWithLoading(async () => {
         const data = {
            id: username,
            pw: password,
         };

         let result = await ZZ_LOGIN_TOKEN(data);

         if (result.result === "SUCCESS") {
            sessionStorage.setItem('loginInfo', JSON.stringify(result));
            sessionStorage.setItem('accessToken', result.accesstoken);
            sessionStorage.setItem('refreshToken', result.refreshtoken);
            navigate('/Main', { state: { result: result } });
         } else {
            setError("아이디 또는 비밀번호가 일치하지 않습니다.");
         }
      });
   };

   //---------------------- api -----------------------------

   const ZZ_LOGIN_TOKEN = async (data: any) => {
      try {
         const result = await fetchPost(`ZZ_LOGIN_TOKEN`, data);
         return result as any;
      } catch (error) {
         console.error("ZZ_USER_LOGIN Error:", error);
         throw error;
      }
   };

   return (
      <div className="w-full h-screen bg-gray-100 flex flex-col items-center">
         <LoadingSpinner />
         <div className="flex h-[85%] w-full sm:w-[90%] md:w-[80%] lg:w-[60%] justify-center items-center px-4 sm:px-0">
            <div className="w-full sm:h-[75%] flex flex-col md:flex-row justify-center items-center bg-white rounded-lg shadow-md sm:shadow-lg md:shadow-none overflow-hidden">
               <div className="w-full md:w-1/2 lg:w-1/3 px-5 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10">
                  <div className="space-y-4 sm:space-y-5 md:space-y-3 w-full">
                     <div className="mb-5 sm:mb-7 md:mb-10 flex flex-col items-center justify-center space-y-2 sm:space-y-4 md:space-y-5">
                        <div className="flex flex-col justify-center items-center space-y-1 sm:space-y-2">
                           <div className="text-center text-sm sm:text-base">안녕하세요! <span className="text-blue-700 text-base sm:text-lg font-[농협체M]">농협파트너스</span>입니다.</div>
                           <div className="text-2xl sm:text-4xl md:text-5xl bold font-[농협체M] text-center">로그인 화면</div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 bg-green-700/15 p-1.5 sm:p-2.5 md:p-2 px-3 sm:px-5 md:px-4 rounded-lg sm:rounded-xl md:rounded-lg">
                           <div>
                              <img src="/images/logo.png" alt="logo" className="w-[10px] sm:w-[15px] md:w-[13px]" />
                           </div>
                           <div className="text-green-600 font-[농협체M] text-sm sm:text-xl md:text-xl">농협파트너스 정보시스템</div>
                        </div>
                     </div>
                     <div className="flex items-center relative mb-4 sm:mb-5 md:mb-0">
                        <div className="absolute left-3 sm:left-4 md:left-2 top-1/2 transform -translate-y-1/2 z-10 border-r pr-2 border-gray-400">
                           <UserIcon className="w-[18px] sm:w-[22px] md:w-[20px] text-gray-500 sm:text-gray-600 md:text-current" />
                        </div>

                        <input 
                           type="text" 
                           value={username} 
                           placeholder="User ID"
                           className="w-full pl-12 sm:pl-14 md:pl-12 pr-3 py-2.5 sm:py-3 md:py-2 border border-gray-300 sm:border-gray-200 md:border-gray-300 rounded-lg sm:rounded-xl md:rounded-lg text-sm sm:text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:shadow-md md:shadow-sm" 
                           onChange={(e) => setUsername(e.target.value)}
                           onKeyPress={handleKeyPress}
                        />
                     </div>
                     <div className="flex items-center relative mb-4 sm:mb-5 md:mb-0">
                        <div className="absolute left-3 sm:left-4 md:left-2 top-1/2 transform -translate-y-1/2 z-10 border-r pr-2 border-gray-400">
                           <KeyIcon className="w-[18px] sm:w-[22px] md:w-[20px] text-gray-500 sm:text-gray-600 md:text-current" />
                        </div>
                        <input
                           type="password"
                           placeholder="Password"
                           value={password}
                           className="w-full pl-12 sm:pl-14 md:pl-12 pr-3 py-2.5 sm:py-3 md:py-2 border border-gray-300 sm:border-gray-200 md:border-gray-300 rounded-lg sm:rounded-xl md:rounded-lg text-sm sm:text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:shadow-md md:shadow-sm"
                           onChange={(e) => setPassword(e.target.value)}
                           onKeyPress={handleKeyPress}
                        />
                     </div>

                     <div>
                        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 md:py-2 px-4 rounded-lg sm:rounded-xl md:rounded-lg shadow-md text-sm sm:text-base transition-colors duration-200 sm:shadow-lg md:shadow-md" onClick={handleLogin}>
                           로그인
                        </button>
                     </div>

                     {error && <p className="text-red-500 text-center text-sm mt-2 sm:mt-3 md:mt-0">{error}</p>}
                  </div>
               </div>
               <div className="hidden lg:block w-2/3 h-full">
                  <div className="w-full h-full bg-[url('./images/login/main.jpg')] bg-no-repeat bg-cover bg-center rounded-r-lg"></div>
               </div>
            </div>
         </div>

         <div className="w-full mt-auto">
            <div className="bg-blue-950">
               <div className="flex flex-col md:flex-row p-4 sm:p-5 md:p-5">
                  <div className="w-full md:w-[23%] flex justify-center items-center text-white/50 text-base sm:text-xl md:text-xl shadow font-[농협체M] py-3 sm:py-4 md:py-0">농협파트너스</div>
                  <div className="w-full md:w-[54%] text-white text-xs sm:text-sm md:text-sm text-gray-200/60">
                     <div>
                        <div className="w-full flex flex-col md:flex-row justify-between px-2">
                           <div className="flex">
                              {/* <div>이용약관</div>
                              <div>ㅣ</div>
                              <div>개인정보 보호방침</div> */}
                           </div>

                           <div className="text-center sm:text-right md:text-left text-xs sm:text-sm">© 2025. 농협파트너스 INC. All Rights Reserved.</div>

                        </div>
                        <div className="w-full border-b my-2 opacity-40 sm:opacity-50 md:opacity-100"></div>

                        <div>
                           <div className="hidden md:grid md:grid-cols-2 px-2 text-xs sm:text-sm gap-y-1 sm:gap-y-0">
                              <div>대표자 : 이 범 석</div>
                              <div className="md:ps-28">대표전화 : 02-569-9100</div>
                              <div>사업자등록번호 : 106-81-95255</div>
                              <div className="md:ps-28">팩스번호 : 02-560-9110</div>
                           </div>
                           <div className="md:ps-2 text-center sm:text-right md:text-left text-xs sm:text-sm mt-2 sm:mt-0 pb-2 md:pb-0">
                              <div className="block md:hidden mb-1 sm:mb-0">대표전화 : 02-569-9100</div>
                              <div className="hidden md:block">주소 : 서울특별시 강동구 올림픽로 48길 7(성내동 553), 농협서울지역본부 별관 1,2층</div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="w-full md:w-[23%]"></div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Login;
