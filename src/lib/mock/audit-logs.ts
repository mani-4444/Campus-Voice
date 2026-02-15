// Audit log mock data
// ──────────────────────────────────────────
import type { AuditLogEntry } from "./types";

export const auditLogData: AuditLogEntry[] = [
  {
    id: 1,
    action: "Admin marked Issue #106 as Resolved",
    admin: "System Admin",
    time: "Feb 14, 2026 - 10:32 AM",
    type: "resolve",
  },
  {
    id: 2,
    action: "Admin assigned Issue #102 to Facilities Dept",
    admin: "Jane Doe",
    time: "Feb 14, 2026 - 09:45 AM",
    type: "assign",
  },
  {
    id: 3,
    action: "Admin escalated Issue #98 priority to Critical",
    admin: "System Admin",
    time: "Feb 13, 2026 - 04:18 PM",
    type: "escalate",
  },
  {
    id: 4,
    action: "Admin added update to Issue #95",
    admin: "John Smith",
    time: "Feb 13, 2026 - 02:30 PM",
    type: "update",
  },
  {
    id: 5,
    action: "Admin marked Issue #91 as Resolved",
    admin: "Jane Doe",
    time: "Feb 13, 2026 - 11:22 AM",
    type: "resolve",
  },
  {
    id: 6,
    action: "System auto-flagged Issue #89 as Overdue",
    admin: "System",
    time: "Feb 13, 2026 - 09:00 AM",
    type: "system",
  },
  {
    id: 7,
    action: "Admin assigned Issue #88 to IT Services",
    admin: "John Smith",
    time: "Feb 12, 2026 - 03:55 PM",
    type: "assign",
  },
];
