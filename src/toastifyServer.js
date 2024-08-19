import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 7500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: null,
    theme: "colored",
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 7500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: null,
    theme: "colored",
  });
};

export const NotificationContainer = () => {
  return <ToastContainer />;
};