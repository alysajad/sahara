"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Layers, TrendingUp, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalBatches: 0,
        loading: true,
        error: false
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const { count: membersCount, error: membersError } = await supabase
                    .from('batch_members')
                    .select('*', { count: 'exact', head: true });

                const { count: batchesCount, error: batchesError } = await supabase
                    .from('batches')
                    .select('*', { count: 'exact', head: true });

                if (membersError || batchesError) {
                    throw new Error("Failed to fetch stats");
                }

                // Fallback: If fetching batches fails (table not created), derive count from unique members' batches
                let finalBatchesCount = batchesCount || 0;

                if (batchesError || batchesCount === 0 || batchesCount === null) {
                    const { data: membersForCount, error: fallbackError } = await supabase
                        .from('batch_members')
                        .select('batch');

                    if (!fallbackError && membersForCount) {
                        const uniqueBatches = new Set(membersForCount.map(m => m.batch));
                        finalBatchesCount = uniqueBatches.size;
                    }
                }

                setStats({
                    totalMembers: membersCount || 0,
                    totalBatches: finalBatchesCount,
                    loading: false,
                    error: false
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
                setStats(prev => ({ ...prev, loading: false, error: true }));
            }
        }

        fetchStats();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
            <div>
                <h1 className="text-4xl font-bold font-serif text-black tracking-tight">Dashboard Overview</h1>
                <p className="text-lg text-gray-500 mt-2 font-medium">Welcome back. Here is what is happening across Sahara Connect.</p>
            </div>

            {stats.error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-200">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="font-medium">Failed to load statistics. Ensure the batches table has been created in Supabase.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="shadow-lg border-gray-100 rounded-2xl overflow-hidden bg-white text-gray-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-sm font-bold text-black uppercase tracking-wider">Total Members</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 pb-8">
                        <div className="text-5xl font-bold text-black tracking-tighter">
                            {stats.loading ? "..." : stats.totalMembers}
                        </div>
                        <p className="text-sm text-green-600 mt-3 flex items-center gap-1.5 font-semibold">
                            <TrendingUp className="w-4 h-4" /> Global alumni signed up
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-gray-100 rounded-2xl overflow-hidden bg-white text-gray-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-sm font-bold text-black uppercase tracking-wider">Registered Batches</CardTitle>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Layers className="w-5 h-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 pb-8">
                        <div className="text-5xl font-bold text-black tracking-tighter">
                            {stats.loading ? "..." : stats.totalBatches}
                        </div>
                        <p className="text-sm text-gray-500 mt-3 font-semibold flex items-center gap-1.5">
                            Formally created batches
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
