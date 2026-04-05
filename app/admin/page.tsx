"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0000] text-white relative flex items-center justify-center overflow-hidden selection:bg-red-600">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b0303] via-[#0a0000] to-black z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_100%)] z-0 opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-md w-full mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-red-600/10 border border-red-600/20 mb-6 group hover:scale-110 transition-transform duration-500">
            <Shield className="text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" size={40} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(220,38,38,0.3)] mb-2">
             Admin <span className="text-red-600">Access</span>
          </h1>
          <p className="text-red-100/40 text-[10px] font-bold uppercase tracking-[0.3em]">
            Authorized Personnel Only
          </p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-900/10 border border-red-500/30 text-red-400 rounded-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500 flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
             <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-200/60 ml-1">Secure Email</label>
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-all placeholder:text-white/10 group-hover:border-white/20 text-white"
                placeholder="admin@supernova.sys"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-red-600/5 opacity-0 group-focus-within:opacity-100 blur transition-opacity pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-200/60 ml-1">Access Key</label>
            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-all placeholder:text-white/10 group-hover:border-white/20 text-white"
                placeholder="••••••••"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-red-600/5 opacity-0 group-focus-within:opacity-100 blur transition-opacity pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-white/20 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.2)] active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Admin Login
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center text-white">
           <Link href="/" className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] hover:text-red-500 transition-colors">
              ← Back to Home
           </Link>
        </div>
      </div>
    </div>
  );
}
