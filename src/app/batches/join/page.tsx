"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  GraduationCap,
  MapPin,
  Briefcase,
  Linkedin,
  Mail,
  Phone,
  User,
  Calendar,
} from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

/* ─── Peace SVG (inline, used as watermark) ───────────────────────── */
const PeaceLogo = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="8" />
    <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="8" />
    <line x1="100" y1="100" x2="28" y2="168" stroke="currentColor" strokeWidth="8" />
    <line x1="100" y1="100" x2="172" y2="168" stroke="currentColor" strokeWidth="8" />
  </svg>
);

/* ─── Reusable themed field ────────────────────────────────────────── */
function Field({
  id,
  label,
  icon: Icon,
  required = false,
  ...inputProps
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-semibold tracking-widest uppercase text-[#6b5c45]">
        {label} {required && <span className="text-[#bb8d62]">*</span>}
      </label>
      <div className="relative group">
        <Icon className="absolute left-3.5 top-3.5 h-4 w-4 text-[#bb8d62] transition-colors group-focus-within:text-[#6b8e73]" />
        <Input
          id={id}
          {...inputProps}
          className="
            pl-10 h-12 w-full
            bg-[#faf7f2]/80
            border border-[#dcd8d0]
            text-[#2C2C2C] placeholder:text-[#b0a898]
            font-serif text-base
            rounded-none
            focus-visible:ring-0
            focus-visible:border-[#6b8e73]
            focus-visible:bg-[#faf7f2]
            transition-all
            shadow-inner
          "
        />
        {/* bottom accent line */}
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#6b8e73] transition-all duration-300 group-focus-within:w-full" />
      </div>
    </div>
  );
}

/* ─── Section wrapper ──────────────────────────────────────────────── */
function FormSection({
  title,
  badge,
  badgeColor = "sepia",
  children,
}: {
  title: string;
  badge: string;
  badgeColor?: "sepia" | "green";
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-[#fdf9f4] border border-[#dcd8d0] p-8"
      style={{ boxShadow: "4px 4px 0 #dcd8d0" }}
    >
      {/* Corner fold */}
      <span className="absolute top-0 right-0 w-0 h-0 border-l-[24px] border-b-[24px] border-l-transparent border-b-[#dcd8d0]" />

      <div className="flex items-center gap-3 mb-7 pb-4 border-b border-[#dcd8d0]">
        <h3 className="font-serif text-2xl font-bold text-[#2C2C2C] tracking-tight flex-1">{title}</h3>
        <span
          className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 border ${
            badgeColor === "green"
              ? "border-[#6b8e73] text-[#6b8e73] bg-[#6b8e73]/10"
              : "border-[#bb8d62] text-[#bb8d62] bg-[#bb8d62]/10"
          }`}
        >
          {badge}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

/* ─── Main form ────────────────────────────────────────────────────── */
function JoinBatchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledBatch = searchParams.get("batch") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    batch: prefilledBatch,
    phone_number: "",
    email: "",
    course: "",
    branch: "",
    company: "",
    job_title: "",
    country: "",
    linkedin_url: "",
    profile_image_url: "",
  });

  useEffect(() => {
    if (prefilledBatch) setFormData((prev) => ({ ...prev, batch: prefilledBatch }));
  }, [prefilledBatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.batch || !formData.phone_number || !formData.email || !formData.course || !formData.branch || !formData.profile_image_url) {
      setError("Please fill in all mandatory fields, including your profile picture.");
      setLoading(false);
      return;
    }

    try {
      const { error: submitError } = await supabase.from("batch_members").insert([formData]);
      if (submitError) throw submitError;
      setSuccess(true);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-[#F9F6F0] border border-[#dcd8d0]"
          style={{ boxShadow: "8px 8px 0 #dcd8d0" }}
        >
          {/* ── Heritage top bar ── */}
          <div className="h-1.5 bg-gradient-to-r from-[#6b8e73] via-[#bb8d62] to-[#2C2C2C] w-full" />

          {/* ── Success Body ── */}
          <div className="px-8 py-16 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-20 h-20 border-2 border-[#6b8e73] text-[#6b8e73] flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            
            <h2 className="font-serif text-4xl font-extrabold text-[#2C2C2C] mb-4 tracking-tight">Registration Successful!</h2>
            <p className="text-[#646464] font-serif text-lg mb-10 max-w-lg mx-auto italic">
              Welcome to the network. Please join our official community WhatsApp group to stay connected with your peers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={process.env.NEXT_PUBLIC_WHATSAPP_JOIN_URL || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-full sm:w-auto px-8 h-12
                  bg-[#25D366] hover:bg-[#20bd5a]
                  text-white font-sans font-bold tracking-wide text-sm uppercase
                  rounded-none flex items-center justify-center gap-2
                  border-2 border-[#128C7E]
                  shadow-[4px_4px_0_#128C7E] hover:shadow-[2px_2px_0_#128C7E]
                  transition-all
                "
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Join WhatsApp Group
              </a>
              <button
                type="button"
                onClick={() => {
                  router.push("/batches");
                  router.refresh();
                }}
                className="
                  w-full sm:w-auto px-8 h-12
                  border-2 border-[#dcd8d0] 
                  text-[#646464] font-sans font-bold tracking-wide uppercase text-sm
                  transition-all hover:border-[#bb8d62] hover:text-[#bb8d62] bg-transparent
                "
              >
                Return to Directory
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative bg-[#F9F6F0] border border-[#dcd8d0]"
        style={{ boxShadow: "8px 8px 0 #dcd8d0" }}
      >
        {/* ── Heritage top bar ── */}
        <div className="h-1.5 bg-gradient-to-r from-[#6b8e73] via-[#bb8d62] to-[#2C2C2C] w-full" />

        {/* ── Header ── */}
        <div className="relative px-8 pt-14 pb-10 text-center border-b border-[#dcd8d0] overflow-hidden">
          {/* Peace logo watermark behind header text */}
          <PeaceLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 text-[#2C2C2C] opacity-[0.04] pointer-events-none" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="w-14 h-14 border-2 border-[#bb8d62] flex items-center justify-center mx-auto mb-6"
          >
            <PeaceLogo className="w-8 h-8 text-[#bb8d62]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="font-serif text-5xl md:text-6xl font-extrabold text-[#2C2C2C] tracking-tight leading-none"
          >
            Join{" "}
            <span className="italic text-[#6b8e73]">
              {prefilledBatch ? `Batch ${prefilledBatch}` : "The Network"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-5 text-[#646464] font-serif italic text-lg max-w-xl mx-auto"
          >
            Take your place in Sahara&apos;s legacy. Connect with peers, share your journey,
            and grow your professional network.
          </motion.p>

          {/* Decorative rule */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className="h-px w-16 bg-[#dcd8d0]" />
            <span className="text-[#bb8d62] text-xs tracking-[0.3em] uppercase font-semibold">Est. Sahara</span>
            <span className="h-px w-16 bg-[#dcd8d0]" />
          </div>
        </div>

        {/* ── Form body ── */}
        <div className="px-6 md:px-10 py-10">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-serif italic"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── Personal Details ── */}
            <FormSection title="Personal Details" badge="Required">
              {/* Profile picture */}
              <div className="mb-8 flex flex-col items-center">
                <label className="text-xs font-semibold tracking-widest uppercase text-[#6b5c45] mb-3">
                  Profile Picture <span className="text-[#bb8d62]">*</span>
                </label>
                <ImageUpload
                  value={formData.profile_image_url}
                  onChange={(url) => setFormData((prev) => ({ ...prev, profile_image_url: url }))}
                  bucket="member-profiles"
                  aspectRatio="1/1"
                  className="w-44 h-44 mx-auto"
                />
                <p className="text-xs text-[#b0a898] mt-2 font-serif italic">Share your face with the community!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field id="name" name="name" label="Full Name" icon={User} required placeholder="E.g. Jane Smith" value={formData.name} onChange={handleChange} />
                <Field id="batch" name="batch" label="enter joining year" icon={Calendar} required placeholder="enter joining year" value={formData.batch} onChange={handleChange} disabled={!!prefilledBatch} />
                <Field id="email" name="email" label="Email ID" icon={Mail} required type="email" placeholder="jane@example.com" value={formData.email} onChange={handleChange} />
                <Field id="phone_number" name="phone_number" label="Phone Number" icon={Phone} required type="tel" placeholder="+91 98765 43210" value={formData.phone_number} onChange={handleChange} />
                <Field id="course" name="course" label="Course" icon={GraduationCap} required placeholder="E.g. B.Tech, M.Tech" value={formData.course} onChange={handleChange} />
                <Field id="branch" name="branch" label="Branch" icon={MapPin} required placeholder="E.g. Computer Science" value={formData.branch} onChange={handleChange} />
              </div>
            </FormSection>

            {/* ── Professional Details ── */}
            <FormSection title="Professional Details" badge="Optional" badgeColor="green">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field id="company" name="company" label="Current Company" icon={Building2} placeholder="E.g. Google, Infosys" value={formData.company} onChange={handleChange} />
                <Field id="job_title" name="job_title" label="Job Title" icon={Briefcase} placeholder="E.g. Software Engineer" value={formData.job_title} onChange={handleChange} />
                <Field id="country" name="country" label="Country" icon={MapPin} placeholder="E.g. India, USA" value={formData.country} onChange={handleChange} />
                <Field id="linkedin_url" name="linkedin_url" label="LinkedIn Profile" icon={Linkedin} type="url" placeholder="https://linkedin.com/in/username" value={formData.linkedin_url} onChange={handleChange} />
              </div>
            </FormSection>

            {/* ── Actions ── */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-[#dcd8d0]">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-8 h-12 border-2 border-[#dcd8d0] text-[#646464] font-serif font-semibold tracking-wide transition-all hover:border-[#bb8d62] hover:text-[#bb8d62] bg-transparent"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full sm:w-auto px-10 h-12
                  bg-[#2C2C2C] hover:bg-[#1a1a1a]
                  text-[#F9F6F0] font-serif font-bold tracking-[0.1em] uppercase text-sm
                  rounded-none
                  border-2 border-[#2C2C2C]
                  shadow-[4px_4px_0_#bb8d62] hover:shadow-[2px_2px_0_#bb8d62]
                  transition-all
                "
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#F9F6F0]/30 border-t-[#F9F6F0] rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Page shell with themed BG ────────────────────────────────────── */
export default function JoinBatchPage() {
  return (
    <main className="relative min-h-screen bg-[#F9F6F0] py-24 px-4 sm:px-6 overflow-hidden">
      {/* ── Large peace logo centred in background ── */}
      <PeaceLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] text-[#2C2C2C] opacity-[0.03] pointer-events-none select-none" />

      {/* ── Slogan watermark ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <p
          className="font-serif font-black text-[clamp(3rem,12vw,9rem)] text-[#2C2C2C] opacity-[0.025] whitespace-nowrap tracking-widest uppercase rotate-[-15deg]"
        >
          Once a Saharian, Always a Saharian.
        </p>
      </div>

      {/* ── Subtle texture lines ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(44,44,44,0.04) 40px)",
        }}
      />

      {/* ── Top-left & bottom-right ornamental corners ── */}
      <span className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-[#bb8d62]/30 pointer-events-none" />
      <span className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-[#bb8d62]/30 pointer-events-none" />

      <div className="relative z-10">
        <Suspense
          fallback={
            <div className="max-w-3xl mx-auto flex justify-center items-center h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C2C2C]" />
            </div>
          }
        >
          <JoinBatchForm />
        </Suspense>
      </div>
    </main>
  );
}
