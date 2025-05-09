import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./frame/Main";
import Login from "./work/Login";
import Survey from "./work/zz/Survey";
import { LoadingProvider } from './context/LoadingContext';

function App() {
   return (
      <LoadingProvider>
         <BrowserRouter basename="/">
            <Routes>
               <Route path="/" element={<Login />} />
               <Route path="/Main" element={<Main />} />
               <Route path="/Survey/:soNo" element={<Survey 
                  setSoNo={function (value: string): void {
                     throw new Error("Function not implemented.");
                  }} 
               />} />
            </Routes>
         </BrowserRouter>
      </LoadingProvider>
   );
}

export default App;
