"use client";
import React from "react";

// You can add as many domains here as you want! 
// The grid layout will automatically expand to accommodate them around the Hulk.
export const DOMAINS = [
  {
    id: 1,
    title: "AI & Machine Learning",
    description: "Architect neural networks and push the limits of AGI. Harness raw algorithmic power.",
  },
  {
    id: 2,
    title: "Web3 & Blockchain",
    description: "Forge unbreakable smart contracts and define the decentralized frontier.",
  },
  {
    id: 3,
    title: "Cybersecurity",
    description: "Defend against dark threads. Penetrate systems and build impenetrable gamma-shields.",
  },
  {
    id: 4,
    title: "AR / VR",
    description: "Construct immersive simulated realities. Redefine human-computer interaction.",
  },
];

const Domains = () => {
  return (
    <section className="relative w-full min-h-screen py-[120px] bg-[#000501] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Gamma Background Noise & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />

      {/* Heading */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-[24px] mb-[80px]">
        <h2 className="font-['Impact',sans-serif] font-black text-[56px] md:text-[96px] tracking-[0.08em] leading-none text-[#e2ffe7] drop-shadow-[0_0_30px_rgba(34,197,94,0.6)] uppercase text-center">
          DOMAIN<span className="text-transparent" style={{ WebkitTextStroke: '2px #22c55e' }}>S</span>
        </h2>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto flex flex-col items-center justify-center px-[24px]">
        
        {/* Massive Hulk absolutely centered (Desktop Only) */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 hidden lg:flex justify-center items-center pointer-events-none">
          {/* Intense Gamma Burst */}
          <div className="absolute inset-0 bg-[#22c55e]/20 blur-[120px] rounded-full" />
          <img 
            src="/assets/hulk.svg" 
            alt="Hulk" 
            className="w-[450px] xl:w-[600px] object-contain animate-[float_6s_ease-in-out_infinite] drop-shadow-[0_0_80px_rgba(34,197,94,0.6)] relative z-10"
          />
        </div>

        {/* Hulk Image (Mobile Only - sits comfortably at the top of the grid) */}
        <div className="flex lg:hidden justify-center items-center w-full mb-[40px] relative z-0">
          <div className="absolute inset-0 bg-[#22c55e]/30 blur-[60px] rounded-full pointer-events-none" />
          <img 
            src="/assets/hulk.svg" 
            alt="Hulk Mobile" 
            className="w-[280px] sm:w-[350px] object-contain animate-[float_6s_ease-in-out_infinite] drop-shadow-[0_0_40px_rgba(34,197,94,0.5)] relative z-10"
          />
        </div>

        {/* Dynamic Domains Grid */}
        {/* The gap-x creates the massive space in the center column where Hulk fits perfectly on desktop */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-[24px] lg:gap-x-[450px] xl:gap-x-[650px] lg:gap-y-[64px]">
          {DOMAINS.map((domain) => (
            <div 
              key={domain.id} 
              className="group relative bg-[#010a03]/80 border border-green-900/40 rounded-xl p-[32px] md:p-[48px] backdrop-blur-xl transition-all duration-300 hover:border-green-500/60 hover:bg-[#021205]/90 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] hover:-translate-y-2"
            >
              <h3 className="relative z-10 text-green-400 font-bold text-[24px] md:text-[28px] tracking-[0.1em] uppercase mb-[16px] drop-shadow-[0_0_10px_rgba(34,197,94,0.4)] transition-colors group-hover:text-green-300">
                {domain.title}
              </h3>
              <p className="relative z-10 text-green-100/70 text-[14px] md:text-[16px] leading-[1.8] font-medium transition-colors group-hover:text-green-50">
                {domain.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Domains;
