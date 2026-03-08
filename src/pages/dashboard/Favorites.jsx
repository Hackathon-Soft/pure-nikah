import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiStar, FiMessageSquare, FiShield, FiMapPin, FiTrash2 } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Favorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("favorites")
        .select("*, profile:profiles(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: async (favoriteId) => {
      const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({ title: "Removed", description: "Profile removed from favorites." });
    },
  });

  return (
    <div className="p-token-4 md:p-token-8 max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-token-2xl font-display font-bold text-foreground flex items-center gap-token-2"><FiStar className="text-accent-foreground" /> Favorites</h1>
        <p className="text-muted-foreground text-token-sm mt-token-1">Profiles you've saved.</p>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="text-center py-token-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-token-4">
              <FiStar className="text-muted-foreground" style={{ fontSize: "var(--size-icon-lg)" }} />
            </div>
            <h3 className="font-display text-token-lg font-semibold text-foreground mb-token-1">No Favorites Yet</h3>
            <p className="text-token-sm text-muted-foreground">Browse profiles and save your favorites for easy access.</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-4">
          {favorites.map((f, i) => {
            const p = f.profile;
            return (
              <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-elevated transition-shadow"><CardContent className="p-token-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-xl font-bold mx-auto mb-token-3">{p?.first_name?.charAt(0) || "?"}</div>
                  <p className="font-display text-token-lg font-semibold text-foreground flex items-center justify-center gap-token-1">{p?.first_name} {p?.last_name?.charAt(0)}.{p?.is_verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}</p>
                  <p className="text-token-sm text-muted-foreground">{p?.caste || "N/A"}</p>
                  <p className="text-token-xs text-muted-foreground flex items-center justify-center gap-token-1 mt-token-1"><FiMapPin style={{ fontSize: "var(--text-xs)" }} /> {p?.city || "Unknown"}</p>
                  <div className="flex gap-token-2 mt-token-4">
                    <Button variant="hero" size="sm" className="flex-1"><FiMessageSquare className="mr-1" /> Message</Button>
                    <Button variant="outline" size="sm" onClick={() => removeMutation.mutate(f.id)}><FiTrash2 /></Button>
                  </div>
                </CardContent></Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
