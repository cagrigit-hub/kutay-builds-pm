import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import service from "@/service";
import { Toaster } from "react-hot-toast";
export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    const auth = async () => {
      const [data, err] = await service.auth.isAuthed();
      if (err) {
        alert("Something went wrong");
        return;
      }
      if (!data && window.location.pathname !== "/auth") {
        window.location.href = "/auth";
        setAuthed(false);
        return;
      }
      setReady(true);
      setAuthed(true);
    };
    auth();

    return () => {};
  }, []);

  return (
    <>
      {!ready ? (
        <Loader />
      ) : authed ? (
        <>
          <Component {...pageProps} />
          <Toaster />
        </>
      ) : (
        <div>Authenticating...</div>
      )}
    </>
  );
}

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};
