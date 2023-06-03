import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckPermission from "../../../Components/Layout/CheckPermission";
import { toast } from "react-toastify";
import { StoreServiceApi } from "../../../apis/ServiceApis";
import MapWrapper from "../../../Components/Map/MapWrapper";

const Create = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [originCoordinate, setOriginCoordinate] = useState();
  const [destinationCoordinate, setDestinationCoordinate] = useState();

  const mutation = new StoreServiceApi({
    onResponse: (response) => {
      toast(response.data.message, {
        toastId: response.data.message,
      });
      return navigate("/services");
    },
  }).useMutation();

  const storeHandler = async (e) => {
    e.preventDefault();

    mutation.mutate({
      customer_name: name,
      origin_coordinate: originCoordinate,
      destination_coordinate: destinationCoordinate,
    });
  };

  return (
    <CheckPermission permission={"service:create"}>
      <div className="w-full mt-5">
        <form
          onSubmit={storeHandler}
          method="post"
          className="p-10 border rounded-md border-gray-500 w-full h-full"
        >
          <div className="mb-5">
            <Link
              className="bg-gray-500 text-white rounded-md px-5 py-2"
              to="/services"
            >
              Back
            </Link>
          </div>

          <MapWrapper
            originCoordinate={originCoordinate}
            setOriginCoordinate={setOriginCoordinate}
            destinationCoordinate={destinationCoordinate}
            setDestinationCoordinate={setDestinationCoordinate}
          />

          <div>
            <label htmlFor="text" className="block mb-2">
              Customer name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              id="name"
              className="border border-gray-500 rounded-md w-full h-10 p-2"
            />
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="bg-blue-500 rounded-md px-5 py-2 w-full"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </CheckPermission>
  );
};

export default Create;
