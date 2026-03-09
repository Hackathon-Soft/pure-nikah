import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Fetch all platform settings
const fetchSettings = async () => {
  const { data, error } = await supabase
    .from("platform_settings")
    .select("key, value");
  if (error) throw error;
  const map = {};
  for (const row of data || []) {
    map[row.key] = typeof row.value === "number" ? row.value : Number(row.value);
  }
  return map;
};

export const usePlatformSettings = () => {
  return useQuery({
    queryKey: ["platform_settings"],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

// Check how many messages user sent today
const countTodayMessages = async (userId) => {
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("sender_id", userId)
    .gte("created_at", startOfToday());
  return count || 0;
};

// Check how many profile views user made today
const countTodayProfileViews = async (userId) => {
  const { count } = await supabase
    .from("profile_views")
    .select("*", { count: "exact", head: true })
    .eq("viewer_id", userId)
    .gte("created_at", startOfToday());
  return count || 0;
};

// Check how many interests user sent today
const countTodayInterests = async (userId) => {
  const { count } = await supabase
    .from("interests")
    .select("*", { count: "exact", head: true })
    .eq("from_user_id", userId)
    .gte("created_at", startOfToday());
  return count || 0;
};

// Check how many favorites user added today
const countTodayFavorites = async (userId) => {
  const { count } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfToday());
  return count || 0;
};

export const useDailyUsage = () => {
  const { user } = useAuth();

  const { data: msgCount = 0, refetch: refetchMsg } = useQuery({
    queryKey: ["usage_messages", user?.id],
    queryFn: () => countTodayMessages(user.id),
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  const { data: viewCount = 0, refetch: refetchViews } = useQuery({
    queryKey: ["usage_views", user?.id],
    queryFn: () => countTodayProfileViews(user.id),
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  const { data: interestCount = 0, refetch: refetchInterests } = useQuery({
    queryKey: ["usage_interests", user?.id],
    queryFn: () => countTodayInterests(user.id),
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  const { data: favCount = 0, refetch: refetchFavs } = useQuery({
    queryKey: ["usage_favorites", user?.id],
    queryFn: () => countTodayFavorites(user.id),
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  return {
    msgCount,
    viewCount,
    interestCount,
    favCount,
    refetchMsg,
    refetchViews,
    refetchInterests,
    refetchFavs,
  };
};
