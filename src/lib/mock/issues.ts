// ──────────────────────────────────────────
// Canonical issue list — single source of truth
// ──────────────────────────────────────────
import type { Issue, TimelineStep, AdminUpdate, ReporterRole } from "./types";

/** Full issue list shown on /issues and referenced by other pages */
export const issues: Issue[] = [
  {
    id: 1,
    title: "Library AC not functioning in Block A",
    description:
      "The air conditioning system in Block A Library has been non-functional for the past 3 days. The temperature inside is uncomfortable, especially during afternoon hours, making it difficult for students to study. Multiple students have reported this issue verbally to the library staff but no action has been taken. The situation is particularly concerning given the current weather conditions.",
    status: "In Progress",
    priority: "High",
    category: "Infrastructure",
    location: "Block A",
    date: "Feb 12, 2026",
    upvotes: 47,
    progress: 60,
    reporter: "student",
    assigned: "Facilities Dept",
  },
  {
    id: 2,
    title: "WiFi connectivity drops in Hostel 3",
    description:
      "WiFi connectivity drops frequently in Hostel 3, particularly on floors 2–4. Students are unable to attend online lectures during peak hours.",
    status: "Submitted",
    priority: "Critical",
    category: "IT Services",
    location: "Hostel 3",
    date: "Feb 11, 2026",
    upvotes: 38,
    progress: 10,
    reporter: "student",
    assigned: "Unassigned",
  },
  {
    id: 3,
    title: "Lab equipment outdated in CS Department",
    description:
      "Several workstations in the CS lab have outdated CPUs and insufficient RAM, causing frequent crashes during practical sessions.",
    status: "Under Review",
    priority: "Medium",
    category: "Academics",
    location: "Block B",
    date: "Feb 10, 2026",
    upvotes: 31,
    progress: 30,
    reporter: "faculty",
    assigned: "CS Dept Head",
  },
  {
    id: 4,
    title: "Cafeteria hygiene concerns reported",
    description:
      "Students reported unhygienic conditions at the main cafeteria — dirty trays, expired condiments, and pests observed near the serving area.",
    status: "In Progress",
    priority: "High",
    category: "Facilities",
    location: "Cafeteria",
    date: "Feb 9, 2026",
    upvotes: 28,
    progress: 45,
    reporter: "student",
    assigned: "Health Officer",
  },
  {
    id: 5,
    title: "Parking lot lighting insufficient",
    description:
      "The east parking lot has at least 4 non-functional lights, creating dim patches after dark. Faculty and students feel unsafe walking to their vehicles.",
    status: "Submitted",
    priority: "Low",
    category: "Safety",
    location: "Main Campus",
    date: "Feb 8, 2026",
    upvotes: 19,
    progress: 5,
    reporter: "faculty",
    assigned: "Unassigned",
  },
  {
    id: 6,
    title: "Hostel water supply irregular schedule",
    description:
      "Water supply in Hostel 1 is available only 2 hours per day instead of the scheduled 6. Residents are struggling with basic needs.",
    status: "Resolved",
    priority: "High",
    category: "Hostel",
    location: "Hostel 1",
    date: "Feb 5, 2026",
    upvotes: 52,
    progress: 100,
    reporter: "student",
    assigned: "Maintenance",
  },
  {
    id: 7,
    title: "Bus timing inconsistency for Route 3",
    description:
      "Route 3 bus has been arriving 15–20 minutes late regularly, causing students to miss first-period classes.",
    status: "In Progress",
    priority: "Medium",
    category: "Transportation",
    location: "Main Campus",
    date: "Feb 4, 2026",
    upvotes: 23,
    progress: 55,
    reporter: "student",
    assigned: "Transport Coordinator",
  },
  {
    id: 8,
    title: "Exam hall seating arrangement complaint",
    description:
      "Faculty observed that seating allocation for mid-semester exams was poorly organized, leading to confusion and delays.",
    status: "Resolved",
    priority: "Low",
    category: "Administration",
    location: "Block C",
    date: "Feb 3, 2026",
    upvotes: 15,
    progress: 100,
    reporter: "faculty",
    assigned: "Exam Cell",
  },
];

