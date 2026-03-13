"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2, CalendarDays, Search, Plus, Edit, Sparkles, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Event = {
    id: string;
    title: string;
    tagline?: string;
    description?: string;
    date: string;
    time?: string;
    venue?: string;
    category?: string;
    type: 'Sahara Fest' | 'Other Events';
    image_url?: string;
    is_featured: boolean;
    created_at: string;
};

export default function EventsManagement() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (err: unknown) {
            console.error("Error fetching events:", err);
            setError("Failed to load events. Make sure you have created the 'events' table.");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (event: Event) => {
        if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', event.id);

            if (error) throw error;
            await fetchEvents();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to delete event.");
            } else {
                setError("Failed to delete event.");
            }
        }
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-black">Manage Events</h1>
                    <p className="text-gray-500 mt-1">Create, edit, and organize community and Sahara Fest events.</p>
                </div>

                <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <Link href="/admin/events/new">
                        <Button className="bg-black text-white hover:bg-gray-800">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Event
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
                        <CalendarDays className="w-5 h-5 text-gray-500" />
                        <h3 className="font-semibold text-black">Events List</h3>
                        <span className="bg-gray-200 text-gray-700 py-0.5 px-2.5 rounded-full text-xs font-bold">
                            {events.length} Events
                        </span>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search events..."
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
                                <th className="px-6 py-4 font-medium text-black">Event Details</th>
                                <th className="px-6 py-4 font-medium hidden sm:table-cell text-black">Schedule</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell text-black">Type/Category</th>
                                <th className="px-6 py-4 font-medium text-right text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-400">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-300" />
                                        Loading events...
                                    </td>
                                </tr>
                            ) : filteredEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-500">
                                        No events found.
                                    </td>
                                </tr>
                            ) : (
                                filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="font-semibold text-black">{event.title}</div>
                                                {event.is_featured && (
                                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                                )}
                                            </div>
                                            <div className="text-gray-500 mt-0.5 text-xs">
                                                {event.venue || "No venue specified"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <div className="flex flex-col gap-1 text-xs text-gray-700">
                                                <span className="font-medium">{event.date}</span>
                                                <span className="text-gray-400">{event.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                <Badge variant={event.type === 'Sahara Fest' ? 'default' : 'secondary'} className="text-[10px] py-0 px-2 uppercase tracking-wider">
                                                    {event.type}
                                                </Badge>
                                                {event.category && (
                                                    <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                                        {event.category}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/registrations?event=${event.id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-8 px-2"
                                                        title="View Registrations"
                                                    >
                                                        <ClipboardList className="w-4 h-4 mr-1.5" />
                                                        Registrations
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/events/${event.id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2"
                                                    >
                                                        <Edit className="w-4 h-4 mr-1.5" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(event)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                                    Delete
                                                </Button>
                                            </div>
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
