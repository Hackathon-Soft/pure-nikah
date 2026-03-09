import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiEye, FiShield, FiMapPin, FiHeart, FiClock } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getDisplayName } from "@/lib/displayName.js";

const WhoViewedMe = () => {
  const { user } = useAuth();

  const { data: viewers = [], isLoading } = useQuery({
    queryKey: ["who-viewed-me", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profile_views")
        .select("*, viewer:profiles!profile_views_viewer_id_fkey(first_name, last_name, display_name, city, caste, is_verified, date_of_birth, gender)")
        .eq("viewed_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      return data || [];
    },
    enabled: !!user,
  });

  // Group by viewer to count views
  const viewerMap = new Map();
  viewers.forEach((v) => {
    const key = v.viewer_id;
    if (viewerMap.has(key)) {
      viewerMap.get(key).viewCount++;
    } else {
      viewerMap.set(key, { ...v, viewCount: 1 });
    }
  });
  const uniqueViewers = Array.from(viewerMap.values());

  const getAge = (dob) => {
    if (!dob) return null;
    return Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000);
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  // Stats
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = todayStart - 6 * 86400000;
  const monthStart = todayStart - 29 * 86400000;

  const todayCount = viewers.filter((v) => new Date(v.created_at).getTime() >= todayStart).length;
  const weekCount = viewers.filter((v) => new Date(v.created_at).getTime() >= weekStart).length;
  const monthCount = viewers.length;

  return (
    <div className="p-token-4 md:p-token-8 max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title flex items-center gap-token-2">
          <FiEye className="text-primary" /> Who Viewed Me
        </h1>
        <p className="page-subtitle">{uniqueViewers.length} people viewed your profile recently.</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-token-4">
        {[
          { label: "Today", value: todayCount },
          { label: "This Week", value: weekCount },
          { label: "This Month", value: monthCount },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-token-4 text-center">
              <p className="text-token-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-token-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Viewers List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : uniqueViewers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FiEye className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-token-lg font-medium text-foreground">No visitors yet</p>
            <p className="text-token-sm text-muted-foreground">
              Complete your profile and stay active to get more views.
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          {uniqueViewers.map((v, i) => {
            const age = getAge(v.viewer?.date_of_birth);
            return (
              <motion.div key={v.viewer_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.03 }}>
                <Card className="hover:shadow-card transition-shadow">
                  <CardContent className="p-token-4 flex items-center gap-token-4 flex-wrap">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-lg font-bold flex-shrink-0">
                      {getDisplayName(v.viewer).charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-token-sm font-semibold text-foreground flex items-center gap-token-1">
                        {getDisplayName(v.viewer)}
                        {v.viewer?.is_verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}
                      </p>
                      <p className="text-token-xs text-muted-foreground">
                        {age ? `${age} yrs` : ""}{age && v.viewer?.caste ? " • " : ""}{v.viewer?.caste || ""}
                      </p>
                      <p className="text-token-xs text-muted-foreground flex items-center gap-token-1 mt-0.5">
                        <FiMapPin style={{ fontSize: "10px" }} /> {v.viewer?.city || "Unknown"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-token-2">
                      <p className="text-token-xs text-muted-foreground flex items-center gap-token-1">
                        <FiClock style={{ fontSize: "10px" }} /> {timeAgo(v.created_at)}
                      </p>
                      {v.viewCount > 1 && (
                        <span className="text-token-xs text-muted-foreground">Viewed {v.viewCount} times</span>
                      )}
                      <Button variant="hero" size="sm" asChild>
                        <Link to={`/profile/${v.viewer_id}`}>
                          <FiHeart className="mr-1" /> View Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default WhoViewedMe;
