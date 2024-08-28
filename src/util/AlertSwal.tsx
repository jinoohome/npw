import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const alertSwal = (
   title: string, 
   msg: string, 
   gubun: SweetAlertIcon, 
   showCancelButton: boolean = false // 취소 버튼 표시 여부를 결정하는 매개변수 추가
 ) => {
   return withReactContent(Swal).fire({
     title: title,
     html: msg,
     confirmButtonText: "확인",
     cancelButtonText: "취소",
     confirmButtonColor: "#f97316",
     showCancelButton: showCancelButton, // 이 값에 따라 취소 버튼이 표시됨
     icon: gubun,
     focusConfirm: false,
   });
 };
 

export { alertSwal };
