"use client";
import React, { useState } from "react";
import Button from "../ui/Button";
import Switch from "../ui/Switch";
import Link from "next/link";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const items = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Domains", id: "domains" },
    { name: "FAQs", id: "faqs" },
  ];

  const handleScroll = (id: string) => {
    setOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[1000] pointer-events-none">
        <div className="w-full backdrop-blur-xl border-b border-neutral-900/30 px-6 md:px-12 py-4 flex justify-between items-center shadow-[0_4px_30px_rgba(220,0,0,0.1)] pointer-events-auto transition-all">
          <div className="flex items-center gap-3">
            <Link href="/" className="pointer-events-auto group">
              <h1 className="text-md font-black font-[Boldonse] tracking-widest text-white group-hover:text-red-400 transition-colors">
                Supernova
              </h1>
            </Link>
          </div>

          <ul className="hidden md:flex gap-10 items-center text-red-100/70">
            {items.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleScroll(item.id)}
                  className="hover:text-red-500 hover:drop-shadow-[0_0_15px_rgba(220,0,0,0.8)] transition-all text-xs font-bold tracking-[0.2em] uppercase focus:outline-none"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:block scale-90 origin-right">
            <Button text="Register" href="#" />
          </div>

          <div className="md:hidden flex justify-end">
            <Switch checked={open} onChange={setOpen} />
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[999] transition-all duration-500 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-[#0a0000] border-l border-red-900/40 shadow-[-10px_0_40px_rgba(220,0,0,0.15)] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="relative h-full flex flex-col px-6 text-white pt-24 text-left">
            <ul className="flex flex-col w-full gap-8 text-2xl font-bold tracking-widest uppercase">
              {items.map((item) => (
                <li
                  key={item.name}
                  className="w-full border-b border-red-900/30 pb-6"
                >
                  <button
                    onClick={() => handleScroll(item.id)}
                    className="flex justify-between items-center group hover:text-red-500 hover:drop-shadow-[0_0_15px_rgba(220,0,0,0.8)] transition-all w-full text-red-100/90 text-left focus:outline-none"
                  >
                    <span>{item.name}</span>
                    <span className="text-2xl text-red-900/50 group-hover:text-red-500 group-hover:translate-x-2 transition-all">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div
              className="mt-12 flex justify-center"
              onClick={() => setOpen(false)}
            >
              <Button text="Register" href="#" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
