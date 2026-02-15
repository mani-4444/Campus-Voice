// ──────────────────────────────────────────
// User mock data
// ──────────────────────────────────────────
import type { MockUser } from "./types";

export const users: MockUser[] = [
  {
    id: 1,
    name: "Dr. Sarah Miller",
    email: "sarah.m@college.edu",
    role: "Faculty",
    dept: "Computer Science",
    status: "Active",
  },
  {
    id: 2,
    name: "Prof. James Chen",
    email: "j.chen@college.edu",
    role: "Faculty",
    dept: "Electrical Eng.",
    status: "Active",
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@college.edu",
    role: "Admin",
    dept: "IT Services",
    status: "Active",
  },
  {
    id: 4,
    name: "Mark Wilson",
    email: "m.wilson@college.edu",
    role: "Student",
    dept: "Mechanical Eng.",
    status: "Suspended",
  },
  {
    id: 5,
    name: "Emily Davis",
    email: "e.davis@college.edu",
    role: "Student",
    dept: "Biotech",
    status: "Active",
  },
];
