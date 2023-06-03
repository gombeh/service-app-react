import axios from "axios";
import { API_URL } from "../config";

export const getServices = (
  params = {},
  callbacks = { onResponse: () => {}, onFailure: () => {} }
) => {
  const path = params.isAdmin ? 'admin' : 'user';
  return axios.get(`${API_URL}/${path}/services`, {
    method: "GET",
    url: `${API_URL}/${path}/services`,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export const getUser = (
  params = {},
  callbacks = { onResponse: () => {}, onFailure: () => {} }
) => {
  axios({
    method: "GET",
    url: `${API_URL}/user`,
    params,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  })
    .then((response) => callbacks.onResponse(response))
    .catch((error) => callbacks.onFailure(error));
};

export const getToken = (
  data = {},
  callbacks = { onResponse: () => {}, onFailure: () => {} }
) => {
  return axios({
    method: "POST",
    url: `${API_URL}/login`,
    data,
  });
};

export const updateStatus = (
  body = {},
  callbacks = { onResponse: () => {}, onFailure: () => {} }
) => {
  return axios({
    method: "PATCH",
    url: `${API_URL}/admin/services/${body.id}/update-status`,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export const storeService = (
  data = {},
  callbacks = { onResponse: () => {}, onFailure: () => {} }
) => {
  return axios({
    method: "POST",
    url: `${API_URL}/admin/services`,
    data,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export const updateProfile = (
  data = {},
  callbacks = { onResponse: () => {}, onFailure: () => {} }
) => {
  return axios({
    method: "PATCH",
    url: `${API_URL}/user`,
    data,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export const removeToken = (
  data = {},
  callbacks = { onResponse: () => {}, onFailure: () => {} }
) => {
  return axios({
    method: "POST",
    url: `${API_URL}/logout`,
    data,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};
