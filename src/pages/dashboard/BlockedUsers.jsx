import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiSlash, FiShield, FiMapPin, FiUnlock } from "react-icons/fi";

const blocked = [
  { name: "User 1", age: 30, city: "Peshawar", reason: "Inappropriate messages", blockedOn: "Jan 15, 2024" },
  { name: "User 2", age: 35, city: "Quetta", reason: "Fake profile suspected", blockedOn: "Dec 20, 2023" },
];

const BlockedUsers = () => (
  <div className="p-token-4 md:p-token-8 max-w-4xl space-y-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="page-title flex items-center gap-token-2">
        <FiSlash className="text-destructive" /> Blocked Users
      </h1>
      <p className="page-subtitle">Users you've blocked can't see your profile or contact you.</p>
    </motion.div>

    {blocked.length === 0 ? (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="text-center py-token-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-token-4">
            <FiShield className="text-muted-foreground" style={{ fontSize: "var(--size-icon-lg)" }} />
          </div>
          <h3 className="font-display text-token-lg font-semibold text-foreground mb-token-1">No Blocked Users</h3>
          <p className="text-token-sm text-muted-foreground">You haven't blocked anyone yet.</p>
        </div>
      </motion.div>
    ) : (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
        {blocked.map((user, i) => (
          <motion.div key={user.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.03 }}>
            <Card>
              <CardContent className="p-token-4 flex items-center gap-token-4 flex-wrap">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-token-lg font-bold flex-shrink-0">
                  <FiSlash />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-token-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-token-xs text-muted-foreground">{user.age} yrs • <FiMapPin className="inline" style={{ fontSize: "10px" }} /> {user.city}</p>
                  <p className="text-token-xs text-muted-foreground mt-0.5">Reason: {user.reason}</p>
                </div>
                <div className="flex flex-col items-end gap-token-2">
                  <p className="text-token-xs text-muted-foreground">Blocked: {user.blockedOn}</p>
                  <Button variant="outline" size="sm"><FiUnlock className="mr-1" /> Unblock</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    )}

    {/* Info */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="bg-muted border-dashed">
        <CardContent className="p-token-4">
          <h3 className="text-token-sm font-semibold text-foreground mb-token-2">About Blocking</h3>
          <ul className="text-token-xs text-muted-foreground space-y-1">
            <li>• Blocked users can't view your profile, send interests, or message you</li>
            <li>• They won't be notified that you blocked them</li>
            <li>• You can unblock someone at any time</li>
            <li>• To report a user for serious violations, use the Report button on their profile</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

export default BlockedUsers;
