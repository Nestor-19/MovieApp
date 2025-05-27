"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar.jsx";
import Outbar from "@/components/Outbar.jsx";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Avoid rendering anything that depends on `pathname` until after mount
  if (!isMounted) return null;

 const isLoginPage = pathname === "/login";
  const isLandingPage = pathname === "/";

  return (
    <>
      { (
        isLoginPage ?   <Outbar /> :  <Navbar />
      )}
      <div
        className="
          min-h-screen flex items-center justify-center
          bg-thio from-slate-800 to-black
          px-4 py-10
        "
      >
        {children}
      </div>
    </>
  );
}
