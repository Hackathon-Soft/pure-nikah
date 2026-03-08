import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { FiUsers, FiCheckCircle, FiAlertTriangle, FiMessageSquare, FiTrendingUp, FiSlash } from "react-icons/fi";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi("get_stats"),
  });

  const statCards = [
    { icon: FiUsers, label: "Total Users", value: stats?.totalProfiles ?? "—", color: "text-primary" },
    { icon: FiCheckCircle, label: "Verified", value: stats?.verifiedProfiles ?? "—", color: "text-green-600" },
    { icon: FiSlash, label: "Banned", value: stats?.bannedUsers ?? "—", color: "text-destructive" },
    { icon: FiAlertTriangle, label: "Pending Reports", value: stats?.pendingReports ?? "—", color: "text-amber-500" },
    { icon: FiMessageSquare, label: "Conversations", value: stats?.totalConversations ?? "—", color: "text-blue-500" },
    { icon: FiTrendingUp, label: "Signups (30d)", value: stats?.recentSignups ?? "—", color: "text-emerald-500" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform statistics and quick actions.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? <span className="animate-pulse">...</span> : stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
