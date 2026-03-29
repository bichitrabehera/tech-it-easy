"use client";
import React from "react";
import IronManCountdown from "./ui/CountDown";
import Button from "./ui/Button";
import Image from "next/image";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0000] text-white pt-[15vh] pb-24 md:pt-0 md:pb-0"
    >
      {/* BACKGROUND GRADIENTS */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b0303] via-[#0a0000] to-black z-0" />

      {/* VIGNETTE */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_100%)] z-0 opacity-90"></div>

      {/* TECH GRID OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none" />

      {/* RED BACKLIGHTING */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* MAIN CONTENT CENTER */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full  transition-all">
        {/* TITLE & IRONMAN WRAPPER */}
        <div className="relative w-full flex items-center justify-center mt-4">
          {/* Supernova BACKGROUND TITLE */}
          <h1
            className="
            absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2
            font-[Boldonse] font-black
            text-[40px] md:text-[150px] 
            tracking-[0.1em] text-white 
            opacity-80 drop-shadow-[0_0_50px_rgba(220,0,0,0.4)]
            uppercase leading-none z-10
            w-full text-center
          "
          >
            SuperNova
          </h1>

          {/* IRONMAN IMAGE (Dictates container height naturally) */}
          <div
            className="relative z-20 w-[250px] sm:w-[400px] lg:w-[400px] mt-[10%] md:mt-[8%]"
            style={{ animation: "float 6s ease-in-out infinite" }}
          >
            <Image
              src="/assets/ironman1.svg"
              alt="Ironman"
              className="w-full h-full object-contain"
              width={50}
              height={50}
            />
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="relative z-30 flex flex-col items-center mt-6 md:mt-12">
          {/* TAGLINE */}
          <div className="text-[14px] sm:text-[16px] font-bold tracking-[0.2em] md:tracking-[0.3em] text-white/90 uppercase mb-6  text-center">
            Build the future.{" "}
            <span className="text-red-500 drop-shadow-[0_0_15px_rgba(220,0,0,0.8)]">
              Become the hero.
            </span>
          </div>

          <div className="text-[14px] md:text-[20px] font-bold  tracking-[0.4em] text-red-300/90 uppercase drop-shadow-[0_0_15px_rgba(220,0,0,0.8)] mb-3">
            24H Hackathon
          </div>

          <div className="text-[12px] md:text-[18px]  tracking-[0.3em] text-red-100/60 uppercase mb-10">
            April 29–30, 2026
          </div>

          {/* BUTTON */}
          <Button text="Register Now" />
        </div>
      </div>

      <div
        className="
        relative md:absolute z-30 
        w-full md:w-auto flex justify-center 
        mt-16 md:mt-0 
        md:right-[2%] lg:right-[4%] xl:right-[8%] 
        md:top-[60%] md:-translate-y-1/2
        px-4 md:px-0
      "
      >
        <div
          className="
          relative bg-[#08000a]/80 backdrop-blur-xl 
          border border-red-600/10 rounded-xl p-2 sm:p-2 
          
          w-full max-w-[400px] md:w-auto
        "
        >
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-red-600/10 blur-3xl rounded-xl pointer-events-none" />

          <div className="relative z-10">
            <IronManCountdown targetDate="2026-04-29T10:00:00" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
