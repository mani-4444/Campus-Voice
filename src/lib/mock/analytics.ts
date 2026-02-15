// ──────────────────────────────────────────
// Analytics / chart mock data
// ──────────────────────────────────────────
import type {
  ChartDataPoint,
  RecentActivity,
  SentimentDataPoint,
  DepartmentDataPoint,
  ActionItem,
} from "./types";

/** Student dashboard — issue activity chart */
export const chartData: ChartDataPoint[] = [
  { month: "Aug", issues: 2 },
  { month: "Sep", issues: 5 },
  { month: "Oct", issues: 3 },
  { month: "Nov", issues: 8 },
  { month: "Dec", issues: 6 },
  { month: "Jan", issues: 12 },
  { month: "Feb", issues: 9 },
];

/** Student dashboard — recent activity feed */
export const recentActivity: RecentActivity[] = [
  {
    text: "Your issue #007 received 5 new upvotes",
    time: "2 hours ago",
    type: "upvote",
  },
  {
    text: "Issue #003 status changed to Resolved",
    time: "5 hours ago",
    type: "resolve",
  },
  {
    text: "Admin posted update on issue #005",
    time: "1 day ago",
    type: "update",
  },
];

/** Faculty dashboard — sentiment pie chart data */
export const sentimentData: SentimentDataPoint[] = [
  { name: "Positive", value: 35, color: "#3FB97C" },
  { name: "Neutral", value: 40, color: "#00F5D4" },
  { name: "Negative", value: 25, color: "#EF4444" },
];

/** Faculty dashboard — issues by department */
export const departmentData: DepartmentDataPoint[] = [
  { dept: "CS", issues: 12 },
  { dept: "EE", issues: 8 },
  { dept: "ME", issues: 15 },
  { dept: "CE", issues: 6 },
  { dept: "BT", issues: 9 },
];

/** Analytics — resolution time trend (last 7 days) */
export const trendData = [
  { day: "Mon", time: 4.5 },
  { day: "Tue", time: 3.8 },
  { day: "Wed", time: 4.2 },
  { day: "Thu", time: 2.9 },
  { day: "Fri", time: 3.5 },
  { day: "Sat", time: 2.1 },
  { day: "Sun", time: 1.8 },
];

/** Analytics — subject feedback ratings */
export const subjectFeedbackData = [
  { subject: "Data Structures", rating: 4.8 },
  { subject: "Algorithms", rating: 4.5 },
  { subject: "Database", rating: 4.2 },
  { subject: "OS", rating: 4.7 },
];

/** Faculty — action items */
export const actionItems: ActionItem[] = [
  {
    id: 1,
    title: "Review 'Lab Safety' policy violation report",
    priority: "Critical",
    deadline: "Today, 5:00 PM",
    type: "review",
  },
  {
    id: 2,
    title: "Approve budget for Department Workshop",
    priority: "High",
    deadline: "Tomorrow, 10:00 AM",
    type: "approval",
  },
  {
    id: 3,
    title: "Respond to Dean's query regarding curriculum",
    priority: "Medium",
    deadline: "Feb 16, 2026",
    type: "response",
  },
];
