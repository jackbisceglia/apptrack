import React, { useState } from "react";
import { API } from "../utils/constants";
import Status from "../components/Status";
import { Link } from "react-router-dom";

export default function Home() {
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState({ intern: false, newgrad: false });
  const [status, setStatus] = useState({ message: "", state: "" });

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const currentCheckbox = e.currentTarget.name as keyof typeof checked;
    setChecked({
      ...checked,
      [currentCheckbox]: !checked[currentCheckbox],
    });
  }

  function formValidation() {
    if (email === "") {
      setStatus({ message: "Missing Email Address", state: "error" });
      return false;
    } else if (!checked.intern && !checked.newgrad) {
      setStatus({ message: "No Selections Made", state: "error" });
      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formValidation()) return;

    const listPreferences: string[] = [];
    for (const key of Object.keys(checked)) {
      if (checked[key as keyof typeof checked]) listPreferences.push(key);
    }

    try {
      setStatus({ message: "Loading...", state: "loading" });
      const response = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress: email,
          listPreferences: listPreferences,
        }),
      });
      const data = await response.json();
      if (data.Success) {
        setEmail("");
        setChecked({ intern: false, newgrad: false });
        setStatus({ message: "Success! You're all set.", state: "success" });
      }
    } catch (error) {
      setStatus({
        message: "Something went wrong. Try again later.",
        state: "error",
      });
    }
  }

  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-sm">
        <h2 className="mb-4 text-4xl font-bold">
          The Easiest Way To Stay Ahead 🚀
        </h2>
        <p className="mb-4 text-lg">
          Receive daily updates on the latest 2023 summer internship and new
          grad job postings. Made possible by the community.
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
            <div>
              <div className="flex items-center">
                <div className="flex">
                  <div className="mr-4 flex items-center">
                    <input
                      id="intern"
                      type="checkbox"
                      className="mr-2 h-7 w-7 accent-red-500"
                      checked={checked.intern}
                      name="intern"
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="intern">Intern</label>
                  </div>
                  <div className="mr-4 flex items-center">
                    <input
                      id="newgrad"
                      type="checkbox"
                      className="mr-2 h-7 w-7 accent-red-500"
                      checked={checked.newgrad}
                      name="newgrad"
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="newgrad">New Grad</label>
                  </div>
                </div>
                <button className="grow rounded-md bg-red-500 p-2 text-lg text-stone-50 hover:bg-red-600 active:bg-red-600">
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </fieldset>
        <Status message={status.message} state={status.state} />
      </div>
    </div>
  );
}
