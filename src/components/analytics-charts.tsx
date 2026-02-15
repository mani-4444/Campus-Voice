"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";
import { BarChart3, TrendingUp, Activity } from "lucide-react";

interface AnalyticsChartsProps {
    departmentData: any[];
    sentimentData: any[];
}

const trendData = [
    { day: "Mon", time: 4.5 },
    { day: "Tue", time: 3.8 },
    { day: "Wed", time: 4.2 },
    { day: "Thu", time: 2.9 },
    { day: "Fri", time: 3.5 },
    { day: "Sat", time: 2.1 },
    { day: "Sun", time: 1.8 },
];


export function AnalyticsCharts({ departmentData, sentimentData }: AnalyticsChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Department Bar Chart */}
            <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold">Issues by Department</h2>
                        <p className="text-xs text-foreground/80">Distribution across campus</p>
                    </div>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,133,144,0.1)" vertical={false} />
                            <XAxis
                                dataKey="dept"
                                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--card)",
                                    borderColor: "var(--border)",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                    color: "var(--foreground)"
                                }}
                                cursor={{ fill: "var(--primary)", opacity: 0.1, radius: 4 }}
                            />
                            <Bar
                                dataKey="issues"
                                fill="var(--primary)"
                                radius={[6, 6, 0, 0]}
                                barSize={40}
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sentiment Pie Chart */}
            <div className="rounded-3xl border border-border bg-card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold">Sentiment</h2>
                        <p className="text-xs text-foreground/80">Student feedback tone</p>
                    </div>
                </div>

                <div className="h-[200px] w-full flex-1 relative">
                    {/* Center Text */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-3xl font-bold">78%</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Positive</span>
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sentimentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={5}
                            >
                                {sentimentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--card)",
                                    borderColor: "var(--border)",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                    color: "var(--foreground)"
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    {sentimentData.map((s) => (
                        <div key={s.name} className="flex flex-col items-center">
                            <div className="h-1.5 w-8 rounded-full mb-1.5" style={{ backgroundColor: s.color }} />
                            <span className="text-[10px] text-foreground/80 font-medium">{s.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subject Feedback Performance Bar Chart */}
            <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 min-h-[300px]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold">Subject Feedback</h3>
                        <p className="text-xs text-foreground/80">Student Ratings (Avg)</p>
                    </div>
                </div>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={[
                                { subject: "Data Structures", rating: 4.8 },
                                { subject: "Algorithms", rating: 4.5 },
                                { subject: "Database", rating: 4.2 },
                                { subject: "OS", rating: 4.7 },
                            ]}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,133,144,0.1)" vertical={false} />
                            <XAxis
                                dataKey="subject"
                                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                domain={[0, 5]}
                                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--card)",
                                    borderColor: "var(--border)",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                    color: "var(--foreground)"
                                }}
                                cursor={{ fill: "var(--primary)", opacity: 0.1, radius: 4 }}
                            />
                            <Bar
                                dataKey="rating"
                                fill="var(--primary)"
                                radius={[6, 6, 0, 0]}
                                barSize={40}
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Response Trend Area Chart - Full Width */}
            <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[var(--warning)]/10 flex items-center justify-center text-[var(--warning)]">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold">Resolution Time Trend</h2>
                            <p className="text-xs text-muted-foreground">Average days to resolve issues (Last 7 days)</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold bg-[var(--success)]/10 text-[var(--success)] px-3 py-1.5 rounded-full border border-[var(--success)]/20">
                        <TrendingUp className="h-3 w-3" />
                        -12% Improvement
                    </div>
                </div>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--warning)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--warning)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,133,144,0.1)" vertical={false} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickMargin={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--card)",
                                    borderColor: "var(--border)",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                    color: "var(--foreground)"
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="time"
                                stroke="var(--warning)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTime)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
