// // src/api/axios.ts
// import axios, { type AxiosRequestHeaders, type InternalAxiosRequestConfig } from "axios";
// import { getJwt } from "../services/auth";
// import { API_BASE } from "../config";

// export const api = axios.create({
//   baseURL: API_BASE,
// });

// api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
//   const jwt = getJwt();
//   if (jwt) {
//     // If it's AxiosHeaders (v1), it has .set()
//     const h = config.headers as any;
//     if (h && typeof h.set === "function") {
//       h.set("Authorization", `Bearer ${jwt}`);
//     } else {
//       // Plain object fallback
//       config.headers = {
//         ...(config.headers as AxiosRequestHeaders),
//         Authorization: `Bearer ${jwt}`,
//       } as AxiosRequestHeaders;
//     }
//   }
//   return config;
// });


// src/api/axios.ts
import axios, { type AxiosRequestHeaders, type InternalAxiosRequestConfig } from "axios";
import { getJwt } from "../services/auth";
import { API_BASE } from "../config";

// normalize to avoid double slashes if callers use leading '/'
const baseURL = API_BASE.replace(/\/+$/, "");

export const api = axios.create({
  baseURL,                 // -> '/api'
  // timeout: 15000,       // (optional) add a timeout
  // withCredentials: false
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const jwt = getJwt();
  if (jwt) {
    const h = config.headers as any;
    if (h && typeof h.set === "function") {
      h.set("Authorization", `Bearer ${jwt}`);
      h.set("Accept", "application/json");
    } else {
      config.headers = {
        ...(config.headers as AxiosRequestHeaders),
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      } as AxiosRequestHeaders;
    }
  }
  return config;
});
