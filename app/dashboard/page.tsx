"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, User, CheckCircle, Clock, AlertCircle, CreditCard } from "lucide-react";
import Link from "next/link";

// GitHub icon SVG
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
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

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("/api/team/me");
        if (response.ok) {
          const data = await response.json();
          setTeam(data.team);
          setGithubId(data.team.githubId || "");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-red-500" size={32} />
      </div>
    );
  }

  if (!team) return null;

  const getStatusBadge = () => {
    switch (team.status) {
      case "SELECTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
            <CheckCircle size={14} />
            Selected
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
            <AlertCircle size={14} />
            Not Selected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
            <Clock size={14} />
            Under Review
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-red-500 hover:text-red-400 text-sm">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold mt-2">Team Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Application Status</h2>
            {getStatusBadge()}
          </div>
          <p className="text-neutral-400">
            {team.status === "PENDING" && "Your application is being reviewed by our team."}
            {team.status === "SELECTED" && "Congratulations! You've been selected for SuperNova 2026."}
            {team.status === "REJECTED" && "Thank you for your interest. Unfortunately, you weren't selected this time."}
          </p>
        </div>

        {/* Team Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Team Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-500">Team Name</p>
                <p className="font-medium">{team.teamName}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Leader</p>
                <p className="font-medium">{team.leaderName}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="font-medium">{team.leaderEmail}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Team ID</p>
                <p className="font-medium font-mono text-sm">{team.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Team Members</h3>
            <ul className="space-y-2">
              {team.members.map((member) => (
                <li key={member.id} className="flex items-center gap-2">
                  <User size={16} className="text-neutral-500" />
                  <span>{member.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* PPT Submission */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">PPT Submission</h3>
          {team.pptUrl ? (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-neutral-500">File uploaded</p>
                <a
                  href={team.pptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:text-red-400"
                >
                  View PPT
                </a>
              </div>
              {team.status === "PENDING" && (
                <Link
                  href="/register"
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors"
                >
                  Update
                </Link>
              )}
            </div>
          ) : (
            <div className="text-neutral-500">
              No PPT uploaded yet.
              <Link href="/register" className="text-red-500 hover:text-red-400 ml-2">
                Upload now
              </Link>
            </div>
          )}
        </div>

        {/* Post-Selection Content */}
        {team.status === "SELECTED" && (
          <>
            {/* Payment Status */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-red-500" />
                <h3 className="text-lg font-semibold">Registration Payment</h3>
              </div>
              
              {team.paymentStatus === "UNPAID" ? (
                <div className="space-y-4">
                  <p className="text-neutral-400">
                    Please complete the registration fee payment to confirm your spot.
                  </p>
                  <div className="bg-neutral-800 p-4 rounded-lg">
                    <p className="text-sm text-neutral-500 mb-2">Payment Details</p>
                    <p className="font-medium">Amount: ₹500 per team</p>
                    <p className="text-sm text-neutral-400 mt-1">
                      UPI: supernova2026@upi
                    </p>
                  </div>
                  <p className="text-sm text-neutral-500">
                    After payment, please wait for admin confirmation.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle size={20} />
                  <span>Payment confirmed</span>
                </div>
              )}
            </div>

            {/* GitHub & ID Proof */}
            {team.paymentStatus === "PAID" && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <GithubIcon />
                  <h3 className="text-lg font-semibold">Complete Your Profile</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub Username</label>
                    <input
                      type="text"
                      value={githubId}
                      onChange={(e) => setGithubId(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-red-500"
                      placeholder="@username"
                    />
                  </div>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                    Save Profile
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
