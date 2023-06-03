import ServiceItem from "./ServiceItem";
import React, { useEffect, useState } from "react";
import {
  GetAdminServicesApi,
  GetUserServiceApi,
  UpdateStatusServiceApi,
} from "../../apis/ServiceApis";
import Modal from "../Layout/Modal";
import MapShow from "../Map/Map";
import { getRoutingApi } from "../../apis/NavigationApis";

const Services = (props) => {
  const [services, setServices] = useState();
  const [showModal, setShowModal] = useState(false);
  const [coordinates, setCoordinates] = useState({});
  const [polyline, setPolyline] = useState();
  let isLoading = false;

  if (props.isAdmin) {
    const result = new GetAdminServicesApi({
      onResponse: (response) => {
        setServices(response.data.result);
      },
    }).useQuery();
    isLoading = result.isLoading;
  } else {
    const result = new GetUserServiceApi({
      onResponse: (response) => {
        setServices(response.data.result);
      },
    }).useQuery();

    isLoading = result.isLoading;
  }

  const mutation = new UpdateStatusServiceApi({
    onResponse: (response) => {
      setServices((prevServices) => {
        const services = [...prevServices];
        let index = services.findIndex(
          (service) => service.id === response.data.result.id
        );
        services[index] = response.data.result;
        return services;
      });
    },
  }).useMutation();

  const routingMutaion = new getRoutingApi({
    onResponse: (response) => {},
  });

  const statusUpdateHandler = async (id) => {
    mutation.mutate(id);
  };

  const showMapHandler = (origin_coordinate, destination_coordinate) => {
    setCoordinates({
      origin: origin_coordinate,
      destination: destination_coordinate,
    });

    const origin = { lat: origin_coordinate[0], lng: origin_coordinate[1] };
    const destination = { lat: destination_coordinate[0], lng: destination_coordinate[1] };
    // routingMutaion.mutate();
    setShowModal(true);
  };

  const syncServices = () => {
    window.Echo.private("users")
      .listen("ServiceCreated", (e) => {
        setServices((prevServices) => {
          if (prevServices.some((service) => service.id === e.id))
            return prevServices;
          return [e, ...prevServices];
        });
      })
      .listen("ServiceUpdated", (e) => {
        setServices((prevServices) => {
          const services = [...prevServices];
          let index = services.findIndex((service) => service.id === e.id);
          services[index] = e;
          return services;
        });
      });
  };

  useEffect(() => {
    syncServices();

    return () => {
      window.Echo.leaveAllChannels();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center relative mt-48">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-auto h-full">
      {showModal && (
        <Modal showModal={showModal} setShowModal={setShowModal} label="Map">
          <MapShow
            originCoordinate={coordinates.origin}
            destinationCoordinate={coordinates.destination}
          />
        </Modal>
      )}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Customer name
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Updated at
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {services?.map((service, index) => (
            <ServiceItem
              service={service}
              key={service.id}
              onStatusUpdate={statusUpdateHandler}
              onShowMap={showMapHandler}
              isAdmin={props.isAdmin}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Services;
