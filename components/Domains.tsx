"use client";
import React from "react";
import Image from "next/image";
import Card from "./ui/Card";

// You can add as many domains here as you want! 
// The grid layout will automatically expand to accommodate them around the Hulk.
export const DOMAINS = [
  {
    id: 1,
    title: "Gen AI & AI Agents",
    description: "Build autonomous agents and generative systems that reason, create, and act at scale.",
  },
  {
    id: 2,
    title: "Multimodal AI",
    description: "Design systems that understand and generate across text, vision, audio, and beyond.",
  },
  {
    id: 3,
    title: "AI + Web3",
    description: "Merge intelligence with decentralization to create trustless, autonomous ecosystems.",
  },
  {
    id: 4,
    title: "Open Innovation",
    description: "Collaborate across disciplines to solve complex problems and drive breakthrough ideas.",
  },
];

const Domains = () => {
  return (
    <section id="domains" className="relative w-full py-30 bg-[#000501] flex flex-col items-center justify-center overflow-hidden border-b border-[#ffffff30]">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-[24px] mb-[80px]">
        <h2 className="font-[Boldonse] font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.08em] leading-none text-[#e2ffe7] drop-shadow-[0_0_30px_rgba(34,197,94,0.6)] uppercase text-center">
          DOMAIN<span className="text-transparent" style={{ WebkitTextStroke: '2px #22c55e' }}>S</span>
        </h2>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto flex flex-col items-center justify-center px-[24px]">

        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 hidden lg:flex justify-center items-center pointer-events-none">
          <div className="absolute inset-0 bg-[#22c55e]/20 blur-[120px] rounded-full" />
          <Image
            src="/assets/hulk1.svg"
            alt="Hulk"
            width={450}
            height={450}
            loading="eager"
            className="w-[450px] xl:w-[400px] object-contain animate-[float_6s_ease-in-out_infinite] relative z-10"
          />
        </div>

        <div className="flex lg:hidden justify-center items-center w-full mb-[40px] relative z-0">
          <div className="absolute inset-0 bg-[#22c55e]/30 blur-[60px] rounded-full pointer-events-none" />
          <Image
            src="/assets/hulk1.svg"
            alt="Hulk Mobile"
            width={350}
            height={350}
            className="w-[280px] sm:w-[350px] object-contain animate-[float_6s_ease-in-out_infinite] relative z-10"
          />
        </div>

        <div className="relative z-10 w-full mx-auto grid grid-cols-1 lg:grid-cols-2 
gap-[24px] lg:gap-x-[450px] xl:gap-x-[650px] lg:gap-y-[64px]
justify-items-center lg:justify-items-stretch">
          {DOMAINS.map((domain) => (
            <Card
              key={domain.id}
              title={domain.title}
              description={domain.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Domains;
