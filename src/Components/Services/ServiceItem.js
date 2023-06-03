import React from "react";

const ServiceItem = (props) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {props.service.customer_name}
      </th>
      <td className="px-6 py-4">{props.service.status}</td>
      <td className="px-6 py-4">{props.service.updated_at}</td>
      <td className=" py-4">
        <button
          onClick={props.onShowMap.bind(
            null,
            props.service.origin_coordinate,
            props.service.destination_coordinate
          )}
          className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
        >
          Map
        </button>
        {props.isAdmin && props.service.status !== "end_service" && (
          <button
            onClick={props.onStatusUpdate.bind(null, props.service.id)}
            className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
          >
            Update Status
          </button>
        )}
      </td>
    </tr>
  );
};

export default ServiceItem;
