import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./frame/Main";
import Login from "./work/Login";

function App() {
   return (
      <BrowserRouter basename="/">
         <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Main" element={<Main />} />
         </Routes>
         
      </BrowserRouter>
   );
}

export default App;
