import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiLock, FiEye, FiCheck, FiX, FiClock } from "react-icons/fi";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/**
 * Determines if photos should be visible based on:
 * - Privacy setting (public/blur_until_accepted/private)
 * - Match status (interests accepted mutually)
 * - Photo access granted
 */
export const usePhotoAccess = (profileOwnerId, photoPrivacy) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  // Check if there's mutual interest (match)
  const { data: isMatched } = useQuery({
    queryKey: ["mutual-match", profileOwnerId, user?.id],
    queryFn: async () => {
      if (!user || user.id === profileOwnerId) return true;
      // Check if both parties have accepted interests
      const { data } = await supabase
        .from("interests")
        .select("*")
        .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${profileOwnerId}),and(from_user_id.eq.${profileOwnerId},to_user_id.eq.${user.id})`)
        .eq("status", "accepted");
      // Both directions must exist and be accepted
      const sentAccepted = data?.some(i => i.from_user_id === user.id && i.to_user_id === profileOwnerId);
      const receivedAccepted = data?.some(i => i.from_user_id === profileOwnerId && i.to_user_id === user.id);
      return sentAccepted && receivedAccepted;
    },
    enabled: isAuthenticated && !!profileOwnerId && profileOwnerId !== user?.id,
  });

  // Check photo access request status
  const { data: accessRequest } = useQuery({
    queryKey: ["photo-access", profileOwnerId, user?.id],
    queryFn: async () => {
      if (!user || user.id === profileOwnerId) return null;
      const { data } = await supabase
        .from("photo_access_requests")
        .select("*")
        .eq("requester_id", user.id)
        .eq("profile_owner_id", profileOwnerId)
        .maybeSingle();
      return data;
    },
    enabled: isAuthenticated && !!profileOwnerId && profileOwnerId !== user?.id,
  });

  // Determine visibility
  const getVisibility = () => {
    // Owner always sees their own photos
    if (!user || user.id === profileOwnerId) return "visible";
    
    switch (photoPrivacy) {
      case "public":
        return "visible";
      case "blur_until_accepted":
        if (isMatched) return "visible";
        if (accessRequest?.status === "approved") return "visible";
        return "blurred";
      case "private":
        if (accessRequest?.status === "approved") return "visible";
        return "hidden";
      default:
        return "blurred";
    }
  };

  return {
    visibility: getVisibility(),
    isMatched,
    accessRequest,
    canRequestAccess: isAuthenticated && photoPrivacy !== "public" && !isMatched && (!accessRequest || accessRequest.status === "rejected"),
    requestPending: accessRequest?.status === "pending",
    requestApproved: accessRequest?.status === "approved",
    requestRejected: accessRequest?.status === "rejected",
  };
};

/**
 * Protected photo display with blur/hide and request access
 */
export const ProtectedPhoto = ({
  src,
  alt,
  className = "",
  profileOwnerId,
  photoPrivacy = "blur_until_accepted",
  showRequestButton = true,
  fallbackInitial,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { visibility, canRequestAccess, requestPending } = usePhotoAccess(profileOwnerId, photoPrivacy);

  const requestAccessMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("photo_access_requests").insert({
        requester_id: user.id,
        profile_owner_id: profileOwnerId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photo-access", profileOwnerId] });
      toast({ title: "Request sent", description: "The user will be notified of your photo access request." });
    },
    onError: (err) => {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    },
  });

  if (visibility === "hidden") {
    return (
      <div className={`relative bg-muted flex flex-col items-center justify-center ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
        <FiLock className="text-muted-foreground z-10" style={{ fontSize: "var(--size-icon-xl)" }} />
        <p className="text-token-xs text-muted-foreground mt-2 z-10 text-center px-4">Photos are private</p>
        {showRequestButton && canRequestAccess && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 z-10"
            onClick={() => requestAccessMutation.mutate()}
            disabled={requestAccessMutation.isPending}
          >
            <FiEye className="mr-1" /> Request Access
          </Button>
        )}
        {requestPending && (
          <Badge variant="secondary" className="mt-3 z-10">
            <FiClock className="mr-1" /> Request Pending
          </Badge>
        )}
      </div>
    );
  }

  if (visibility === "blurred") {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover blur-xl scale-110" />
        ) : fallbackInitial ? (
          <div className="w-full h-full bg-gradient-primary flex items-center justify-center blur-lg">
            <span className="text-4xl font-bold text-primary-foreground">{fallbackInitial}</span>
          </div>
        ) : (
          <div className="w-full h-full bg-muted blur-lg" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <FiEye className="text-white drop-shadow-lg" style={{ fontSize: "var(--size-icon-lg)" }} />
          <p className="text-token-xs text-white drop-shadow mt-2 text-center px-4">
            Photo blurred until match
          </p>
          {showRequestButton && canRequestAccess && (
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => requestAccessMutation.mutate()}
              disabled={requestAccessMutation.isPending}
            >
              <FiEye className="mr-1" /> Request to View
            </Button>
          )}
          {requestPending && (
            <Badge variant="secondary" className="mt-3 bg-white/90 text-foreground">
              <FiClock className="mr-1" /> Request Pending
            </Badge>
          )}
        </div>
      </div>
    );
  }

  // Visible
  return src ? (
    <img src={src} alt={alt} className={`object-cover ${className}`} />
  ) : fallbackInitial ? (
    <div className={`bg-gradient-primary flex items-center justify-center ${className}`}>
      <span className="text-4xl font-bold text-primary-foreground">{fallbackInitial}</span>
    </div>
  ) : (
    <div className={`bg-muted ${className}`} />
  );
};

/**
 * Dashboard component to manage incoming photo access requests
 */
export const PhotoAccessRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["incoming-photo-requests", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("photo_access_requests")
        .select("*")
        .eq("profile_owner_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      
      if (!data?.length) return [];
      
      // Get requester profiles
      const requesterIds = data.map(r => r.requester_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, city")
        .in("user_id", requesterIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      return data.map(r => ({ ...r, requester: profileMap.get(r.requester_id) }));
    },
    enabled: !!user?.id,
  });

  const respondMutation = useMutation({
    mutationFn: async ({ requestId, approved }) => {
      const { error } = await supabase
        .from("photo_access_requests")
        .update({
          status: approved ? "approved" : "rejected",
          responded_at: new Date().toISOString(),
        })
        .eq("id", requestId);
      if (error) throw error;
    },
    onSuccess: (_, { approved }) => {
      queryClient.invalidateQueries({ queryKey: ["incoming-photo-requests"] });
      toast({ title: approved ? "Access granted" : "Request declined" });
    },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;
  if (requests.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-token-sm font-semibold text-foreground flex items-center gap-2">
        <FiEye className="text-primary" /> Photo Access Requests ({requests.length})
      </h3>
      {requests.map((req) => (
        <div key={req.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <p className="text-token-sm font-medium text-foreground">
              {req.requester?.first_name || "Someone"} {req.requester?.last_name?.charAt(0) || ""}.
            </p>
            <p className="text-token-xs text-muted-foreground">
              {req.requester?.city || "Unknown location"} • {new Date(req.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => respondMutation.mutate({ requestId: req.id, approved: true })}
              disabled={respondMutation.isPending}
            >
              <FiCheck className="mr-1" /> Grant
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => respondMutation.mutate({ requestId: req.id, approved: false })}
              disabled={respondMutation.isPending}
            >
              <FiX className="mr-1" /> Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
