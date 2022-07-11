import { useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../utils/constants";

type UnsubscribeProps = {
  authenticated: boolean;
};

type UnsubscribeHandlerProps = {
  userId: string;
};

export default function Unsubscribe() {
  const { userId } = useParams();

  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-sm">
        {userId?.length ? (
          <UnsubscribeHandler userId={userId} />
        ) : (
          <AuthFailure />
        )}
      </div>
    </div>
  );
}

function UnsubscribeHandler({ userId }: UnsubscribeHandlerProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (email === "") {
      setStatus("Missing Email Address");
      return;
    }

    try {
      setStatus("Loading...");
      const response = await fetch(`${API}/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress: email,
          userId: userId,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.Success) {
        setEmail("");
        setStatus("Successfully Unsubscribed!");
      } else {
        setStatus(`Error Unsubscribing! ${data.ServerError}`);
      }
    } catch (error) {
      setStatus("Something went wrong. Try again later.");
      return;
    }
  }

  return (
    <>
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
    </>
  );
}

function AuthFailure() {
  return (
    <h1 className="text-center text-lg text-red-500">
      Not authenticated. To unsubscribe, visit our most recently sent email and
      click the unsubscribe button linked at the bottom of the page. Thanks!
    </h1>
  );
}
