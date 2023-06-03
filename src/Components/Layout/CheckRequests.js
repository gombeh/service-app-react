import {  useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CheckRequests(props) {
  let navigate = useNavigate();
  useEffect(() => {
    axios.interceptors.response.use(
      function (response) {
        // Do something with response data
        return response;
      },
      function (error) {
        switch (error.response.status) {
          case 401:
            localStorage.removeItem('token')
            navigate('/login');
            break;
          default:
            toast.error(error.response.data.message, {
              toastId: error.response.data.message
            })
            break;
        }
        // Do something with response error
        return Promise.reject(error);
      }
    );
  });

  return props.children;
}

export default CheckRequests;
