"use client";
import React, { useState } from "react";
import { faqs } from "@/data/faqs";
import Image from "next/image";

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="relative w-full min-h-screen py-[120px] flex flex-col justify-center">
      <div className="absolute inset-0 bg-[#00040a]/80 z-0 pointer-events-none backdrop-blur-[4px]" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-[24px]">
        <h2 className="font-[Boldonse] font-black text-[56px] md:text-[76px] tracking-[0.08em] leading-none text-white drop-shadow-[0_0_30px_rgba(38,102,220,0.5)] uppercase mb-[64px] text-left">
          FAQ
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "2px #2666dcff" }}
          >
            S
          </span>
        </h2>

        <div className="flex flex-col-reverse lg:flex-row gap-20 md:gap-[200px] items-center lg:items-start w-full">
          <div className="w-full lg:w-[35%] flex justify-center items-center relative">
            <div className="absolute inset-0 bg-[#2666dc]/20 blur-[80px] rounded-full pointer-events-none" />
            <Image
              src="/assets/captianamerica.svg"
              alt="Captain America"
              width={900}
              height={900}
              className="w-[350px] md:w-[500px] lg:w-[900px] max-w-[500px] object-contain relative z-10 animate-[float_6s_ease-in-out_infinite]"
            />
          </div>

          <div className="w-full lg:w-[55%] flex flex-col gap-[16px]">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`rounded-xl border transition-all duration-300 shadow-[0_4px_30px_rgba(38,102,220,0.1)] overflow-hidden ${isOpen
                      ? "bg-[#000a14]/90 border-blue-600/50 backdrop-blur-xl"
                      : "bg-[#00040a]/60 border-blue-900/30 backdrop-blur-md hover:bg-[#000a14]/70 hover:border-blue-600/30"
                    }`}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between px-[24px] py-[14px] text-left text-white"
                  >
                    <span
                      className={`font-bold tracking-wide transition-colors duration-300 text-[16px] md:text-[18px] ${isOpen ? "text-blue-400" : "text-white/90"}`}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={`text-blue-600 text-[28px] font-black transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? "rotate-[135deg] text-blue-500" : ""
                        }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-[24px] pb-[28px] text-blue-100/60 text-[14px] md:text-[16px] leading-relaxed mx-[8px] md:mx-[16px] font-medium border-t border-blue-900/20 pt-[20px]">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
