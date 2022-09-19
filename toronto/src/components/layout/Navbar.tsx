import Link from "next/link";
import React from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

const NavLink = ({
  href,
  action,
  children,
}: {
  href: string;
  action?: () => void;
  children: React.ReactNode;
}) => {
  const sharedStyles =
    "rounded-md px-2 pb-2 transition-[padding] duration-150 ease-out hover:bg-red-500 hover:pt-2 hover:text-stone-50";

  const { pathname } = useRouter();
  const isActive = pathname === href;

  const actionHandler = () => {
    if (!action) return;
    action();
  };

  return (
    <Link href={href}>
      <a
        onClick={actionHandler}
        className={
          isActive ? `${sharedStyles} text-red-500` : `${sharedStyles}`
        }
        href=""
      >
        {children}
      </a>
    </Link>
  );
};

function Navbar() {
  return (
    <header className="px-4 pt-8 pb-12 w-full">
      <div className="font-bold">
        <h1 className="text-center text-header">APPTRACK</h1>
        <nav className="mx-auto flex h-[36px] max-w-screen-sm items-start justify-center gap-1.5 text-xl">
          <NavLink href="/">HOME</NavLink>
          <NavLink href="/jobs">MY JOBS</NavLink>
          <NavLink href="/account">ACCOUNT</NavLink>
          <NavLink action={signOut} href="">
            SIGN OUT
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
