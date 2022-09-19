import LoginNav from "./LoginNav";
import Navbar from "./Navbar";
import React from "react";
import { useRouter } from "next/router";

function PrimaryLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();

  const isOnLoginScreen = pathname === "/login";
  return (
    <>
      <div className="font-sen text-stone-800 min-h-screen flex flex-col justify-start items-center m-0">
        {isOnLoginScreen ? <LoginNav /> : <Navbar />}
        <main className="flex w-full px-24 justify-center">{children}</main>
      </div>
    </>
  );
}

export default PrimaryLayout;
