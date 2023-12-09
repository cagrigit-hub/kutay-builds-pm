import service from "@/service";
import { ReturnedPassword } from "@/service/password";
import React from "react";
import toast from "react-hot-toast";

function PasswordEntryModal({
  setPasswordsState,
}: {
  setPasswordsState: React.Dispatch<React.SetStateAction<ReturnedPassword[]>>;
}) {
  const submitForm = async (title: string, pass: string) => {
    const [data, err] = await service.password.insertpass({
      title,
      password: pass,
    });
    if (err) {
      toast.error("Something went wrong");
      return;
    }
    setPasswordsState((prev) => [data, ...prev]);
    // close modal by clicking close button
    const closeBtn = document.getElementById("close-button");
    closeBtn?.click();
  };
  return (
    <dialog id="password_entry_modal" className="modal ">
      <div className="modal-box ">
        <h1 className="text-center text-2xl my-4 font-bold">
          Add a new Password
        </h1>

        <form
          className="flex flex-col space-y-4 items-center justify-center pb-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const title = e.currentTarget.ptitle.value;
            const pass = e.currentTarget.password.value;
            // reset form
            e.currentTarget.ptitle.value = "";
            e.currentTarget.password.value = "";
            await submitForm(title, pass);
          }}>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Password Title</span>
            </div>
            <input
              required={true}
              autoComplete="off"
              name="ptitle"
              type="text"
              placeholder="Title"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs ">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              required={true}
              autoComplete="off"
              name="password"
              type="password"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <button type="submit" className="btn btn-outline btn-accent">
            Add Password
          </button>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button id="close-button">close</button>
      </form>
    </dialog>
  );
}

export default PasswordEntryModal;
