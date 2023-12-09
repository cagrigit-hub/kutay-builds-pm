import { request } from "../instance";
import { Service } from "./types";

export const signin: Service.SignIn = (data, config) =>
  request({
    method: "post",
    url: "/auth",
    data,
    ...config,
  });

export const isAuthed: Service.IsAuthed = (_, config) =>
  request({
    method: "get",
    url: "/auth/is-authed",
    ...config,
  });

export const logout: Service.Logout = (_, config) =>
  request({
    method: "get",
    url: "/auth/logout",
    ...config,
  });

export const confirmPasskey: Service.ConfirmPasskey = (data, config) =>
  request({
    method: "post",
    url: "/auth/confirm-passkey",
    data,
    ...config,
  });
