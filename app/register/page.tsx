"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Upload, Loader2, X, Sparkles, Users, Mail, User, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters"),
  leaderName: z.string().min(2, "Leader name must be at least 2 characters"),
  leaderEmail: z.string().email("Invalid email address"),
  leaderPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  members: z.array(z.object({
    name: z.string().min(1, "Member name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
  })),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [members, setMembers] = useState<Array<{ name: string; email: string; phone: string }>>([{ name: "", email: "", phone: "" }]);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [pptUrl, setPptUrl] = useState<string | null>(null);
  const [isUploading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      members: [{ name: "", email: "", phone: "" }],
    },
  });

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem("registration_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setValue("teamName", parsed.teamName || "");
        setValue("leaderName", parsed.leaderName || "");
        setValue("leaderEmail", parsed.leaderEmail || "");
        if (parsed.members?.length > 0) {
          setMembers(parsed.members);
          setValue("members", parsed.members);
        }
        if (parsed.pptUrl) setPptUrl(parsed.pptUrl);
      } catch {
        // Invalid draft
      }
    }
  }, [setValue]);

  // Auto-save to localStorage
  const formValues = watch();
  const debouncedSave = useCallback(() => {
    const timeout = setTimeout(() => {
      const draft = {
        ...formValues,
        members,
        pptUrl,
      };
      localStorage.setItem("registration_draft", JSON.stringify(draft));
      setAutoSaveStatus("Saved");
      setTimeout(() => setAutoSaveStatus(""), 1000);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [formValues, members, pptUrl]);

  useEffect(() => {
    const cleanup = debouncedSave();
    return cleanup;
  }, [debouncedSave]);

  const handleAddMember = () => {
    const newMembers = [...members, { name: "", email: "", phone: "" }];
    setMembers(newMembers);
    setValue("members", newMembers);
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
    setValue("members", newMembers);
  };

  const handleMemberChange = (index: number, field: 'name' | 'email' | 'phone', value: string) => {
    const newMembers = members.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    setMembers(newMembers);
    setValue("members", newMembers);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Only PPT / PPTX allowed" });
      return;
    }

    // Check file size
    if (file.size > 50 * 1024 * 1024) {
      setMessage({ type: "error", text: "Size under 50MB only" });
      return;
    }

    setPptFile(file);
    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/ppt", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPptUrl(data.url);
        setMessage({ type: "success", text: "Asset uploaded" });
      } else {
        setMessage({ type: "error", text: data.error || "Network failure" });
      }
    } catch {
      setMessage({ type: "error", text: "Upload failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("teamName", data.teamName);
      formData.append("leaderName", data.leaderName);
      formData.append("leaderEmail", data.leaderEmail);
      formData.append("leaderPhone", data.leaderPhone);
      formData.append("members", JSON.stringify(members.filter(m => m.name.trim())));
      if (pptUrl) formData.append("pptUrl", pptUrl);

      const response = await fetch("/api/team/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Record Created Successfully" });
        localStorage.removeItem("registration_draft");
        // Reset form
        setMembers([{ name: "", email: "", phone: "" }]);
        setPptFile(null);
        setPptUrl(null);
      } else {
        setMessage({ type: "error", text: result.error || "Entry Refused" });
      }
    } catch {
      setMessage({ type: "error", text: "Connection error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0000] text-white relative overflow-hidden">
      {/* BACKGROUND GRADIENTS */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b0303] via-[#0a0000] to-black z-0" />

      {/* VIGNETTE */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_100%)] z-0 opacity-90" />

      {/* TECH GRID OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 pointer-events-none" />

      {/* RED BACKLIGHTING */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[800px] md:h-[800px] bg-red-600/10 rounded-full blur-3xl pointer-events-none z-0" />


      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 md:py-20">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-all duration-300 group">
          <span className="text-xl transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="text-xs font-medium uppercase tracking-wider leading-none mt-1">Portal Home</span>
        </Link>

        {/* Header */}
        <div className="mb-16 text-center">

          <h1 className="text-2xl md:text-7xl font-bold mb-6 font-[Boldonse] tracking-widest text-red-500 drop-shadow-[0_0_50px_rgba(220,0,0,0.4)] ">
            Register Your Team
          </h1>
          <p className="text-lg text-white/80 max-w-md mx-auto tracking-widest">
            Build the future. <span className="text-red-500 drop-shadow-[0_0_15px_rgba(220,0,0,0.8)]">Become the hero.</span>
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-10 p-6 rounded-xl border backdrop-blur-xl text-center transform transition-all duration-500 ${message.type === "success"
              ? "bg-green-500/10 border-green-400/30 text-green-100 shadow-lg shadow-green-500/20"
              : "bg-red-500/10 border-red-400/30 text-red-100 shadow-lg shadow-red-500/20"
              }`}
          >
            <div className="flex items-center justify-center gap-3">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <span className="font-medium uppercase tracking-[0.1em]">{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Team Name */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-3">
              <Users className="w-4 h-4" />
              Team Name
            </label>
            <div className="relative">
              <input
                {...register("teamName")}
                className="w-full px-6 py-4 bg-[#08000a]/80 backdrop-blur-xl border border-red-600/10 rounded-xl focus:outline-none focus:border-red-500 focus:bg-[#08000a]/90 transition-all duration-300 placeholder:text-white/40 text-white"
                placeholder="Enter your team name"
              />
              <div className="absolute inset-0 rounded-xl bg-red-600/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
            {errors.teamName && (
              <p className="text-red-400 text-sm mt-2 ml-2 flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.teamName.message}
              </p>
            )}
          </div>

          {/* Leader Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-3">
                <User className="w-4 h-4" />
                Team Leader
              </label>
              <div className="relative">
                <input
                  {...register("leaderName")}
                  className="w-full px-6 py-4 bg-[#08000a]/80 backdrop-blur-xl border border-red-600/10 rounded-xl focus:outline-none focus:border-red-500 focus:bg-[#08000a]/90 transition-all duration-300 placeholder:text-white/40 text-white"
                  placeholder="Your full name"
                />
                <div className="absolute inset-0 rounded-xl bg-red-600/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              {errors.leaderName && (
                <p className="text-red-400 text-sm mt-2 ml-2 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.leaderName.message}
                </p>
              )}
            </div>
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-3">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("leaderEmail")}
                  type="email"
                  className="w-full px-6 py-4 bg-[#08000a]/80 backdrop-blur-xl border border-red-600/10 rounded-xl focus:outline-none focus:border-red-500 focus:bg-[#08000a]/90 transition-all duration-300 placeholder:text-white/40 text-white"
                  placeholder="your@email.com"
                />
                <div className="absolute inset-0 rounded-xl bg-red-600/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              {errors.leaderEmail && (
                <p className="text-red-400 text-sm mt-2 ml-2 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.leaderEmail.message}
                </p>
              )}
            </div>
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-3">
                <Mail className="w-4 h-4" />
                Phone Number
              </label>
              <div className="relative">
                <input
                  {...register("leaderPhone")}
                  type="tel"
                  className="w-full px-6 py-4 bg-[#08000a]/80 backdrop-blur-xl border border-red-600/10 rounded-xl focus:outline-none focus:border-red-500 focus:bg-[#08000a]/90 transition-all duration-300 placeholder:text-white/40 text-white"
                  placeholder="+1234567890"
                />
                <div className="absolute inset-0 rounded-xl bg-red-600/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              {errors.leaderPhone && (
                <p className="text-red-400 text-sm mt-2 ml-2 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.leaderPhone.message}
                </p>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-6">
            <label className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Users className="w-4 h-4" />
              Team Members
            </label>
            <div className="space-y-6">
              {members.map((member, index) => (
                <div key={index} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative group">
                      <input
                        value={member.name || ''}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        className="w-full px-6 py-4 bg-[#08000a]/80 backdrop-blur-xl border border-red-600/10 rounded-xl focus:outline-none focus:border-red-500 focus:bg-[#08000a]/90 transition-all duration-300 placeholder:text-white/40 text-white"
                        placeholder={`Member ${index + 2} name`}
                      />
                      <div className="absolute inset-0 rounded-xl bg-red-600/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    <div className="relative group">
                      <input
                        value={member.email || ''}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        type="email"
                        className="w-full px-6 py-4 bg-[#08000a]/80 backdrop-blur-xl border border-red-600/10 rounded-xl focus:outline-none focus:border-red-500 focus:bg-[#08000a]/90 transition-all duration-300 placeholder:text-white/40 text-white"
                        placeholder={`Member ${index + 2} email`}
                      />
                      <div className="absolute inset-0 rounded-xl bg-red-600/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    <div className="relative group flex gap-3">
                      <div className="relative flex-1 group">
                        <input
                          value={member.phone || ''}
                          onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                          type="tel"
                          className="w-full px-6 py-4 bg-[#08000a]/80 backdrop-blur-xl border border-red-600/10 rounded-xl focus:outline-none focus:border-red-500 focus:bg-[#08000a]/90 transition-all duration-300 placeholder:text-white/40 text-white"
                          placeholder={`Member ${index + 2} phone`}
                        />
                        <div className="absolute inset-0 rounded-xl bg-red-600/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(index)}
                          className="px-4 border border-white/20 text-white/60 hover:border-red-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {members.length < 3 && (
              <button
                type="button"
                onClick={handleAddMember}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#08000a]/80 backdrop-blur-xl border border-red-600/10 rounded-xl text-sm font-medium text-white/90 hover:bg-red-600/20 hover:border-red-500 transition-all duration-300"
              >
                <Plus size={16} />
                Add Team Member
              </button>
            )}
          </div>

          {/* PPT Upload */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Upload className="w-4 h-4" />
              Presentation (Optional)
            </label>
            <div className="relative group">
              <div className="border-2 border-dashed border-red-600/20 rounded-xl p-12 text-center hover:border-red-500 transition-all duration-300 bg-[#08000a]/60 backdrop-blur-xl">
                {pptUrl ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 text-green-400 rounded-2xl mb-3">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">File Uploaded Successfully</p>
                      <p className="text-white/60 text-sm">{pptFile?.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPptFile(null);
                        setPptUrl(null);
                      }}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept=".ppt,.pptx"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className="space-y-4">
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="animate-spin text-purple-400 mb-3" size={32} />
                          <p className="text-white font-medium">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                            <Upload size={24} />
                          </div>
                          <div>
                            <p className="text-white font-medium mb-1">Upload Presentation</p>
                            <p className="text-white/60 text-sm">PPT or PPTX (Max 50MB)</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                )}
              </div>
              <div className="absolute inset-0 rounded-xl bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full h-14 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Registering...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Register Team
                </>
              )}
            </button>
          </div>

          {/* Auto-save indicator */}
          <div className="h-6 flex items-center justify-center">
            {autoSaveStatus && (
              <div className="flex items-center gap-2 text-xs font-medium text-white/60 animate-pulse">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                Draft saved locally
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-white/60 text-sm">
            Already have a team?{" "}
            <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
