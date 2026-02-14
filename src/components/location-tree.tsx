"use client";

import { useState } from "react";
import {
    ChevronRight,
    ChevronDown,
    MapPin,
    Building,
    Layers,
    Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface LocationNode {
    id: string;
    name: string;
    type: "campus" | "block" | "lab" | "hostel" | "facility";
    children?: LocationNode[];
    issueCount?: number;
}

interface LocationTreeProps {
    nodes: LocationNode[];
    selectedId: string | null;
    onSelect: (node: LocationNode) => void;
}

const typeIcons: Record<string, React.ElementType> = {
    campus: Building,
    block: Layers,
    lab: MapPin,
    hostel: Home,
    facility: MapPin,
};

const typeColors: Record<string, string> = {
    campus: "text-primary bg-primary/10",
    block: "text-[var(--warning)] bg-[var(--warning)]/10",
    lab: "text-blue-500 bg-blue-500/10",
    hostel: "text-purple-500 bg-purple-500/10",
    facility: "text-[var(--success)] bg-[var(--success)]/10",
};

function TreeNode({
    node,
    depth = 0,
    selectedId,
    onSelect
}: {
    node: LocationNode;
    depth?: number;
    selectedId: string | null;
    onSelect: (node: LocationNode) => void;
}) {
    const [expanded, setExpanded] = useState(depth < 1);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedId === node.id;

    const Icon = typeIcons[node.type] || MapPin;

    return (
        <div className="select-none">
            <motion.div
                layout
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(node);
                    if (hasChildren) setExpanded(!expanded);
                }}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group",
                    isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                )}
                style={{ paddingLeft: `${depth * 16 + 12}px` }}
            >
                {isSelected && (
                    <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-tr-md rounded-br-md"
                    />
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                    className={cn(
                        "p-0.5 rounded-md hover:bg-muted/50 transition-colors",
                        !hasChildren && "invisible"
                    )}
                >
                    {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>

                <div className={cn(
                    "h-6 w-6 rounded flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? typeColors[node.type] : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                )}>
                    <Icon className="h-3 w-3" />
                </div>

                <span className="text-sm truncate flex-1">{node.name}</span>

                {node.issueCount !== undefined && node.issueCount > 0 && (
                    <span className={cn(
                        "text-[10px] font-mono px-1.5 py-0.5 rounded-md",
                        isSelected ? "bg-primary/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                        {node.issueCount}
                    </span>
                )}
            </motion.div>

            <AnimatePresence>
                {hasChildren && expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {node.children!.map((child) => (
                            <TreeNode
                                key={child.id}
                                node={child}
                                depth={depth + 1}
                                selectedId={selectedId}
                                onSelect={onSelect}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function LocationTree({ nodes, selectedId, onSelect }: LocationTreeProps) {
    return (
        <div className="space-y-0.5 py-2">
            {nodes.map((node) => (
                <TreeNode
                    key={node.id}
                    node={node}
                    selectedId={selectedId}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}
