import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { FiUsers, FiCheckCircle, FiAlertTriangle, FiMessageSquare, FiTrendingUp, FiSlash, FiHeart } from "react-icons/fi";
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
    { icon: FiHeart, label: "Nikah via Platform", value: stats?.totalMarriages ?? "—", color: "text-rose-500" },
    { icon: FiHeart, label: "Marriages (30d)", value: stats?.recentMarriages ?? "—", color: "text-pink-500" },
  ];

  const successRate = stats?.totalProfiles && stats?.totalMarriages
    ? ((stats.totalMarriages / stats.totalProfiles) * 100).toFixed(1)
    : null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform statistics and quick actions.</p>
      </motion.div>

      {/* Marriage success banner */}
      {!isLoading && stats?.totalMarriages > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="text-3xl">💍</div>
              <div>
                <p className="font-semibold text-foreground">
                  {stats.totalMarriages} Nikah{stats.totalMarriages !== 1 ? "s" : ""} facilitated — Alhamdulillah!
                </p>
                <p className="text-sm text-muted-foreground">
                  {successRate}% of registered profiles found their match through PureNikah.
                  {stats.recentMarriages > 0 && ` ${stats.recentMarriages} in the last 30 days.`}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
