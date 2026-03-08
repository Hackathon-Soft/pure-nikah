import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

  const verifyMutation = useMutation({
    mutationFn: ({ userId, verified }) => adminApi("verify_user", { userId, verified }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verification-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({ title: "Verification updated" });
    },
  });

  const requests = data?.requests || [];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Profile Verification</h1>
        <p className="text-sm text-muted-foreground mt-1">{requests.length} profiles awaiting verification</p>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FiCheckCircle className="mx-auto text-4xl text-green-500 mb-3" />
            <p className="text-lg font-medium text-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground">No pending verification requests.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {req.first_name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{req.first_name} {req.last_name}</p>
                        <p className="text-xs text-muted-foreground">{req.email}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {req.city && <Badge variant="secondary">{req.city}</Badge>}
                          {req.gender && <Badge variant="outline">{req.gender}</Badge>}
                          {req.education && <Badge variant="outline">{req.education}</Badge>}
                          {req.profession && <Badge variant="outline">{req.profession}</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => verifyMutation.mutate({ userId: req.user_id, verified: true })}
                        disabled={verifyMutation.isPending}
                      >
                        <FiCheckCircle className="mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => verifyMutation.mutate({ userId: req.user_id, verified: false })}
                        disabled={verifyMutation.isPending}
                      >
                        <FiX className="mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Sect:</span> <span className="font-medium">{req.sect || "—"}</span></div>
                    <div><span className="text-muted-foreground">Prayer:</span> <span className="font-medium">{req.prayer_level || "—"}</span></div>
                    <div><span className="text-muted-foreground">Marital:</span> <span className="font-medium">{req.marital_status || "—"}</span></div>
                    <div><span className="text-muted-foreground">Joined:</span> <span className="font-medium">{new Date(req.created_at).toLocaleDateString()}</span></div>
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
