"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  User,
  Loader,
} from "lucide-react";
import { motion } from "framer-motion";
import { auditTypeStyles } from "@/lib/mock/constants";
import { getAuditLogs } from "@/lib/services/admin-issues";
import type { DbAuditLog } from "@/types/db";

const typeIcons: Record<string, React.ReactNode> = {
  resolve: <CheckCircle className="h-4 w-4 text-[var(--success)]" />,
  assign: <User className="h-4 w-4 text-primary" />,
  escalate: <AlertTriangle className="h-4 w-4 text-[var(--warning)]" />,
  update: <FileText className="h-4 w-4 text-muted-foreground" />,
  system: <Shield className="h-4 w-4 text-destructive" />,
};

export function AuditLog() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [logs, setLogs] = useState<DbAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const res = await getAuditLogs();
        if (res.data) setLogs(res.data);
      } catch {
        // Fallback silently
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter !== "All" && log.type !== filter.toLowerCase()) return false;
    if (search && !log.action.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs bg-card border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
          >
            <option value="All">All Actions</option>
            <option value="resolve">Resolutions</option>
            <option value="assign">Assignments</option>
            <option value="escalate">Escalations</option>
            <option value="system">System Alerts</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
        {!loading &&
          filteredLogs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex gap-3 p-3 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors"
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                  auditTypeStyles[log.type] || auditTypeStyles["system"],
                )}
              >
                {typeIcons[log.type] || typeIcons["system"]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
                  {log.action}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded border border-border/50">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    {log.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        {filteredLogs.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-xs">
            No logs found matching criteria.
          </div>
        )}
      </div>
    </div>
  );
}
