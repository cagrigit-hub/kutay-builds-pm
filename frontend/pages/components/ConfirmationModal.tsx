import service from "@/service";
import React from "react";
import toast from "react-hot-toast";

function ConfirmPasskeyModal({ onConfirm }: { onConfirm: () => void }) {
  const submitForm = async (pass: string) => {
    const [data, err] = await service.auth.confirmPasskey({
      passkey: pass,
    });
    if (err) {
      toast.error("Something went wrong");
      return;
    }
    if (data) {
      onConfirm();
    }
    // close modal by clicking close button
    const closeBtn = document.getElementById("confirm-close-button");
    closeBtn?.click();
  };
  return (
    <dialog id="confirmation_modal" className="modal ">
      <div className="modal-box ">
        <h1 className="font-bold text-center my-2 text-3xl">Are you sure?</h1>
        <form
          className="flex flex-col space-y-4 items-center justify-center pb-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const pass = e.currentTarget.password.value;
            // reset form
            e.currentTarget.password.value = "";
            await submitForm(pass);
          }}>
          <label className="form-control w-full max-w-xs"></label>
          <label className="form-control w-full max-w-xs ">
            <div className="label">
              <span className="label-text">Confirm your passkey.</span>
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
            Confirm Passkey
          </button>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button id="confirm-close-button">close</button>
      </form>
    </dialog>
  );
}

export default ConfirmPasskeyModal;
