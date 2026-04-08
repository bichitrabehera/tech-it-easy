import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-10 md:p-12 text-center space-y-8">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
          <CheckCircle2 className="text-blue-400" size={34} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">Registration Submitted</h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Your team registration has been received successfully.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-5 flex items-start gap-3 text-left">
          <Clock3 className="text-amber-400 mt-0.5" size={18} />
          <p className="text-amber-200/90 text-sm leading-relaxed">
            Please wait while your team is reviewed. If selected, you will receive dashboard access credentials from the admin.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest transition-all"
          >
            Back To Home
          </Link>
          <Link
            href="/login"
            className="px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-bold uppercase tracking-widest transition-all"
          >
            Team Login
          </Link>
        </div>
      </div>
    </div>
  );
}
