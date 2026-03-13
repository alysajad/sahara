"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { FormField } from "@/components/admin/EventFormBuilder";

interface EventRegistrationFormProps {
    eventId: string;
    eventTitle: string;
    formSchema: FormField[];
}

export function EventRegistrationForm({ eventId, eventTitle, formSchema }: EventRegistrationFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (fieldLabel: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldLabel]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus('idle');

        try {
            const { error } = await supabase
                .from('event_registrations')
                .insert([
                    {
                        event_id: eventId,
                        form_data: formData
                    }
                ]);

            if (error) throw error;
            setStatus('success');
            setFormData({});
        } catch (err: any) {
            console.error("Registration error:", err);
            setStatus('error');
            setErrorMessage(err.message || "Failed to register. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (status === 'success') {
        return (
            <Card className="border-green-100 bg-green-50/30">
                <CardContent className="pt-8 pb-8 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-green-900">Registration Successful!</h3>
                        <p className="text-green-700">Thank you for registering for {eventTitle}. We've received your details.</p>
                    </div>
                    <Button onClick={() => setStatus('idle')} variant="outline" className="mt-4 border-green-200 hover:bg-green-100 text-green-700 h-9">
                        Register Another
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg border-gray-100 bg-white overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-xl font-serif text-black font-bold">Register for this Event</CardTitle>
                <CardDescription>Fill in the details below to secure your spot.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {formSchema.map((field) => (
                        <div key={field.id} className="space-y-1.5">
                            <Label htmlFor={field.id} className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                {field.label}
                                {field.required && <span className="text-red-500">*</span>}
                            </Label>
                            
                            {field.type === 'select' ? (
                                <Select 
                                    required={field.required}
                                    onValueChange={(val) => handleInputChange(field.label, val)}
                                    value={formData[field.label] || ""}
                                >
                                    <SelectTrigger className="bg-white border-gray-200 h-10">
                                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map(opt => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : field.type === 'textarea' ? (
                                <textarea
                                    id={field.id}
                                    required={field.required}
                                    placeholder={field.label}
                                    className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-black ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                                    value={formData[field.label] || ""}
                                />
                            ) : (
                                <Input
                                    id={field.id}
                                    type={field.type}
                                    required={field.required}
                                    placeholder={field.label}
                                    className="bg-white border-gray-200 text-black h-10"
                                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                                    value={formData[field.label] || ""}
                                />
                            )}
                        </div>
                    ))}

                    {formSchema.length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-4 italic">No registration fields required for this event.</p>
                    )}

                    {status === 'error' && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errorMessage}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        disabled={submitting} 
                        className="w-full h-11 bg-black text-white hover:bg-gray-800 rounded-lg font-semibold tracking-wide transition-all"
                    >
                        {submitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Submit Registration"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
