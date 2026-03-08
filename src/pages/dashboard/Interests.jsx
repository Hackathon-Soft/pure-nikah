import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiHeart, FiX, FiCheck, FiShield, FiMapPin, FiMessageSquare, FiClock, FiUser } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const statusStyle = {
  accepted: "bg-primary/10 text-primary",
  pending: "bg-accent/20 text-accent-foreground",
  rejected: "bg-destructive/10 text-destructive",
};

const InterestCard = ({ person, actions, badge }) => (
  <Card className="hover:shadow-card transition-shadow">
    <CardContent className="p-token-4 flex items-center gap-token-4 flex-wrap">
      <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-lg font-bold flex-shrink-0">
        {person.first_name?.charAt(0) || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-token-sm font-semibold text-foreground flex items-center gap-token-1 flex-wrap">
          {person.first_name} {person.last_name?.charAt(0)}.
          {person.is_verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}
        </p>
        <p className="text-token-xs text-muted-foreground">{person.caste || "N/A"}</p>
        <p className="text-token-xs text-muted-foreground flex items-center gap-token-1 mt-0.5">
          <FiMapPin style={{ fontSize: "10px" }} /> {person.city || "Unknown"}
        </p>
      </div>
      <div className="flex flex-col items-end gap-token-2">
        {badge}
        <div className="flex gap-token-2">{actions}</div>
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ icon: Icon, title, desc }) => (
  <div className="text-center py-token-12">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-token-4">
      <Icon className="text-muted-foreground" style={{ fontSize: "var(--size-icon-lg)" }} />
    </div>
    <h3 className="font-display text-token-lg font-semibold text-foreground mb-token-1">{title}</h3>
    <p className="text-token-sm text-muted-foreground">{desc}</p>
  </div>
);

const Interests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: received = [] } = useQuery({
    queryKey: ["interests-received", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("interests")
        .select("*, from_profile:profiles!interests_from_user_id_fkey(*)")
        .eq("to_user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      return (data || []).map(i => ({ ...i, ...i.from_profile }));
    },
    enabled: !!user,
  });

  const { data: sent = [] } = useQuery({
    queryKey: ["interests-sent", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("interests")
        .select("*, to_profile:profiles!interests_to_user_id_fkey(*)")
        .eq("from_user_id", user.id)
        .order("created_at", { ascending: false });
      return (data || []).map(i => ({ ...i, ...i.to_profile, interestStatus: i.status }));
    },
    enabled: !!user,
  });

  const { data: mutual = [] } = useQuery({
    queryKey: ["interests-mutual", user?.id],
    queryFn: async () => {
      // Find accepted interests where user is involved
      const { data } = await supabase
        .from("interests")
        .select("*, from_profile:profiles!interests_from_user_id_fkey(*), to_profile:profiles!interests_to_user_id_fkey(*)")
        .eq("status", "accepted")
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`);
      return (data || []).map(i => {
        const otherProfile = i.from_user_id === user.id ? i.to_profile : i.from_profile;
        return { ...i, ...otherProfile };
      });
    },
    enabled: !!user,
  });

  const respondMutation = useMutation({
    mutationFn: async ({ interestId, status }) => {
      const { error } = await supabase.from("interests").update({ status }).eq("id", interestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests-received"] });
      queryClient.invalidateQueries({ queryKey: ["interests-mutual"] });
      toast({ title: "Updated!", description: "Interest response saved." });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (interestId) => {
      const { error } = await supabase.from("interests").delete().eq("id", interestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests-sent"] });
      toast({ title: "Withdrawn", description: "Interest withdrawn successfully." });
    },
  });

  return (
    <div className="p-token-4 md:p-token-8 max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title flex items-center gap-token-2">
          <FiHeart className="text-destructive" /> Interests
        </h1>
        <p className="page-subtitle">Manage your received, sent, and mutual interests.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-token-4">
        {[
          { label: "Received", value: received.length, color: "text-destructive" },
          { label: "Sent", value: sent.length, color: "text-primary" },
          { label: "Mutual", value: mutual.length, color: "text-accent-foreground" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-token-4 text-center">
              <p className={`text-token-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-token-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-token-4">
            <TabsTrigger value="received">Received ({received.length})</TabsTrigger>
            <TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger>
            <TabsTrigger value="mutual">Mutual ({mutual.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-3">
            {received.length === 0 ? (
              <EmptyState icon={FiHeart} title="No interests yet" desc="When someone sends you an interest, it will appear here." />
            ) : received.map((r) => (
              <InterestCard key={r.id} person={r} actions={
                <>
                  <Button variant="hero" size="sm" onClick={() => respondMutation.mutate({ interestId: r.id, status: "accepted" })}><FiCheck className="mr-1" /> Accept</Button>
                  <Button variant="outline" size="sm" onClick={() => respondMutation.mutate({ interestId: r.id, status: "rejected" })}><FiX className="mr-1" /> Decline</Button>
                </>
              } />
            ))}
          </TabsContent>

          <TabsContent value="sent" className="space-y-3">
            {sent.length === 0 ? (
              <EmptyState icon={FiHeart} title="No sent interests" desc="Search for profiles and send interests to get started." />
            ) : sent.map((s) => (
              <InterestCard key={s.id} person={s}
                badge={<span className={`text-token-xs px-token-2 py-0.5 rounded-full font-medium capitalize ${statusStyle[s.interestStatus]}`}>{s.interestStatus}</span>}
                actions={s.interestStatus === "pending" && (
                  <Button variant="outline" size="sm" onClick={() => withdrawMutation.mutate(s.id)}><FiX className="mr-1" /> Withdraw</Button>
                )}
              />
            ))}
          </TabsContent>

          <TabsContent value="mutual" className="space-y-3">
            {mutual.length === 0 ? (
              <EmptyState icon={FiHeart} title="No mutual interests" desc="When both you and someone else accept each other's interest, it becomes mutual." />
            ) : mutual.map((m) => (
              <InterestCard key={m.id} person={m} actions={
                <Button variant="hero" size="sm"><FiMessageSquare className="mr-1" /> Message</Button>
              } />
            ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Interests;
