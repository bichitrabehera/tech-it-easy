"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-white/5 backdrop-blur-xl">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,115,0,0.15),transparent_60%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Branding */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              <span className="text-orange-500">Tech</span>It<span className="text-orange-500">Easy</span>
            </h2>
            <p className="mt-3 text-neutral-400 max-w-sm">
              Build something insane in 24 hours. Collaborate, innovate, and win
              big.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="text-white font-semibold mb-3">Explore</h3>
              <ul className="space-y-2 text-neutral-400">
                <li className="hover:text-orange-400 cursor-pointer">About</li>
                <li className="hover:text-orange-400 cursor-pointer">Prizes</li>
                <li className="hover:text-orange-400 cursor-pointer">
                  Sponsors
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-neutral-400">
                <li className="hover:text-orange-400 cursor-pointer">FAQs</li>
                <li className="hover:text-orange-400 cursor-pointer">Rules</li>
                <li className="hover:text-orange-400 cursor-pointer">
                  Discord
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Social</h3>
              <ul className="space-y-2 text-neutral-400">
                <li className="hover:text-orange-400 cursor-pointer">
                  Twitter
                </li>
                <li className="hover:text-orange-400 cursor-pointer">
                  LinkedIn
                </li>
                <li className="hover:text-orange-400 cursor-pointer">GitHub</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-neutral-500 text-sm gap-4">
          <p>© 2026 Tech It Easy. All rights reserved.</p>

          <div className="flex gap-6">
            <span className="hover:text-orange-400 cursor-pointer">
              Privacy
            </span>
            <span className="hover:text-orange-400 cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
