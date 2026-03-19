"use client";
import React from "react";
import Countdown from "./ui/CountDown";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0b0b0f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,115,0,0.25),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(0,180,255,0.15),transparent_40%)]" />

      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay noise" />

      <div className="absolute inset-0">
        <span className="hex-outline slow top-20 left-20"></span>
        <span className="hex-outline mid top-1/3 right-32"></span>
        <span className="hex-outline fast bottom-24 left-1/4"></span>
        <span className="circle-outline slow bottom-20 right-20"></span>
        <span className="plus mid top-1/4 left-1/2"></span>
      </div>

      <div className="relative z-10 text-center max-w-3xl px-6">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="text-orange-500">Tech </span> It{" "}
          <span className="text-orange-500">Easy</span>
        </h1>

        <p className="mt-6 text-xl text-gray-300">
          Turn your full-stack agentic AI app idea into reality in 24 hours.
        </p>

        <p
          className="mt-4 text-sm text-gray-400 uppercase font-semibold"
          style={{ letterSpacing: "1px" }}
        >
          AMC | Bangalore | APRIL 29-30, 2026
        </p>

        <div className="mx-auto w-fit">
          <Countdown targetDate="2026-04-29T09:00:00" />
        </div>

        <div className="mt-10 flex justify-center items-center mx-auto gap-6 flex-col md:flex-row">
          <button
            className="w-fit bg-orange-500 text-neutral-100 font-semibold tracking-wide transition hover:bg-orange-600"
            style={{
              clipPath: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)",
              padding: "8px 32px",
            }}
          >
            REGISTER NOW →
          </button>

          <button
            className="w-fit text-neutral-200 font-semibold tracking-wide transition hover:text-orange-400"
            style={{
              clipPath: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)",
              padding: "8px 32px",
              border: "1px solid rgba(156,163,175,0.4)",
            }}
          >
            MISSION BRIEFING
          </button>
        </div>
        <p className="mt-10 text-sm text-gray-400 tracking-widest uppercase">
          No Fee <span className="text-orange-500">•</span> $1000+ PRIZES{" "}
          <span className="text-orange-500">•</span> MENTORS{" "}
        </p>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-500 animate-bounce">
        <p>Scroll</p>
      </div>
    </section>
  );
};

export default Hero;
