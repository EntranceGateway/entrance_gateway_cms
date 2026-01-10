import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Suspense } from "react";
import Spinner from "@/components/common/Spinner";
import useAxiosInterceptor from "@/pages/login/axiosInterceptor";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { restoreAuthState } from "@/store/authSlice";
import { AppRoutes } from "./routes";

// Wrapper to run interceptor inside Router
const AxiosInterceptorWrapper = ({ children }) => {
  useAxiosInterceptor();
  const dispatch = useDispatch();

  useEffect(() => {
    // Hydrate auth state from localStorage on app mount
    dispatch(restoreAuthState());
  }, [dispatch]);

  return children;
};

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AxiosInterceptorWrapper>
          <Suspense fallback={<Spinner />}>
            <AppRoutes />
          </Suspense>
        </AxiosInterceptorWrapper>
      </BrowserRouter>
    </Provider>
  );
}
