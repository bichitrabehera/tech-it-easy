"use client";

import { useState } from "react";
import { 
  FileText, 
  Users, 
  Mail, 
  Phone, 
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ExternalLink
} from "lucide-react";

interface TeamMember {
  name: string;
  email: string;
  phone: string;
}

interface Team {
  id: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  pptUrl: string | null;
  status: "PENDING" | "SELECTED" | "REJECTED";
  paymentStatus: "UNPAID" | "PAID";
  members: TeamMember[];
  createdAt: string;
}

interface AdminTeamReviewProps {
  team: Team;
  onSelect: (teamId: string) => void;
  onReject: (teamId: string) => void;
  isLoading?: boolean;
}

export default function AdminTeamReview({ 
  team, 
  onSelect, 
  onReject, 
  isLoading = false 
}: AdminTeamReviewProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SELECTED":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      case "REJECTED":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      default:
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SELECTED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">{team.teamName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1 ${getStatusColor(team.status)}`}>
              {getStatusIcon(team.status)}
              {team.status}
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            Applied on {new Date(team.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Leader Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Team Leader</p>
            <p className="text-sm text-white font-medium">{team.leaderName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
            <p className="text-sm text-white font-medium truncate">{team.leaderEmail}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Phone</p>
            <p className="text-sm text-white font-medium">{team.leaderPhone}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-slate-500" />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Team Size</p>
            <p className="text-sm text-white font-medium">{team.members.length + 1} members</p>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="border-t border-slate-800/50 pt-6 mb-6 space-y-4">
          {/* Team Members */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Members
            </h4>
            <div className="space-y-2">
              {team.members.map((member, index) => (
                <div key={index} className="bg-slate-800/30 rounded-lg p-3">
                  <p className="text-sm text-white font-medium">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.email}</p>
                  <p className="text-xs text-slate-400">{member.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PPT Section */}
      {team.pptUrl && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-semibold text-white">Presentation</h4>
          </div>
          <a
            href={team.pptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 rounded-lg transition-all text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            View Presentation
          </a>
        </div>
      )}

      {/* Actions */}
      {team.status === "PENDING" && (
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800/50">
          <button
            onClick={() => onSelect(team.id)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {isLoading ? "Processing..." : "Select Team"}
          </button>
          
          <button
            onClick={() => onReject(team.id)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            {isLoading ? "Processing..." : "Reject Team"}
          </button>
        </div>
      )}

      {/* Payment Status */}
      {team.status === "SELECTED" && (
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800/50">
          <div className="flex-1 px-4 py-2 bg-slate-800/30 rounded-lg">
            <p className="text-sm text-slate-400">Payment Status</p>
            <p className={`text-sm font-medium ${
              team.paymentStatus === "PAID" ? "text-green-400" : "text-yellow-400"
            }`}>
              {team.paymentStatus}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
