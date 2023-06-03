import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "../../apis/AuthApis";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = new LoginApi({
    onResponse: (response) => {
      const token = `Bearer ${response.data.result.token}`;
      localStorage.setItem("token", token);
      navigate("/");
    }
  }).useMutation();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      return navigate("/");
    }
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    mutation.mutate({email, password});
  };

  const enteredEmailHandler = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  const enteredPasswordHandler = useCallback((event) => {
    setPassword(event.target.value);
  }, []);

  return (
    <div className=" flex justify-center items-center w-full mt-48">
      <form
        onSubmit={loginHandler}
        method="post"
        className="p-10 border rounded-md border-gray-500 w-2/6"
      >
        <div>
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={enteredEmailHandler}
            id="email"
            className="border border-gray-500 rounded-md w-full h-10 p-2"
          />
        </div>
        <div className="mt-5">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={enteredPasswordHandler}
            id="password"
            className="border border-gray-500 rounded-md w-full h-10 p-2"
          />
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="bg-blue-500 rounded-md px-5 py-2 w-full"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
