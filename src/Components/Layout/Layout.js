import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Echo from "laravel-echo";
import socket from "socket.io-client";
import { asyncActionSetUser } from "../../Redux/actions/async-actions";

const Layout = () => {
  const navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return navigate("/login");
    }

    window.io = socket;
    window.Echo = new Echo({
      broadcaster: "socket.io",
      host: "127.0.0.1:6001",
      auth: {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      },
    });

    dispatch(asyncActionSetUser());

  }, []);


  return (
    <div className="relative h-screen overflow-hidden flex flex-col items-center">
      <div className="w-full">
      <Header />
      </div>
      <div className="container mt-5 mx-auto w-full h-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
