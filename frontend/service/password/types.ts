import { Request } from "../types";

export type InsertPasswordRaw = {
  title: string;
  password: string;
};

export type ReturnedPassword = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type RevealedPassword = {
  password: string;
};

export namespace Service {
  export type InsertPassword = Request<InsertPasswordRaw, any>;
  export type GetAllPasswords = Request<any, ReturnedPassword[]>;
  export type DeletePassword = Request<any, any>;
  export type RevealPassword = Request<any, RevealedPassword>;
}
