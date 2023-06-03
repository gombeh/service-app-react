import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import React, { useEffect } from "react";

const AuthLayout = (props) => {
  let navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      return navigate("/");
    }
  }, []);

  return (
    <div className="relative">
      <Header />
      <div className="container mt-5 mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
