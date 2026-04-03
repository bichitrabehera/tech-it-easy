"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  Send,
  LogOut,
  Filter,
  Search
} from "lucide-react";
import Link from "next/link";

interface Team {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  pptUrl: string | null;
  status: "PENDING" | "SELECTED" | "REJECTED";
  paymentStatus: "UNPAID" | "PAID";
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
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, [statusFilter]);

  useEffect(() => {
    let filtered = teams;
    
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.teamName.toLowerCase().includes(query) ||
          t.leaderName.toLowerCase().includes(query) ||
          t.leaderEmail.toLowerCase().includes(query)
      );
    }
    
    setFilteredTeams(filtered);
  }, [teams, statusFilter, searchQuery]);

  const fetchTeams = async () => {
    try {
      const url = statusFilter !== "ALL" 
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

  const handleExport = async () => {
    const url = statusFilter !== "ALL"
      ? `/api/admin/export?status=${statusFilter}`
      : "/api/admin/export";
    window.open(url, "_blank");
  };

  const handleStatusUpdate = async (teamId: string, status: "SELECTED" | "REJECTED") => {
    setActionLoading(teamId);
    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchTeams();
      }
    } catch {
      console.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendEmail = async (teamId: string, type: "selected" | "rejected" | "payment_confirmed") => {
    setActionLoading(`${teamId}-email`);
    try {
      await fetch(`/api/admin/teams/${teamId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      alert("Email sent successfully!");
    } catch {
      alert("Failed to send email");
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
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
            <CheckCircle size={12} />
            Selected
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
            <XCircle size={12} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-red-500" size={32} />
      </div>
    );
  }

  const stats = {
    total: teams.length,
    pending: teams.filter(t => t.status === "PENDING").length,
    selected: teams.filter(t => t.status === "SELECTED").length,
    rejected: teams.filter(t => t.status === "REJECTED").length,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-neutral-400">Manage teams and registrations</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <p className="text-neutral-500 text-sm">Total Teams</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <p className="text-neutral-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <p className="text-neutral-500 text-sm">Selected</p>
            <p className="text-2xl font-bold text-green-500">{stats.selected}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <p className="text-neutral-500 text-sm">Rejected</p>
            <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2">
            <Filter size={18} className="text-neutral-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-white"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2">
            <Search size={18} className="text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              className="flex-1 bg-transparent border-none outline-none text-white"
            />
          </div>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Teams Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Team</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Leader</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Members</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Payment</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">PPT</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{team.teamName}</p>
                      <p className="text-xs text-neutral-500">{new Date(team.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{team.leaderName}</p>
                      <p className="text-xs text-neutral-500">{team.leaderEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Users size={14} className="text-neutral-500" />
                        <span className="text-sm">{team.members.length + 1}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(team.status)}</td>
                    <td className="px-4 py-3">
                      {team.status === "SELECTED" && (
                        <span className={`text-xs ${team.paymentStatus === "PAID" ? "text-green-400" : "text-yellow-400"}`}>
                          {team.paymentStatus === "PAID" ? "Paid" : "Unpaid"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {team.pptUrl ? (
                        <a
                          href={team.pptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-400 text-sm"
                        >
                          View PPT
                        </a>
                      ) : (
                        <span className="text-neutral-500 text-sm">No PPT</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {team.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(team.id, "SELECTED")}
                              disabled={actionLoading === team.id}
                              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                            >
                              Select
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(team.id, "REJECTED")}
                              disabled={actionLoading === team.id}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {team.status === "SELECTED" && team.paymentStatus === "UNPAID" && (
                          <button
                            onClick={() => handleConfirmPayment(team.id)}
                            disabled={actionLoading === `${team.id}-payment`}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                          >
                            Confirm Payment
                          </button>
                        )}
                        
                        {team.status === "SELECTED" && (
                          <button
                            onClick={() => handleSendEmail(team.id, team.paymentStatus === "PAID" ? "payment_confirmed" : "selected")}
                            disabled={actionLoading === `${team.id}-email`}
                            className="p-1 text-neutral-400 hover:text-white transition-colors"
                            title="Send Email"
                          >
                            <Send size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTeams.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No teams found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
