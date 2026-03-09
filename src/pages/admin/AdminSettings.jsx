import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { FiSave, FiMessageSquare, FiEye, FiHeart, FiStar, FiClock, FiShield } from "react-icons/fi";
import { toast } from "sonner";

const LIMIT_CONFIGS = [
  {
    key: "daily_messages_limit",
    label: "Daily Messages Limit",
    description: "Max messages a user can send per day (0 = unlimited)",
    icon: FiMessageSquare,
    color: "text-blue-500",
    min: 0,
    max: 9999,
  },
  {
    key: "daily_profile_views_limit",
    label: "Daily Profile Views Limit",
    description: "Max profiles a user can view/open per day (0 = unlimited)",
    icon: FiEye,
    color: "text-purple-500",
    min: 0,
    max: 9999,
  },
  {
    key: "daily_interests_limit",
    label: "Daily Interests Limit",
    description: "Max interest requests a user can send per day (0 = unlimited)",
    icon: FiHeart,
    color: "text-rose-500",
    min: 0,
    max: 9999,
  },
  {
    key: "daily_favorites_limit",
    label: "Daily Favorites Limit",
    description: "Max profiles a user can favorite per day (0 = unlimited)",
    icon: FiStar,
    color: "text-amber-500",
    min: 0,
    max: 9999,
  },
  {
    key: "message_cooldown_seconds",
    label: "Message Cooldown (seconds)",
    description: "Minimum seconds between consecutive messages to prevent spam",
    icon: FiClock,
    color: "text-green-500",
    min: 0,
    max: 300,
  },
];

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [localValues, setLocalValues] = useState({});
  const [dirty, setDirty] = useState({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("key, value, description, updated_at");
      if (error) throw error;
      const map = {};
      for (const row of data || []) {
        map[row.key] = { value: Number(row.value), updated_at: row.updated_at };
      }
      return map;
    },
    onSuccess: (data) => {
      const vals = {};
      for (const [k, v] of Object.entries(data)) {
        vals[k] = v.value;
      }
      setLocalValues(vals);
    },
  });

  // Sync localValues once settings are loaded
  const displayValues = Object.keys(localValues).length
    ? localValues
    : Object.fromEntries(
        Object.entries(settings || {}).map(([k, v]) => [k, v.value])
      );

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }) => {
      const { error } = await supabase
        .from("platform_settings")
        .update({ value: value, updated_at: new Date().toISOString() })
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: (_, { key }) => {
      setDirty((prev) => ({ ...prev, [key]: false }));
      queryClient.invalidateQueries({ queryKey: ["platform_settings"] });
      toast.success("Setting saved");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save");
    },
  });

  const saveAll = async () => {
    const dirtyKeys = Object.keys(dirty).filter((k) => dirty[k]);
    for (const key of dirtyKeys) {
      await updateMutation.mutateAsync({ key, value: displayValues[key] });
    }
    if (dirtyKeys.length === 0) toast.info("No changes to save");
  };

  const handleChange = (key, val) => {
    const num = Math.max(0, Number(val) || 0);
    setLocalValues((prev) => ({ ...prev, [key]: num }));
    setDirty((prev) => ({ ...prev, [key]: true }));
  };

  const hasDirty = Object.values(dirty).some(Boolean);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FiShield className="text-primary text-lg" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Platform Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Configure anti-spam rate limits for all users.</p>
          </div>
        </div>
      </motion.div>

      {/* Rate Limit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LIMIT_CONFIGS.map((cfg, i) => (
          <motion.div
            key={cfg.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={dirty[cfg.key] ? "border-primary/60 shadow-md" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <cfg.icon className={`text-base ${cfg.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-foreground">{cfg.label}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">{cfg.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Value</Label>
                    <Input
                      type="number"
                      min={cfg.min}
                      max={cfg.max}
                      value={isLoading ? "" : (displayValues[cfg.key] ?? "")}
                      onChange={(e) => handleChange(cfg.key, e.target.value)}
                      disabled={isLoading}
                      className="h-9"
                      placeholder={isLoading ? "Loading..." : "0"}
                    />
                  </div>
                  <div className="flex-shrink-0 pt-5">
                    <Button
                      size="sm"
                      variant={dirty[cfg.key] ? "default" : "outline"}
                      disabled={!dirty[cfg.key] || updateMutation.isPending}
                      onClick={() =>
                        updateMutation.mutate({ key: cfg.key, value: displayValues[cfg.key] })
                      }
                      className="h-9 px-3"
                    >
                      <FiSave className="mr-1.5 text-xs" />
                      Save
                    </Button>
                  </div>
                </div>
                {settings?.[cfg.key]?.updated_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last updated: {new Date(settings[cfg.key].updated_at).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Save All */}
      {hasDirty && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">You have unsaved changes.</p>
              <Button onClick={saveAll} disabled={updateMutation.isPending}>
                <FiSave className="mr-2" /> Save All Changes
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Info Box */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Note:</strong> Set any limit to <strong>0</strong> to disable it (unlimited).
            Changes take effect immediately for all users. These limits help prevent spam and keep the community respectful.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
