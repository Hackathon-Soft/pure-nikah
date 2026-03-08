import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiEye, FiShield, FiMapPin, FiHeart, FiClock, FiLock } from "react-icons/fi";

const viewers = [
  { name: "Fatima A.", age: 25, city: "Karachi", cast: "Syed", verified: true, time: "10 min ago", viewCount: 3 },
  { name: "Maryam S.", age: 27, city: "Multan", cast: "Sheikh", verified: false, time: "2 hours ago", viewCount: 1 },
  { name: "Hina T.", age: 28, city: "Faisalabad", cast: "Arain", verified: true, time: "Yesterday", viewCount: 5 },
  { name: "Sara K.", age: 26, city: "Lahore", cast: "Rajput", verified: true, time: "2 days ago", viewCount: 2 },
  { name: "Zainab M.", age: 23, city: "Islamabad", cast: "Malik", verified: false, time: "3 days ago", viewCount: 1 },
];

const WhoViewedMe = () => (
  <div className="p-token-4 md:p-token-8 max-w-4xl space-y-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="page-title flex items-center gap-token-2">
        <FiEye className="text-primary" /> Who Viewed Me
      </h1>
      <p className="page-subtitle">{viewers.length} people viewed your profile recently.</p>
    </motion.div>

    {/* Stats */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-token-4">
      {[
        { label: "Today", value: 2 },
        { label: "This Week", value: 12 },
        { label: "This Month", value: 38 },
      ].map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-token-4 text-center">
            <p className="text-token-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-token-xs text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </motion.div>

    {/* Viewers List */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
      {viewers.map((v, i) => (
        <motion.div key={v.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.03 }}>
          <Card className="hover:shadow-card transition-shadow">
            <CardContent className="p-token-4 flex items-center gap-token-4 flex-wrap">
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-lg font-bold flex-shrink-0">
                {v.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-token-sm font-semibold text-foreground flex items-center gap-token-1">
                  {v.name}
                  {v.verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}
                </p>
                <p className="text-token-xs text-muted-foreground">{v.age} yrs • {v.cast}</p>
                <p className="text-token-xs text-muted-foreground flex items-center gap-token-1 mt-0.5">
                  <FiMapPin style={{ fontSize: "10px" }} /> {v.city}
                </p>
              </div>
              <div className="flex flex-col items-end gap-token-2">
                <p className="text-token-xs text-muted-foreground flex items-center gap-token-1">
                  <FiClock style={{ fontSize: "10px" }} /> {v.time}
                </p>
                {v.viewCount > 1 && (
                  <span className="text-token-xs text-muted-foreground">Viewed {v.viewCount} times</span>
                )}
                <Button variant="hero" size="sm"><FiHeart className="mr-1" /> Send Interest</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>

    {/* Premium Upsell */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="bg-gradient-primary border-0">
        <CardContent className="p-token-6 text-center text-primary-foreground">
          <FiLock className="mx-auto mb-token-3" style={{ fontSize: "var(--size-icon-xl)" }} />
          <h3 className="font-display text-token-lg font-bold mb-token-2">See All Profile Visitors</h3>
          <p className="text-primary-foreground/80 text-token-sm mb-token-4">
            Upgrade to Premium to see everyone who visited your profile and get priority in search results.
          </p>
          <Button variant="gold" size="sm">Upgrade to Premium</Button>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

export default WhoViewedMe;
