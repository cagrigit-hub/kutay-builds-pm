import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

instance.defaults.withCredentials = true;

instance.interceptors.response.use(
  (res: AxiosResponse) => res.data as any,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);

export const request = async (config: AxiosRequestConfig): Promise<any> => {
  try {
    const data = await instance.request(config);

    return [data, null];
  } catch (error) {
    return [null, error];
  }
};
