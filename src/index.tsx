import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'tui-grid/dist/tui-grid.css';
import 'tui-date-picker/dist/tui-date-picker.css';


// 환경 변수에서 API URL 가져오기
const baseURL = process.env.REACT_APP_API_URL || ""; // 기본값 설정
const cssURL = `${baseURL}/src/output.css`; // CSS 경로 동적 생성

// 동적으로 <link> 태그 추가
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = cssURL;
document.head.appendChild(link);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
