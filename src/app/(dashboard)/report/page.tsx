"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { StepCategoryLocation } from "./step-category-location";
import { StepDetails } from "./step-details";
import { StepReview } from "./step-review";

export default function ReportIssuePage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const steps = [
    { num: 1, label: "Category & Location" },
    { num: 2, label: "Details" },
    { num: 3, label: "Review & Submit" },
  ];

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => router.push("/issues"), 2500);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative mb-6"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_40px_rgba(0,245,212,0.3)]">
            <Check className="h-12 w-12 text-primary" strokeWidth={1.5} />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
          >
            <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
          </motion.div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent"
        >
          Issue Submitted
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground mt-2 text-center max-w-sm"
        >
          Your anonymous report has been recorded and will be reviewed by the administration.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-muted-foreground/60 mt-6 animate-pulse"
        >
          Redirecting to issues...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
        <p className="text-muted-foreground">Submit a new anonymous report for immediate attention</p>
      </motion.div>

      {/* Anonymous badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 px-5 py-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/5 blur-xl -z-10" />
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <ShieldCheck className="h-5 w-5 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <span className="text-sm font-semibold text-primary block shadow-[0_0_15px_rgba(0,245,212,0.3)]">Anonymous Submission Enabled</span>
          <span className="text-xs text-muted-foreground">Your identity is encrypted and will never be revealed to administrators</span>
        </div>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-3 flex-1">
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-500",
              step >= s.num
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,245,212,0.4)]"
                : "bg-muted text-muted-foreground"
            )}>
              {step > s.num ? <Check className="h-4 w-4" strokeWidth={2.5} /> : s.num}
            </div>
            <span className={cn(
              "text-xs font-medium hidden sm:block whitespace-nowrap transition-colors duration-300",
              step >= s.num ? "text-foreground" : "text-muted-foreground"
            )}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-3 h-[2px] rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: step > s.num ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1">
              <StepCategoryLocation
                category={category}
                setCategory={setCategory}
                location={location}
                setLocation={setLocation}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2">
              <StepDetails
                description={description}
                setDescription={setDescription}
                priority={priority}
                setPriority={setPriority}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3">
              <StepReview
                category={category}
                location={location}
                description={description}
                priority={priority}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between pt-6 border-t border-border/50"
      >
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          Back
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(Math.min(3, step + 1))}
            disabled={
              (step === 1 && (!category || !location)) ||
              (step === 2 && !description)
            }
            className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-[0_0_20px_rgba(0,245,212,0.3)] hover:shadow-[0_0_25px_rgba(0,245,212,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
          >
            Next Step
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-[0_0_20px_rgba(0,245,212,0.3)] hover:shadow-[0_0_30px_rgba(0,245,212,0.6)] active:scale-[0.98] disabled:opacity-70 disabled:shadow-none"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </button>
        )}
      </motion.div>
    </div>
  );
}
