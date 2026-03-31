"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { label: "About", id: "about" },
  { label: "Domains", id: "domains" },
  { label: "FAQs", id: "faqs" },
];

const policyLinks = [
  { label: "Code of Conduct", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

const Footer = () => {
  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-red-900/40 bg-[#080202] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_75%_15%,rgba(220,38,38,0.2),transparent_42%),radial-gradient(circle_at_25%_85%,rgba(220,38,38,0.08),transparent_35%)]" />
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)]  opacity-20" />

      <div className="relative z-10 w-full max-w-325 mx-auto px-6 py-16 md:py-20">
        <div className="relative overflow-hidden ">
          <div className="absolute inset-0 pointer-events-none" />
          <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <div className="relative flex justify-center mr-20 lg:justify-end">
                <Image
                  src="/assets/deadpool.svg"
                  alt="Deadpool"
                  width={300}
                  height={300}
                  className="w-80 sm:w-107.5 md:w-195 h-auto object-contain relative z-10 "
                />
              </div>
              <h2 className="font-[Boldonse] text-[30px] md:text-[44px] leading-tight text-[#ffe2e2] uppercase">
                Ready To Build Something Heroic?
              </h2>
              <p className="mt-4 text-red-100/70 max-w-[60ch]">
                One day. Infinite grit. Bring your squad, pick a domain, and
                launch something unforgettable.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button className="px-6 py-2.5 rounded-full bg-red-600 text-white text-sm font-semibold tracking-wide hover:bg-red-500 transition-colors">
                Register Your Team
              </button>
              <button
                onClick={() => handleScroll("domains")}
                className="px-6 py-2.5 rounded-full border border-red-500/50 text-red-200 text-sm font-semibold tracking-wide hover:bg-red-500/15 transition-colors"
              >
                Explore Domains
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          <div>
            <h3 className="text-[#ffe2e2] uppercase text-sm tracking-[0.22em] mb-3">
              Supernova
            </h3>
            <p className="text-red-100/65  mx-auto md:mx-0 leading-relaxed">
              A 24-hour hackathon where ideas collide with execution. Build
              fast, think bold, and ship with impact.
            </p>
          </div>

          <div>
            <h3 className="text-[#ffe2e2] uppercase text-sm tracking-[0.22em] mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-red-100/70">
              {quickLinks.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleScroll(item.id)}
                    className="hover:text-red-300 transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#ffe2e2] uppercase text-sm tracking-[0.22em] mb-3">
              Essentials
            </h3>
            <ul className="space-y-2 text-red-100/70">
              {policyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-red-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 h-px bg-linear-to-r from-transparent via-red-500/60 to-transparent" />

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-red-100/50 text-xs md:text-sm">
          <p className="uppercase tracking-wider text-center">
            © 2026 Supernova. Maximum Effort.
          </p>
          <p className="tracking-[0.2em] uppercase text-[10px] md:text-xs text-red-300/70">
            Build • Break • Rebuild
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
