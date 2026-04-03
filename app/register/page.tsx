"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Upload, Loader2, X } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters"),
  leaderName: z.string().min(2, "Leader name must be at least 2 characters"),
  leaderEmail: z.string().email("Invalid email address"),
  members: z.array(z.string().min(1, "Member name is required")),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [members, setMembers] = useState<string[]>([""]);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [pptUrl, setPptUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
      members: [""],
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
    const newMembers = [...members, ""];
    setMembers(newMembers);
    setValue("members", newMembers);
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
    setValue("members", newMembers);
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = members.map((m, i) => (i === index ? value : m));
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
      setMessage({ type: "error", text: "Only PPT and PPTX files are allowed" });
      return;
    }

    // Check file size
    if (file.size > 50 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 50MB" });
      return;
    }

    setPptFile(file);
    setIsUploading(true);
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
        setMessage({ type: "success", text: "File uploaded successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to upload file" });
    } finally {
      setIsUploading(false);
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
      formData.append("members", JSON.stringify(members.filter(m => m.trim())));
      if (pptUrl) formData.append("pptUrl", pptUrl);

      const response = await fetch("/api/team/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        localStorage.removeItem("registration_draft");
        // Reset form
        setMembers([""]);
        setPptFile(null);
        setPptUrl(null);
      } else {
        setMessage({ type: "error", text: result.error || "Registration failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link href="/" className="text-red-500 hover:text-red-400 mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-2">Team Registration</h1>
        <p className="text-gray-400 mb-8">SuperNova 2026 Hackathon</p>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-900/30 border border-green-500/50 text-green-400"
                : "bg-red-900/30 border border-red-500/50 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Team Name *</label>
            <input
              {...register("teamName")}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-red-500"
              placeholder="Enter your team name"
            />
            {errors.teamName && (
              <p className="text-red-500 text-sm mt-1">{errors.teamName.message}</p>
            )}
          </div>

          {/* Leader Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Leader Name *</label>
              <input
                {...register("leaderName")}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-red-500"
                placeholder="Team leader name"
              />
              {errors.leaderName && (
                <p className="text-red-500 text-sm mt-1">{errors.leaderName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Leader Email *</label>
              <input
                {...register("leaderEmail")}
                type="email"
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-red-500"
                placeholder="leader@example.com"
              />
              {errors.leaderEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.leaderEmail.message}</p>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-sm font-medium mb-2">Team Members</label>
            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-red-500"
                    placeholder={`Member ${index + 1} name`}
                  />
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="px-3 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddMember}
              className="mt-3 flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
            >
              <Plus size={18} />
              Add Member
            </button>
          </div>

          {/* PPT Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">PPT Presentation</label>
            <div className="border-2 border-dashed border-neutral-800 rounded-lg p-6 text-center hover:border-red-500/50 transition-colors">
              {pptUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Upload size={20} />
                    <span>File uploaded</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPptFile(null);
                      setPptUrl(null);
                    }}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove and upload different file
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
                  <div className="space-y-3">
                    {isUploading ? (
                      <Loader2 className="mx-auto animate-spin text-red-500" size={32} />
                    ) : (
                      <Upload className="mx-auto text-neutral-500" size={32} />
                    )}
                    <p className="text-neutral-400">
                      {isUploading ? "Uploading..." : "Click to upload PPT (max 50MB)"}
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Registering...
              </>
            ) : (
              "Register Team"
            )}
          </button>

          {/* Auto-save indicator */}
          {autoSaveStatus && (
            <p className="text-center text-sm text-neutral-500">{autoSaveStatus}</p>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-sm">
            Already registered?{" "}
            <Link href="/login" className="text-red-500 hover:text-red-400">
              Access your dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
