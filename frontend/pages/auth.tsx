import React, { useState } from "react";
import service from "@/service";
import toast from "react-hot-toast";
function Auth() {
  const [passkey, setPasskey] = useState<string>("");
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl p-24">
        <h1 className="text-black text-3xl mb-4 font-bold text-center">
          Passkey
        </h1>
        <div className="flex flex-col space-y-2">
          <input
            onChange={(e) => setPasskey(e.target.value)}
            className="outline-none text-white border border-black px-4 py-2  rounded-full"
            placeholder="Enter Passkey"
            type="password"
          />
          <button
            onClick={async () => {
              const [data, err] = await service.auth.signin({ passkey });
              if (err) {
                toast.error("Something went wrong");
                return;
              }
              // returns Success string
              if (data === "Success") {
                window.location.href = "/";
              } else {
                toast.error("Wrong Passkey");
              }
            }}
            className="bg-black text-white px-4 py-2 rounded-full mt-5">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
