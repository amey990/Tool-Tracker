// src/api/axios.ts
import axios, { type AxiosRequestHeaders, type InternalAxiosRequestConfig } from "axios";
import { getJwt } from "../services/auth";
import { API_BASE } from "../config";

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const jwt = getJwt();
  if (jwt) {
    // If it's AxiosHeaders (v1), it has .set()
    const h = config.headers as any;
    if (h && typeof h.set === "function") {
      h.set("Authorization", `Bearer ${jwt}`);
    } else {
      // Plain object fallback
      config.headers = {
        ...(config.headers as AxiosRequestHeaders),
        Authorization: `Bearer ${jwt}`,
      } as AxiosRequestHeaders;
    }
  }
  return config;
});
