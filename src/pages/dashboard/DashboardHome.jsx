import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { FiUser, FiHeart, FiMessageSquare, FiShield, FiSearch, FiStar, FiAlertCircle, FiCheckCircle, FiClock, FiEye, FiArrowRight } from "react-icons/fi";

const profileCompletion = 65;
const stats = [
  { icon: FiEye, label: "Profile Views", value: "23", color: "text-primary" },
  { icon: FiHeart, label: "Interests Received", value: "8", color: "text-destructive" },
  { icon: FiStar, label: "Favorites", value: "5", color: "text-accent-foreground" },
  { icon: FiMessageSquare, label: "Messages", value: "12", color: "text-secondary" },
];
const recentInterests = [
  { name: "Fatima A.", age: 25, city: "Karachi", status: "pending" },
  { name: "Aisha R.", age: 24, city: "Rawalpindi", status: "accepted" },
  { name: "Maryam S.", age: 27, city: "Multan", status: "pending" },
];
const suggestedMatches = [
  { name: "Sara K.", age: 26, city: "Lahore", compatibility: 92, verified: true },
  { name: "Zainab M.", age: 23, city: "Islamabad", compatibility: 87, verified: true },
  { name: "Hina T.", age: 28, city: "Faisalabad", compatibility: 85, verified: false },
];

const DashboardHome = () => {
  return (
    <div className="p-token-4 md:p-token-8 space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Assalamu Alaikum, Ahmed 👋</h1>
        <p className="page-subtitle">Here's your activity overview.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="border-accent bg-accent/10"><CardContent className="p-token-4 flex items-center gap-token-4 flex-wrap">
          <FiClock className="text-accent-foreground flex-shrink-0" style={{ fontSize: "var(--size-icon-lg)" }} />
          <div className="flex-1 min-w-0"><p className="text-token-sm font-medium text-foreground">Verification Pending</p><p className="text-token-xs text-muted-foreground">Complete your identity verification to unlock all features and get a verified badge.</p></div>
          <Button variant="gold" size="sm" asChild><Link to="/dashboard/verification">Complete Now <FiArrowRight className="ml-token-1" /></Link></Button>
        </CardContent></Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-token-4">
        {stats.map((stat) => (<Card key={stat.label}><CardContent className="p-token-4 flex items-center gap-token-3"><div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}><stat.icon style={{ fontSize: "var(--size-icon)" }} /></div><div><p className="text-token-2xl font-bold text-foreground">{stat.value}</p><p className="text-token-xs text-muted-foreground">{stat.label}</p></div></CardContent></Card>))}
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-token-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card><CardContent className="p-token-6">
            <div className="flex items-center justify-between mb-token-4"><h3 className="card-section-title">Profile</h3><span className="text-token-sm font-bold text-primary">{profileCompletion}%</span></div>
            <Progress value={profileCompletion} className="h-2 mb-token-4" />
            <ul className="space-y-2">
              {[{ label: "Basic Info", done: true },{ label: "Religious Info", done: true },{ label: "Photos", done: false },{ label: "Preferences", done: false },{ label: "Family Details", done: true }].map((item) => (
                <li key={item.label} className="flex items-center gap-token-2 text-token-sm">{item.done ? <FiCheckCircle className="text-primary" style={{ fontSize: "var(--size-icon-sm)" }} /> : <FiAlertCircle className="text-muted-foreground" style={{ fontSize: "var(--size-icon-sm)" }} />}<span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span></li>
              ))}
            </ul>
            <Button variant="outline" size="sm" asChild className="w-full mt-token-4"><Link to="/dashboard/edit-profile">Complete Profile</Link></Button>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card><CardContent className="p-token-6">
            <div className="flex items-center justify-between mb-token-4"><h3 className="card-section-title">Recent Interests</h3><Link to="/dashboard/interests" className="text-token-xs link-primary">View All</Link></div>
            <div className="space-y-3">
              {recentInterests.map((interest) => (
                <div key={interest.name} className="list-item-muted">
                  <div className="avatar-circle w-10 h-10 text-token-sm flex-shrink-0">{interest.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0"><p className="text-token-sm font-medium text-foreground truncate">{interest.name}</p><p className="text-token-xs text-muted-foreground">{interest.age} yrs • {interest.city}</p></div>
                  <span className={interest.status === "accepted" ? "badge-status-accepted" : "badge-status-pending"}>{interest.status}</span>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card><CardContent className="p-token-6">
            <div className="flex items-center justify-between mb-token-4"><h3 className="card-section-title">Suggested Matches</h3><Link to="/dashboard/search" className="text-token-xs link-primary">Search More</Link></div>
            <div className="space-y-3">
              {suggestedMatches.map((match) => (
                <div key={match.name} className="list-item-muted">
                  <div className="avatar-circle-gold w-10 h-10 text-token-sm flex-shrink-0">{match.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0"><p className="text-token-sm font-medium text-foreground truncate flex items-center gap-token-1">{match.name}{match.verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}</p><p className="text-token-xs text-muted-foreground">{match.age} yrs • {match.city}</p></div>
                  <div className="text-center flex-shrink-0"><p className="text-token-sm font-bold text-primary">{match.compatibility}%</p><p className="text-token-xs text-muted-foreground">match</p></div>
                </div>
              ))}
            </div>
            <Button variant="hero" size="sm" asChild className="w-full mt-token-4"><Link to="/dashboard/search"><FiSearch className="mr-token-1" style={{ fontSize: "var(--size-icon-sm)" }} />Find Matches</Link></Button>
          </CardContent></Card>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card><CardContent className="p-token-6">
          <h3 className="card-section-title mb-token-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-token-3">
            {[{ icon: FiUser, label: "Edit Profile", to: "/dashboard/edit-profile" },{ icon: FiSearch, label: "Search", to: "/dashboard/search" },{ icon: FiHeart, label: "Interests", to: "/dashboard/interests" },{ icon: FiShield, label: "Verify", to: "/dashboard/verification" }].map((action) => (
              <Link key={action.label} to={action.to} className="action-card">
                <action.icon className="text-primary" style={{ fontSize: "var(--size-icon-lg)" }} /><span className="text-token-xs font-medium text-foreground">{action.label}</span>
              </Link>
            ))}
          </div>
        </CardContent></Card>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
