import { ToastContainer } from "react-toastify";

export default function NotificationToast() {
  return (
    <div className="absolute bottom-0 right-0 m-4 w-auto">
      <ToastContainer
        position="bottom-right"
        autoClose={3000} // Hide after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
