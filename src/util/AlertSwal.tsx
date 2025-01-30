import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const alertSwal = (
  title: string,
  msg: string,
  gubun: SweetAlertIcon,
  showCancelButton: boolean = false,
  inputType?: "checkbox" | "text" | "radio" | "number" | "textarea", // Optional input type
  inputPlaceholder?: string, // Optional placeholder for input
  inputValue?: any, // Optional default value for input
  inputValidator?: (value: any) => string | null | undefined // Optional validator function
) => {
  return withReactContent(Swal).fire({
    title: title,
    html: msg,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    confirmButtonColor: "#f97316",
    showCancelButton: showCancelButton,
    icon: gubun,
    focusConfirm: false,
    input: inputType, // Pass the input type
    inputPlaceholder: inputPlaceholder, // Pass the input placeholder
    inputValue: inputValue, // Pass the input default value
    inputValidator: inputValidator, // Pass the input validator
  });
};

export { alertSwal };