/** Helper – look up a single issue by id */
export function getIssueById(id: number): Issue | undefined {
  return issues.find((i) => i.id === id);
}

/** Helper – get reporter for an issue (fallback to "student") */
export function getIssueReporter(id: number): ReporterRole {
  return issues.find((i) => i.id === id)?.reporter ?? "student";
}

// ────── Per-issue timeline & admin updates (keyed by issue ID) ──────

/** Timeline steps keyed by issue ID — maps to issue status history */
const issueTimelines: Record<number, TimelineStep[]> = {
  1: [
    {
      label: "Submitted",
      date: "Feb 12, 2026 - 09:14 AM",
      completed: true,
      current: false,
      description: "Issue reported and added to anonymous queue",
    },
    {
      label: "Under Review",
      date: "Feb 12, 2026 - 11:30 AM",
      completed: true,
      current: false,
      description: "Assigned to Facilities Management department",
    },
    {
      label: "In Progress",
      date: "Feb 13, 2026 - 02:15 PM",
      completed: true,
      current: true,
      description: "Maintenance team dispatched to site",
    },
    {
      label: "Resolved",
      date: "Pending",
      completed: false,
      current: false,
      description: "Awaiting resolution confirmation",
    },
  ],
  2: [
    {
      label: "Submitted",
      date: "Feb 11, 2026 - 08:02 AM",
      completed: true,
      current: true,
      description: "Issue reported — WiFi drops across Hostel 3 floors 2–4",
    },
    {
      label: "Under Review",
      date: "Pending",
      completed: false,
      current: false,
      description: "Awaiting IT Services triage",
    },
    {
      label: "In Progress",
      date: "Pending",
      completed: false,
      current: false,
      description: "—",
    },
    {
      label: "Resolved",
      date: "Pending",
      completed: false,
      current: false,
      description: "—",
    },
  ],
  3: [
    {
      label: "Submitted",
      date: "Feb 10, 2026 - 10:22 AM",
      completed: true,
      current: false,
      description: "Faculty reported outdated CS lab equipment",
    },
    {
      label: "Under Review",
      date: "Feb 10, 2026 - 03:45 PM",
      completed: true,
      current: true,
      description: "CS Dept Head reviewing procurement budget",
    },
    {
      label: "In Progress",
      date: "Pending",
      completed: false,
      current: false,
      description: "—",
    },
    {
      label: "Resolved",
      date: "Pending",
      completed: false,
      current: false,
      description: "—",
    },
  ],
  4: [
    {
      label: "Submitted",
      date: "Feb 9, 2026 - 12:45 PM",
      completed: true,
      current: false,
      description: "Hygiene concerns reported at main cafeteria",
    },
    {
      label: "Under Review",
      date: "Feb 9, 2026 - 02:00 PM",
      completed: true,
      current: false,
      description: "Health Officer notified for inspection",
    },
    {
      label: "In Progress",
      date: "Feb 10, 2026 - 09:30 AM",
      completed: true,
      current: true,
      description: "Hygiene audit underway",
    },
    {
      label: "Resolved",
      date: "Pending",
      completed: false,
      current: false,
      description: "Awaiting audit completion",
    },
  ],
  5: [
    {
      label: "Submitted",
      date: "Feb 8, 2026 - 06:30 PM",
      completed: true,
      current: true,
      description: "Faculty reported insufficient parking lot lighting",
    },
    {
      label: "Under Review",
      date: "Pending",
      completed: false,
      current: false,
      description: "—",
    },
    {
      label: "In Progress",
      date: "Pending",
      completed: false,
      current: false,
      description: "—",
    },
    {
      label: "Resolved",
      date: "Pending",
      completed: false,
      current: false,
      description: "—",
    },
  ],
  6: [
    {
      label: "Submitted",
      date: "Feb 5, 2026 - 07:10 AM",
      completed: true,
      current: false,
      description: "Hostel 1 water supply complaint filed",
    },
    {
      label: "Under Review",
      date: "Feb 5, 2026 - 09:00 AM",
      completed: true,
      current: false,
      description: "Maintenance team assigned",
    },
    {
      label: "In Progress",
      date: "Feb 6, 2026 - 10:00 AM",
      completed: true,
      current: false,
      description: "Plumbing team dispatched to Hostel 1",
    },
    {
      label: "Resolved",
      date: "Feb 8, 2026 - 04:00 PM",
      completed: true,
      current: false,
      description: "Water schedule restored to 6 hours",
    },
  ],
  7: [
    {
      label: "Submitted",
      date: "Feb 4, 2026 - 08:15 AM",
      completed: true,
      current: false,
      description: "Route 3 bus timing complaints reported",
    },
    {
      label: "Under Review",
      date: "Feb 4, 2026 - 11:00 AM",
      completed: true,
      current: false,
      description: "Transport Coordinator reviewing schedule",
    },
    {
      label: "In Progress",
      date: "Feb 5, 2026 - 09:00 AM",
      completed: true,
      current: true,
      description: "Schedule revision underway with operator",
    },
    {
      label: "Resolved",
      date: "Pending",
      completed: false,
      current: false,
      description: "—",
    },
  ],
  8: [
    {
      label: "Submitted",
      date: "Feb 3, 2026 - 11:00 AM",
      completed: true,
      current: false,
      description: "Faculty reported seating arrangement issues",
    },
    {
      label: "Under Review",
      date: "Feb 3, 2026 - 02:00 PM",
      completed: true,
      current: false,
      description: "Exam Cell reviewing allocation system",
    },
    {
      label: "In Progress",
      date: "Feb 4, 2026 - 09:00 AM",
      completed: true,
      current: false,
      description: "New allocation algorithm applied",
    },
    {
      label: "Resolved",
      date: "Feb 5, 2026 - 10:30 AM",
      completed: true,
      current: false,
      description: "Revised seating plan distributed",
    },
  ],
};

