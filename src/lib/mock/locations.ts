// ──────────────────────────────────────────
// Location mock data
// ──────────────────────────────────────────
import type { LocationNode } from "./types";

/** Hierarchical campus location tree */
export const initialLocations: LocationNode[] = [
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
          {
            id: "1-1-2",
            name: "Classroom 101",
            type: "facility",
            issueCount: 2,
          },
        ],
      },
      {
        id: "1-2",
        name: "M Block",
        type: "block",
        issueCount: 8,
        children: [],
      },
      {
        id: "1-3",
        name: "N Block",
        type: "block",
        issueCount: 15,
        children: [],
      },
      {
        id: "1-4",
        name: "L Block",
        type: "block",
        issueCount: 5,
        children: [],
      },
      {
        id: "1-5",
        name: "R&D Block",
        type: "block",
        issueCount: 10,
        children: [],
      },
      {
        id: "1-6",
        name: "C Block",
        type: "block",
        issueCount: 7,
        children: [],
      },
      {
        id: "1-7",
        name: "D Block",
        type: "block",
        issueCount: 9,
        children: [],
      },
      {
        id: "1-8",
        name: "AIDS Block",
        type: "block",
        issueCount: 4,
        children: [],
      },
      {
        id: "1-9",
        name: "E Block",
        type: "block",
        issueCount: 6,
        children: [],
      },
      {
        id: "1-10",
        name: "Sports Block",
        type: "facility",
        issueCount: 3,
        children: [],
      },
      {
        id: "1-11",
        name: "Library",
        type: "facility",
        issueCount: 12,
        children: [],
      },
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

/** Flat list of category options for the report form */
export const categories = [
  "Infrastructure",
  "IT Services",
  "Academics",
  "Facilities",
  "Safety",
  "Administration",
  "Hostel",
  "Transportation",
];

/** Flat list of location options for the report form */
export const reportLocations = [
  "K Block",
  "M Block",
  "N Block",
  "L Block",
  "R&D Block",
  "C Block",
  "D Block",
  "AIDS Block",
  "E Block",
  "Sports Block",
  "Library",
  "Main Campus",
  "Hostel 1",
  "Hostel 2",
];
