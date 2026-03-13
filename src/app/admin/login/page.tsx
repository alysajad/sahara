"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            console.log("Login attempt:", { email, success: !authError, error: authError });

            if (authError) throw authError;

            console.log("Login successful, session:", data.session);
            router.push("/admin");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">

            <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-xl">
                <div className="h-2 bg-gradient-to-r from-gray-900 via-gray-700 to-black w-full" />
                <CardHeader className="space-y-2 text-center pb-6 pt-10">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
                        <Lock className="w-8 h-8 text-gray-800" />
                    </div>
                    <CardTitle className="text-4xl font-serif font-bold tracking-tight text-gray-900">Admin Access</CardTitle>
                    <CardDescription className="text-base text-gray-500">Sign in to manage Sahara Connect</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-10">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-md">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-sm font-semibold text-black tracking-wide">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-11 h-12 bg-white border-gray-200 focus-visible:ring-black text-black text-base transition-all shadow-sm"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-sm font-semibold text-black tracking-wide">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                                <Input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-11 h-12 bg-white border-gray-200 focus-visible:ring-black text-black text-base transition-all shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 mt-4 bg-black hover:bg-gray-800 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
