"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to send magic link",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-white/5 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* MAIN ROW */}
      <div className="relative z-10 max-w-6xl w-full grid lg:grid-cols-2 gap-12 px-6">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center space-y-8">

          <Link href="/" className="text-white/40 hover:text-white text-sm">
            ← Back to Portal
          </Link>

          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Secure Access
            </h1>
            <p className="text-white/50 max-w-md leading-relaxed">
              Enter your registered email to receive a secure magic link and access your team dashboard instantly.
            </p>
          </div>

        </div>

        {/* RIGHT SIDE (FORM CARD) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">

          <div className="mb-8">
            <div className="w-14 h-14 flex items-center justify-center bg-white text-black rounded-xl mb-4">
              <Mail size={26} />
            </div>
            <h2 className="text-2xl font-semibold">Login</h2>
            <p className="text-white/40 text-sm mt-1">
              Magic link authentication
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-300 border border-green-500/20"
                  : "bg-red-500/10 text-red-300 border border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="text-sm text-white/60 mb-2 block">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-5 py-4 rounded-xl bg-black border border-white/10 focus:border-white focus:outline-none transition-all placeholder:text-white/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-white text-black rounded-xl font-semibold tracking-wide hover:bg-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Send Magic Link"
              )}
            </button>
          </form>

          <div className="mt-8 text-sm text-white/40 text-center">
            No account?{" "}
            <Link
              href="/register"
              className="text-white hover:underline"
            >
              Register your team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}