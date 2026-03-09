import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FiPlus, FiBell, FiAlertTriangle, FiShield, FiTool, FiInfo, FiTrash2, FiEdit2, FiEye, FiEyeOff } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";

const typeConfig = {
  info: { icon: FiInfo, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", label: "Info" },
  warning: { icon: FiAlertTriangle, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30", label: "Warning" },
  safety: { icon: FiShield, color: "text-red-600 bg-red-100 dark:bg-red-900/30", label: "Safety Alert" },
  maintenance: { icon: FiTool, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30", label: "Maintenance" },
};

const AdminSupport = () => {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editNotice, setEditNotice] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", type: "info", priority: 0, expires_at: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-notices"],
    queryFn: () => adminApi("list_notices"),
  });

  const createMutation = useMutation({
    mutationFn: (params) => adminApi("create_notice", params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
      toast.success("Notice published");
      setCreateOpen(false);
      resetForm();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (params) => adminApi("update_notice", params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
      toast.success("Notice updated");
      setEditNotice(null);
      resetForm();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (noticeId) => adminApi("delete_notice", { noticeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
      toast.success("Notice deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ noticeId, is_active }) => adminApi("update_notice", { noticeId, is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
    },
  });

  const resetForm = () => setForm({ title: "", content: "", type: "info", priority: 0, expires_at: "" });

  const handleCreate = () => {
    createMutation.mutate({
      ...form,
      priority: Number(form.priority),
      expires_at: form.expires_at || null,
    });
  };

  const handleEdit = () => {
    updateMutation.mutate({
      noticeId: editNotice.id,
      title: form.title,
      content: form.content,
      type: form.type,
      priority: Number(form.priority),
      expires_at: form.expires_at || null,
    });
  };

  const openEdit = (notice) => {
    setForm({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      priority: notice.priority,
      expires_at: notice.expires_at ? notice.expires_at.split("T")[0] : "",
    });
    setEditNotice(notice);
  };

  const notices = data?.notices || [];
  const active = notices.filter((n) => n.is_active);
  const inactive = notices.filter((n) => !n.is_active);

  const NoticeForm = ({ onSubmit, submitLabel, isPending }) => (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Notice title..." maxLength={200} />
      </div>
      <div>
        <Label>Content</Label>
        <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Notice content..." rows={4} maxLength={2000} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="safety">Safety Alert</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Priority (0-10)</Label>
          <Input type="number" min={0} max={10} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Expires At (optional)</Label>
        <Input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isPending || !form.title.trim() || !form.content.trim()}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="p-token-6 space-y-token-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-token-2xl font-display font-bold text-foreground flex items-center gap-2">
            <FiBell className="text-primary" /> Support & Safety
          </h1>
          <p className="text-token-sm text-muted-foreground mt-1">
            Manage public notices, safety alerts, and platform announcements
          </p>
        </motion.div>

        <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><FiPlus className="mr-1" /> New Notice</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Public Notice</DialogTitle>
            </DialogHeader>
            <NoticeForm onSubmit={handleCreate} submitLabel="Publish Notice" isPending={createMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(typeConfig).map(([key, cfg]) => {
          const count = notices.filter((n) => n.type === key && n.is_active).length;
          return (
            <Card key={key}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${cfg.color}`}>
                  <cfg.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-token-xl font-bold text-foreground">{count}</p>
                  <p className="text-token-xs text-muted-foreground">{cfg.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Notices */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : notices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FiBell className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-token-lg font-medium text-foreground">No notices yet</p>
            <p className="text-token-sm text-muted-foreground">
              Create a public notice to inform users about important updates or safety alerts.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {active.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-token-lg font-semibold text-foreground flex items-center gap-2">
                <FiEye className="text-green-600" /> Active ({active.length})
              </h2>
              {active.map((notice, i) => {
                const cfg = typeConfig[notice.type] || typeConfig.info;
                return (
                  <motion.div key={notice.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className={`border-l-4 ${
                      notice.type === "safety" ? "border-l-red-500" :
                      notice.type === "warning" ? "border-l-amber-500" :
                      notice.type === "maintenance" ? "border-l-purple-500" : "border-l-blue-500"
                    }`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cfg.color}>{cfg.label}</Badge>
                              {notice.priority > 5 && <Badge variant="destructive">High Priority</Badge>}
                            </div>
                            <h3 className="text-token-base font-semibold text-foreground">{notice.title}</h3>
                            <p className="text-token-sm text-muted-foreground">{notice.content}</p>
                            <div className="flex gap-4 text-token-xs text-muted-foreground">
                              <span>Created: {new Date(notice.created_at).toLocaleDateString()}</span>
                              {notice.expires_at && <span>Expires: {new Date(notice.expires_at).toLocaleDateString()}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Switch
                              checked={notice.is_active}
                              onCheckedChange={(checked) => toggleMutation.mutate({ noticeId: notice.id, is_active: checked })}
                            />
                            <Button variant="ghost" size="icon" onClick={() => openEdit(notice)}>
                              <FiEdit2 className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"><FiTrash2 className="h-4 w-4 text-destructive" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                                  <AlertDialogDescription>This will permanently delete this notice.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMutation.mutate(notice.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {inactive.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-token-lg font-semibold text-foreground flex items-center gap-2">
                <FiEyeOff className="text-muted-foreground" /> Inactive ({inactive.length})
              </h2>
              {inactive.map((notice) => {
                const cfg = typeConfig[notice.type] || typeConfig.info;
                return (
                  <Card key={notice.id} className="opacity-60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cfg.color}>{cfg.label}</Badge>
                        <span className="text-token-sm text-foreground">{notice.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={false}
                          onCheckedChange={() => toggleMutation.mutate({ noticeId: notice.id, is_active: true })}
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><FiTrash2 className="h-4 w-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently delete this notice.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteMutation.mutate(notice.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editNotice} onOpenChange={(o) => { if (!o) { setEditNotice(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
          </DialogHeader>
          <NoticeForm onSubmit={handleEdit} submitLabel="Update Notice" isPending={updateMutation.isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSupport;
