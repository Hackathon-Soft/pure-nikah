import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { FiTrendingUp, FiMapPin, FiUsers, FiBarChart2, FiPieChart, FiActivity } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "#f59e0b",
  "#10b981",
  "#6366f1",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
];

const AdminAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => adminApi("get_analytics"),
  });

  const genderData = analytics?.genderDistribution || [];
  const cityData = analytics?.topCities || [];
  const sectData = analytics?.sectDistribution || [];
  const maritalData = analytics?.maritalDistribution || [];
  const monthlySignups = analytics?.monthlySignups || [];
  const verificationStats = analytics?.verificationStats || {};

  const summaryCards = [
    { icon: FiUsers, label: "Total Profiles", value: analytics?.totalProfiles ?? "—", color: "text-primary" },
    { icon: FiActivity, label: "Active (30d)", value: analytics?.activeUsers ?? "—", color: "text-green-600" },
    { icon: FiTrendingUp, label: "Avg Compatibility", value: analytics?.avgCompatibility ? `${analytics.avgCompatibility}%` : "—", color: "text-blue-500" },
    { icon: FiBarChart2, label: "Total Interests", value: analytics?.totalInterests ?? "—", color: "text-amber-500" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <FiBarChart2 className="text-primary" /> Analytics & Insights
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Detailed platform statistics, trends, and geographical data.</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((stat, i) => (
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Signups */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <FiTrendingUp className="text-primary" /> Monthly Signups
              </h2>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={monthlySignups}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Gender Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <FiPieChart className="text-primary" /> Gender Distribution
              </h2>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <FiMapPin className="text-primary" /> Top Cities
              </h2>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={cityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sect Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <FiPieChart className="text-primary" /> Sect Distribution
              </h2>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={sectData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {sectData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Marital Status & Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <FiUsers className="text-primary" /> Marital Status Breakdown
              </h2>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={maritalData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Verification Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <FiActivity className="text-primary" /> Verification Overview
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Verified", value: verificationStats.verified ?? 0, color: "text-green-600 bg-green-100 dark:bg-green-900/20" },
                  { label: "Unverified", value: verificationStats.unverified ?? 0, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/20" },
                  { label: "Pending Requests", value: verificationStats.pending ?? 0, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20" },
                  { label: "Rejected", value: verificationStats.rejected ?? 0, color: "text-red-600 bg-red-100 dark:bg-red-900/20" },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
                    <p className="text-2xl font-bold">{isLoading ? "..." : stat.value}</p>
                    <p className="text-xs font-medium mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
