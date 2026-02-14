"use client";

import {
    Building,
    MapPin,
    AlertTriangle,
    CheckCircle,
    Clock,
    MoreVertical,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LocationNode } from "./location-tree";

interface LocationStatsProps {
    location: LocationNode | null;
}

export function LocationStats({ location }: LocationStatsProps) {
    if (!location) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center animate-in fade-in">
                <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 opacity-50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No Location Selected</h3>
                <p className="text-sm max-w-xs mt-2">Select a location from the sidebar to view details, statistics, and manage sub-units.</p>
            </div>
        );
    }

    // Mock stats generation based on location
    const totalIssues = location.issueCount || 0;
    const highPriority = Math.floor(totalIssues * 0.3);
    const resolved = Math.floor(totalIssues * 0.4);
    const efficiency = "94%";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/50">
                            {location.type}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">{location.name}</h2>
                    <p className="text-sm text-muted-foreground">ID: {location.id} • Last audited 2 days ago</p>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4" />
                        Add Sub-unit
                    </button>
                    <button className="p-2 border border-border rounded-xl hover:bg-muted transition-colors">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-card border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <AlertTriangle className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Active Issues</span>
                    </div>
                    <p className="text-2xl font-bold">{totalIssues}</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded bg-[var(--warning)]/10 flex items-center justify-center text-[var(--warning)]">
                            <Clock className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">High Priority</span>
                    </div>
                    <p className="text-2xl font-bold">{highPriority}</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)]">
                            <CheckCircle className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Resolved</span>
                    </div>
                    <p className="text-2xl font-bold">{resolved}</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Building className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Efficiency</span>
                    </div>
                    <p className="text-2xl font-bold">{efficiency}</p>
                </div>
            </div>

            {/* Sub-locations Grid (if any) */}
            {location.children && location.children.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold mb-3">Sub-Locations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {location.children.map((child) => (
                            <div key={child.id} className="group p-3 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-mono text-muted-foreground">{child.type}</span>
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded",
                                        (child.issueCount || 0) > 10 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                                    )}>
                                        {child.issueCount} issues
                                    </span>
                                </div>
                                <p className="font-semibold text-sm group-hover:text-primary transition-colors">{child.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
