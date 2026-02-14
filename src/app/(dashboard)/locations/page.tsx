"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { LocationTree, LocationNode } from "@/components/location-tree";
import { LocationStats } from "@/components/location-stats";
import { Skeleton } from "@/components/ui/skeleton";

const initialLocations: LocationNode[] = [
  {
    id: "1",
    name: "Main Campus",
    type: "campus",
    issueCount: 89,
    children: [
      {
        id: "1-1",
        name: "K Block",
        type: "block",
        issueCount: 12,
        children: [
          { id: "1-1-1", name: "Chemistry Lab", type: "lab", issueCount: 3 },
          { id: "1-1-2", name: "Classroom 101", type: "facility", issueCount: 2 },
        ],
      },
      { id: "1-2", name: "M Block", type: "block", issueCount: 8, children: [] },
      { id: "1-3", name: "N Block", type: "block", issueCount: 15, children: [] },
      { id: "1-4", name: "L Block", type: "block", issueCount: 5, children: [] },
      { id: "1-5", name: "R&D Block", type: "block", issueCount: 10, children: [] },
      { id: "1-6", name: "C Block", type: "block", issueCount: 7, children: [] },
      { id: "1-7", name: "D Block", type: "block", issueCount: 9, children: [] },
      { id: "1-8", name: "AIDS Block", type: "block", issueCount: 4, children: [] },
      { id: "1-9", name: "E Block", type: "block", issueCount: 6, children: [] },
      { id: "1-10", name: "Sports Block", type: "facility", issueCount: 3, children: [] },
      { id: "1-11", name: "Library", type: "facility", issueCount: 12, children: [] },
    ],
  },
  {
    id: "2",
    name: "Hostel Zone",
    type: "campus",
    issueCount: 42,
    children: [
      { id: "2-1", name: "Hostel 1 (Boys)", type: "hostel", issueCount: 16 },
      { id: "2-2", name: "Hostel 2 (Boys)", type: "hostel", issueCount: 12 },
      { id: "2-3", name: "Hostel 3 (Girls)", type: "hostel", issueCount: 14 },
    ],
  },
];

export default function LocationsPage() {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setSelectedLocation(initialLocations[0]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddLocation = () => {
    toast.success("Add Location Modal", {
      description: "This feature would open a modal to add a new location.",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campus Map</h1>
          <p className="text-sm text-muted-foreground">Manage locations and view infrastructure status</p>
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
                nodes={initialLocations}
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
