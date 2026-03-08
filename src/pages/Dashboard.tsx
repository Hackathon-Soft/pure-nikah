import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FiUser,
  FiHeart,
  FiMessageCircle,
  FiBell,
  FiEye,
  FiShield,
  FiSettings,
  FiSearch,
  FiChevronRight,
} from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";

const quickStats = [
  { label: "Profile Views", value: "128", icon: FiEye, color: "text-primary" },
  { label: "Interests Received", value: "24", icon: FiHeart, color: "text-accent" },
  { label: "New Messages", value: "7", icon: FiMessageCircle, color: "text-secondary" },
  { label: "Matches", value: "12", icon: GoShieldCheck, color: "text-primary" },
];

const recentMatches = [
  { name: "Fatima A.", age: 25, city: "Lahore", compatibility: 92 },
  { name: "Aisha R.", age: 27, city: "Karachi", compatibility: 88 },
  { name: "Maryam S.", age: 24, city: "Islamabad", compatibility: 85 },
];

const menuItems = [
  { label: "My Profile", icon: FiUser, path: "/profile", badge: "60%" },
  { label: "Search Proposals", icon: FiSearch, path: "/search" },
  { label: "My Interests", icon: FiHeart, path: "/interests", badge: "3 new" },
  { label: "Messages", icon: FiMessageCircle, path: "/messages", badge: "7" },
  { label: "Notifications", icon: FiBell, path: "/notifications", badge: "5" },
  { label: "Verification", icon: FiShield, path: "/verification", badge: "Pending" },
  { label: "Settings", icon: FiSettings, path: "/settings" },
];

const Dashboard = () => (
  <>
    <Navbar />
    <main className="pt-navbar min-h-screen bg-muted islamic-pattern">
      <div className="container mx-auto px-token-4 py-token-10">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-token-8">
          <h1 className="text-token-3xl font-display font-bold text-foreground">
            Assalamu Alaikum, Ahmed 👋
          </h1>
          <p className="text-muted-foreground mt-token-1">Welcome to your dashboard. Here's your activity overview.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-token-6">
          {/* Left — Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-card p-token-6"
            >
              <div className="flex items-center justify-between mb-token-3">
                <h3 className="font-display text-token-lg font-semibold text-foreground">Profile Completion</h3>
                <span className="text-token-sm font-bold text-primary">60%</span>
              </div>
              <Progress value={60} className="h-3 mb-token-3" />
              <p className="text-token-sm text-muted-foreground">
                Complete your profile to get better match suggestions.{" "}
                <Link to="/profile" className="text-primary font-medium hover:underline">Complete Now →</Link>
              </p>
            </motion.div>

            {/* Verification Alert */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-accent/10 rounded-2xl border border-accent/20 p-token-6 flex items-start gap-token-4"
            >
              <FiShield className="text-accent flex-shrink-0 mt-1" style={{ fontSize: "var(--size-icon-lg)" }} />
              <div className="flex-1">
                <h3 className="font-display text-token-base font-semibold text-foreground">Verify Your Identity</h3>
                <p className="text-token-sm text-muted-foreground mt-token-1">
                  Submit your CNIC to get verified and unlock full access. Verified profiles get 5x more interest.
                </p>
              </div>
              <Button variant="gold" size="sm" asChild>
                <Link to="/verification">Verify Now</Link>
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-token-4"
            >
              {quickStats.map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl border border-border shadow-card p-token-4 text-center">
                  <stat.icon className={`mx-auto mb-token-2 ${stat.color}`} style={{ fontSize: "var(--size-icon-lg)" }} />
                  <p className="text-token-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-token-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Suggested Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card rounded-2xl border border-border shadow-card p-token-6"
            >
              <div className="flex items-center justify-between mb-token-4">
                <h3 className="font-display text-token-lg font-semibold text-foreground">Suggested Matches</h3>
                <Link to="/search" className="text-token-sm text-primary font-medium hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {recentMatches.map((match) => (
                  <div key={match.name} className="flex items-center gap-token-4 p-token-3 rounded-xl hover:bg-muted transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold">
                      {match.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-token-sm">{match.name}</p>
                      <p className="text-token-xs text-muted-foreground">{match.age} yrs • {match.city}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-token-sm font-bold text-primary">{match.compatibility}%</span>
                      <p className="text-token-xs text-muted-foreground">match</p>
                    </div>
                    <FiChevronRight className="text-muted-foreground" style={{ fontSize: "var(--size-icon)" }} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Sidebar Menu */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border shadow-card p-token-6"
            >
              <div className="text-center mb-token-6">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-token-2xl mx-auto mb-token-3">
                  A
                </div>
                <h3 className="font-display text-token-lg font-semibold text-foreground">Ahmed K.</h3>
                <p className="text-token-sm text-muted-foreground">Lahore, Pakistan</p>
                <div className="inline-flex items-center gap-token-1 text-token-xs bg-accent/10 text-accent-foreground px-token-2 py-token-1 rounded-full mt-token-2">
                  <FiShield style={{ fontSize: "var(--text-xs)" }} /> Verification Pending
                </div>
              </div>

              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="flex items-center gap-token-3 px-token-3 py-token-3 rounded-xl text-token-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <item.icon style={{ fontSize: "var(--size-icon)" }} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-token-xs bg-primary/10 text-primary px-token-2 py-0.5 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default Dashboard;
