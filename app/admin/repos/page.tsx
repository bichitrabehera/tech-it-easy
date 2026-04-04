"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Search, 
  ExternalLink, 
  Users, 
  ShieldCheck, 
  LayoutDashboard, 
  Activity, 
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Terminal,
  Code
} from "lucide-react";
import Link from "next/link";

// GitHub icon SVG
const GithubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

interface Team {
  id: string;
  teamName: string;
  leaderName: string;
  githubId: string | null;
  githubRepo: string | null;
  paymentStatus: "UNPAID" | "PAID";
}

export default function RepoMonitoringPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = teams.filter(t => 
      t.teamName.toLowerCase().includes(query) || 
      t.githubId?.toLowerCase().includes(query) ||
      t.leaderName.toLowerCase().includes(query)
    );
    setFilteredTeams(filtered);
  }, [teams, searchQuery]);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/admin/teams");
      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams.filter((t: Team) => t.githubId || t.githubRepo));
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-blue-200/50 text-sm font-medium tracking-widest uppercase">Syncing Repositories...</p>
        </div>
      </div>
    );
  }

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
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl font-medium transition-all group">
            <LayoutDashboard className="group-hover:text-blue-400" size={18} />
            Teams Feed
          </Link>
          <Link href="/admin/repos" className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-medium transition-all">
            <Code size={18} />
            Repo Monitor
          </Link>
        </nav>

        <div className="pt-6 border-t border-slate-800/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-400 transition-colors font-medium"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-screen">
        {/* Header Bar */}
        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-xl sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold">Code Radar</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Dashboard</span>
              <span className="text-slate-700">/</span>
              <span className="text-[10px] text-blue-500 uppercase font-bold tracking-widest">Repository Monitoring</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Total Repos: <span className="text-white ml-1">{filteredTeams.length}</span></p>
             </div>
          </div>
        </header>

        <div className="p-8">
           {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-10">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Team or GitHub Handle..."
                className="w-full bg-slate-900/40 border border-slate-800/50 focus:border-blue-500/50 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Repos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
             {filteredTeams.map((team) => (
               <div key={team.id} className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all group flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                       <GithubIcon className="w-6 h-6" />
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      team.paymentStatus === "PAID" 
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                      : "bg-slate-800 border-slate-700 text-slate-500"
                    }`}>
                       {team.paymentStatus === "PAID" ? "Verified" : "Unpaid"}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors truncate">{team.teamName}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-8">
                     <Users size={14} className="text-slate-600" />
                     {team.leaderName}
                  </div>

                  <div className="mt-auto space-y-3">
                    {team.githubId && (
                      <div className="p-3 bg-slate-800/30 border border-slate-800/50 rounded-xl">
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Developer Handle</p>
                        <a 
                          href={`https://github.com/${team.githubId.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-slate-300 hover:text-blue-400 transition-colors flex items-center justify-between"
                        >
                          @{team.githubId.replace('@', '')}
                          <ExternalLink size={12} className="text-slate-600" />
                        </a>
                      </div>
                    )}

                    {team.githubRepo ? (
                      <a 
                        href={team.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-600/10"
                      >
                         Open Repo
                         <ExternalLink size={14} />
                      </a>
                    ) : (
                      <div className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-slate-800 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest italic">
                         Awaiting Repo
                      </div>
                    )}
                  </div>
               </div>
             ))}
          </div>

          {filteredTeams.length === 0 && (
            <div className="py-32 text-center bg-slate-900/20 border border-dashed border-slate-800/50 rounded-2xl">
               <Code size={48} className="mx-auto text-slate-800 mb-4" />
               <p className="text-slate-600 text-sm font-medium">Capture stream empty. No active repositories found.</p>
            </div>
          )}
        </div>
      </main>

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
