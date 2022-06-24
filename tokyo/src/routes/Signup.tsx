import React, { FormEventHandler, useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState([false, false]);
  const [status, setStatus] = useState("");

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }

  function handleCheckboxChange(position: Number) {
    const updatedCheckedState: boolean[] = checked.map((curr, index) => {
      return position === index ? !curr : curr;
    });
    setChecked(updatedCheckedState);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (email === "") {
      setStatus("Missing Email Address");
      return;
    } else if (checked.every((c) => c === false)) {
      setStatus("No Selections Made");
      return;
    }

    const listPreferences = [];
    if (checked[0]) listPreferences.push("intern");
    if (checked[1]) listPreferences.push("newgrad");

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress: email,
          listPreferences: listPreferences,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      setStatus("Something went wrong. Try again later.");
      return;
    }

    setEmail("");
    setChecked([false, false]);
    setStatus("Success! Your all set.");
  }

  // FOR TESTING ONLY
  async function testPost() {
    const response = await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailAddress: "foo@gmail.com",
        listPreferences: ["intern", "newgrad"],
      }),
    });
    const data = await response.json();
    console.log(data);
  }

  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-sm">
        <h2 className="mb-4 text-4xl font-bold">
          The Easiest Way To Stay Ahead 🚀
        </h2>
        <p className="mb-4 text-lg">
          Receive updates on the latest 2023 summer internship and new grad job
          postings. Delivered once daily if there is anything new.
        </p>
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
                    id="internships"
                    type="checkbox"
                    className="mr-2 h-7 w-7 accent-red-500"
                    checked={checked[0]}
                    onChange={() => handleCheckboxChange(0)}
                  />
                  <label htmlFor="internships">Intern</label>
                </div>
                <div className="mr-4 flex items-center">
                  <input
                    id="newgrads"
                    type="checkbox"
                    className="mr-2 h-7 w-7 accent-red-500"
                    checked={checked[1]}
                    onChange={() => handleCheckboxChange(1)}
                  />
                  <label htmlFor="newgrads">New Grad</label>
                </div>
              </div>
              <button className="grow rounded-md bg-red-500 p-2 text-lg text-stone-50 hover:bg-red-600 active:bg-red-600">
                Sign Up
              </button>
            </div>
          </div>
        </form>
        {status && (
          <p
            className={
              status === "Success! Your all set."
                ? "mt-4 text-lg font-bold text-green-700"
                : "mt-4 text-lg font-bold text-red-500"
            }
          >
            {status}
          </p>
        )}
        <button
          className="grow rounded-md bg-red-500 p-2 text-lg text-stone-50 hover:bg-red-600 active:bg-red-600"
          onClick={testPost}
        >
          TEST BUTTON FOR JACK
        </button>
      </div>
    </div>
  );
}
