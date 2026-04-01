import React from "react";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="relative w-full border-b border-[#ffffff30] py-10 lg:py-30 bg-[#08000a] overflow-hidden flex items-center justify-center">
      {/* Seamless Transitions */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(220,0,0,0.15),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />

      {/* Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-16">
        {/* Left: About Text & Stats */}
        <div className="flex-1 max-w-2xl flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-block m text-xs md:text-xs font-bold tracking-[0.3em] uppercase text-red-300 border border-red-900 bg-red-900/20 px-4 py-2 rounded-full mb-6 shadow-[0_0_15px_rgba(220,0,0,0.3)]">
            The Battle Begins
          </div>

          <h2 className="font-[Boldonse] mt-10 font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.08em] leading-none text-white drop-shadow-[0_0_30px_rgba(220,0,0,0.5)] uppercase mb-8">
            ABOU
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px #dc2626" }}
            >
              T
            </span>
          </h2>

          <p className="text-lg leading-relaxed text-red-100/70  mb-12">
            <strong className="text-white">
              SuperNova
            </strong>{" "}
            is where heroes are forged in a 24-hour crucible of code and
            creativity. We don&apos;t just build software we build the future. No
            safety nets. No half measures. Only the relentless pursuit of
            something incredible.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-12">
            {/* Stat 1 */}
            <div className="flex flex-col items-center md:items-start">
              <div className="font-['Impact',sans-serif] text-4xl md:text-6xl text-white tracking-[0.05em] drop-shadow-[0_0_20px_rgba(220,0,0,0.6)]">
                24H
              </div>
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-red-500 mt-1">
                Non-stop
              </div>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center md:items-start">
              <div className="font-['Impact',sans-serif] text-4xl md:text-6xl text-white tracking-[0.05em] drop-shadow-[0_0_20px_rgba(220,0,0,0.6)]">
                $1000
              </div>
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-red-500 mt-1">
                Prizes
              </div>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center md:items-start">
              <div className="font-['Impact',sans-serif] text-4xl md:text-6xl text-white tracking-[0.05em] drop-shadow-[0_0_20px_rgba(220,0,0,0.6)]">
                FREE
              </div>
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-red-500 mt-1">
                Swags
              </div>
            </div>
          </div>
        </div>

        {/* Right: SVG Image */}
        <div className="flex-1 w-full max-w-md relative flex justify-center items-center">
          <div className="absolute inset-0 bg-red-600/10 blur-2xl rounded-full pointer-events-none" />
          <Image
            src="/assets/spiderman1.svg"
            alt="Spiderman"
            width={480}
            height={480}
            className="w-72 md:w-[480px] object-contain relative z-10 animate-[float_6s_ease-in-out_infinite]"
          />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </section>
  );
}
