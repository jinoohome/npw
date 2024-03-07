const fetchPost = async (url: string, data: any) => {
   try {
      const baseURL = process.env.REACT_APP_API_URL;
      const endpoint = `${baseURL}/${url}`;

      console.log("fetchPost:", endpoint, data);
      const response = await fetch(endpoint, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("API 요청 실패");

      return await response.json();
   } catch (err) {
      throw err;
   }
};

export { fetchPost };
