import { useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../utils/constants";
import Status from "../components/Status";

export default function Unsubscribe() {
  const { userId } = useParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ message: "", state: "" });

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }

  function formValidation() {
    if (email === "") {
      setStatus({ message: "Missing Email Address", state: "error" });
      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formValidation()) return;

    try {
      setStatus({ message: "Loading...", state: "loading" });
      const response = await fetch(`${API}/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress: email,
          userId: userId,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      if (data.Success) {
        setEmail("");
        setStatus({ message: "Successfully Unsubscribed!", state: "success" });
      } else {
        setStatus({
          message: `Error Unsubscribing! ${data.ServerError}`,
          state: "error",
        });
      }
    } catch (error) {
      let errorMessage = "Something went wrong. Try again later.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setStatus({
        message: `${errorMessage.trim()}. Please try again.`,
        state: "error",
      });
    }
  }

  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-sm">
        <h2 className="mb-4 text-4xl font-bold">Leaving Already? 🤬</h2>
        <p className="mb-4 text-lg">
          Enter your email to unsubscribe from all future updates. Feel free to
          sign up again if you change your mind! We'll be waiting here.
        </p>
        <fieldset disabled={status.state === "loading"}>
          <form onSubmit={handleSubmit}>
            <input
              className="mb-4 w-full rounded-md bg-stone-300 p-2 text-lg placeholder-stone-500"
              type="email"
              placeholder="email address"
              value={email}
              onChange={handleEmailChange}
            />
            <button className="w-full rounded-md bg-red-500 p-2 text-lg text-stone-50 hover:bg-red-600 active:bg-red-600">
              Unsubscribe
            </button>
          </form>
        </fieldset>
        <Status message={status.message} state={status.state} />
      </div>
    </div>
  );
}
