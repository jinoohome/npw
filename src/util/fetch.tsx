const fetchPost = async (url: string, data: any): Promise<any> => {
   try {
      const baseURL = process.env.REACT_APP_API_URL;
      const endpoint = `${baseURL}/${url}`;

      //console.log("endpoint", endpoint);

      // 특정 요청은 accessToken 없이 처리
      const isAuthRequired = url !== "ZZ_LOGIN_TOKEN"; // 인증이 필요 없는 API 분기
      const accessToken = isAuthRequired ? sessionStorage.getItem('accessToken') : null;

      // console.log(sessionStorage.getItem('refreshToken') );
      if (isAuthRequired && !accessToken) {
         throw new Error("인증 토큰이 없습니다.");
      }

      //console.log("accessToken", accessToken);
      const response = await fetch(endpoint, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            ...(isAuthRequired && { Authorization: `Bearer ${accessToken}` }), // 인증 헤더 추가
         },
         body: JSON.stringify(data),
         credentials: "include", // 인증 정보를 포함
      });

      // 401 Unauthorized 처리
      if (response.status === 401 && isAuthRequired) {
         // console.warn("Access token expired, attempting to refresh...");
         await refreshAccessToken(); // 새 토큰 발급 시도
         return await fetchPost(url, data); // 요청 재시도
      }

      if (!response.ok) {
         throw new Error(`API 요청 실패: ${response.statusText}`);
      }

      return await response.json();
   } catch (err) {
      console.error("fetchPost Error:", err);
      throw err;
   }
};


// Refresh access token using refreshToken
const refreshAccessToken = async () => {
   try {
      const baseURL = process.env.REACT_APP_API_URL;
      const refreshToken = sessionStorage.getItem('refreshToken');

      if (!refreshToken) {
         throw new Error("Refresh Token이 없습니다. 다시 로그인하세요.");
      }

      // console.log("refreshToken", refreshToken);

      const response = await fetch(`${baseURL}/ZZ_TOKEN_CHECK`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
         console.error("토큰 갱신 실패 응답:", response.status, response.statusText);
         throw new Error("토큰 갱신 실패");
      }

      const data = await response.json();

      // console.log("토큰 갱신 데이터:", data);

      // 토큰 갱신 성공 여부 확인
      if (data.msgCd === "1" && data.accesstoken && data.refreshtoken) {
         sessionStorage.setItem('accessToken', data.accesstoken);
         sessionStorage.setItem('refreshToken', data.refreshtoken);
      } else {
         console.error("갱신 데이터가 올바르지 않습니다:", data);
         throw new Error("토큰 갱신 실패");
      }
   } catch (err:any) {
      console.error("Token Refresh Error:", err.message);

      // 토큰 갱신 실패 시 처리: 세션 초기화 및 로그인 페이지 이동
      sessionStorage.clear();
      window.location.href = "/login"; // 필요 시 React Router로 navigate("/login") 사용
   }
};

export { fetchPost };
