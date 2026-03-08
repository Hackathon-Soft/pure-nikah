import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FiBell, FiHeart, FiMessageSquare, FiShield, FiEye, FiAlertCircle } from "react-icons/fi";

const notifications = [
  { icon: FiHeart, text: "Fatima A. sent you an interest", time: "2 min ago", type: "interest" },
  { icon: FiMessageSquare, text: "New message from Aisha R.", time: "1 hour ago", type: "message" },
  { icon: FiEye, text: "Someone viewed your profile", time: "3 hours ago", type: "view" },
  { icon: FiShield, text: "Your verification is under review", time: "Yesterday", type: "verification" },
  { icon: FiAlertCircle, text: "Complete your profile to get more matches", time: "2 days ago", type: "alert" },
  { icon: FiHeart, text: "Sara K. accepted your interest!", time: "3 days ago", type: "interest" },
];

const typeColors: Record<string, string> = {
  interest: "bg-destructive/10 text-destructive",
  message: "bg-primary/10 text-primary",
  view: "bg-secondary/10 text-secondary",
  verification: "bg-accent/20 text-accent-foreground",
  alert: "bg-muted text-muted-foreground",
};

const Notifications = () => (
  <div className="p-token-4 md:p-token-8 max-w-3xl space-y-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-token-2xl font-display font-bold text-foreground flex items-center gap-token-2">
        <FiBell className="text-primary" /> Notifications
      </h1>
    </motion.div>

    <div className="space-y-3">
      {notifications.map((n, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
          <Card className="hover:shadow-card transition-shadow">
            <CardContent className="p-token-4 flex items-center gap-token-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeColors[n.type]}`}>
                <n.icon style={{ fontSize: "var(--size-icon)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-token-sm text-foreground">{n.text}</p>
                <p className="text-token-xs text-muted-foreground">{n.time}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Notifications;
