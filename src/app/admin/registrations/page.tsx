"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ClipboardList, Search, FileJson, Calendar, Trash2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/admin/EventFormBuilder";

type Registration = {
    id: string;
    event_id: string;
    form_data: Record<string, any>;
    created_at: string;
    events: {
        title: string;
        registration_form: FormField[] | null;
    } | null;
};

type Event = {
    id: string;
    title: string;
    registration_form: FormField[] | null;
};

function RegistrationsContent() {
    const searchParams = useSearchParams();
    const eventFilterId = searchParams.get("event");

    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string>(eventFilterId || "all");

    useEffect(() => {
        fetchEvents();
        fetchRegistrations();
    }, [selectedEventId]);

    async function fetchEvents() {
        const { data, error } = await supabase.from('events').select('id, title, registration_form').order('title');
        if (!error && data) setEvents(data as Event[]);
    }

    async function fetchRegistrations() {
        setLoading(true);
        try {
            let query = supabase
                .from('event_registrations')
                .select('*, events(title, registration_form)')
                .order('created_at', { ascending: false });

            if (selectedEventId !== "all") {
                query = query.eq('event_id', selectedEventId);
            }

            const { data, error } = await query;

            if (error) throw error;
            setRegistrations((data as any[]) || []);
        } catch (err: any) {
            console.error("Error fetching registrations:", err);
            setError("Failed to load registrations.");
        } finally {
            setLoading(false);
        }
    }

    async function deleteRegistration(id: string) {
        if (!window.confirm("Are you sure you want to delete this registration?")) return;
        
        try {
            const { error } = await supabase
                .from('event_registrations')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            setRegistrations(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error("Error deleting registration:", err);
            alert("Failed to delete registration.");
        }
    }

    async function deleteAllRegistrations() {
        if (selectedEventId === "all") return;
        
        const eventTitle = events.find(e => e.id === selectedEventId)?.title || "this event";
        if (!window.confirm(`CRITICAL: Are you sure you want to delete ALL registrations for "${eventTitle}"? This action is permanent.`)) return;

        try {
            const { error } = await supabase
                .from('event_registrations')
                .delete()
                .eq('event_id', selectedEventId);

            if (error) throw error;
            
            setRegistrations([]);
            alert(`Successfully deleted all registrations for ${eventTitle}`);
        } catch (err) {
            console.error("Error deleting all registrations:", err);
            alert("Failed to delete registrations.");
        }
    }

    // Determine dynamic columns based on selected event or first registration
    const getDynamicColumns = () => {
        if (selectedEventId !== "all") {
            const selectedEvent = events.find(e => e.id === selectedEventId);
            if (selectedEvent?.registration_form) {
                return selectedEvent.registration_form.map(f => f.label);
            }
        }
        
        // Fallback or "All Events" view: collect unique keys from all registrations
        const allKeys = new Set<string>();
        registrations.forEach(reg => {
            Object.keys(reg.form_data).forEach(key => allKeys.add(key));
        });
        return Array.from(allKeys).slice(0, 5); // Limit to 5 columns for "All" view to avoid overflow
    };

    const dynamicColumns = getDynamicColumns();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-black">Event Registrations</h1>
                    <p className="text-gray-500 mt-1">
                        {selectedEventId === "all" 
                            ? "Overview of all candidate registrations across all events." 
                            : `Registrations for "${events.find(e => e.id === selectedEventId)?.title || 'Selected Event'}"`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-64">
                        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                            <SelectTrigger className="bg-white border-gray-200">
                                <SelectValue placeholder="Filter by event" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                {events.map(event => (
                                    <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedEventId !== "all" && registrations.length > 0 && (
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-none gap-2 font-bold px-4 rounded-xl"
                            onClick={deleteAllRegistrations}
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete All
                        </Button>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                    {error}
                </div>
            )}

            <Card className="shadow-md border-gray-100 overflow-hidden bg-white text-gray-900">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ClipboardList className="w-5 h-5 text-gray-500" />
                        <h3 className="font-semibold text-black">Registrations List</h3>
                        <span className="bg-gray-200 text-gray-700 py-0.5 px-2.5 rounded-full text-xs font-bold">
                            {registrations.length} Total
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-white border-b border-gray-100 text-gray-400">
                            <tr>
                                {selectedEventId === "all" && <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider text-black">Event</th>}
                                {dynamicColumns.map(col => (
                                    <th key={col} className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider text-black whitespace-nowrap">{col}</th>
                                ))}
                                <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider text-black text-right">Registered At</th>
                                <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider text-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={dynamicColumns.length + (selectedEventId === "all" ? 2 : 1)} className="p-12 text-center text-gray-400">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-300" />
                                        Loading registrations...
                                    </td>
                                </tr>
                            ) : registrations.length === 0 ? (
                                <tr>
                                    <td colSpan={dynamicColumns.length + (selectedEventId === "all" ? 2 : 1)} className="p-12 text-center text-gray-500 text-sm">
                                        No registrations found for this filter.
                                    </td>
                                </tr>
                            ) : (
                                registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                                        {selectedEventId === "all" && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary opacity-60" />
                                                    <div className="font-semibold text-black truncate max-w-[150px]">{reg.events?.title || "Unknown"}</div>
                                                </div>
                                            </td>
                                        )}
                                        {dynamicColumns.map(col => (
                                            <td key={col} className="px-6 py-4 text-gray-700">
                                                {reg.form_data[col] !== undefined ? String(reg.form_data[col]) : "-"}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-right">
                                            {new Date(reg.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                                onClick={() => deleteRegistration(reg.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
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

export default function RegistrationsManagement() {
    return (
        <Suspense fallback={
            <div className="p-12 text-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-300" />
                Initializing...
            </div>
        }>
            <RegistrationsContent />
        </Suspense>
    );
}
