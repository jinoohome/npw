import { React, useEffect, useState, useRef, useCallback, initChoice, initChoice2, updateChoices, alertSwal, fetchPost, Breadcrumb, TuiGrid01, getGridDatas, refreshGrid, reSizeGrid, InputComp1, InputComp2, SelectComp3 } from "../comp/Import";

import { useNavigate } from "react-router-dom";

import { UserIcon ,KeyIcon } from "@heroicons/react/24/outline";

const Login = () => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const navigate = useNavigate();

   const handleLogin = async () => {
      const data = {
         id: username,
         pw: password,
      };

      let result = await ZZ_LOGIN_TOKEN(data);

      //console.log(result);
      

      if (result.result === "SUCCESS") {
         sessionStorage.setItem('loginInfo', JSON.stringify(result));
         sessionStorage.setItem('accessToken', result.accesstoken);
         sessionStorage.setItem('refreshToken', result.refreshtoken);

         //console.log('accessToken',sessionStorage.getItem('accessToken'));
         navigate('/Main', { state: { result: result } });
      } else {
         setError("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
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
      <div className="w-full h-screen bg-gray-100 flex flex-col items-center ">
         <div className="flex h-[85%] w-[60%] justify-center items-center">
            <div className="w-full h-[75%] flex justify-center items-center bg-white rounded-lg">
               <div className="w-1/3 px-10 py-40   ">
                  <div className="space-y-3 w-full">
                     <div className="mb-24 flex flex-col items-center justify-center space-y-5">
                        <div className="text-4xl bold font-[Giants-Bold]">로그인 화면</div>
                        <div>회사이름</div>
                     </div>
                     <div className="flex items-center relative">
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 border-r pr-2 border-gray-400">
                           <UserIcon className="w-[25px]" />
                        </div>

                        <input 
                           type="text" 
                           value={username} 
                           placeholder="User ID"
                           className="w-full pl-16 pr-3 py-3 border border-gray-300 rounded-lg text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" onChange={(e) => setUsername(e.target.value)} />
                     </div>
                     <div className="flex items-center relative">
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 border-r pr-2 border-gray-400">
                           <KeyIcon className="w-[25px]" />
                        </div>
                        <input
                           type="password"
                           placeholder="Password"
                           value={password}
                           className="w-full pl-16 pr-3 py-3 border border-gray-300 rounded-lg text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                           onChange={(e) => setPassword(e.target.value)}
                        />
                     </div>

                     <div>
                        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md" onClick={handleLogin}>
                           로그인
                        </button>
                     </div>

                     {error && <p>{error}</p>}
                  </div>
               </div>
               <div className="w-2/3 h-full">
                  <div className="w-full h-full  bg-[url('./images/login/main.jpg')] bg-no-repeat  bg-cover bg-center rounded-r-lg"></div>
               </div>
            </div>
         </div>

         <div className="w-full h-[15%] justify-self-end">
            <div className="bg-blue-950 h-full">
               <div className="h-full flex p-5">
                  <div className="w-[23%] h-full flex justify-center items-center text-white text-xl shadow ">회사이름</div>
                  <div className="w-[54%] h-full  text-white text-sm text-gray-200/60">
                     <div className="h-full">
                        <div className="w-full flex justify-between px-2">
                           <div className="flex">
                              <div>이용약관</div>
                              <div>ㅣ</div>
                              <div>개인정보 보호방침</div>
                           </div>

                           <div>© 2024. 회사이름 INC. All Rights Reserved.</div>

                        </div>
                        <div className="w-full border-b my-2  "></div>

                        <div>
                           <div className="w-full grid grid-cols-2 px-2">
                              <div>대표자 : 홍길동</div>
                              <div className="lg:ps-28">이메일 : xxxxx@xxxxx.com</div>
                              <div>대표전화 : 02-1234-5678</div>
                              <div className="lg:ps-28">사업자등록번호 : 123-45-67890</div>
                              <div>통신판매번호 : 제 2024-서울강남-0000호</div>
                              <div className="lg:ps-28">주소 : 서울시 강남구 삼성동 123-45</div>
                           </div>

                        </div>

                     </div>

                  </div>
                  <div className="w-[23%]"></div>

               </div>
            </div>

         </div>
      </div>
   );
};

export default Login;
