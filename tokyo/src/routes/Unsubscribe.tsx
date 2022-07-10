import { useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../utils/constants";

export default function Unsubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const { createdAt } = useParams();

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (email === "") {
      setStatus("Missing Email Address");
      return;
    }

    if (!createdAt) {
      setStatus("Can't unsubscribe.");
      return;
    }

    try {
      setStatus("Loading...");
      const response = await fetch(`${API}/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress: email,
          createdAt: createdAt,
        }),
      });
      const data = await response.json();
      if (data.Success) {
        setEmail("");
        setStatus("Successfully Unsubscribed!");
      }
    } catch (error) {
      setStatus("Something went wrong. Try again later.");
      return;
    }
  }

  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-sm">
        <h2 className="mb-4 text-4xl font-bold">Leaving already? 🤬</h2>
        <p className="mb-4 text-lg">
          Enter your email to unsubscribe from all future updates. Feel free to
          sign up again if you change your mind! We'll be waiting here.
        </p>
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
        {status && (
          <p
            className={
              status === "Successfully Unsubscribed!"
                ? "mt-4 text-lg font-bold text-green-700"
                : "mt-4 text-lg font-bold text-red-500"
            }
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
