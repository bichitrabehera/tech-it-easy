"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
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
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center px-6">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto animate-spin text-red-500 mb-4" size={48} />
            <h1 className="text-2xl font-bold text-white mb-2">{message}</h1>
            <p className="text-neutral-400">Please wait while we verify your link...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h1 className="text-2xl font-bold text-white mb-2">{message}</h1>
            <p className="text-neutral-400">Welcome to SuperNova 2026!</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
            <p className="text-neutral-400 mb-6">{message}</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Request New Link
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
