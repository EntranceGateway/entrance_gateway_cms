import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAxiosInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add interceptor
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Remove token
          localStorage.removeItem("token");
          // Navigate to login with replace
          navigate("/admin/login", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    // Cleanup to avoid duplicate interceptors
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);
};

export default useAxiosInterceptor;
