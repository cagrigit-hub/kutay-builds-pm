import Navbar from "./components/Navbar";
import PasswordEntryModal from "./components/PasswordEntryModal";
import { ReturnedPassword } from "@/service/password";
import axios from "axios";
import Passwords from "./components/Passwords";
import { useState } from "react";
import ConfirmPasskeyModal from "./components/ConfirmationModal";
export async function getServerSideProps(context: any) {
  const token = context.req.cookies.token;
  if (!token)
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  const res = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/password/pass",
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + token,
      },
    }
  );
  const passwords = res.data;
  return {
    props: {
      passwords,
    },
  };
}

export default function Home({ passwords }: { passwords: ReturnedPassword[] }) {
  const [passwordsState, setPasswordsState] =
    useState<ReturnedPassword[]>(passwords);

  return (
    <div>
      <PasswordEntryModal setPasswordsState={setPasswordsState} />
      <Navbar />
      <Passwords
        setPasswordsState={setPasswordsState}
        passwords={passwordsState}
      />
    </div>
  );
}
