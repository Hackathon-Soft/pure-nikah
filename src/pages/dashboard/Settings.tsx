import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FiSettings, FiLock, FiBell, FiEye, FiTrash2 } from "react-icons/fi";

const Settings = () => (
  <div className="p-token-4 md:p-token-8 max-w-3xl space-y-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-token-2xl font-display font-bold text-foreground flex items-center gap-token-2">
        <FiSettings className="text-primary" /> Settings
      </h1>
    </motion.div>

    {/* Privacy */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card>
        <CardContent className="p-token-6 space-y-5">
          <h2 className="font-display text-token-lg font-semibold text-foreground flex items-center gap-token-2">
            <FiEye className="text-primary" /> Privacy
          </h2>
          {[
            { label: "Show profile in search results", defaultChecked: true },
            { label: "Show online status", defaultChecked: false },
            { label: "Allow profile viewing by non-verified users", defaultChecked: false },
            { label: "Blur photos until interest accepted", defaultChecked: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <Label className="text-token-sm text-foreground">{item.label}</Label>
              <Switch defaultChecked={item.defaultChecked} />
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>

    {/* Notifications */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <Card>
        <CardContent className="p-token-6 space-y-5">
          <h2 className="font-display text-token-lg font-semibold text-foreground flex items-center gap-token-2">
            <FiBell className="text-primary" /> Notifications
          </h2>
          {[
            { label: "New interest notifications", defaultChecked: true },
            { label: "Message notifications", defaultChecked: true },
            { label: "Profile view alerts", defaultChecked: false },
            { label: "Verification reminders", defaultChecked: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <Label className="text-token-sm text-foreground">{item.label}</Label>
              <Switch defaultChecked={item.defaultChecked} />
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>

    {/* Security */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardContent className="p-token-6 space-y-4">
          <h2 className="font-display text-token-lg font-semibold text-foreground flex items-center gap-token-2">
            <FiLock className="text-primary" /> Security
          </h2>
          <Button variant="outline">Change Password</Button>
          <Button variant="outline">Change Email</Button>
        </CardContent>
      </Card>
    </motion.div>

    {/* Danger */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
      <Card className="border-destructive/30">
        <CardContent className="p-token-6 space-y-4">
          <h2 className="font-display text-token-lg font-semibold text-destructive flex items-center gap-token-2">
            <FiTrash2 /> Danger Zone
          </h2>
          <p className="text-token-sm text-muted-foreground">Permanently delete your account and all data.</p>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

export default Settings;
