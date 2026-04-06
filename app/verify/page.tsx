"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your magic link...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing token");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          setStatus("error");
          setMessage(data.error || "Invalid or expired token");
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center selection:bg-blue-500/30">
      <div className="text-center px-6 max-w-sm w-full">
        <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <ShieldCheck className="text-white" size={28} />
            </div>
        </div>

        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto animate-spin text-blue-500 h-10 w-10" />
            <h1 className="text-xl font-bold text-white tracking-tight">{message}</h1>
            <p className="text-slate-500 text-sm font-medium tracking-wide">Syncing with SuperNova 2026 terminal...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle className="mx-auto text-blue-400 h-10 w-10" />
            <h1 className="text-xl font-bold text-white tracking-tight">{message}</h1>
            <p className="text-slate-500 text-sm font-medium tracking-wide">Welcome to the inner circle.</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <XCircle className="mx-auto text-red-400 h-10 w-10" />
            <h1 className="text-xl font-bold text-white tracking-tight italic">Link Refused</h1>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{message}</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/10"
            >
              Request Access Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
