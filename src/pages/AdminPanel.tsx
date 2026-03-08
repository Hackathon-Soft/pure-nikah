import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FiCheck,
  FiX,
  FiEye,
  FiAlertTriangle,
  FiClock,
  FiUsers,
  FiShield,
  FiSearch,
} from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import { useState } from "react";

type Tab = "pending" | "verified" | "rejected" | "reported";

const pendingUsers = [
  { id: 1, name: "Muhammad Usman", cnic: "35202-XXXXXXX-X", city: "Lahore", age: 28, gender: "Male", submitted: "2 hours ago" },
  { id: 2, name: "Ayesha Siddiqui", cnic: "42301-XXXXXXX-X", city: "Karachi", age: 24, gender: "Female", submitted: "5 hours ago" },
  { id: 3, name: "Bilal Ahmad", cnic: "38403-XXXXXXX-X", city: "Islamabad", age: 31, gender: "Male", submitted: "1 day ago" },
  { id: 4, name: "Sana Fatima", cnic: "36302-XXXXXXX-X", city: "Faisalabad", age: 26, gender: "Female", submitted: "1 day ago" },
  { id: 5, name: "Hamza Ali", cnic: "35201-XXXXXXX-X", city: "Rawalpindi", age: 29, gender: "Male", submitted: "2 days ago" },
];

const adminStats = [
  { label: "Pending Review", value: "23", icon: FiClock, color: "text-accent" },
  { label: "Verified Users", value: "1,247", icon: GoShieldCheck, color: "text-primary" },
  { label: "Reported", value: "8", icon: FiAlertTriangle, color: "text-destructive" },
  { label: "Total Users", value: "1,580", icon: FiUsers, color: "text-secondary" },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const tabs: { key: Tab; label: string; icon: typeof FiClock }[] = [
    { key: "pending", label: "Pending", icon: FiClock },
    { key: "verified", label: "Verified", icon: GoShieldCheck },
    { key: "rejected", label: "Rejected", icon: FiX },
    { key: "reported", label: "Reported", icon: FiAlertTriangle },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-navbar min-h-screen bg-muted islamic-pattern">
        <div className="container mx-auto px-token-4 py-token-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-token-3xl font-display font-bold text-foreground mb-token-1">Admin Panel</h1>
            <p className="text-muted-foreground mb-token-8">Manage user verifications, reports, and platform moderation.</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-token-4 mb-token-8"
          >
            {adminStats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl border border-border shadow-card p-token-4 text-center">
                <stat.icon className={`mx-auto mb-token-2 ${stat.color}`} style={{ fontSize: "var(--size-icon-lg)" }} />
                <p className="text-token-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-token-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-token-2 mb-token-6 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "hero" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.key)}
              >
                <tab.icon className="mr-token-1" /> {tab.label}
              </Button>
            ))}
          </div>

          {/* Pending Verification Queue */}
          {activeTab === "pending" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-token-3 mb-token-4">
                <div className="relative flex-1 max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name or CNIC..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-token-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {pendingUsers.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border border-border shadow-card p-token-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-token-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-token-xl flex-shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-token-2 flex-wrap">
                        <h3 className="font-display text-token-base font-semibold text-foreground">{user.name}</h3>
                        <span className="text-token-xs bg-accent/10 text-accent-foreground px-token-2 py-0.5 rounded-full">{user.gender}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-token-sm text-muted-foreground mt-token-1">
                        <span>CNIC: {user.cnic}</span>
                        <span>{user.city}</span>
                        <span>{user.age} yrs</span>
                        <span className="flex items-center gap-token-1">
                          <FiClock style={{ fontSize: "var(--text-xs)" }} /> {user.submitted}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-token-2 flex-shrink-0">
                      <Button variant="outline" size="sm">
                        <FiEye className="mr-token-1" /> View Docs
                      </Button>
                      <Button variant="hero" size="sm">
                        <FiCheck className="mr-token-1" /> Approve
                      </Button>
                      <Button variant="destructive" size="sm">
                        <FiX className="mr-token-1" /> Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab !== "pending" && (
            <div className="bg-card rounded-xl border border-border shadow-card p-token-12 text-center">
              <FiShield className="mx-auto mb-token-4 text-muted-foreground" style={{ fontSize: "2.5rem" }} />
              <h3 className="font-display text-token-lg font-semibold text-foreground">
                {activeTab === "verified" && "Verified Users"}
                {activeTab === "rejected" && "Rejected Users"}
                {activeTab === "reported" && "Reported Users"}
              </h3>
              <p className="text-token-sm text-muted-foreground mt-token-2">
                Connect to Lovable Cloud to manage {activeTab} users with a real database.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminPanel;
