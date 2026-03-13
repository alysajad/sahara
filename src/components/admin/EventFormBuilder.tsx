"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Settings2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type FormField = {
    id: string;
    label: string;
    type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'date';
    required: boolean;
    options?: string[];
};

interface EventFormBuilderProps {
    value: FormField[];
    onChange: (value: FormField[]) => void;
}

export function EventFormBuilder({ value, onChange }: EventFormBuilderProps) {
    const addField = () => {
        const newField: FormField = {
            id: Math.random().toString(36).substr(2, 9),
            label: "New Field",
            type: "text",
            required: false,
        };
        onChange([...(value || []), newField]);
    };

    const removeField = (id: string) => {
        onChange(value.filter((f) => f.id !== id));
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        onChange(value.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-gray-400" />
                    Registration Form Builder
                </h3>
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addField}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 h-8"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                </Button>
            </div>

            {!value || value.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-sm">
                    No fields added yet. Click "Add Field" to start building your form.
                </div>
            ) : (
                <div className="space-y-3">
                    {value.map((field) => (
                        <Card key={field.id} className="shadow-sm border-gray-100 bg-white">
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className="mt-2 text-gray-300">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Field Label</Label>
                                        <Input
                                            value={field.label}
                                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                                            placeholder="e.g. Full Name"
                                            className="bg-white border-gray-200 text-black h-9 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Field Type</Label>
                                        <Select
                                            value={field.type}
                                            onValueChange={(val: any) => updateField(field.id, { type: val })}
                                        >
                                            <SelectTrigger className="bg-white border-gray-200 h-9 text-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Short Text</SelectItem>
                                                <SelectItem value="email">Email Address</SelectItem>
                                                <SelectItem value="number">Number</SelectItem>
                                                <SelectItem value="textarea">Long Text (TextArea)</SelectItem>
                                                <SelectItem value="select">Dropdown (Select)</SelectItem>
                                                <SelectItem value="date">Date</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {field.type === 'select' && (
                                        <div className="md:col-span-2 space-y-1">
                                            <Label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Options (comma separated)</Label>
                                            <Input
                                                value={field.options?.join(", ") || ""}
                                                onChange={(e) => updateField(field.id, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                                                placeholder="e.g. Vegetarian, Non-Vegetarian, Vegan"
                                                className="bg-white border-gray-200 text-black h-9 text-sm"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 mt-1">
                                        <Switch
                                            id={`required-${field.id}`}
                                            checked={field.required}
                                            onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                                        />
                                        <Label htmlFor={`required-${field.id}`} className="text-sm cursor-pointer text-gray-700">Required Field</Label>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeField(field.id)}
                                    className="text-red-400 hover:text-red-500 hover:bg-red-50 h-8 w-8"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
