"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2, Users, Search, GraduationCap, Download, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Member = {
    id?: string;
    name: string;
    email: string;
    phone_number?: string;
    batch: string;
    course?: string;
    branch?: string;
    job_title?: string;
    company?: string;
    created_at?: string;
};

function MembersContent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('batch') || searchParams.get('search') || "";

    const [members, setMembers] = useState<Member[]>([]);
    const [availableBatches, setAvailableBatches] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(initialSearch);

    useEffect(() => {
        fetchMembers();
    }, []);

    async function fetchMembers() {
        setLoading(true);
        try {
            const { data: membersData, error } = await supabase
                .from('batch_members')
                .select('*')
                .order('batch', { ascending: false });

            if (error) throw error;
            
            const { data: explicitBatches } = await supabase
                .from('batches')
                .select('year');

            const uniqueBatches = new Set<string>();
            if (explicitBatches) {
                explicitBatches.forEach(b => uniqueBatches.add(b.year));
            }
            if (membersData) {
                membersData.forEach(m => {
                    if (m.batch) uniqueBatches.add(m.batch);
                });
            }

            setAvailableBatches(Array.from(uniqueBatches).sort((a, b) => b.localeCompare(a)));
            setMembers(membersData || []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to load members.");
            } else {
                setError("Failed to load members.");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleBatchChange = async (memberId: string | undefined, newBatch: string) => {
        if (!memberId) return;
        try {
            const { error } = await supabase
                .from('batch_members')
                .update({ batch: newBatch })
                .eq('id', memberId);
            if (error) throw error;
            setMembers(prev => prev.map(m => m.id === memberId ? { ...m, batch: newBatch } : m));
        } catch (err) {
            console.error("Error updating batch:", err);
            alert("Failed to update batch.");
        }
    };

    const handleDelete = async (member: Member) => {
        if (!confirm(`Are you sure you want to remove ${member.name} from the network?`)) return;

        try {
            let query = supabase.from('batch_members').delete();

            if (member.id) {
                query = query.eq('id', member.id);
            } else {
                query = query.eq('email', member.email);
            }

            // Chain .select() to verify the row was actually deleted
            const { error, data } = await query.select();

            if (error) throw error;

            // If data is empty, it means the query executed successfully but 0 rows were affected.
            // In Supabase, this almost always means Row Level Security (RLS) is blocking the DELETE.
            if (!data || data.length === 0) {
                throw new Error("Deletion blocked by Database. Please add a DELETE policy in your Supabase Row Level Security settings.");
            }

            await fetchMembers();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to delete member.");
            } else {
                setError("Failed to delete member.");
            }
        }
    };

    const handleExportPDF = () => {
        if (members.length === 0) return;

        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Sahara Connect - Members Directory", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

        const tableColumn = ["Name", "Email", "Phone", "Batch", "Dept/Course", "Professional Identity", "Joined Date"];
        const tableRows = members.map(member => [
            member.name,
            member.email,
            member.phone_number || "N/A",
            member.batch,
            `${member.course || ""} ${member.branch ? '- ' + member.branch : ''}`.trim() || "N/A",
            `${member.job_title || ""} ${member.company ? 'at ' + member.company : ''}`.trim() || "N/A",
            member.created_at ? new Date(member.created_at).toLocaleDateString() : "N/A"
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 28,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [17, 24, 39] }, // Tailwind gray-900
        });

        doc.save(`saharaconnect_members_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.batch.includes(searchQuery)
    );

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-black">Manage Members</h1>
                    <p className="text-gray-500 mt-1">Review, search, and manage alumni across all batches.</p>
                </div>

                <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <Button
                        onClick={handleExportPDF}
                        disabled={members.length === 0}
                        variant="outline"
                        className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                    </Button>
                    <Link href={`/admin/members/new${searchQuery.trim().length === 4 && !isNaN(Number(searchQuery.trim())) ? `?batch=${searchQuery.trim()}` : ''}`}>
                        <Button className="bg-black text-white hover:bg-gray-800">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Member
                        </Button>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                    {error}
                </div>
            )}

            <Card className="shadow-md border-gray-100 overflow-hidden bg-white text-gray-900">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-500" />
                        <h3 className="font-semibold text-black">Directory</h3>
                        <span className="bg-gray-200 text-gray-700 py-0.5 px-2.5 rounded-full text-xs font-bold">
                            {members.length} Users
                        </span>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name, email, or batch..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 bg-white w-full border-gray-200 text-black"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white border-b border-gray-100 text-gray-500">
                            <tr>
                                <th className="px-6 py-4 font-medium text-black">Member & Contact</th>
                                <th className="px-6 py-4 font-medium hidden sm:table-cell text-black">Education</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell text-black">Professional Identity</th>
                                <th className="px-6 py-4 font-medium text-right text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-400">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-300" />
                                        Loading members matrix...
                                    </td>
                                </tr>
                            ) : filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-500">
                                        No members match your search criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers.map((member, i) => (
                                    <tr key={member.id || String(i)} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-black">{member.name}</div>
                                            <div className="text-gray-500 mt-0.5 text-xs flex flex-col gap-1">
                                                <span>{member.email}</span>
                                                {member.phone_number && <span>{member.phone_number}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <div className="flex flex-col items-start gap-1">
                                                <div className="inline-flex items-center bg-gray-100 text-gray-700 font-medium px-2.5 py-0.5 rounded-md text-xs border border-gray-200 focus-within:ring-2 focus-within:ring-black">
                                                    <GraduationCap className="w-3 h-3 mr-1 shrink-0" />
                                                    <select
                                                        value={member.batch}
                                                        onChange={(e) => handleBatchChange(member.id, e.target.value)}
                                                        className="bg-transparent border-none outline-none focus:ring-0 py-1 pl-0 pr-1 cursor-pointer text-xs font-semibold appearance-none"
                                                        title="Change Batch"
                                                    >
                                                        {availableBatches.map(b => (
                                                            <option key={b} value={b}>{b}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {(member.course || member.branch) && (
                                                    <span className="text-xs text-gray-500">
                                                        {member.course} {member.branch && `- ${member.branch}`}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            {member.job_title || member.company ? (
                                                <div>
                                                    <span className="text-gray-800 font-medium">{member.job_title}</span>
                                                    {member.job_title && member.company && <span className="text-gray-400 mx-1">at</span>}
                                                    <span className="text-gray-600">{member.company}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Not provided</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(member)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

export default function MembersManagement() {
    return (
        <Suspense fallback={
            <div className="p-12 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        }>
            <MembersContent />
        </Suspense>
    );
}
