// ──────────────────────────────────────────
// Shared colour maps used across components
// ──────────────────────────────────────────

/** Status badge colours used on dashboard & admin table pages */
export const statusColors: Record<string, string> = {
  Submitted: "bg-muted text-muted-foreground",
  "Under Review": "bg-primary/10 text-primary",
  "In Progress": "bg-primary/10 text-primary",
  Resolved: "bg-success/10 text-success",
};

/** Status badge colours used on issue cards / list items (slightly different palette) */
export const statusColorsAlt: Record<string, string> = {
  Submitted: "bg-muted text-muted-foreground border-transparent",
  "Under Review": "bg-primary/10 text-primary border-primary/20",
  "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

/** Text-only priority colours (dashboard & admin) */
export const priorityColors: Record<string, string> = {
  Critical: "text-destructive",
  High: "text-[var(--warning)]",
  Medium: "text-primary",
  Low: "text-muted-foreground",
};

/** Priority badge colours with background (faculty action items) */
export const priorityBadgeColors: Record<string, string> = {
  Critical: "text-destructive bg-destructive/10 border-destructive/20",
  High: "text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]/20",
  Medium: "text-primary bg-primary/10 border-primary/20",
};

/** Priority dot colours (issue card / list item) */
export const priorityDot: Record<string, string> = {
  Critical: "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]",
  High: "bg-[var(--warning)] shadow-[0_0_8px_rgba(245,158,11,0.4)]",
  Medium: "bg-primary",
  Low: "bg-muted-foreground",
};

/** User role badge colours (user management table) */
export const roleColors: Record<string, string> = {
  Admin: "bg-destructive/10 text-destructive border-destructive/20",
  Faculty: "bg-primary/10 text-primary border-primary/20",
  Student: "bg-muted text-muted-foreground border-border",
};

/** Audit log type badge styles */
export const auditTypeStyles: Record<string, string> = {
  resolve:
    "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
  assign: "bg-primary/10 text-primary border-primary/20",
  escalate:
    "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  update: "bg-muted/50 text-muted-foreground border-border",
  system: "bg-destructive/10 text-destructive border-destructive/20",
};

/** Filter values */
export const filterCategories = [
  "All",
  "Infrastructure",
  "IT Services",
  "Academics",
  "Facilities",
  "Safety",
  "Hostel",
  "Transportation",
  "Administration",
];

export const filterStatuses = [
  "All",
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
];
