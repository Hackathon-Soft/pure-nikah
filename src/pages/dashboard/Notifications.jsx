import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FiBell, FiHeart, FiMessageSquare, FiShield, FiEye, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const iconMap = {
  interest: FiHeart,
  message: FiMessageSquare,
  view: FiEye,
  verification: FiShield,
  alert: FiAlertCircle,
  system: FiBell,
};

const typeColors = {
  interest: "bg-destructive/10 text-destructive",
  message: "bg-primary/10 text-primary",
  view: "bg-secondary/10 text-secondary",
  verification: "bg-accent/20 text-accent-foreground",
  alert: "bg-muted text-muted-foreground",
  system: "bg-muted text-muted-foreground",
};

const Notifications = () => {
  const { user } = useAuth();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      return data || [];
    },
    enabled: !!user,
  });

  return (
    <div className="p-token-4 md:p-token-8 max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-token-2xl font-display font-bold text-foreground flex items-center gap-token-2"><FiBell className="text-primary" /> Notifications</h1>
      </motion.div>

      {notifications.length === 0 ? (
        <div className="text-center py-token-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-token-4">
            <FiBell className="text-muted-foreground" style={{ fontSize: "var(--size-icon-lg)" }} />
          </div>
          <h3 className="font-display text-token-lg font-semibold text-foreground mb-token-1">No Notifications</h3>
          <p className="text-token-sm text-muted-foreground">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => {
            const Icon = iconMap[n.type] || FiBell;
            return (
              <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className={`hover:shadow-card transition-shadow ${!n.read ? "border-primary/30" : ""}`}>
                  <CardContent className="p-token-4 flex items-center gap-token-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeColors[n.type] || typeColors.system}`}>
                      <Icon style={{ fontSize: "var(--size-icon)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-token-sm text-foreground font-medium">{n.title}</p>
                      <p className="text-token-xs text-muted-foreground">{n.message}</p>
                      <p className="text-token-xs text-muted-foreground mt-0.5">{new Date(n.created_at).toLocaleDateString()}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
