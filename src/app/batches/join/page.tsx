"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Building2, GraduationCap, MapPin, Briefcase, Linkedin, Mail, Phone, User, Calendar } from "lucide-react";

import { ImageUpload } from "@/components/admin/ImageUpload";

function JoinBatchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prefilledBatch = searchParams.get("batch") || "";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


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
        profile_image_url: ""
    });


    // Sync batch if searchParam updates
    useEffect(() => {
        if (prefilledBatch) {
            setFormData(prev => ({ ...prev, batch: prefilledBatch }));
        }
    }, [prefilledBatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic validation for mandatory fields
        if (!formData.name || !formData.batch || !formData.phone_number || !formData.email || !formData.course || !formData.branch) {
            setError("Please fill in all mandatory fields.");
            setLoading(false);
            return;
        }

        try {
            const { error: submitError } = await supabase
                .from('batch_members')
                .insert([formData]);

            if (submitError) throw submitError;

            // Redirect back to batches page on success
            router.push("/batches");
            router.refresh();

        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message || "Failed to submit your details. Please try again.");
            } else {
                setError("Failed to submit your details. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Card className="border border-gray-100 shadow-2xl bg-white overflow-hidden rounded-2xl">
                    {/* Decorative Header Banner */}
                    <div className="h-3 bg-gradient-to-r from-gray-900 via-gray-700 to-black w-full" />

                    <CardHeader className="text-center pb-6 pt-10 px-4 sm:px-8 border-b border-gray-100">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100"
                        >
                            <GraduationCap className="w-8 h-8 text-gray-800" />
                        </motion.div>
                        <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">
                            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
                                {prefilledBatch ? `Batch ${prefilledBatch}` : "The Network"}
                            </span>
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto font-medium">
                            Take your place in Sahara&apos;s legacy. Connect with peers, share your journey, and grow your professional network.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-5 sm:p-8 md:p-12 bg-gray-50/30">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md flex items-center shadow-sm"
                            >
                                <p className="font-medium">{error}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Mandatory Section */}
                            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                    <div className="bg-gray-100 p-2 rounded-lg"><User className="w-5 h-5 text-gray-700" /></div>
                                    <h3 className="text-2xl font-bold text-gray-900">Personal Details</h3>
                                    <span className="ml-auto text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider">Required</span>
                                </div>
                                <div className="mb-8 flex flex-col items-center">
                                    <label className="text-sm font-semibold text-gray-900 tracking-wide mb-3 block w-full text-center">Profile Picture (Optional)</label>
                                    <ImageUpload 
                                        value={formData.profile_image_url}
                                        onChange={(url) => setFormData(prev => ({ ...prev, profile_image_url: url }))}
                                        bucket="member-profiles"
                                        aspectRatio="1/1"
                                        className="w-48 h-48 mx-auto"
                                    />
                                    <p className="text-xs text-gray-500 mt-2 font-medium italic">Share your face with the community!</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 sm:gap-y-6">
                                    <div className="space-y-2.5">
                                        <label htmlFor="name" className="text-sm font-semibold text-gray-900 tracking-wide">Full Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                                            <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Jane Smith"
                                                className="pl-11 h-12 bg-white border-gray-200 text-black font-medium placeholder:text-gray-400 focus-visible:ring-black focus-visible:border-black text-base transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="batch" className="text-sm font-semibold text-gray-900 tracking-wide">Batch Year *</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 z-10" />
                                            <Input
                                                id="batch"
                                                name="batch"
                                                required
                                                value={formData.batch}
                                                onChange={handleChange}
                                                placeholder="e.g. 2024"
                                                disabled={!!prefilledBatch}
                                                className="pl-11 h-12 bg-white border-gray-200 text-black font-medium placeholder:text-gray-400 focus-visible:ring-black focus-visible:border-black text-base transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-100"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="email" className="text-sm font-semibold text-gray-900 tracking-wide">Email ID *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                                            <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="jane@example.com"
                                                className="pl-11 h-12 bg-white border-gray-200 text-black font-medium placeholder:text-gray-400 focus-visible:ring-black focus-visible:border-black text-base transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="phone_number" className="text-sm font-semibold text-gray-900 tracking-wide">Phone Number *</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                                            <Input id="phone_number" name="phone_number" type="tel" required value={formData.phone_number} onChange={handleChange} placeholder="+1 234 567 8900"
                                                className="pl-11 h-12 bg-white border-gray-200 text-black font-medium placeholder:text-gray-400 focus-visible:ring-black focus-visible:border-black text-base transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="course" className="text-sm font-semibold text-gray-900 tracking-wide">Course *</label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                                            <Input id="course" name="course" required value={formData.course} onChange={handleChange} placeholder="e.g. B.Tech, M.Tech"
                                                className="pl-11 h-12 bg-white border-gray-200 text-black font-medium placeholder:text-gray-400 focus-visible:ring-black focus-visible:border-black text-base transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="branch" className="text-sm font-semibold text-gray-900 tracking-wide">Branch *</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                                            <Input id="branch" name="branch" required value={formData.branch} onChange={handleChange} placeholder="e.g. Computer Science"
                                                className="pl-11 h-12 bg-white border-gray-200 text-black font-medium placeholder:text-gray-400 focus-visible:ring-black focus-visible:border-black text-base transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Optional Section */}
                            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                    <div className="bg-blue-50 p-2 rounded-lg"><Briefcase className="w-5 h-5 text-blue-600" /></div>
                                    <h3 className="text-2xl font-bold text-gray-900">Professional Details</h3>
                                    <span className="ml-auto text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">Optional</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 sm:gap-y-6">
                                    <div className="space-y-2.5">
                                        <label htmlFor="company" className="text-sm font-semibold text-gray-900 tracking-wide">Current Company</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                                            <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Tech Corp Inc."
                                                className="pl-11 h-12 bg-white border-gray-200 text-black font-medium placeholder:text-gray-400 focus-visible:ring-black focus-visible:border-black text-base transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="job_title" className="text-sm font-semibold text-gray-900 tracking-wide">Job Title</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                                            <Input id="job_title" name="job_title" value={formData.job_title} onChange={handleChange} placeholder="Senior Software Engineer"
                                                className="pl-11 h-12 bg-white border-gray-200 text-black font-medium placeholder:text-gray-400 focus-visible:ring-black focus-visible:border-black text-base transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="country" className="text-sm font-semibold text-gray-900 tracking-wide">Country</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                                            <Input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="e.g. USA, UK, India"
                                                className="pl-11 h-12 bg-white border-gray-200 text-black font-medium placeholder:text-gray-400 focus-visible:ring-black focus-visible:border-black text-base transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label htmlFor="linkedin_url" className="text-sm font-semibold text-gray-900 tracking-wide">LinkedIn Profile</label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                                            <Input id="linkedin_url" name="linkedin_url" type="url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/username"
                                                className="pl-11 h-12 bg-white border-gray-200 text-black font-medium placeholder:text-gray-400 focus-visible:ring-black focus-visible:border-black text-base transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 border-t border-gray-200 pt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-32 h-12 border-red-200 text-red-600 font-semibold hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-base rounded-xl transition-all"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full sm:w-56 h-12 bg-black hover:bg-gray-800 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </span>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export default function JoinBatchPage() {
    return (
        <main className="min-h-screen bg-[#f8fafc] py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
            {/* Abstract Background Design */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 bg-gradient-to-b from-gray-300 to-transparent blur-3xl rounded-full" />
            </div>

            <div className="relative z-10">
                <Suspense fallback={
                    <div className="max-w-4xl mx-auto flex justify-center items-center h-[50vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                }>
                    <JoinBatchForm />
                </Suspense>
            </div>
        </main>
    );
}
