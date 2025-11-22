import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import STATUSES from "../../globals/status/statuses";
import Form from "./form/login";
import { login, setStatus } from "../../../store/authSlice";

const Login = () => {
  const { user, status, token, userId ,error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (data) => {
    dispatch(login(data));
  };

  useEffect(() => {
    if (status === STATUSES.SUCCESS && token) {
    navigate("/", { replace: true }); 
      dispatch(setStatus(null));
    }
  }, [status, token, navigate, dispatch]);

  return (
    <>
  <Form type="Login" user={user} onSubmit={handleLogin}  error={status === STATUSES.ERROR ? error : null}
/>
</>
  )
};

export default Login;
