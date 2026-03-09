import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiSettings, FiLock, FiBell, FiEye, FiTrash2, FiShield, FiUser } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import PhoneVerification from "@/components/verification/PhoneVerification";

const Settings = () => {
  const { signOut, user, profile, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [photoPrivacy, setPhotoPrivacy] = useState(profile?.photo_privacy || "blur_until_accepted");
  const [showInSearch, setShowInSearch] = useState(profile?.show_in_search ?? true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(profile?.show_online_status ?? false);
  const [allowNonVerifiedViews, setAllowNonVerifiedViews] = useState(profile?.allow_non_verified_views ?? false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setPhotoPrivacy(profile.photo_privacy || "blur_until_accepted");
      setShowInSearch(profile.show_in_search ?? true);
      setShowOnlineStatus(profile.show_online_status ?? false);
      setAllowNonVerifiedViews(profile.allow_non_verified_views ?? false);
    }
  }, [profile]);

  const handleSavePrivacy = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName || null,
          photo_privacy: photoPrivacy,
          show_in_search: showInSearch,
          show_online_status: showOnlineStatus,
          allow_non_verified_views: allowNonVerifiedViews,
        })
        .eq("user_id", user.id);
      if (error) throw error;
      await fetchProfile(user.id);
      toast({ title: "Settings saved", description: "Your privacy preferences have been updated." });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    toast({ title: "Not available", description: "Account deletion requires admin approval. Please contact support.", variant: "destructive" });
  };

  return (
    <div className="p-token-4 md:p-token-8 max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title flex items-center gap-token-2"><FiSettings className="text-primary" /> Settings</h1>
      </motion.div>

      {/* Anonymity / Display Name */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card><CardContent className="p-token-6 space-y-5">
          <h2 className="card-section-title flex items-center gap-token-2"><FiUser className="text-primary" /> Display Name & Anonymity</h2>
          <p className="text-token-xs text-muted-foreground">Use a nickname to remain anonymous to other users. Your real name will only be shared when you choose.</p>
          <div>
            <Label className="text-token-sm text-foreground">Display Name / Nickname</Label>
            <Input 
              placeholder="e.g. Noor, SeekingPious, etc." 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              className="mt-token-1 max-w-sm" 
            />
            <p className="text-token-xs text-muted-foreground mt-token-1">Leave empty to use your real first name</p>
          </div>
        </CardContent></Card>
      </motion.div>

      {/* Photo Privacy */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Card><CardContent className="p-token-6 space-y-5">
          <h2 className="card-section-title flex items-center gap-token-2"><FiShield className="text-primary" /> Photo Privacy</h2>
          <p className="text-token-xs text-muted-foreground">Control who can see your photos. This is especially important for sisters.</p>
          <div>
            <Label className="text-token-sm text-foreground">Photo Visibility</Label>
            <Select value={photoPrivacy} onValueChange={setPhotoPrivacy}>
              <SelectTrigger className="mt-token-1 max-w-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public — visible to all verified users</SelectItem>
                <SelectItem value="blur_until_accepted">Blurred — clear only after interest accepted</SelectItem>
                <SelectItem value="private">Hidden — only you can see your photos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent></Card>
      </motion.div>

      {/* Privacy Toggles */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card><CardContent className="p-token-6 space-y-5">
          <h2 className="card-section-title flex items-center gap-token-2"><FiEye className="text-primary" /> Profile Visibility</h2>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-token-sm text-foreground">Show profile in search results</Label>
              <p className="text-token-xs text-muted-foreground">If disabled, your profile won't appear in searches</p>
            </div>
            <Switch checked={showInSearch} onCheckedChange={setShowInSearch} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-token-sm text-foreground">Show online status</Label>
              <p className="text-token-xs text-muted-foreground">Let others see when you're active</p>
            </div>
            <Switch checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-token-sm text-foreground">Allow profile viewing by non-verified users</Label>
              <p className="text-token-xs text-muted-foreground">If disabled, only verified users can view your full profile</p>
            </div>
            <Switch checked={allowNonVerifiedViews} onCheckedChange={setAllowNonVerifiedViews} />
          </div>
          <Button variant="hero" onClick={handleSavePrivacy} disabled={saving}>
            {saving ? "Saving..." : "Save Privacy Settings"}
          </Button>
        </CardContent></Card>
      </motion.div>

      {/* Screenshot Protection Notice */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Card className="border-primary/30 bg-primary/5"><CardContent className="p-token-6 space-y-3">
          <h2 className="card-section-title flex items-center gap-token-2"><FiShield className="text-primary" /> Screenshot Protection</h2>
          <p className="text-token-sm text-muted-foreground">
            PureNikah applies screenshot protection on profile photos and sensitive information. While no system can prevent all methods, we use CSS-based protections to discourage casual screenshotting.
          </p>
        </CardContent></Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card><CardContent className="p-token-6 space-y-5">
          <h2 className="card-section-title flex items-center gap-token-2"><FiBell className="text-primary" /> Notifications</h2>
          {[{ label: "New interest notifications", defaultChecked: true },{ label: "Message notifications", defaultChecked: true },{ label: "Profile view alerts", defaultChecked: false },{ label: "Verification reminders", defaultChecked: true }].map((item) => (
            <div key={item.label} className="flex items-center justify-between"><Label className="text-token-sm text-foreground">{item.label}</Label><Switch defaultChecked={item.defaultChecked} /></div>
          ))}
        </CardContent></Card>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card><CardContent className="p-token-6 space-y-4">
          <h2 className="card-section-title flex items-center gap-token-2"><FiLock className="text-primary" /> Security</h2>
          <Button variant="outline" onClick={() => navigate("/forgot-password")}>Change Password</Button>
        </CardContent></Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="border-destructive/30"><CardContent className="p-token-6 space-y-4">
          <h2 className="card-section-title text-destructive flex items-center gap-token-2"><FiTrash2 /> Danger Zone</h2>
          <p className="text-token-sm text-muted-foreground">Permanently delete your account and all data.</p>
          <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
        </CardContent></Card>
      </motion.div>
    </div>
  );
};

export default Settings;
