import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  FiUser, FiHeart, FiMessageSquare, FiShield,
  FiSearch, FiStar, FiAlertCircle, FiCheckCircle,
  FiClock, FiEye, FiArrowRight, FiZap,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { usePlatformSettings, useDailyUsage } from "@/hooks/usePlatformLimits";
import NoticeBanner from "@/components/notices/NoticeBanner";
import { calculateCompatibility } from "@/lib/compatibility";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { getDisplayName } from "@/lib/displayName.js";

const DashboardHome = () => {
  const { user, profile } = useAuth();
  const { data: settings = {} } = usePlatformSettings();
  const { msgCount, viewCount, interestCount, favCount } = useDailyUsage();

  const { data: viewsCount = 0 } = useQuery({
    queryKey: ["profile-views-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("profile_views").select("*", { count: "exact", head: true }).eq("viewed_id", user.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: interestsCount = 0 } = useQuery({
    queryKey: ["interests-received-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("interests").select("*", { count: "exact", head: true }).eq("to_user_id", user.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: favoritesCount = 0 } = useQuery({
    queryKey: ["favorites-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("favorites").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: messagesCount = 0 } = useQuery({
    queryKey: ["conversations-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("conversations").select("*", { count: "exact", head: true }).or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: recentInterests = [] } = useQuery({
    queryKey: ["recent-interests", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("interests")
        .select("*, from_profile:profiles!interests_from_user_id_fkey(first_name, last_name, city)")
        .eq("to_user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: suggestedMatches = [] } = useQuery({
    queryKey: ["suggested-matches", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .neq("user_id", user.id)
        .eq("profile_completed", true)
        .limit(3);
      return data || [];
    },
    enabled: !!user,
  });

  const completionFields = profile
    ? [profile.first_name, profile.last_name, profile.date_of_birth, profile.gender, profile.city, profile.sect, profile.prayer_level, profile.education, profile.profession, profile.family_type, profile.religious_expectations]
    : [];
  const filled = completionFields.filter(Boolean).length;
  const profileCompletion = Math.round((filled / completionFields.length) * 100);

  const stats = [
    { icon: FiEye, label: "Profile Views", value: String(viewsCount), color: "text-primary" },
    { icon: FiHeart, label: "Interests Received", value: String(interestsCount), color: "text-destructive" },
    { icon: FiStar, label: "Favorites", value: String(favoritesCount), color: "text-accent-foreground" },
    { icon: FiMessageSquare, label: "Conversations", value: String(messagesCount), color: "text-secondary" },
  ];

  const displayName = profile?.first_name || user?.user_metadata?.name || "User";

  const profileChecklist = [
    { label: "Basic Info", done: !!(profile?.first_name && profile?.city) },
    { label: "Religious Info", done: !!profile?.sect },
    { label: "Education & Work", done: !!profile?.education },
    { label: "Preferences", done: !!profile?.religious_expectations },
    { label: "Family Details", done: !!profile?.family_type },
  ];

  const quickActions = [
    { icon: FiUser, label: "Edit Profile", to: "/dashboard/edit-profile" },
    { icon: FiSearch, label: "Search", to: "/dashboard/search" },
    { icon: FiHeart, label: "Interests", to: "/dashboard/interests" },
    { icon: FiShield, label: "Verify", to: "/dashboard/verification" },
  ];

  return (
    <div className="p-token-4 md:p-token-8 space-y-token-6 max-w-6xl">
      {/* Public Notices */}
      <NoticeBanner />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-token-2xl md:text-token-3xl font-display font-bold text-foreground">
          Assalamu Alaikum, {displayName} 👋
        </h1>
        <p className="text-token-sm text-muted-foreground mt-token-1">Here's your activity overview.</p>
      </motion.div>

      {/* Complete Profile Banner */}
      {!profile?.profile_completed && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-accent bg-accent/10">
            <CardContent className="p-token-4 flex items-center gap-token-4 flex-wrap">
              <FiClock className="text-accent-foreground flex-shrink-0 text-xl" />
              <div className="flex-1 min-w-0">
                <p className="text-token-sm font-medium text-foreground">Complete Your Profile</p>
                <p className="text-token-xs text-muted-foreground">Complete your profile to start receiving matches and interests.</p>
              </div>
              <Button variant="gold" size="sm" asChild>
                <Link to="/dashboard/create-profile">
                  Complete Now <FiArrowRight className="ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-token-4"
      >
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-token-4 flex items-center gap-token-3">
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="text-lg" />
              </div>
              <div>
                <p className="text-token-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-token-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Daily Usage Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardContent className="p-token-5">
            <div className="flex items-center justify-between mb-token-4">
              <div className="flex items-center gap-token-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FiZap className="text-primary text-sm" />
                </div>
                <h3 className="font-display text-token-base font-semibold text-foreground">Today's Activity</h3>
              </div>
              <span className="text-token-xs text-muted-foreground">Resets at midnight</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-token-4">
              {[
                { icon: FiMessageSquare, label: "Messages Sent", used: msgCount, limit: settings.daily_messages_limit ?? 0, color: "text-blue-500", to: "/dashboard/messages" },
                { icon: FiEye,           label: "Profiles Viewed", used: viewCount, limit: settings.daily_profile_views_limit ?? 0, color: "text-purple-500", to: "/dashboard/search" },
                { icon: FiHeart,         label: "Interests Sent",  used: interestCount, limit: settings.daily_interests_limit ?? 0, color: "text-rose-500", to: "/dashboard/interests" },
                { icon: FiStar,          label: "Favorites Added", used: favCount, limit: settings.daily_favorites_limit ?? 0, color: "text-amber-500", to: "/dashboard/favorites" },
              ].map(({ icon: Icon, label, used, limit, color, to }) => {
                const unlimited = !limit || limit === 0;
                const pct = unlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));
                const exceeded = !unlimited && used >= limit;
                const nearLimit = !unlimited && pct >= 80;
                return (
                  <Link key={label} to={to} className="group rounded-xl border border-border bg-muted/40 hover:bg-muted transition-colors p-token-3 flex flex-col gap-token-2">
                    <div className="flex items-center justify-between">
                      <Icon className={`text-sm ${color}`} />
                      {unlimited
                        ? <span className="text-token-xs text-muted-foreground font-bold" title="Unlimited">∞</span>
                        : <span className={`text-token-xs font-semibold ${exceeded ? "text-destructive" : nearLimit ? "text-amber-500" : "text-muted-foreground"}`}>
                            {used}/{limit}
                          </span>}
                    </div>
                    <p className="text-token-xs text-muted-foreground leading-token-snug">{label}</p>
                    {unlimited ? (
                      <div className="h-1.5 rounded-full bg-border" />
                    ) : (
                      <div className="h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${exceeded ? "bg-destructive" : nearLimit ? "bg-amber-400" : "bg-primary"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                    {exceeded && (
                      <p className="text-token-xs font-medium text-destructive">Limit reached</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Three Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-token-6">
        {/* Profile Completion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="h-full">
            <CardContent className="p-token-6">
              <div className="flex items-center justify-between mb-token-4">
                <h3 className="font-display text-token-lg font-semibold text-foreground">Profile</h3>
                <span className="text-token-sm font-bold text-primary">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2 mb-token-4" />
              <ul className="space-y-token-2">
                {profileChecklist.map((item) => (
                  <li key={item.label} className="flex items-center gap-token-2 text-token-sm">
                    {item.done
                      ? <FiCheckCircle className="text-primary text-base flex-shrink-0" />
                      : <FiAlertCircle className="text-muted-foreground text-base flex-shrink-0" />}
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" asChild className="w-full mt-token-4">
                <Link to="/dashboard/edit-profile">Complete Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Interests */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardContent className="p-token-6">
              <div className="flex items-center justify-between mb-token-4">
                <h3 className="font-display text-token-lg font-semibold text-foreground">Recent Interests</h3>
                <Link to="/dashboard/interests" className="text-token-xs text-primary font-medium hover:underline">View All</Link>
              </div>
              <div className="space-y-token-3">
                {recentInterests.length === 0 ? (
                  <p className="text-token-sm text-muted-foreground text-center py-token-4">
                    No interests yet. Complete your profile to get noticed!
                  </p>
                ) : (
                  recentInterests.map((interest) => (
                    <div key={interest.id} className="flex items-center gap-token-3 p-token-3 rounded-lg bg-muted">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-sm font-bold flex-shrink-0">
                        {interest.from_profile?.first_name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-token-sm font-medium text-foreground truncate">
                          {interest.from_profile?.first_name} {interest.from_profile?.last_name}
                        </p>
                        <p className="text-token-xs text-muted-foreground">{interest.from_profile?.city || "Unknown"}</p>
                      </div>
                      <span className={`text-token-xs px-token-2 py-token-1 rounded-full font-medium ${
                        interest.status === "accepted"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/20 text-accent-foreground"
                      }`}>
                        {interest.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Suggested Matches */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="h-full">
            <CardContent className="p-token-6">
              <div className="flex items-center justify-between mb-token-4">
                <h3 className="font-display text-token-lg font-semibold text-foreground">Suggested Matches</h3>
                <Link to="/dashboard/search" className="text-token-xs text-primary font-medium hover:underline">Search More</Link>
              </div>
              <div className="space-y-token-3">
                {suggestedMatches.length === 0 ? (
                  <p className="text-token-sm text-muted-foreground text-center py-token-4">
                    No matches yet. More users are joining every day!
                  </p>
                ) : (
                  suggestedMatches.map((match) => (
                    <div key={match.id} className="flex items-center gap-token-3 p-token-3 rounded-lg bg-muted">
                      <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-accent-foreground text-token-sm font-bold flex-shrink-0">
                        {match.first_name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-token-sm font-medium text-foreground truncate flex items-center gap-token-1">
                          {match.first_name} {match.last_name?.charAt(0)}.
                          {match.is_verified && <FiShield className="text-primary text-xs" />}
                        </p>
                        <p className="text-token-xs text-muted-foreground">{match.city || "Unknown"}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button variant="hero" size="sm" asChild className="w-full mt-token-4">
                <Link to="/dashboard/search">
                  <FiSearch className="mr-1 text-sm" /> Find Matches
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardContent className="p-token-6">
            <h3 className="font-display text-token-lg font-semibold text-foreground mb-token-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-token-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="action-card"
                >
                  <action.icon className="text-primary text-xl" />
                  <span className="text-token-xs font-medium text-foreground">{action.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