/** Admin updates keyed by issue ID — maps to `issue_updates` table */
const issueAdminUpdates: Record<number, AdminUpdate[]> = {
  1: [
    {
      id: 1,
      issueId: 1,
      author: "System",
      message:
        "Issue #001 submitted and recorded in anonymous queue. Auto-priority: High based on keywords 'AC', 'Library'.",
      time: "Feb 12, 2026 - 09:14 AM",
      type: "system",
    },
    {
      id: 2,
      issueId: 1,
      author: "Ravi (Facilities)",
      message:
        "Issue assigned to Facilities Management department for review. Reference ticket created: FM-2026-0212.",
      time: "Feb 12, 2026 - 11:30 AM",
      type: "assign",
    },
    {
      id: 3,
      issueId: 1,
      author: "Suresh (Maintenance)",
      message:
        "Maintenance team dispatched to Block A Library. Estimated resolution time provided: 48 hours.",
      time: "Feb 13, 2026 - 02:15 PM",
      type: "update",
    },
    {
      id: 4,
      issueId: 1,
      author: "Ravi (Facilities)",
      message:
        "Parts ordered for AC unit replacement (Compressor Unit XJ-900). Vendor: CoolTech Systems.",
      time: "Feb 14, 2026 - 10:00 AM",
      type: "update",
    },
  ],
  2: [
    {
      id: 5,
      issueId: 2,
      author: "System",
      message:
        "Issue #002 submitted. Auto-priority: Critical — WiFi outage affecting multiple floors.",
      time: "Feb 11, 2026 - 08:02 AM",
      type: "system",
    },
  ],
  3: [
    {
      id: 6,
      issueId: 3,
      author: "System",
      message: "Issue #003 submitted by faculty. Auto-priority: Medium.",
      time: "Feb 10, 2026 - 10:22 AM",
      type: "system",
    },
    {
      id: 7,
      issueId: 3,
      author: "Dr. Kumar (CS HOD)",
      message:
        "Reviewing budget allocation for lab upgrades. Will be discussed in next department meeting.",
      time: "Feb 10, 2026 - 03:45 PM",
      type: "update",
    },
  ],
  4: [
    {
      id: 8,
      issueId: 4,
      author: "System",
      message:
        "Issue #004 submitted. Auto-priority: High — hygiene keywords detected.",
      time: "Feb 9, 2026 - 12:45 PM",
      type: "system",
    },
    {
      id: 9,
      issueId: 4,
      author: "Health Officer",
      message:
        "Inspection scheduled for Feb 10. Cafeteria management notified.",
      time: "Feb 9, 2026 - 02:00 PM",
      type: "assign",
    },
    {
      id: 10,
      issueId: 4,
      author: "Health Officer",
      message:
        "Audit in progress. Preliminary: trays replaced, pest control scheduled.",
      time: "Feb 10, 2026 - 09:30 AM",
      type: "update",
    },
  ],
  5: [
    {
      id: 11,
      issueId: 5,
      author: "System",
      message: "Issue #005 submitted by faculty. Auto-priority: Low.",
      time: "Feb 8, 2026 - 06:30 PM",
      type: "system",
    },
  ],
  6: [
    {
      id: 12,
      issueId: 6,
      author: "System",
      message: "Issue #006 submitted. Auto-priority: High — water supply.",
      time: "Feb 5, 2026 - 07:10 AM",
      type: "system",
    },
    {
      id: 13,
      issueId: 6,
      author: "Maintenance Lead",
      message:
        "Plumbing team dispatched. Root cause: main valve pressure drop.",
      time: "Feb 6, 2026 - 10:00 AM",
      type: "assign",
    },
    {
      id: 14,
      issueId: 6,
      author: "Maintenance Lead",
      message: "Repair complete. Water supply schedule restored to 6 hours.",
      time: "Feb 8, 2026 - 04:00 PM",
      type: "update",
    },
  ],
  7: [
    {
      id: 15,
      issueId: 7,
      author: "System",
      message: "Issue #007 submitted. Route 3 bus timing inconsistency.",
      time: "Feb 4, 2026 - 08:15 AM",
      type: "system",
    },
    {
      id: 16,
      issueId: 7,
      author: "Transport Coordinator",
      message:
        "Contacted operator. Investigating root cause of recurring delays.",
      time: "Feb 4, 2026 - 11:00 AM",
      type: "assign",
    },
    {
      id: 17,
      issueId: 7,
      author: "Transport Coordinator",
      message:
        "Driver shift revision underway. New timetable expected by Feb 7.",
      time: "Feb 5, 2026 - 09:00 AM",
      type: "update",
    },
  ],
  8: [
    {
      id: 18,
      issueId: 8,
      author: "System",
      message: "Issue #008 submitted by faculty.",
      time: "Feb 3, 2026 - 11:00 AM",
      type: "system",
    },
    {
      id: 19,
      issueId: 8,
      author: "Exam Cell",
      message: "Revised seating allocation algorithm applied and distributed.",
      time: "Feb 5, 2026 - 10:30 AM",
      type: "update",
    },
  ],
};

/** Default timeline for unknown/new issues */
const defaultTimeline: TimelineStep[] = [
  {
    label: "Submitted",
    date: "—",
    completed: true,
    current: true,
    description: "Issue submitted",
  },
  {
    label: "Under Review",
    date: "Pending",
    completed: false,
    current: false,
    description: "—",
  },
  {
    label: "In Progress",
    date: "Pending",
    completed: false,
    current: false,
    description: "—",
  },
  {
    label: "Resolved",
    date: "Pending",
    completed: false,
    current: false,
    description: "—",
  },
];

/** Get timeline for a specific issue */
export function getTimelineForIssue(issueId: number): TimelineStep[] {
  return issueTimelines[issueId] ?? defaultTimeline;
}

/** Get admin updates for a specific issue */
export function getUpdatesForIssue(issueId: number): AdminUpdate[] {
  return issueAdminUpdates[issueId] ?? [];
}

// Legacy exports (backward-compat for any remaining references)
export const timelineSteps = issueTimelines[1] ?? defaultTimeline;
export const adminUpdates = issueAdminUpdates[1] ?? [];
