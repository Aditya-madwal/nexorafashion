// here the api that is requested by the user will be altered and headers will be added to add bearer token

import axios from "axios";

import { ACCESS_TOKEN } from "./constants";
import process from "process";

const api = axios.create({
  baseURL: process.env.BACKEND_URL || "http://127.0.0.1:8000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
