"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Save, Sparkles, Image as ImageIcon, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { EventFormBuilder, FormField } from "@/components/admin/EventFormBuilder";


export default function NewEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        tagline: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        category: "",
        type: "Other Events",
        image_url: "",
        is_featured: false,
        is_registration_enabled: true,
        registration_form: [] as FormField[]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: insertError } = await supabase
                .from('events')
                .insert([formData]);

            if (insertError) throw insertError;

            router.push("/admin/events");
        } catch (err: any) {
            console.error("Error creating event:", err);
            setError(err.message || err.details || "Failed to create event. Check if 'events' table and RLS policies exist.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link href="/admin/events" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
            </Link>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-black">Add New Event</h1>
                    <p className="text-gray-500 mt-1">Fill in the details for the new community event.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                    {error}
                </div>
            )}

            <Card className="shadow-lg border-gray-100 bg-white">
                <CardHeader className="border-b border-gray-50 bg-gray-50/50">
                    <CardTitle className="text-xl text-black">Event Details</CardTitle>
                    <CardDescription>General information about the event.</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title" className="text-black">Event Title</Label>
                                <Input
                                    id="title"
                                    required
                                    placeholder="e.g. Sahara Fest 2026 Opening Night"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="tagline" className="text-black">Tagline / Short Catchphrase</Label>
                                <Input
                                    id="tagline"
                                    placeholder="e.g. The Grand Annual Celebration"
                                    value={formData.tagline}
                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description" className="text-black">Description</Label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    placeholder="Detailed information about the event..."
                                    className="flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-black ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-black">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="bg-white border-gray-200 text-black appearance-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="time" className="text-black">Time</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="bg-white border-gray-200 text-black appearance-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="venue" className="text-black">Venue</Label>
                                <Input
                                    id="venue"
                                    placeholder="e.g. Sahara Campus Grounds"
                                    value={formData.venue}
                                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-black">Category</Label>
                                <Input
                                    id="category"
                                    placeholder="e.g. Music, Sports, Tech"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="bg-white border-gray-200 text-black"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-black">Event Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger className="bg-white border-gray-200">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sahara Fest">Sahara Fest</SelectItem>
                                        <SelectItem value="Other Events">Other Events</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2 text-black">
                                <Label className="flex items-center gap-1.5 mb-2 font-semibold text-black">
                                    <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                                    Event Image
                                </Label>

                                <ImageUpload
                                    value={formData.image_url}
                                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                                />
                                <p className="text-[11px] text-gray-400 italic">This image will be used in the event cards and hero sections.</p>
                            </div>


                            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl md:col-span-2">
                                <Switch
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                                />
                                <Label htmlFor="is_featured" className="flex items-center gap-2 cursor-pointer font-semibold text-black">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    Feature this event (Hero section for Sahara Fest)
                                </Label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-2xl border border-purple-100 md:col-span-2 mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <ClipboardList className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <Label htmlFor="is_registration_enabled" className="text-base font-bold text-gray-900 cursor-pointer">
                                            Enable Registration
                                        </Label>
                                        <p className="text-xs text-purple-600 font-medium">Allow candidates to sign up for this event</p>
                                    </div>
                                </div>
                                <Switch
                                    id="is_registration_enabled"
                                    checked={formData.is_registration_enabled}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_registration_enabled: checked })}
                                    className="data-[state=checked]:bg-purple-600"
                                />
                            </div>

                            {formData.is_registration_enabled && (
                                <div className="md:col-span-2 pt-6 border-t border-gray-100">
                                    <EventFormBuilder
                                        value={formData.registration_form}
                                        onChange={(form) => setFormData({ ...formData, registration_form: form })}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-50 flex gap-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-12 bg-black text-white hover:bg-gray-800 rounded-xl"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        Create Event
                                    </>
                                )}
                            </Button>
                            <Link href="/admin/events" className="flex-1">
                                <Button
                                    variant="outline"
                                    disabled={loading}
                                    className="w-full h-12 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl"
                                >
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
