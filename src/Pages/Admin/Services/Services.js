import { Link } from "react-router-dom";
import React from "react";
import ServicesComponent from "../../../Components/Services/Services";
import CheckPermission from "../../../Components/Layout/CheckPermission";

const Services = () => {
  return (
    <CheckPermission permission={"service:index"}>
      <div className="h-full flex flex-col">
      <div className="mb-5">
        <Link
          className="bg-gray-500 text-white rounded-md px-5 py-2 inline-block"
          to="/services/create"
        >
          Create Service
        </Link>
      </div>
      <ServicesComponent
        isAdmin={true}
      />
      </div>
    </CheckPermission>
  );
};

export default Services;
