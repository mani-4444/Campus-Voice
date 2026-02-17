"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { toast } from "sonner";
import { LocationTree, LocationNode } from "@/components/location-tree";
import { LocationStats } from "@/components/location-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { initialLocations } from "@/lib/mock/locations";
import { getLocations, addLocation } from "@/lib/services/admin-issues";
import { getIssues } from "@/lib/services/issues";
import type { DbLocation, DbIssue } from "@/types/db";

/** Transform flat DB locations into a tree of LocationNodes */
function buildTree(locations: DbLocation[], issues: DbIssue[]): LocationNode[] {
  // Count issues per location name
  const issueCounts: Record<string, number> = {};
  issues.forEach((i) => {
    issueCounts[i.location] = (issueCounts[i.location] || 0) + 1;
  });

  const nodeMap = new Map<string, LocationNode>();
  locations.forEach((loc) => {
    nodeMap.set(loc.id, {
      id: loc.id,
      name: loc.name,
      type: loc.type,
      children: [],
      issueCount: issueCounts[loc.name] || 0,
    });
  });

  const roots: LocationNode[] = [];
  locations.forEach((loc) => {
    const node = nodeMap.get(loc.id)!;
    if (loc.parent_id && nodeMap.has(loc.parent_id)) {
      nodeMap.get(loc.parent_id)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export default function LocationsPage() {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationNode | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [treeNodes, setTreeNodes] = useState<LocationNode[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [locRes, issuesRes] = await Promise.all([
        getLocations(),
        getIssues(),
      ]);
      const locations = locRes.data ?? [];
      const issues = issuesRes.data ?? [];

      if (locations.length > 0) {
        const tree = buildTree(locations, issues);
        setTreeNodes(tree);
        setSelectedLocation(tree[0] ?? null);
      } else {
        // Fallback to mock data if DB has no locations
        setTreeNodes(initialLocations);
        setSelectedLocation(initialLocations[0]);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleAddLocation = async () => {
    const name = prompt("Enter location name:");
    if (!name) return;
    const type = prompt(
      "Enter type (campus, block, lab, hostel, facility):",
      "block",
    );
    if (!type) return;
    const res = await addLocation(name, type, selectedLocation?.id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`Location "${name}" added`);
      // Refresh
      const [locRes, issuesRes] = await Promise.all([
        getLocations(),
        getIssues(),
      ]);
      if (locRes.data && locRes.data.length > 0) {
        const tree = buildTree(locRes.data, issuesRes.data ?? []);
        setTreeNodes(tree);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campus Map</h1>
          <p className="text-sm text-muted-foreground">
            Manage locations and view infrastructure status
          </p>
        </div>
        <button
          onClick={handleAddLocation}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Campus Zone
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6">
        {/* Sidebar - Tree View */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border/50 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-muted/30 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Hierarchy</span>
              <button className="hover:text-foreground transition-colors">
                <Filter className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {isLoading ? (
              <div className="space-y-2 p-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full pl-4" />
                <Skeleton className="h-8 w-full pl-4" />
                <Skeleton className="h-8 w-full pl-8" />
              </div>
            ) : (
              <LocationTree
                nodes={treeNodes}
                selectedId={selectedLocation?.id || null}
                onSelect={setSelectedLocation}
              />
            )}
          </div>
        </div>

        {/* Main Content - Stats & Details */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col bg-card/50 border border-border/50 rounded-2xl p-6 overflow-y-auto shadow-sm">
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-24" />
                <div className="grid grid-cols-3 gap-3">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <LocationStats location={selectedLocation} />
          )}
        </div>
      </div>
    </div>
  );
}
