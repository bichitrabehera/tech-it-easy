"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Sponsors = () => {
  return (
    <section id="sponsors" className="relative w-full py-24 bg-[#0a0a0a] overflow-hidden border-b border-[#ffffff10]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-[Boldonse] text-5xl md:text-7xl font-black text-white tracking-wider uppercase drop-shadow-[0_0_30px_rgba(255,0,0,0.3)]"
          >
            OUR <span className="text-transparent" style={{ WebkitTextStroke: "2px #ef4444" }}>SPONSORS</span>
          </motion.h2>
          <div className="h-1 w-24 bg-red-600 mx-auto mt-4" />
        </div>

        <div className="relative flex flex-col items-center justify-center min-h-[300px]">
           {/* Classified / Coming Soon Badge */}
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             className="relative p-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-red-600/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] flex flex-col items-center"
           >
              <div className="absolute -top-6 bg-red-600 text-white font-black px-6 py-2 rounded-sm transform skew-x-[-15deg] text-sm tracking-widest uppercase">
                Classified
              </div>
              
              <h3 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter text-center">
                COMING SOON
              </h3>
              <p className="text-zinc-500 text-sm md:text-base text-center max-w-md">
                The most powerful allies in the multiverse are preparing to reveal themselves. Stay tuned for the unveiling of our legendary sponsors.
              </p>
              
           </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shiver {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(5px, -5px) rotate(1deg); }
          50% { transform: translate(-5px, 5px) rotate(-1deg); }
          75% { transform: translate(5px, 5px) rotate(1.5deg); }
        }
      `}</style>
    </section>
  );
};

export default Sponsors;
