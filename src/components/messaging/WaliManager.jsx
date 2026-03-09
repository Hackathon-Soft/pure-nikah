import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiUserPlus, FiUsers, FiX, FiCheck, FiClock } from "react-icons/fi";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const WaliManager = ({ conversationId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { data: walis = [] } = useQuery({
    queryKey: ["wali-participants", conversationId],
    queryFn: async () => {
      const { data } = await supabase
        .from("wali_participants")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!conversationId,
  });

  const inviteMutation = useMutation({
    mutationFn: async (waliEmail) => {
      const trimmedEmail = waliEmail.trim().toLowerCase();
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        throw new Error("Please enter a valid email address");
      }
      const { error } = await supabase.from("wali_participants").insert({
        conversation_id: conversationId,
        wali_email: trimmedEmail,
        invited_by: user.id,
      });
      if (error) {
        if (error.message?.includes("duplicate")) {
          throw new Error("This Wali is already invited");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wali-participants", conversationId] });
      setEmail("");
      toast({ title: "Wali invited", description: "They will be notified when they sign up or log in." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("wali_participants")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wali-participants", conversationId] });
      toast({ title: "Removed", description: "Wali has been removed from this conversation." });
    },
  });

  const handleInvite = (e) => {
    e.preventDefault();
    if (email.trim()) {
      inviteMutation.mutate(email);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <FiCheck className="text-green-500" />;
      case "declined":
        return <FiX className="text-destructive" />;
      default:
        return <FiClock className="text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <FiUsers className="text-primary" />
          Wali
          {walis.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
              {walis.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiUsers className="text-primary" />
            Wali / Chaperone
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-token-xs text-muted-foreground">
            Invite a trusted guardian (Wali) to view this conversation for Shariah compliance and peace of mind.
            They'll be able to read all messages in this conversation.
          </p>

          <form onSubmit={handleInvite} className="flex gap-2">
            <Input
              type="email"
              placeholder="Wali's email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              maxLength={255}
            />
            <Button type="submit" size="sm" disabled={inviteMutation.isPending || !email.trim()}>
              <FiUserPlus className="mr-1" /> Invite
            </Button>
          </form>

          {walis.length > 0 && (
            <div className="space-y-2">
              <p className="text-token-xs font-medium text-foreground">Invited Walis</p>
              <div className="space-y-2">
                {walis.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(w.status)}
                      <span className="text-token-sm">{w.wali_email}</span>
                      <Badge
                        variant={w.status === "accepted" ? "default" : "secondary"}
                        className="text-[10px] capitalize"
                      >
                        {w.status}
                      </Badge>
                    </div>
                    {w.invited_by === user?.id && w.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMutation.mutate(w.id)}
                        className="h-6 w-6 p-0 hover:text-destructive"
                      >
                        <FiX className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {walis.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-token-xs">
              No Wali invited yet. Add a guardian's email to include them.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaliManager;
