import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const alertSwal = (title: string, msg: string, gubun: SweetAlertIcon) => {
   return withReactContent(Swal).fire({
      title: title,
      html: msg,
      confirmButtonText: "확인",
      confirmButtonColor: "#f97316",
      icon: gubun,
      focusConfirm: false,
   });
};

export { alertSwal };
