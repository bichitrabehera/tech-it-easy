"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="relative border-t border-cyan-900/40 bg-[#010614] backdrop-blur-xl min-h-[100vh] flex flex-col justify-end">
      {/* Intense Center Backlight behind Thor
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_60%)] blur-[60px] pointer-events-none z-0" /> */}

      {/* Centerpiece: Massive Thor (Uncapped to break out of top) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 lg:opacity-100 flex justify-center items-end pb-[40px]">
        <img
          src="/assets/thorbg.png"
          alt="Thor Centerpiece"
          className="h-[90%] md:h-[80%] object-contain object-bottom  drop-shadow-[0_0_60px_rgba(6,182,212,0.6)]"
        />
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-[1400px] mx-auto px-[24px] pt-[80px] pb-[40px] relative z-10 flex flex-col justify-between flex-grow">
        {/* Top Split: Left Branding & Right Links */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-[64px] w-full">
          {/* LEFT: Branding */}
          <div className="w-full lg:w-[400px]">
            <h2 className="text-[40px] md:text-[64px] font-black font-['Impact',sans-serif] tracking-widest text-[#e2f8ff] uppercase  leading-none text-center lg:text-left">
              LUMORA
            </h2>
            <p className="mt-[24px] text-cyan-100/70 text-[14px] md:text-[16px] leading-[1.8] font-medium drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] text-center lg:text-left">
              Build the future. Become the hero. Harness the lightning and
              innovate alongside the brightest minds at the ultimate 2026
              Hackathon.
            </p>
          </div>

          {/* RIGHT: Links Grid */}
          <div className="w-full lg:w-[500px] grid grid-cols-2 sm:grid-cols-3 gap-[40px] md:gap-[60px] text-[15px] relative z-20 text-center sm:text-left">
            <div>
              <h3 className="text-cyan-50 font-black tracking-[0.2em] uppercase mb-[24px] drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] text-[14px]">
                Explore
              </h3>
              <ul className="flex flex-col gap-[16px] text-cyan-200/50 font-bold tracking-wide">
                <li className="hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all cursor-pointer">
                  About
                </li>
                <li className="hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all cursor-pointer">
                  Prizes
                </li>
                <li className="hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all cursor-pointer">
                  Sponsors
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-cyan-50 font-black tracking-[0.2em] uppercase mb-[24px] drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] text-[14px]">
                Resources
              </h3>
              <ul className="flex flex-col gap-[16px] text-cyan-200/50 font-bold tracking-wide">
                <li className="hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all cursor-pointer">
                  FAQs
                </li>
                <li className="hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all cursor-pointer">
                  Rules
                </li>
                <li className="hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all cursor-pointer">
                  Discord
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-cyan-50 font-black tracking-[0.2em] uppercase mb-[24px] drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] text-[14px]">
                Social
              </h3>
              <ul className="flex flex-col sm:items-start items-center gap-[16px] text-cyan-200/50 font-bold tracking-wide">
                <li className="hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all cursor-pointer">
                  Twitter
                </li>
                <li className="hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all cursor-pointer">
                  LinkedIn
                </li>
                <li className="hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all cursor-pointer">
                  GitHub
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar Container */}
        <div className="mt-auto pt-[64px]">
          {/* Electric Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] mb-[32px]" />

          {/* Legal / Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-cyan-200/40 text-[12px] md:text-[14px] font-bold tracking-[0.2em] gap-[24px] relative z-20">
            <p className="uppercase text-center text-cyan-300/60 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
              © 2026 Lumora. The Hackathon of the Gods.
            </p>

            <div className="flex gap-[32px] md:gap-[48px]">
              <span className="hover:text-cyan-400 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all cursor-pointer uppercase">
                Privacy
              </span>
              <span className="hover:text-cyan-400 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-all cursor-pointer uppercase">
                Terms
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
