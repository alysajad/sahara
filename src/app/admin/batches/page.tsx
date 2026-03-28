"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Loader2, CalendarDays, Database, Users } from "lucide-react";
import Link from "next/link";

type Batch = {
    year: string;
    created_at: string;
};

export default function BatchesManagement() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [newBatchYear, setNewBatchYear] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBatches();
    }, []);

    async function fetchBatches() {
        setLoading(true);
        setError(null);
        try {
            const { data: explicitBatches } = await supabase
                .from('batches')
                .select('*');

            const { data: members, error: membersError } = await supabase
                .from('batch_members')
                .select('batch');

            if (membersError) throw membersError;

            const batchMap = new Map<string, Batch>();

            if (explicitBatches) {
                explicitBatches.forEach(b => {
                    batchMap.set(b.year, b);
                });
            }

            if (members) {
                members.forEach(m => {
                    if (m.batch && !batchMap.has(m.batch)) {
                        batchMap.set(m.batch, {
                            year: m.batch,
                            created_at: new Date().toISOString()
                        });
                    }
                });
            }

            const combinedBatches = Array.from(batchMap.values())
                .sort((a, b) => b.year.localeCompare(a.year));

            setBatches(combinedBatches);
        } catch (err) {
            console.error("Error fetching batches:", err);
            setError("Failed to load batches.");
        } finally {
            setLoading(false);
        }
    }

    const handleAddBatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBatchYear.trim()) return;

        setSubmitting(true);
        setError(null);
        try {
            const { error: insertError } = await supabase
                .from('batches')
                .insert([{ year: newBatchYear.trim() }]);

            if (insertError) {
                if (insertError.code === '23505') {
                    throw new Error(`Batch ${newBatchYear} already exists.`);
                }
                throw insertError;
            }

            setNewBatchYear("");
            await fetchBatches();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to add batch.");
            } else {
                setError("Failed to add batch.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (year: string) => {
        if (!confirm(`Are you sure you want to delete Batch ${year}? This action cannot be undone.`)) return;

        try {
            const { error } = await supabase
                .from('batches')
                .delete()
                .eq('year', year);

            if (error) throw error;
            await fetchBatches();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to delete batch.");
            } else {
                setError("Failed to delete batch.");
            }
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-black">Manage Batches</h1>
                    <p className="text-gray-500 mt-1">Add or remove recognized batches in Sahara Connect.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="shadow-md border-gray-100 sticky top-24 bg-white text-gray-900">
                        <CardHeader className="pb-4 bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2 text-black">
                                <CalendarDays className="w-5 h-5 text-gray-700" />
                                Add New Batch
                            </CardTitle>
                            <CardDescription>Register a new graduation year format.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleAddBatch} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-black">enter joining year</label>
                                    <Input
                                        value={newBatchYear}
                                        onChange={(e) => setNewBatchYear(e.target.value)}
                                        placeholder="enter joining year"
                                        required
                                        className="h-11 bg-white border-gray-200 text-black"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full h-11 bg-black text-white hover:bg-gray-800"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Batch
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="shadow-md border-gray-100 overflow-hidden bg-white text-gray-900">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                            <Database className="w-5 h-5 text-gray-500" />
                            <h3 className="font-semibold text-black">Current Batches</h3>
                            <span className="ml-auto bg-gray-200 text-gray-700 py-0.5 px-2.5 rounded-full text-xs font-bold">
                                {batches.length} Total
                            </span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {loading ? (
                                <div className="p-12 flex justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                </div>
                            ) : batches.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    No batches found. Add your first batch to the left.
                                </div>
                            ) : (
                                batches.map((batch) => (
                                    <div key={batch.year} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                        <Link href={`/admin/members?batch=${batch.year}`} className="flex-1 group">
                                            <div className="font-semibold text-lg text-black border border-gray-200 bg-white rounded-md px-3 py-1 inline-block group-hover:border-blue-300 group-hover:text-blue-700 transition-colors">
                                                {batch.year}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                                <span>Added: {new Date(batch.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span className="text-blue-600 flex items-center group-hover:underline">
                                                    <Users className="w-3 h-3 mr-1" /> View Members
                                                </span>
                                            </div>
                                        </Link>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(batch.year)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0 rounded-full"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
