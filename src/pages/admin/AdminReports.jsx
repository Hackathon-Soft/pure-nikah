import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FiAlertTriangle, FiCheckCircle, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
  dismissed: "bg-gray-100 text-gray-700",
};

const AdminReports = () => {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [activeNotes, setActiveNotes] = useState({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reports", statusFilter],
    queryFn: () => adminApi("list_reports", { status: statusFilter || undefined }),
  });

  const resolveMutation = useMutation({
    mutationFn: (params) => adminApi("resolve_report", params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({ title: "Report updated" });
    },
  });

  const reports = data?.reports || [];

  const filters = [
    { label: "Pending", value: "pending" },
    { label: "Resolved", value: "resolved" },
    { label: "Dismissed", value: "dismissed" },
    { label: "All", value: "" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Content Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and resolve user reports.</p>
      </motion.div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={statusFilter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FiCheckCircle className="mx-auto text-4xl text-green-500 mb-3" />
            <p className="text-lg font-medium text-foreground">No reports found</p>
            <p className="text-sm text-muted-foreground">All clear for now.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report, i) => (
            <motion.div key={report.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FiAlertTriangle className="text-amber-500" />
                        <span className="font-semibold text-foreground">{report.reason}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[report.status] || ""}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{report.reporter_name}</span> reported{" "}
                        <span className="font-medium text-foreground">{report.reported_name}</span>
                      </p>
                      {report.description && (
                        <p className="text-sm text-muted-foreground mt-2 bg-muted rounded-lg p-3">{report.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {report.status === "pending" && (
                    <div className="space-y-3 border-t pt-4">
                      <Textarea
                        placeholder="Admin notes (optional)..."
                        value={activeNotes[report.id] || ""}
                        onChange={(e) => setActiveNotes({ ...activeNotes, [report.id]: e.target.value })}
                        className="text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => resolveMutation.mutate({
                            reportId: report.id,
                            status: "resolved",
                            admin_notes: activeNotes[report.id] || "",
                          })}
                          disabled={resolveMutation.isPending}
                        >
                          <FiCheckCircle className="mr-1" /> Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveMutation.mutate({
                            reportId: report.id,
                            status: "dismissed",
                            admin_notes: activeNotes[report.id] || "",
                          })}
                          disabled={resolveMutation.isPending}
                        >
                          <FiX className="mr-1" /> Dismiss
                        </Button>
                      </div>
                    </div>
                  )}

                  {report.admin_notes && report.status !== "pending" && (
                    <div className="border-t pt-3">
                      <p className="text-xs text-muted-foreground">Admin notes:</p>
                      <p className="text-sm">{report.admin_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
