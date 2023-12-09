import service from "@/service";
import { ReturnedPassword } from "@/service/password";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmPasskeyModal from "./ConfirmationModal";
function Passwords({
  setPasswordsState,
  passwords,
}: {
  setPasswordsState: React.Dispatch<React.SetStateAction<ReturnedPassword[]>>;
  passwords: ReturnedPassword[];
}) {
  const secretTerm = "*************";
  const [callback, setCallback] = useState<() => void>(() => () => {}); // empty function
  const [revealed, setRevealed] = useState<string[]>(
    passwords.map((pass) => secretTerm)
  );

  useEffect(() => {
    setRevealed(
      passwords.map((pass) => {
        return secretTerm;
      })
    );
  }, [passwords]);

  async function revealPass(id: number, idx: number) {
    const [data, err] = await service.password.revealPassword(id);
    if (err) {
      toast.error("Something went wrong");
      return;
    }
    if (data) {
      setRevealed((prev) => {
        // change by object id
        const newRevealed = [...prev];
        newRevealed[idx] = data.password;
        return newRevealed;
      });
    }
  }

  async function deletePass(id: number) {
    const [data, err] = await service.password.deletepass(id);
    if (err) {
      toast.error("Something went wrong");
      return;
    }
    toast.success("Password deleted");
    setPasswordsState((prev) => prev.filter((pass) => pass.id !== id));
  }
  async function copyPass(id: number) {
    const [data, err] = await service.password.revealPassword(id);
    if (err) {
      toast.error("Something went wrong");
      return;
    }
    if (data) {
      navigator.clipboard.writeText(data.password);
      toast.success("Copied to clipboard");
    }
  }

  function openModal() {
    const modal = document.getElementById(
      "confirmation_modal"
    ) as HTMLDialogElement;
    modal?.showModal();
  }

  return (
    <>
      <div className="overflow-x-auto bg-base-100 ">
        <table className="table ">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Title</th>
              <th>Password</th>
              <th>Last Updated</th>
              <th>Delete</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {passwords?.map((password, i) => (
              <tr key={i}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td className="pl-2">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 h-12">
                        <img src="/pass.svg" alt="lock" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{password.title}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {revealed[i]}{" "}
                  <button
                    onClick={() => {
                      openModal();
                      setCallback(() => () => {
                        copyPass(password.id);
                      });
                    }}
                    className="w-5 h-5 pl-1">
                    <img src="/copy.svg" alt="eye" />
                  </button>
                  <br />
                  <button
                    onClick={() => {
                      if (revealed[i] === secretTerm) {
                        openModal();
                        setCallback(() => () => {
                          revealPass(password.id, i);
                        });
                      } else {
                        setRevealed((prev) => {
                          const newRevealed = [...prev];
                          newRevealed[i] = secretTerm;
                          return newRevealed;
                        });
                      }
                    }}
                    className="badge badge-ghost badge-md ">
                    {revealed[i] === secretTerm
                      ? "Reveal the Password"
                      : "Hide the Password"}
                  </button>
                </td>
                <td>{password.updatedAt}</td>
                <td>
                  <div
                    onClick={() => {
                      openModal();
                      setCallback(() => () => {
                        deletePass(password.id);
                      });
                    }}
                    className="cursor-pointer pl-1 w-8 h-8">
                    <img src="/trash.svg" alt="delete" />
                  </div>
                </td>
                <th>
                  <button className="btn  btn-sm">Details</button>
                </th>
              </tr>
            ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Password</th>
              <th>Last Updated</th>
              <th>Delete</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
        <ConfirmPasskeyModal onConfirm={callback} />
      </div>
    </>
  );
}

export default Passwords;
