import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const AdminVerification = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-verification-requests"],
    queryFn: () => adminApi("list_verification_requests"),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ requestId, userId, approved, rejectionReason }) =>
      adminApi("review_verification_request", { requestId, userId, approved, rejectionReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verification-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({ title: "Verification updated" });
    },
    onError: (error) => {
      toast({ title: "Update failed", description: error.message || "Please try again.", variant: "destructive" });
    },
  });

  const requests = data?.requests || [];

  const handleApprove = (req) => {
    reviewMutation.mutate({ requestId: req.id, userId: req.user_id, approved: true, rejectionReason: null });
  };

  const handleReject = (req) => {
    const reason = window.prompt("Optional rejection reason for the user:", "");
    reviewMutation.mutate({ requestId: req.id, userId: req.user_id, approved: false, rejectionReason: reason || null });
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Selfie Verification</h1>
        <p className="text-sm text-muted-foreground mt-1">{requests.length} pending verification requests</p>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FiCheckCircle className="mx-auto text-4xl text-primary mb-3" />
            <p className="text-lg font-medium text-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground">No pending verification requests.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {(req.first_name || req.full_name || "?").charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{req.full_name || `${req.first_name || ""} ${req.last_name || ""}`.trim()}</p>
                        <p className="text-xs text-muted-foreground">{req.email || "N/A"}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="secondary">CNIC: {req.cnic_number}</Badge>
                          {req.city && <Badge variant="outline">{req.city}</Badge>}
                          {req.gender && <Badge variant="outline">{req.gender}</Badge>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleApprove(req)} disabled={reviewMutation.isPending}>
                        <FiCheckCircle className="mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(req)} disabled={reviewMutation.isPending}>
                        <FiX className="mr-1" /> Reject
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: "CNIC Front", url: req.cnic_front_url },
                      { label: "CNIC Back", url: req.cnic_back_url },
                      { label: "Selfie", url: req.selfie_url },
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-border overflow-hidden bg-muted/30 hover:opacity-90 transition-opacity">
                            <img src={item.url} alt={item.label} loading="lazy" className="w-full h-40 object-cover" />
                          </a>
                        ) : (
                          <div className="h-40 rounded-lg border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">Missing file</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-muted-foreground">DOB:</span> <span className="font-medium">{req.date_of_birth || "—"}</span></div>
                    <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{req.phone_number || "—"}</span></div>
                    <div><span className="text-muted-foreground">Father:</span> <span className="font-medium">{req.father_name || "—"}</span></div>
                    <div><span className="text-muted-foreground">Submitted:</span> <span className="font-medium">{new Date(req.created_at).toLocaleDateString()}</span></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerification;
