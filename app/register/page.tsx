"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Loader2,
  Users,
  Mail,
  Zap,
  Upload,
  ArrowLeft,
  Smartphone,
  Globe,
  Star,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  REGISTRATION_TITLE,
} from "@/lib/constants";

const schema = z.object({
  teamName: z.string().trim().min(2, "Team name must be at least 2 characters"),
  leaderName: z.string().trim().min(2, "Leader name must be at least 2 characters"),
  leaderEmail: z.string().trim().email("Invalid email address"),
  leaderPhone: z
    .string()
    .trim()
    .regex(/^\d{10,15}$/, "Phone number must be 10 to 15 digits"),
  driveLink: z
    .string()
    .trim()
    .url("Enter a valid Google Drive link")
    .refine((value) => value.includes("drive.google.com"), {
      message: "Please provide a Google Drive link",
    }),
  members: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Member name is required"),
        email: z.string().trim().email("Invalid email address"),
        phone: z
          .string()
          .trim()
          .regex(/^\d{10,15}$/, "Phone number must be 10 to 15 digits"),
      }),
    )
    .min(1, "At least one member is required"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [members, setMembers] = useState([{ name: "", email: "", phone: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [autoSaveStatus] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      teamName: "",
      leaderName: "",
      leaderEmail: "",
      leaderPhone: "",
      driveLink: "",
      members: [{ name: "", email: "", phone: "" }],
    },
  });

  const handleAddMember = () => {
    if (members.length < 3) {
      const newMembers = [...members, { name: "", email: "", phone: "" }];
      setMembers(newMembers);
      setValue("members", newMembers, { shouldValidate: true });
    }
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
    setValue("members", newMembers, { shouldValidate: true });
  };

  const handleMemberChange = (
    index: number,
    field: "name" | "email" | "phone",
    value: string,
  ) => {
    const newMembers = members.map((m, i) =>
      i === index ? { ...m, [field]: value } : m,
    );
    setMembers(newMembers);
    setValue("members", newMembers, { shouldValidate: true });
  };

  const onInvalid = () => {
    setMessage({
      type: "error",
      text: "Please fix the highlighted fields before submitting.",
    });
  };

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append("teamName", data.teamName);
      payload.append("leaderName", data.leaderName);
      payload.append("leaderEmail", data.leaderEmail);
      payload.append("leaderPhone", data.leaderPhone);
      payload.append("pptUrl", data.driveLink);
      payload.append(
        "members",
        JSON.stringify(members.filter((m) => m.name.trim())),
      );

      const response = await fetch("/api/team/register", {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      if (result.success) {
        localStorage.removeItem("registration_draft");
        router.push("/register/success");
      } else {
        setMessage({
          type: "error",
          text: result.error || "Transmission Refused. Check details.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Hyperlane Connection Lost. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020202] text-white selection:bg-red-500/30 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(185,28,28,0.15)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-1/4 left-[-100px] w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full" />

        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:border-red-500/50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-tight text-white/70">
              Return to Portal
            </span>
          </Link>
        </motion.div>

        {/* Title Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-8xl font-black  tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-none">
              {REGISTRATION_TITLE}
            </h1>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-12">
          {message && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "border-green-500/40 bg-green-500/10 text-green-300"
                  : "border-red-500/40 bg-red-500/10 text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Section 1: Team Core */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight ">
                Formation Protocol
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-xs  tracking-widest text-white/40 font-bold ml-2">
                  Team Name
                </label>
                <div className="relative">
                  <input
                    {...register("teamName")}
                    placeholder="Enter Team Name"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-white/20"
                  />
                  {errors.teamName && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-xs mt-1 ml-2 font-medium italic"
                    >
                      {errors.teamName.message}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs  tracking-widest text-white/40 font-bold ml-2">
                  Lead
                </label>
                <input
                  {...register("leaderName")}
                  placeholder="Lead Name"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-white/20"
                />
                {errors.leaderName && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-xs mt-1 ml-2 font-medium italic"
                  >
                    {errors.leaderName.message}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative space-y-2">
                <label className="text-xs  tracking-widest text-white/40 font-bold ml-2">
                  {" "}
                  Email
                </label>
                <div className="flex">
                  <span className="h-14 w-12 flex items-center justify-center bg-white/5 border border-r-0 border-white/10 rounded-l-xl text-white/30">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    {...register("leaderEmail")}
                    placeholder="email@nexus.com"
                    className="flex-1 h-14 bg-white/5 border border-white/10 rounded-r-xl px-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-white/20"
                  />
                </div>
                {errors.leaderEmail && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-xs mt-1 ml-2 font-medium italic"
                  >
                    {errors.leaderEmail.message}
                  </motion.p>
                )}
              </div>

              <div className="relative space-y-2">
                <label className="text-xs  tracking-widest text-white/40 font-bold ml-2">
                  Phone
                </label>
                <div className="flex">
                  <span className="h-14 w-12 flex items-center justify-center bg-white/5 border border-r-0 border-white/10 rounded-l-xl text-white/30">
                    <Smartphone className="w-4 h-4" />
                  </span>
                  <input
                    {...register("leaderPhone")}
                    placeholder="+91 ...."
                    className="flex-1 h-14 bg-white/5 border border-white/10 rounded-r-xl px-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-white/20"
                  />
                </div>
                {errors.leaderPhone && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-xs mt-1 ml-2 font-medium italic"
                  >
                    {errors.leaderPhone.message}
                  </motion.p>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Crew Members */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight ">
                Reinforcements
              </h2>
              <span className="text-xs text-white/30 font-mono">
                [{members.length}/3 MAX]
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            <div className="space-y-4">
              {errors.members?.message && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-xs ml-2 font-medium italic"
                >
                  {errors.members.message}
                </motion.p>
              )}
              <AnimatePresence mode="popLayout">
                {members.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative grid grid-cols-1 md:grid-cols-10 gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[14px]  font-bold text-white/30 ml-1">
                        Name
                      </label>
                      <input
                        value={m.name}
                        onChange={(e) =>
                          handleMemberChange(i, "name", e.target.value)
                        }
                        placeholder="Name"
                        className="w-full bg-transparent border-b border-white/10 focus:border-red-500 outline-none py-1 text-sm placeholder:text-white/10 transition-colors"
                      />
                      {errors.members?.[i]?.name && (
                        <p className="text-red-400 text-[11px] font-medium italic">
                          {errors.members[i]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[14px]  font-bold text-white/30 ml-1">
                        Email
                      </label>
                      <input
                        value={m.email}
                        onChange={(e) =>
                          handleMemberChange(i, "email", e.target.value)
                        }
                        placeholder="Email"
                        className="w-full bg-transparent border-b border-white/10 focus:border-red-500 outline-none py-1 text-sm placeholder:text-white/10 transition-colors"
                      />
                      {errors.members?.[i]?.email && (
                        <p className="text-red-400 text-[11px] font-medium italic">
                          {errors.members[i]?.email?.message}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[14px]  font-bold text-white/30 ml-1">
                        Phone
                      </label>
                      <input
                        value={m.phone}
                        onChange={(e) =>
                          handleMemberChange(i, "phone", e.target.value)
                        }
                        placeholder="Phone"
                        className="w-full bg-transparent border-b border-white/10 focus:border-red-500 outline-none py-1 text-sm placeholder:text-white/10 transition-colors"
                      />
                      {errors.members?.[i]?.phone && (
                        <p className="text-red-400 text-[11px] font-medium italic">
                          {errors.members[i]?.phone?.message}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-1 flex items-end justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(i)}
                        className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {members.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="w-full py-4 rounded-2xl border border-dashed border-white/10 hover:border-red-500/50 hover:bg-red-500/5 transition-all text-white/40 hover:text-white flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span className="font-bold  tracking-widest text-xs">
                    Request Reinforcement
                  </span>
                </button>
              )}
            </div>
          </section>

          {/* Section 3: Data Core */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight ">
                Strategic Asset Link
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 space-y-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-600/20 rounded-xl">
                  <Globe className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Google Drive Deployment</h3>
                  <p className="text-white/40 text-sm">
                    Upload your Team PPTs to a public Drive folder and paste the
                    link below.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <input
                  {...register("driveLink")}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full h-16 bg-black/40 border border-white/20 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-red-100 placeholder:text-white/10 font-mono text-sm"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-6 pointer-events-none opacity-20 group-focus-within:opacity-100 group-focus-within:text-red-500 transition-all">
                  <Star className="w-5 h-5" />
                </div>
              </div>
              {errors.driveLink && (
                <p className="text-red-400 text-xs mt-2 ml-2 font-medium italic">
                  {errors.driveLink.message}
                </p>
              )}
            </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-10 space-y-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full overflow-hidden group py-3 rounded-2xl bg-white text-black font-black  tracking-[0.2em] italic hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="group-hover:text-white transition-colors">
                      Transmitting...
                    </span>
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 group-hover:text-white transition-colors" />
                    <span className="group-hover:text-white transition-colors">
                      Register
                    </span>
                  </>
                )}
              </div>
            </button>

            <div className="flex flex-col md:flex-row items-center justify-between px-4">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div
                  className={`w-2 h-2 rounded-full ${autoSaveStatus ? "bg-green-500 animate-pulse" : "bg-white/20"}`}
                />
                <p className="text-[14px]  tracking-widest font-bold text-white/30">
                  {autoSaveStatus || "Data Encryption Idle"}
                </p>
              </div>

              <p className="text-[14px]  tracking-widest font-bold text-white/20">
                Authorized access only // SuperNova Network 2026
              </p>
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #020202;
        }
        ::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
}
