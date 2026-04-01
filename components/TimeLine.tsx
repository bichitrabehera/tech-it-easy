"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";

type TimelineEvent = {
  time: string;
  title: string;
  description: string;
};

type TimelineDay = {
  day: string;
  events: TimelineEvent[];
};

const TIMELINE_DATA: TimelineDay[] = [
  {
    day: "Day 1 — Origin Begins",
    events: [
      {
        time: "08:30 AM",
        title: "Hero Check-in & Gear Up",
        description: "Registration, kit distribution, and early strategy sessions.",
      },
      {
        time: "10:00 AM",
        title: "Hero Assembly (Inauguration)",
        description: "Rules briefing, WiFi credentials, mentor introductions.",
      },
      {
        time: "11:00 AM",
        title: "Power Activation (Hacking Begins)",
        description: "Teams begin building and designing their solutions.",
      },
      {
        time: "03:00 PM",
        title: "Hero Review 1: Origin Scan",
        description: "Mentors assess ideas, direction, and feasibility.",
      },
      {
        time: "09:00 PM",
        title: "Hero Review 2: Power Surge",
        description: "Evaluation of core logic, backend strength, and early UI.",
      },
    ],
  },
  {
    day: "Day 2 — Final Battle",
    events: [
      {
        time: "08:00 AM",
        title: "Hero Review 3: Final Form",
        description: "Assessment of polished builds, UI, and bug fixes. Finalists selected.",
      },
      {
        time: "11:00 AM",
        title: "Power Down (Hacking Ends)",
        description: "All code must be submitted via official GitHub links or folders.",
      },
      {
        time: "11:30 AM",
        title: "Ultimate Showdown (Grand Finale)",
        description: "5-minute demo + 2-minute Q&A for selected finalist teams.",
      },
      {
        time: "01:30 PM",
        title: "Hall of Fame (Awards & Closing)",
        description: "Winners announced, snacks, networking, and photos.",
      },
    ],
  },
];

const TimeLine = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90,
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#050005] py-32 px-4 border-b border-[#ffffff10] overflow-hidden"
    >
      {/* Background Grid & Vignette (Mystical Purple/Orange) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,0.05),transparent_70%)] pointer-events-none" />

      {/* Portal & Dr Strange Section */}
      <div className="relative z-20 flex flex-col items-center mb-40">
        {/* PORTAL ILLUSTRATION */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-12">
          {/* Spinning Portal Rings */}
          <div className="absolute inset-0 border-4 border-dashed border-orange-500 rounded-full animate-[spin_10s_linear_infinite] opacity-40" />
          <div className="absolute inset-0 border-4 border-dotted border-gold-500 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-30" />

          {/* Inner Glow Portal */}
          <div className="absolute inset-4 bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="absolute inset-10 bg-black/40 backdrop-blur-sm rounded-full border border-orange-500/50 shadow-[0_0_50px_rgba(245,158,11,0.4)]" />

          {/* Dr Strange */}
          <Image
            src="/assets/drstrange.svg"
            alt="Doctor Strange"
            width={180}
            height={180}
            className="relative z-10 animate-[float_4s_ease-in-out_infinite] drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]"
          />

          {/* Sparkles around portal */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-ping" style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`
              }} />
            ))}
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-[Boldonse] text-4xl md:text-7xl font-black text-white  uppercase drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]"
        >
          THE CIRCUIT
        </motion.h2>
        <div className="text font-bold text-orange-400  uppercase mt-10">
          TIME CONTINUUM — SECTOR ANALYSIS
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative flex flex-col items-center">

        {/* Winding SVG Path (Orange/Gold Glow) */}
        <svg
          viewBox="0 0 400 1800"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0 opacity-80"
          preserveAspectRatio="none"
        >
          <path
            d="M 200 0 C 350 200 350 400 200 600 C 50 800 50 1000 200 1200 C 350 1400 350 1600 200 1800"
            fill="none"
            stroke="rgba(245,158,11,0.05)"
            strokeWidth="4"
          />
          <motion.path
            d="M 200 0 C 350 200 350 400 200 600 C 50 800 50 1000 200 1200 C 350 1400 350 1600 200 1800"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="4"
            style={{ pathLength }}
            strokeLinecap="round"
          />
        </svg>

        <div className="w-full relative z-10 flex flex-col gap-40 pb-20">
          {TIMELINE_DATA.map((day, dayIndex) => (
            <div key={dayIndex} className="relative flex flex-col items-center">

              {/* Day Badge (Orange) */}
              <div className="relative mb-24 self-start md:self-auto md:ml-[-250px]">
                <div className="bg-orange-500 px-6 py-2 rounded-sm transform skew-x-[-20deg] shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  <span className="inline-block transform skew-x-[20deg] text-black font-black text-xs md:text-sm tracking-widest uppercase">
                    {day.day}
                  </span>
                </div>
              </div>

              {/* Day Events */}
              <div className="w-full flex flex-col gap-32">
                {day.events.map((event, index) => {
                  const getXOffset = (it: number, dIdx: number) => {
                    const totalIdx = (dIdx * 4) + it;
                    if (totalIdx % 4 === 0) return "md:ml-[80px]";
                    if (totalIdx % 4 === 1) return "md:ml-[220px]";
                    if (totalIdx % 4 === 2) return "md:ml-[-220px]";
                    return "md:ml-[150px]";
                  };

                  const isLeft = ((dayIndex * 4) + index) % 2 === 0;

                  return (
                    <div key={index} className={`relative flex flex-col items-center w-full`}>

                      {/* Connection Dot (Orange Glow) */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-3 h-3 rounded-full bg-black border-2 border-white shadow-[0_0_10px_#f59e0b] z-30" />

                      {/* Content Card (Gold Accents) */}
                      <motion.div
                        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={`relative z-20 w-[90%] md:w-[400px] mt-8 ${getXOffset(index, dayIndex)} transition-all duration-500`}
                      >
                        <div className="bg-black/90 backdrop-blur-md border border-white/5 group hover:border-orange-500/50 p-6 rounded-lg shadow-2xl relative overflow-hidden">
                          {/* Inner gold glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />

                          <div className="relative z-10">
                            <span className="text-orange-500 font-bold text-xl mb-1 block tracking-tighter">
                              {event.time}
                            </span>
                            <h3 className="text-white font-[Boldonse] text-lg md:text-xl tracking-wider mb-2 uppercase group-hover:text-gold transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                              {event.description}
                            </p>
                          </div>

                          {/* Decorative Gold Corners */}
                          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500/30" />
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-500/30" />
                        </div>
                      </motion.div>

                      {/* Assets along path (Themed Heros) */}
                      {index === 1 && dayIndex === 0 && (
                        <div className="absolute right-[-10%] md:right-[0%] top-[-50px] pointer-events-none z-0">
                          <Image src="/assets/hulk1.svg" alt="Hulk" width={280} height={280} className="opacity-40 animate-[float_6s_ease-in-out_infinite]" />
                        </div>
                      )}

                      {index === 3 && dayIndex === 0 && (
                        <div className="absolute left-[-10%] md:left-[0%] top-0 pointer-events-none z-0">
                          <Image src="/assets/spiderman1.svg" alt="Spiderman" width={300} height={300} className="opacity-40 animate-[float_5s_ease-in-out_infinite]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
      `}</style>
    </section>
  );
};

export default TimeLine;
