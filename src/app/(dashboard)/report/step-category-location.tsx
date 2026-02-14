"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepCategoryLocationProps {
  category: string;
  setCategory: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
}

const categories = ["Infrastructure", "IT Services", "Academics", "Facilities", "Safety", "Administration", "Hostel", "Transportation"];
const locations = [
  "K Block", "M Block", "N Block", "L Block", "R&D Block",
  "C Block", "D Block", "AIDS Block", "E Block",
  "Sports Block", "Library", "Main Campus", "Hostel 1", "Hostel 2"
];

export function StepCategoryLocation({ category, setCategory, location, setLocation }: StepCategoryLocationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-semibold mb-3">Category</label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setCategory(cat)}
              className={cn(
                "relative rounded-xl border px-4 py-3 text-sm text-left transition-all duration-200 font-medium overflow-hidden group",
                category === cat
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border hover:border-primary/30 hover:bg-muted/50 text-foreground"
              )}
            >
              <span className="relative z-10">{cat}</span>
              {category === cat && (
                <motion.div
                  layoutId="category-active"
                  className="absolute inset-0 bg-primary/5 z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {category === cat && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-3">Location</label>
        <div className="grid grid-cols-2 gap-2">
          {locations.map((loc, i) => (
            <motion.button
              key={loc}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              onClick={() => setLocation(loc)}
              className={cn(
                "relative rounded-xl border px-4 py-3 text-sm text-left transition-all duration-200 font-medium overflow-hidden group",
                location === loc
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border hover:border-primary/30 hover:bg-muted/50 text-foreground"
              )}
            >
              <span className="relative z-10">{loc}</span>
              {location === loc && (
                <motion.div
                  layoutId="location-active"
                  className="absolute inset-0 bg-primary/5 z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {location === loc && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
