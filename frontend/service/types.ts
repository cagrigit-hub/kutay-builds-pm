import { AxiosRequestConfig } from "axios";

export type Request<D = any, R = void> = (
  data?: D,
  config?: AxiosRequestConfig<D>
) => Promise<[R, Error]>;
