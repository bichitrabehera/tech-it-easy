"use client";
import React, { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const items = [
    { name: "Home", href: "#" },
    { name: "About", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mt-4 mx-4 border border-neutral-950/10 rounded-xl">
      <div className="mx-auto bg-black md:px-6 px-6 py-4 max-w-5xl border border-neutral-800 rounded-xl flex justify-between items-center text-white">
        <h1
          className="text-xl font-bold text-neutral-200"
          style={{ letterSpacing: "0px" }}
        >
          <span className="text-orange-500">Tech</span>It
          <span className="text-orange-500">Easy</span>
        </h1>

        <ul className="hidden md:flex gap-6 text-neutral-500">
          {items.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="hover:text-orange-500 transition uppercase font-medium text-sm duration-300"
                style={{ letterSpacing: "1px" }}
              >
                / / {item.name}
              </a>
            </li>
          ))}
        </ul>

        <button className=" text-sm uppercase font-bold bg-orange-500 text-white px-4 py-1 rounded-xl hover:bg-orange-600 transition">
          Register Now
        </button>

        <button
          className="md:hidden text-xl text-neutral-500"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-2 bg-black/70 rounded-2xl border  backdrop-blur-2xl border-neutral-800 px-6 py-4 text-white">
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="hover:text-orange-500 transition"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
