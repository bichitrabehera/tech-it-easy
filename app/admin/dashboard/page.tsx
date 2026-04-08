"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  LogOut,
  Search,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  Activity
} from "lucide-react";
import Link from "next/link";
import {
  ADMIN_ACTION_APPROVE,
  ADMIN_ACTION_CONFIRM_PAYMENT,
  ADMIN_ACTION_REJECT,
  ADMIN_ACTION_VIEW_PPT,
  ADMIN_ACTION_VIEW_PROOF,
  ADMIN_SUBTITLE,
  ADMIN_TITLE,
} from "@/lib/constants";

interface Team {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  pptUrl: string | null;
  status: "PENDING" | "SELECTED" | "REJECTED";
  paymentStatus: "UNPAID" | "PAID";
  paymentProof: string | null;
  members: { id: string; name: string }[];
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, [statusFilter]);

  useEffect(() => {
    let filtered = teams;
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.teamName.toLowerCase().includes(query) ||
          t.leaderName.toLowerCase().includes(query) ||
          t.leaderEmail.toLowerCase().includes(query)
      );
    }
    setFilteredTeams(filtered);
  }, [teams, statusFilter, searchQuery]);

  const fetchTeams = async () => {
    try {
      const url =
        statusFilter !== "ALL"
          ? `/api/admin/teams?status=${statusFilter}`
          : "/api/admin/teams";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams);
      } else if (response.status === 401) {
        router.push("/admin");
      }
    } catch {
      console.error("Failed to fetch teams");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const sendTeamEmail = async (
    teamId: string,
    type: "selected" | "rejected" | "payment_confirmed"
  ) => {
    const response = await fetch(`/api/admin/teams/${teamId}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });

    return response.ok;
  };

  const handleExport = () => {
    const url =
      statusFilter !== "ALL"
        ? `/api/admin/export?status=${statusFilter}`
        : "/api/admin/export";
    window.open(url, "_blank");
  };

  const handleStatusUpdate = async (
    teamId: string,
    status: "SELECTED" | "REJECTED"
  ) => {
    setActionLoading(teamId);
    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        if (status === "SELECTED") {
          const emailSent = await sendTeamEmail(teamId, "selected");
          if (!emailSent) {
            alert("Team selected, but the payment email could not be sent.");
          }
        }
        await fetchTeams();
      }
    } catch {
      console.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmPayment = async (teamId: string) => {
    setActionLoading(`${teamId}-payment`);
    try {
      await fetch(`/api/admin/teams/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "PAID" }),
      });
      const emailSent = await sendTeamEmail(teamId, "payment_confirmed");
      if (!emailSent) {
        alert("Payment was confirmed, but the dashboard email could not be sent.");
      }
      await fetchTeams();
      alert("Payment confirmed!");
    } catch {
      alert("Failed to confirm payment");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SELECTED":
        return (
          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
            Selected
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider border border-slate-700">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
            Pending
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-blue-200/50 text-sm font-medium tracking-widest uppercase">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: teams.length,
    pending: teams.filter((t) => t.status === "PENDING").length,
    selected: teams.filter((t) => t.status === "SELECTED").length,
    rejected: teams.filter((t) => t.status === "REJECTED").length,
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-800/50 bg-[#020617] h-screen sticky top-0 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">SuperNova</h1>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Admin Hub</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-medium transition-all">
            <LayoutDashboard size={18} />
            Teams Feed
          </Link>
          <Link href="/admin/repos" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl font-medium transition-all group">
            <Activity className="group-hover:text-blue-400" size={18} />
            Repo Monitor
          </Link>
        </nav>

        <div className="pt-6 border-t border-slate-800/50 font-bold uppercase tracking-widest text-[10px]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
            Termination
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-screen container mx-auto">
        {/* Header Bar */}
        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-xl sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{ADMIN_TITLE}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-blue-500 uppercase font-bold tracking-widest">{ADMIN_SUBTITLE}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border border-slate-700"
            >
              Export CSV
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "All", value: stats.total, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Pending", value: stats.pending, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Selected", value: stats.selected, color: "text-blue-400", bg: "bg-blue-400/10" },
              { label: "Rejected", value: stats.rejected, color: "text-slate-500", bg: "bg-slate-800" },
            ].map((s, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-2xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{s.label}</p>
                <p className="text-4xl font-bold text-white tracking-tighter">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams..."
                className="w-full bg-slate-900/40 border border-slate-800/50 focus:border-blue-500/50 rounded-xl py-3.5 pl-12 pr-4 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative min-w-[200px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-900/40 border border-slate-800/50 rounded-xl py-3.5 pl-5 pr-10 text-[10px] font-bold uppercase tracking-widest appearance-none focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer text-slate-400"
                >
                  <option value="ALL">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="SELECTED">Selected</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="bg-slate-800/40 border-b border-slate-800/60 transition-colors">
                    <th className="px-6 py-4 font-bold uppercase tracking-[0.15em] text-slate-500">ID</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-[0.15em] text-slate-500">Team</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-[0.15em] text-slate-500">Leader</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-[0.15em] text-slate-500">Email</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-[0.15em] text-slate-500">Status</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-[0.15em] text-slate-500">Payment</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-[0.15em] text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-slate-800/20 transition-all group">
                      <td className="px-6 py-5 font-mono text-slate-600 text-[10px]">
                        {team.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-bold text-slate-200 uppercase tracking-tight">{team.teamName}</span>
                      </td>
                      <td className="px-6 py-5 text-slate-400">
                        {team.leaderName}
                      </td>
                      <td className="px-6 py-5 text-slate-500 font-medium">
                        {team.leaderEmail}
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(team.status)}
                      </td>
                      <td className="px-6 py-5">
                        {team.status === "SELECTED" ? (
                          <div className="flex flex-col gap-1.5">
                            <span className={`font-bold uppercase tracking-widest text-[9px] ${team.paymentStatus === "PAID" ? "text-blue-400" : "text-slate-600"
                              }`}>
                              [{team.paymentStatus}]
                            </span>
                            {team.paymentProof && (
                              <a
                                href={team.paymentProof}
                                target="_blank"
                                className="mt-2 block group/img relative w-fit"
                              >
                                <img
                                  src={team.paymentProof}
                                  alt="Receipt"
                                  className="w-16 h-10 object-cover rounded border border-slate-800 group-hover/img:border-blue-500/50 transition-all"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).parentElement!.innerText = "VIEW ATTACHMENT";
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-[7px] font-bold uppercase tracking-[0.2em] transition-opacity rounded text-white">
                                  EXAMINE
                                </div>
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-800 uppercase font-black">—</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-3">
                          {team.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(team.id, "SELECTED")}
                                disabled={actionLoading === team.id}
                                className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded border border-blue-600/30 transition-all disabled:opacity-20"
                              >
                                {actionLoading === team.id ? "Processing..." : ADMIN_ACTION_APPROVE}
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(team.id, "REJECTED")}
                                disabled={actionLoading === team.id}
                                className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest bg-slate-800/50 text-slate-500 hover:bg-slate-700 hover:text-white rounded border border-slate-700/50 transition-all disabled:opacity-20"
                              >
                                {ADMIN_ACTION_REJECT}
                              </button>
                            </>
                          )}

                          {team.status === "SELECTED" && team.paymentStatus === "UNPAID" && (
                            <button
                              onClick={() => handleConfirmPayment(team.id)}
                              disabled={actionLoading === `${team.id}-payment`}
                              className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-500 rounded transition-all shadow-lg shadow-blue-600/20 disabled:opacity-20"
                            >
                              {ADMIN_ACTION_CONFIRM_PAYMENT}
                            </button>
                          )}

                          {team.paymentProof && (
                            <a
                              href={team.paymentProof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600 hover:text-blue-400 transition-all border border-slate-800 hover:border-blue-500/20 rounded"
                            >
                              {ADMIN_ACTION_VIEW_PROOF}
                            </a>
                          )}

                          {team.pptUrl && (
                            <a
                              href={team.pptUrl}
                              target="_blank"
                              className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600 hover:text-blue-400 transition-all border border-slate-800 hover:border-blue-500/20 rounded"
                            >
                              {ADMIN_ACTION_VIEW_PPT}
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTeams.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em]">Database Stream Restricted: No Matching Records</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 4px;
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