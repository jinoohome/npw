import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./frame/Main";
import Login from "./work/Login";
import { LoadingProvider } from './context/LoadingContext';

function App() {
   return (
      <LoadingProvider>
         <BrowserRouter basename="/">
            <Routes>
               <Route path="/" element={<Login />} />
               <Route path="/Main" element={<Main />} />
            </Routes>
         </BrowserRouter>
      </LoadingProvider>
   );
}

export default App;
