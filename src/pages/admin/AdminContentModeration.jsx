import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FiAlertTriangle, FiCheck, FiX, FiEye, FiUser, FiMessageSquare, FiShield } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";

const AdminContentModeration = () => {
  const queryClient = useQueryClient();
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  const { data, isLoading } = useQuery({
    queryKey: ["flagged-messages", statusFilter],
    queryFn: () => adminApi("list_flagged_messages", { status: statusFilter }),
  });

  const resolveMutation = useMutation({
    mutationFn: (params) => adminApi("resolve_flagged_message", params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["flagged-messages"] });
      toast.success(
        variables.action === "dismiss" 
          ? "Message dismissed — false positive" 
          : variables.action === "warn"
          ? "User warned successfully"
          : "User banned successfully"
      );
      setSelectedFlag(null);
      setActionType(null);
      setAdminNotes("");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleAction = (action) => {
    resolveMutation.mutate({
      flagId: selectedFlag.id,
      action,
      adminNotes,
      userId: selectedFlag.sender_id,
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const flaggedMessages = data?.messages || [];

  return (
    <div className="p-token-6 space-y-token-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-token-2xl font-display font-bold text-foreground">Content Moderation</h1>
          <p className="text-token-sm text-muted-foreground mt-1">
            Review AI-flagged messages and take appropriate action
          </p>
        </div>
        <div className="flex gap-2">
          {["pending", "resolved", "all"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-token-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10">
                <FiAlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-token-2xl font-bold text-foreground">
                  {flaggedMessages.filter(m => m.status === "pending").length}
                </p>
                <p className="text-token-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-token-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <FiShield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-token-2xl font-bold text-foreground">
                  {flaggedMessages.filter(m => m.severity === "high").length}
                </p>
                <p className="text-token-xs text-muted-foreground">High Severity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-token-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-500/10">
                <FiCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-token-2xl font-bold text-foreground">
                  {flaggedMessages.filter(m => m.status === "resolved").length}
                </p>
                <p className="text-token-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Messages List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : flaggedMessages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FiMessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-token-lg font-medium text-foreground">No flagged messages</p>
            <p className="text-token-sm text-muted-foreground">
              {statusFilter === "pending" 
                ? "All messages are clean. MashAllah!" 
                : "No messages match this filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {flaggedMessages.map((flag, index) => (
            <motion.div
              key={flag.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`border-l-4 ${
                flag.severity === "high" ? "border-l-destructive" :
                flag.severity === "medium" ? "border-l-amber-500" : "border-l-muted"
              }`}>
                <CardContent className="pt-token-4">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Sender Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-sm font-bold">
                          {flag.sender_name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-token-sm font-medium text-foreground flex items-center gap-2">
                            {flag.sender_name || "Unknown User"}
                            {flag.sender_verified && <FiShield className="text-primary text-xs" />}
                          </p>
                          <p className="text-token-xs text-muted-foreground">
                            {new Date(flag.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={getSeverityColor(flag.severity)} className="ml-auto lg:ml-2">
                          {flag.severity?.toUpperCase()}
                        </Badge>
                        {flag.status === "resolved" && (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                            Resolved
                          </Badge>
                        )}
                      </div>

                      {/* Flagged Content */}
                      <div className="p-3 rounded-lg bg-muted/50 border border-border">
                        <p className="text-token-sm text-foreground">{flag.content}</p>
                      </div>

                      {/* AI Reason */}
                      <div className="flex items-start gap-2 text-token-xs">
                        <FiAlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          <strong>AI Reason:</strong> {flag.reason}
                        </span>
                      </div>

                      {/* Admin Notes (if resolved) */}
                      {flag.admin_notes && (
                        <div className="flex items-start gap-2 text-token-xs">
                          <FiUser className="text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            <strong>Admin Notes:</strong> {flag.admin_notes}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {flag.status === "pending" && (
                      <div className="flex flex-row lg:flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                          onClick={() => { setSelectedFlag(flag); setActionType("dismiss"); }}
                        >
                          <FiCheck className="mr-1" /> Dismiss
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-amber-600 border-amber-600 hover:bg-amber-50"
                          onClick={() => { setSelectedFlag(flag); setActionType("warn"); }}
                        >
                          <FiAlertTriangle className="mr-1" /> Warn
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => { setSelectedFlag(flag); setActionType("ban"); }}
                        >
                          <FiX className="mr-1" /> Ban
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => { setActionType(null); setSelectedFlag(null); setAdminNotes(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "dismiss" && "Dismiss Flag"}
              {actionType === "warn" && "Warn User"}
              {actionType === "ban" && "Ban User"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "dismiss" && "This will mark the flag as a false positive. No action will be taken against the user."}
              {actionType === "warn" && "This will send a warning to the user about their message."}
              {actionType === "ban" && "This will ban the user from the platform. This action is serious."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFlag && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border text-token-sm">
              "{selectedFlag.content}"
            </div>
          )}

          <Textarea
            placeholder="Add admin notes (optional)..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => { setActionType(null); setSelectedFlag(null); }}>
              Cancel
            </Button>
            <Button
              variant={actionType === "ban" ? "destructive" : actionType === "warn" ? "default" : "outline"}
              onClick={() => handleAction(actionType)}
              disabled={resolveMutation.isPending}
            >
              {resolveMutation.isPending ? "Processing..." : `Confirm ${actionType?.charAt(0).toUpperCase()}${actionType?.slice(1)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContentModeration;
