import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Suspense } from "react";
import useAxiosInterceptor from "@/pages/login/axiosInterceptor";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { restoreAuthState } from "@/store/authSlice";
import { AppRoutes } from "./routes";
import { ProgressiveLoader, FullPageSpinner } from "@/components/loaders";
import { RouteChangeDetector } from "@/components/loaders/RouteChangeDetector";

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
          <RouteChangeDetector />
          <ProgressiveLoader />
          <Suspense fallback={<FullPageSpinner message="Loading application..." />}>
            <AppRoutes />
          </Suspense>
        </AxiosInterceptorWrapper>
      </BrowserRouter>
    </Provider>
  );
}
