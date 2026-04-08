"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, FileUp, Loader2, ShieldCheck, Upload, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { PAYMENT_AMOUNT_INR, PAYMENT_TITLE, PAYMENT_UPI_ID } from "@/lib/constants";
interface Team {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  status: "PENDING" | "SELECTED" | "REJECTED";
  paymentStatus: "UNPAID" | "PAID";
  paymentProof: string | null;
}

export default function PaymentPage() {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("/api/team/me");
        if (response.ok) {
          const data = await response.json();

          if (data.team.paymentStatus === "PAID") {
            router.replace("/dashboard");
            return;
          }

          setTeam(data.team);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [router]);

  useEffect(() => {
    if (!team || team.paymentStatus === "PAID") {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/team/me", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        if (data.team.paymentStatus === "PAID") {
          router.replace("/dashboard");
        }
      } catch {
        // Polling is best effort; ignore transient errors.
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [router, team]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isUploading) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Upload an image screenshot of your payment proof" });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload/payment-proof", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "Payment proof uploaded. Webhook verification remains primary." });
        setTeam((current) =>
          current
            ? {
                ...current,
                paymentProof: data.url,
              }
            : current
        );
      } else {
        setMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Upload failed" });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePayNow = () => {
    const upiUrl = `upi://pay?pa=${encodeURIComponent(PAYMENT_UPI_ID)}&pn=${encodeURIComponent(team?.teamName || "SuperNova")}&am=${PAYMENT_AMOUNT_INR}&cu=INR`;
    window.location.href = upiUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-blue-200/50 text-sm font-medium tracking-widest uppercase">Opening Payment Portal...</p>
        </div>
      </div>
    );
  }

  if (!team) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      <header className="h-20 border-b border-slate-800/50 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">SuperNova</h1>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none">{PAYMENT_TITLE}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handleLogout}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto p-6 md:py-12 md:px-8">
        {message && (
          <div className={`mb-6 p-4 rounded-2xl border ${message.type === "success" ? "bg-blue-500/10 border-blue-500/20 text-blue-200" : "bg-red-500/10 border-red-500/20 text-red-200"}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-3xl backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                  <CreditCard size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Complete Payment</h2>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Selected teams only</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>Team <span className="text-white font-semibold">{team.teamName}</span> is selected. Tap the payment button, pay once, and you are done.</p>
                <p>After payment, upload proof below. Admin verifies and then dashboard access is enabled.</p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white">Payment Details</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Settlement instructions</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                  Awaiting proof
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-5 bg-blue-600/5 border border-blue-500/10 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Amount</p>
                  <p className="text-3xl font-black text-white">₹{PAYMENT_AMOUNT_INR}</p>
                </div>
                <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">UPI ID</p>
                  <p className="text-sm font-mono font-semibold text-slate-200 break-all">{PAYMENT_UPI_ID}</p>
                </div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePayNow();
                  }}
                  className="inline-flex items-center justify-center gap-3 px-5 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                >
                  Pay now (UPI)
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </section>

          <section className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300">
                  <FileUp size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white uppercase">Upload Proof</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Optional fallback</p>
                </div>
              </div>

              <input
                type="file"
                id="payment-proof"
                accept="image/*"
                className="hidden"
                onChange={handleProofUpload}
              />
              <label
                htmlFor="payment-proof"
                className="flex flex-col items-center justify-center gap-4 w-full py-16 border-2 border-dashed border-slate-800 bg-slate-800/20 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/[0.02] transition-all rounded-3xl"
              >
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                  {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {team.paymentProof ? "Resubmit proof" : "Upload proof"}
                </span>
                <span className="text-xs text-slate-600 text-center max-w-md">
                  If needed, upload a screenshot of the payment confirmation.
                </span>
              </label>
            </div>

            {team.paymentProof && (
              <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-4 text-blue-400">
                  <CheckCircle size={20} />
                  <h3 className="text-lg font-bold uppercase tracking-tight">Proof Uploaded</h3>
                </div>
                <p className="text-sm text-slate-400">Your proof is saved. Admin can review it if needed.</p>
                <a
                  href={team.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300"
                >
                  View Uploaded Proof
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4 text-amber-400">
                <Clock size={20} />
                <h3 className="text-lg font-bold uppercase tracking-tight">Next</h3>
              </div>
              <ol className="space-y-3 text-sm text-slate-400 list-decimal list-inside">
                <li>Pay once using the button above.</li>
                <li>Upload payment proof screenshot.</li>
                <li>Admin confirms and then you move to dashboard.</li>
              </ol>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
