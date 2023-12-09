import { request } from "../instance";
import { Service } from "./types";

export const insertpass: Service.InsertPassword = (data, config) =>
  request({
    method: "post",
    url: "/password/pass",
    data,
    ...config,
  });

export const getallpass: Service.GetAllPasswords = (config) =>
  request({
    method: "get",
    url: "/password/pass",
    ...config,
  });

export const deletepass: Service.DeletePassword = (id, config) =>
  request({
    method: "delete",
    url: `/password/pass/${id}`,
    ...config,
  });

export const revealPassword: Service.RevealPassword = (id, config) =>
  request({
    method: "get",
    url: `/password/pass/${id}`,
    ...config,
  });
