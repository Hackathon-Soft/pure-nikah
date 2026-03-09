import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiSend, FiShield, FiAlertTriangle } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePlatformSettings, useDailyUsage } from "@/hooks/usePlatformLimits";
import LimitBanner from "@/components/LimitBanner";
import { toast } from "sonner";

const Messages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [lastSentAt, setLastSentAt] = useState(null);
  const messagesEndRef = useRef(null);

  const { data: settings = {} } = usePlatformSettings();
  const { msgCount, refetchMsg } = useDailyUsage();

  const dailyLimit = settings.daily_messages_limit ?? 0;
  const cooldownSec = settings.message_cooldown_seconds ?? 5;
  const limitReached = dailyLimit > 0 && msgCount >= dailyLimit;

  // Cooldown state
  const [cooldownLeft, setCooldownLeft] = useState(0);
  useEffect(() => {
    if (!lastSentAt || cooldownSec <= 0) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - lastSentAt) / 1000;
      const left = Math.max(0, Math.ceil(cooldownSec - elapsed));
      setCooldownLeft(left);
      if (left === 0) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, [lastSentAt, cooldownSec]);

  // Fetch conversations with other user's profile
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("last_message_at", { ascending: false });

      if (!data) return [];

      const enriched = await Promise.all(data.map(async (c) => {
        const otherId = c.user1_id === user.id ? c.user2_id : c.user1_id;
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name, is_verified")
          .eq("user_id", otherId)
          .single();
        return { ...c, otherProfile: profile, otherUserId: otherId };
      }));
      return enriched;
    },
    enabled: !!user,
  });

  const selected = conversations.find(c => c.id === selectedId) || conversations[0];

  // Fetch messages for selected conversation
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", selected?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selected.id)
        .order("created_at", { ascending: true });
      return data || [];
    },
    enabled: !!selected?.id,
  });

  // Realtime subscription for new messages
  useEffect(() => {
    if (!selected?.id) return;
    const channel = supabase
      .channel(`messages-${selected.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selected.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["messages", selected.id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selected?.id, queryClient]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: async (content) => {
      // Insert message first
      const { data: newMessage, error } = await supabase.from("messages").insert({
        conversation_id: selected.id,
        sender_id: user.id,
        content,
      }).select().single();
      if (error) throw error;
      
      // Update conversation
      await supabase.from("conversations").update({
        last_message: content,
        last_message_at: new Date().toISOString(),
      }).eq("id", selected.id);

      // Trigger AI moderation in background (don't block on it)
      supabase.functions.invoke("moderate-message", {
        body: {
          messageId: newMessage.id,
          conversationId: selected.id,
          senderId: user.id,
          content,
        },
      }).catch(err => console.warn("Moderation check failed:", err));

      return newMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selected?.id] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      refetchMsg();
      setNewMsg("");
      setLastSentAt(Date.now());
      setCooldownLeft(cooldownSec);
    },
  });

  const handleSend = () => {
    if (!newMsg.trim() || !selected) return;

    if (limitReached) {
      toast.error(`Daily message limit of ${dailyLimit} reached. Try again tomorrow.`);
      return;
    }
    if (cooldownLeft > 0) {
      toast.warning(`Please wait ${cooldownLeft}s before sending another message.`);
      return;
    }
    sendMutation.mutate(newMsg.trim());
  };

  const isSendDisabled = sendMutation.isPending || limitReached || cooldownLeft > 0;

  if (conversations.length === 0) {
    return (
      <div className="flex h-[calc(100vh-var(--size-navbar))] items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-token-lg font-display font-semibold text-foreground">No Conversations Yet</p>
          <p className="text-token-sm text-muted-foreground">When you have a mutual interest, you can start messaging.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--size-navbar))]">
      {/* Limit banner at top */}
      {dailyLimit > 0 && (
        <div className="px-4 pt-3 pb-0">
          <LimitBanner label="Messages" used={msgCount} limit={dailyLimit} icon={FiSend} />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r border-border bg-card flex-shrink-0 hidden md:flex flex-col">
          <div className="p-token-4 border-b border-border"><h2 className="font-display text-token-lg font-semibold text-foreground">Messages</h2></div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <button key={c.id} onClick={() => setSelectedId(c.id)} className={`w-full text-left p-token-4 border-b border-border hover:bg-muted transition-colors flex gap-token-3 ${selected?.id === c.id ? "bg-primary/5" : ""}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-sm font-bold flex-shrink-0">{c.otherProfile?.first_name?.charAt(0) || "?"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between"><p className="text-token-sm font-medium text-foreground truncate flex items-center gap-token-1">{c.otherProfile?.first_name || "User"}{c.otherProfile?.is_verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}</p></div>
                  <p className="text-token-xs text-muted-foreground truncate">{c.last_message || "No messages yet"}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-token-4 border-b border-border bg-card flex items-center gap-token-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-xs font-bold">{selected?.otherProfile?.first_name?.charAt(0) || "?"}</div>
            <div><p className="text-token-sm font-medium text-foreground flex items-center gap-token-1">{selected?.otherProfile?.first_name || "User"}{selected?.otherProfile?.is_verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}</p></div>
          </div>
          <div className="flex-1 overflow-y-auto p-token-4 space-y-3">
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-token-4 py-token-3 ${msg.sender_id === user.id ? "bg-gradient-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                  <p className="text-token-sm">{msg.content}</p>
                  <p className={`text-token-xs mt-token-1 ${msg.sender_id === user.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Limit / cooldown warning */}
          {(limitReached || cooldownLeft > 0) && (
            <div className="px-token-4 pb-2">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${limitReached ? "bg-destructive/10 text-destructive border border-destructive/30" : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"}`}>
                <FiAlertTriangle className="flex-shrink-0" />
                {limitReached
                  ? `Daily message limit (${dailyLimit}) reached. Come back tomorrow.`
                  : `Please wait ${cooldownLeft}s before sending again.`}
              </div>
            </div>
          )}

          <div className="p-token-4 border-t border-border bg-card">
            <div className="flex gap-token-3">
              <Input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder={limitReached ? "Daily limit reached" : "Type a message..."}
                className="flex-1"
                disabled={isSendDisabled && cooldownLeft === 0 && limitReached}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button variant="hero" size="icon" onClick={handleSend} disabled={isSendDisabled} title={cooldownLeft > 0 ? `Wait ${cooldownLeft}s` : limitReached ? "Limit reached" : "Send"}>
                {cooldownLeft > 0
                  ? <span className="text-xs font-bold">{cooldownLeft}</span>
                  : <FiSend style={{ fontSize: "var(--size-icon)" }} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
