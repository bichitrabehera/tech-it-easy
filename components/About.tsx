import React from "react";

export default function About() {
  return (
    <section className="relative w-full min-h-[80vh] bg-[#08000a] overflow-hidden flex items-center justify-center py-[80px]">
      {/* Seamless Transitions */}
      <div className="absolute top-0 inset-x-0 h-[160px] bg-gradient-to-b from-black to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 inset-x-0 h-[160px] bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(220,0,0,0.15),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />

      {/* Container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-[24px] md:px-[48px] flex flex-col md:flex-row items-center justify-between gap-[64px]">
        {/* Left: About Text & Stats */}
        <div className="flex-1 max-w-[600px] flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-block text-[10px] md:text-[12px] font-bold tracking-[0.3em] uppercase text-red-300 border border-red-900 bg-red-900/20 px-[16px] py-[8px] rounded-full mb-[24px] shadow-[0_0_15px_rgba(220,0,0,0.3)]">
            The Battle Begins
          </div>

          <h2 className="font-['Impact',sans-serif] font-black text-[68px] md:text-[110px] tracking-[0.08em] leading-none text-white drop-shadow-[0_0_30px_rgba(220,0,0,0.5)] uppercase mb-[32px]">
            ABOU
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px #dc2626" }}
            >
              T
            </span>
          </h2>

          <p className="text-[16px] leading-[1.8] text-red-100/70  mb-[48px]">
            <strong className="text-white drop-shadow-[0_0_10px_rgba(220,0,0,0.8)]">
              Lumora
            </strong>{" "}
            is where heroes are forged in a 24-hour crucible of code and
            creativity. We don't just build software we build the future. No
            safety nets. No half measures. Only the relentless pursuit of
            something incredible.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-[32px] md:gap-[48px]">
            {/* Stat 1 */}
            <div className="flex flex-col items-center md:items-start">
              <div className="font-['Impact',sans-serif] text-[40px] md:text-[56px] text-white tracking-[0.05em] drop-shadow-[0_0_20px_rgba(220,0,0,0.6)]">
                24H
              </div>
              <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-red-500 mt-[4px]">
                Non-stop
              </div>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center md:items-start">
              <div className="font-['Impact',sans-serif] text-[40px] md:text-[56px] text-white tracking-[0.05em] drop-shadow-[0_0_20px_rgba(220,0,0,0.6)]">
                $1000
              </div>
              <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-red-500 mt-[4px]">
                Prizes
              </div>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center md:items-start">
              <div className="font-['Impact',sans-serif] text-[40px] md:text-[56px] text-white tracking-[0.05em] drop-shadow-[0_0_20px_rgba(220,0,0,0.6)]">
                FREE
              </div>
              <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-red-500 mt-[4px]">
                Swags
              </div>
            </div>
          </div>
        </div>

        {/* Right: SVG Image */}
        <div className="flex-1 w-full max-w-[500px] relative flex justify-center items-center">
          <div className="absolute inset-0 bg-red-600/10 blur-[80px] rounded-full pointer-events-none" />
          <img
            src="/assets/spiderman.svg"
            alt="Spiderman"
            className="w-[280px] md:w-[480px] object-contain relative z-10 animate-[float_6s_ease-in-out_infinite] drop-shadow-[0_0_30px_rgba(220,0,0,0.4)]"
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
