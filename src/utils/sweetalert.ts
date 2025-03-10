import { PRIMARY, ERROR, GREY } from "../theme/palette";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const MySwal = withReactContent(Swal);

export const confirmAlert = async ({
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  cancelLabel = "Cancel",
  confirmLabel = "Yes, delete it!",
  icon = "question",
  isWarning = true,
}: {
  title?: string;
  text?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  isWarning?: boolean;
  icon?: SweetAlertIcon;
} = {}) => {
  const result = await MySwal.fire({
    target: "root",
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: isWarning ? ERROR.main : PRIMARY.main,
    cancelButtonColor: GREY[500],
    cancelButtonText: cancelLabel,
    confirmButtonText: confirmLabel,
    focusCancel: true,
    allowOutsideClick: false,
    customClass: { container: "my-swal" },
    reverseButtons: true,
  });

  return result;
};

export const showAlert = async ({
  title = "",
  text = "",
  icon = "success",
}: {
  title: string;
  text: string;
  icon?: SweetAlertIcon;
}) => {
  const result = await MySwal.fire({
    target: "root",
    title: title,
    text: text,
    icon: icon,
    confirmButtonColor: PRIMARY.main,
    showCloseButton: true,
    allowOutsideClick: false,
    customClass: { container: "my-swal" },
  });
  return result;
};
