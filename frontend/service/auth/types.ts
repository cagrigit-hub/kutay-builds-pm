import { Request } from "../types";

export type SignInRaw = {
  passkey: string;
};

export namespace Service {
  export type SignIn = Request<SignInRaw, string>;
  export type IsAuthed = Request<undefined, boolean>;
  export type Logout = Request<undefined, boolean>;
  export type ConfirmPasskey = Request<SignInRaw, boolean>;
}
