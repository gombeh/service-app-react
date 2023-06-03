import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout/Layout";
import Home from "../Pages/Home";
import Login from "../Pages/Auth/Login";
import Services from "../Pages/Admin/Services";
import NoPage from "../Pages/NoPage";
import Create from "../Pages/Admin/Services/Create";
import Profile from "../Pages/Admin/Profile";
import AuthLayout from "./Layout/AuthLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
    },
  },
});

const localStoragePersistor = createWebStoragePersistor({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persistor: localStoragePersistor,
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services">
              <Route index element={<Services />} />
              <Route path="create" element={<Create />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NoPage />} />
          </Route>
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </QueryClientProvider>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
