import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  FiUser, FiHeart, FiMessageSquare, FiShield,
  FiSearch, FiStar, FiAlertCircle, FiCheckCircle,
  FiClock, FiEye, FiArrowRight, FiZap, FiInfinity,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { usePlatformSettings, useDailyUsage } from "@/hooks/usePlatformLimits";

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
    <div className="p-4 md:p-8 space-y-6 max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Assalamu Alaikum, {displayName} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here's your activity overview.</p>
      </motion.div>

      {/* Complete Profile Banner */}
      {!profile?.profile_completed && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-accent bg-accent/10">
            <CardContent className="p-4 flex items-center gap-4 flex-wrap">
              <FiClock className="text-accent-foreground flex-shrink-0 text-xl" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Complete Your Profile</p>
                <p className="text-xs text-muted-foreground">Complete your profile to start receiving matches and interests.</p>
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
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Three Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Completion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Profile</h3>
                <span className="text-sm font-bold text-primary">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2 mb-4" />
              <ul className="space-y-2">
                {profileChecklist.map((item) => (
                  <li key={item.label} className="flex items-center gap-2 text-sm">
                    {item.done
                      ? <FiCheckCircle className="text-primary text-base flex-shrink-0" />
                      : <FiAlertCircle className="text-muted-foreground text-base flex-shrink-0" />}
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" asChild className="w-full mt-4">
                <Link to="/dashboard/edit-profile">Complete Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Interests */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Recent Interests</h3>
                <Link to="/dashboard/interests" className="text-xs text-primary font-medium hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {recentInterests.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No interests yet. Complete your profile to get noticed!
                  </p>
                ) : (
                  recentInterests.map((interest) => (
                    <div key={interest.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                        {interest.from_profile?.first_name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {interest.from_profile?.first_name} {interest.from_profile?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{interest.from_profile?.city || "Unknown"}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
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
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Suggested Matches</h3>
                <Link to="/dashboard/search" className="text-xs text-primary font-medium hover:underline">Search More</Link>
              </div>
              <div className="space-y-3">
                {suggestedMatches.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No matches yet. More users are joining every day!
                  </p>
                ) : (
                  suggestedMatches.map((match) => (
                    <div key={match.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-accent-foreground text-sm font-bold flex-shrink-0">
                        {match.first_name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate flex items-center gap-1">
                          {match.first_name} {match.last_name?.charAt(0)}.
                          {match.is_verified && <FiShield className="text-primary text-xs" />}
                        </p>
                        <p className="text-xs text-muted-foreground">{match.city || "Unknown"}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button variant="hero" size="sm" asChild className="w-full mt-4">
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
          <CardContent className="p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted hover:bg-primary/5 transition-colors text-center"
                >
                  <action.icon className="text-primary text-xl" />
                  <span className="text-xs font-medium text-foreground">{action.label}</span>
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
