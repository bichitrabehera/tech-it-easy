"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Download, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  CreditCard, 
  Save, 
  Users, 
  FileUp,
  ShieldCheck,
  Link as LinkIcon,
  ExternalLink,
  ChevronRight,
  Activity,
  Terminal,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { DEFAULT_RAZORPAY_PAYMENT_URL, PAYMENT_AMOUNT_INR, PAYMENT_UPI_ID } from "@/lib/constants";

// Custom GitHub icon SVG to match standard
const GithubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

interface Team {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  pptUrl: string | null;
  status: "PENDING" | "SELECTED" | "REJECTED";
  members: { id: string; name: string }[];
  githubId: string | null;
  githubRepo: string | null;
  idProofUrl: string | null;
  paymentStatus: "UNPAID" | "PAID";
  paymentProof: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [githubId, setGithubId] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("/api/team/me");
        if (response.ok) {
          const data = await response.json();
          if (data.team.paymentStatus !== "PAID") {
            router.replace("/payment");
            return;
          }
          setTeam(data.team);
          setGithubId(data.team.githubId || "");
          setGithubRepo(data.team.githubRepo || "");
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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const handleUpdateGithub = async () => {
    if ((!githubId && !githubRepo) || isSaving) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/team/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubId, githubRepo }),
      });
      
      if (response.ok) {
        alert("Profile updated!");
      } else {
        alert("Failed to update profile");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isUploading) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch("/api/upload/payment-proof", { 
        method: "POST", 
        body: formData 
      });
      if (res.ok) { 
        window.location.reload(); 
      }
    } catch (e) { 
      console.error(e); 
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
          <p className="text-blue-200/50 text-sm font-medium tracking-widest uppercase">Syncing Terminal...</p>
        </div>
      </div>
    );
  }

  if (!team) return null;

  const getStatusDisplay = () => {
    switch (team.status) {
      case "SELECTED":
        return {
          label: "ACCESS GRANTED",
          description: "Your team has been selected for the next phase. Prepare for activation.",
          color: "text-blue-400",
          bg: "bg-blue-400/10",
          border: "border-blue-400/20"
        };
      case "REJECTED":
        return {
          label: "RECORD REFUSED",
          description: "Your team was not selected for this cycle. We monitor for future eligibility.",
          color: "text-red-400",
          bg: "bg-red-400/10",
          border: "border-red-400/20"
        };
      default:
        return {
          label: "REVIEW PENDING",
          description: "Application is in the prioritization queue. Await signal.",
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20"
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <header className="h-20 border-b border-slate-800/50 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
               <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">SuperNova</h1>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none">Developer Space</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Home</Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 group px-4 py-2 text-slate-500 hover:text-white transition-all transform hover:scale-105"
            >
              <LogOut size={16} className="group-hover:text-red-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Terminate Session</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 md:py-12 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR: PROFILE & ROSTER */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Team Identity Card */}
            <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Terminal size={120} />
               </div>
               
               <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                     <Users size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors uppercase">{team.teamName}</h2>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Ref ID: <span className="font-mono text-slate-400">{team.id.slice(0, 8)}</span></p>
                  </div>
               </div>

               <div className="space-y-4 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Lead Developer</span>
                    <span className="text-sm font-bold text-slate-200">{team.leaderName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Contact Portal</span>
                    <span className="text-[11px] font-medium text-slate-400">{team.leaderEmail}</span>
                  </div>
               </div>
            </div>

            {/* Team Roster */}
            <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-3xl">
               <div className="flex items-center gap-2 mb-6">
                 <Activity size={14} className="text-blue-500" />
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Roster</h3>
               </div>
               
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-600/5 border border-blue-500/10 rounded-xl">
                     <span className="text-sm font-bold text-blue-200">{team.leaderName}</span>
                     <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2 py-0.5 bg-blue-400/10 rounded">Lead</span>
                  </div>
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-slate-800/20 border border-slate-800/50 rounded-xl">
                       <span className="text-sm font-medium text-slate-400">{member.name}</span>
                       <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Active</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* RIGHT SIDE: MAIN OPERATIONS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STATUS NOTIFICATION BAR */}
            <div className={`${statusInfo.bg} ${statusInfo.border} border p-8 rounded-3xl relative overflow-hidden`}>
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                     <h2 className={`text-2xl font-black tracking-tighter ${statusInfo.color}`}>{statusInfo.label}</h2>
                     <p className="text-sm text-slate-400/80 font-medium leading-relaxed max-w-sm">
                        {statusInfo.description}
                     </p>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl bg-white/5 border ${statusInfo.border} backdrop-blur-md flex items-center gap-3 shrink-0 justify-center`}>
                     {team.status === "SELECTED" ? <CheckCircle size={20} className={statusInfo.color} /> : <Clock size={20} className={statusInfo.color} />}
                     <span className={`font-black text-xs tracking-widest ${statusInfo.color}`}>{team.status}</span>
                  </div>
               </div>
            </div>

            {/* PROJECT ASSETS SECTION */}
            <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-3xl">
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Project Assets</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Resource Repository</p>
                  </div>
                  {team.pptUrl && (
                    <a 
                      href={team.pptUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                    >
                      <Download size={20} />
                    </a>
                  )}
               </div>

               {!team.pptUrl ? (
                <div className="p-12 border-2 border-dashed border-slate-800/50 rounded-3xl flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-600 mb-4">
                      <AlertCircle size={32} />
                   </div>
                   <p className="text-sm text-slate-500 font-medium mb-6">No documentation records found in our database.</p>
                   <Link href="/register" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all border border-slate-700">
                     Complete Profile →
                   </Link>
                </div>
              ) : (
                <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-2xl flex items-center gap-5">
                   <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                      <CheckCircle size={24} />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Verification Stream Initialized</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Your presentation has been hashed and verified.</p>
                   </div>
                   <div className="ml-auto px-3 py-1 bg-blue-400/10 rounded-lg text-[9px] font-black text-blue-400 uppercase tracking-widest">
                      ACTIVE
                   </div>
                </div>
              )}
            </div>

            {/* PROJECT ACTIVATION: PAYMENT & PROOF */}
            {team.status === "SELECTED" && (
              <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-3xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                      <CreditCard size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold tracking-tight text-white uppercase">Project Activation</h3>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1 italic">Level 2 Clearance Requirements</p>
                   </div>
                </div>

                {team.paymentStatus === "UNPAID" ? (
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option 1: Razorpay */}
                        <div className="p-8 bg-blue-600/[0.03] border border-blue-500/10 rounded-3xl flex flex-col justify-between group hover:border-blue-500/30 transition-all">
                           <div>
                              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Registration Credit</p>
                              <div className="text-4xl font-black text-white mb-8 tracking-tighter">
                                 ₹{PAYMENT_AMOUNT_INR}
                                 <span className="text-xs font-medium text-slate-600 ml-2 tracking-normal uppercase">Cycle fee</span>
                              </div>
                           </div>
                          <a 
                            href={DEFAULT_RAZORPAY_PAYMENT_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                           >
                              Initialize Payment
                              <ExternalLink size={14} />
                           </a>
                        </div>

                        {/* Option 2: UPI */}
                        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-6">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Static Terminal IP (UPI)</p>
                           <div className="p-4 bg-[#020617] border border-slate-800/80 rounded-2xl">
                              <p className="text-[9px] text-slate-600 uppercase font-bold mb-1">Direct Identity:</p>
                              <p className="text-xs font-mono font-bold text-slate-300 break-all">{PAYMENT_UPI_ID}</p>
                           </div>
                           <p className="text-[9px] text-slate-600 font-medium leading-relaxed italic uppercase">
                              Submit required credit (₹{PAYMENT_AMOUNT_INR}) to the identity above and capture the visual log.
                           </p>
                        </div>
                     </div>

                     {/* Upload Section */}
                     <div className="p-10 bg-slate-900 border border-slate-800 rounded-3xl">
                        <div className="flex flex-col md:flex-row gap-8">
                           <div className="flex-1 space-y-6">
                              <div>
                                 <h4 className="text-sm font-bold text-slate-200">Evidence Submission</h4>
                                 <p className="text-xs text-slate-500 mt-1">Upload your payment record for terminal verification.</p>
                              </div>
                              
                              <div className="relative">
                                 <input
                                    type="file"
                                    id="payment-proof"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleProofUpload}
                                 />
                                 <label
                                    htmlFor="payment-proof"
                                    className="flex flex-col items-center justify-center gap-4 w-full py-10 border-2 border-dashed border-slate-800 bg-slate-800/20 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/[0.02] transition-all rounded-3xl"
                                 >
                                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-400">
                                       <FileUp size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                       {team.paymentProof ? "Resubmit Receipt" : "Upload Verification Receipt"}
                                    </span>
                                 </label>
                              </div>
                           </div>

                           <div className="md:w-px bg-slate-800 h-px md:h-auto self-stretch opacity-50" />

                           <div className="flex-1 flex flex-col justify-center space-y-6">
                              <div className="space-y-2">
                                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
                                    Verification Priority: <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-4">HIGH</span>
                                 </p>
                                 <p className="text-[9px] text-slate-500 leading-relaxed font-medium">
                                    Verification logs are usually validated within a 24-hour window by the SuperNova Core.
                                 </p>
                              </div>
                              
                              <div className="flex items-center gap-3 text-xs">
                                 <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                 <span className="font-bold text-slate-400 tracking-tight uppercase tracking-widest text-[9px]">Awaiting Manual Validation</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-blue-600/[0.02] rounded-3xl border border-blue-500/10">
                    <div className="w-24 h-24 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/30 transform rotate-3">
                      <CheckCircle size={48} />
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-white tracking-tighter">OPERATIONAL ACCESS GRANTED</h4>
                      <p className="text-[11px] font-bold text-blue-400/60 uppercase tracking-[0.4em] mt-4">Security Phase Fully Authenticated</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* GITHUB/DEVELOPER CREDENTIALS */}
            {team.paymentStatus === "PAID" && (
              <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-3xl">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300">
                      <GithubIcon className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold tracking-tight text-white uppercase">Developer Integrity</h3>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Connect Repositories</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1">GitHub Handle</label>
                     <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                        <input
                          type="text"
                          value={githubId}
                          onChange={(e) => setGithubId(e.target.value)}
                          className="w-full h-14 bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium text-slate-200 placeholder:text-slate-700 shadow-inner"
                          placeholder="johndoe"
                        />
                     </div>
                   </div>
                   <div className="space-y-2 lg:col-span-1">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1">Repository Target</label>
                     <div className="relative group">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                        <input
                          type="text"
                          value={githubRepo}
                          onChange={(e) => setGithubRepo(e.target.value)}
                          className="w-full h-14 bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium text-slate-200 placeholder:text-slate-700 shadow-inner"
                          placeholder="https://github.com/..."
                        />
                     </div>
                   </div>
                   <div className="pt-2">
                      <button 
                        onClick={handleUpdateGithub}
                        disabled={isSaving}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-30"
                      >
                        {isSaving ? "SYNCING..." : "SYNC RECORD"}
                      </button>
                   </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-800/50">
        <div className="max-w-[1400px] mx-auto px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">SuperNova 2026 · Corporate Protocol Terminal</p>
           <div className="flex items-center gap-6 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Integrity</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Op</span>
           </div>
        </div>
      </footer>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
