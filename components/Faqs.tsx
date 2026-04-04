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
    <section id="faqs" className="relative  w-full py-30 flex flex-col justify-center">
      <div className="absolute inset-0 bg-[#00040a]/80 z-0 pointer-events-none backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <h2 className="font-[Boldonse] font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.08em] leading-none text-white drop-shadow-[0_0_30px_rgba(38,102,220,0.5)] uppercase mb-16 text-center lg:text-left">
          FAQ
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "2px #2666dcff" }}
          >
            S
          </span>
        </h2>

        <div className="flex flex-col-reverse lg:flex-row gap-20 md:gap-40 items-center lg:items-start w-full">
          <div className="w-full lg:w-1/3 mt-10 flex justify-center items-center relative">
            <div className="absolute inset-0 bg-[#2666dc]/20 blur-[80px] rounded-full pointer-events-none" />
            <Image
              src="/assets/superman.svg"
              alt="Captain America"
              width={900}
              height={900}
              className="w-80 md:w-[500px] lg:w-[900px] max-w-sm object-contain relative z-10 animate-[float_6s_ease-in-out_infinite]"
            />
          </div>

          <div className="w-full lg:w-7/12 flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`rounded-xl border transition-all duration-300  overflow-hidden ${isOpen
                      ? "bg-[#000a14]/90 border-blue-600/50 backdrop-blur-xl"
                      : "bg-[#00040a]/60 border-blue-900/30 backdrop-blur-md hover:bg-[#000a14]/70 hover:border-blue-600/30"
                    }`}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between px-6 py-3.5 text-left text-white"
                  >
                    <span
                      className={`font-bold tracking-wide transition-colors duration-300 text-base md:text-lg ${isOpen ? "text-blue-400" : "text-white/90"}`}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={`text-red-600 text-2xl font-black transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? "rotate-[135deg] text-blue-500" : ""
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
                      <div className="px-6 pb-7 text-blue-100/60 text-sm md:text-base leading-relaxed mx-2 md:mx-4 font-medium border-t border-blue-900/20 pt-5">
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
