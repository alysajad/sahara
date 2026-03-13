"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let mounted = true;

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            console.log("AdminGuard session check:", { session, pathname });

            if (!mounted) return;

            if (!session) {
                if (pathname !== '/admin/login') {
                    console.log("No session, redirecting to login");
                    router.push('/admin/login');
                }
            } else {
                console.log("Session found, authenticated");
                setAuthenticated(true);
            }
            setLoading(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                setAuthenticated(false);
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            } else {
                setAuthenticated(true);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (!authenticated && pathname !== '/admin/login') {
        return null;
    }

    return <>{children}</>;
}
