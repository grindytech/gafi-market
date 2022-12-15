import Swal, { SweetAlertOptions } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useCustomColors from "../theme/useCustomColors";

const swal = withReactContent(Swal);
const useSwal = () => {
  const { swalBg, swalText } = useCustomColors();
  const swAlert = ({ ...rest }: SweetAlertOptions<any, any>) => {
    return swal.fire({
      background: swalBg,
      color: swalText,
      ...rest,
    });
  };
  return { swal, swAlert };
};
export default useSwal;
