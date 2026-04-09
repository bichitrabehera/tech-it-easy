"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterSuccessPage() {
  return (
    <div className="relative min-h-screen py-10 bg-[#020202] text-white flex items-center justify-center px-6 overflow-hidden">
      
      {/* Background Effects (same as register page) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(185,28,28,0.15)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-1/4 left-[-100px] w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:border-red-500/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm text-white/70">Return to Portal</span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 md:p-12 text-center space-y-10"
        >

          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
            <CheckCircle2 className="text-red-400" size={40} />
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight italic bg-gradient-to-b from-white to-white/40 text-transparent bg-clip-text">
              TRANSMISSION COMPLETE
            </h1>

            <p className="text-white/40 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
              Your team registration has been successfully transmitted to the SuperNova network.
            </p>
          </div>

          {/* Status Box */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-5 flex items-start gap-3 text-left">
            <Clock3 className="text-amber-400 mt-1" size={18} />
            <p className="text-amber-200/90 text-sm leading-relaxed">
              Await clearance from command. If selected, access credentials will be issued to your registered email.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            
            <Link
              href="/"
              className="group relative px-6 py-3 rounded-xl bg-white text-black font-black tracking-widest text-xs hover:scale-[1.02] transition-all overflow-hidden"
            >
              <span className="relative z-10 group-hover:text-white transition-colors">
                RETURN HOME
              </span>
              <div className="absolute inset-0 bg-red-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </Link>

            <Link
              href="/login"
              className="px-6 py-3 rounded-xl border border-white/10 hover:border-red-500/50 text-white/70 hover:text-white text-xs font-bold tracking-widest transition-all"
            >
              TEAM LOGIN
            </Link>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-xs text-white/20 tracking-widest">
              SuperNova Network // Secure Channel Established
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}