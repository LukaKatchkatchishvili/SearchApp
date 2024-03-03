"use client";
import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  const handleClearCache = (): void => {
    for (let key in localStorage) {
      if (key.startsWith("search") || key.startsWith("popular")) {
        localStorage.removeItem(key);
      }
    }
    window.location.reload();
  };

  return (
    <nav className="bg-[#1a1717] p-5 shadow-md min-h-[7vh]">
      <div className="container mx-auto flex justify-between items-center px-4">
        <p className="text-white font-bold">
          <Link href="/" passHref className="text-xl">
            Home
          </Link>
        </p>

        <div className="flex items-center">
          <p className="text-white mr-4">
            <Link href="/history" passHref>
              History
            </Link>
          </p>

          <button onClick={handleClearCache} className="text-white">
            Clear Cache
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
