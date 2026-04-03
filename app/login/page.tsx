"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
        setMessage({ type: "error", text: data.error || "Failed to send magic link" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6 py-12">
        <Link href="/" className="text-red-500 hover:text-red-400 mb-8 inline-block">
          ← Back to Home
        </Link>

        <div className="text-center mb-8">
          <Mail className="mx-auto text-red-500 mb-4" size={48} />
          <h1 className="text-3xl font-bold text-white mb-2">Team Login</h1>
          <p className="text-neutral-400">
            Enter your email to receive a magic link
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-900/30 border border-green-500/50 text-green-400"
                : "bg-red-900/30 border border-red-500/50 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-red-500 text-white"
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Sending...
              </>
            ) : (
              "Send Magic Link"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-sm">
            Not registered yet?{" "}
            <Link href="/register" className="text-red-500 hover:text-red-400">
              Register your team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
