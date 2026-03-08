import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShield, FiCheckCircle, FiClock, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const steps = [
  { label: "Documents Submitted", done: true, date: "March 1, 2026" },
  { label: "Under Human Review", done: true, date: "March 2, 2026" },
  { label: "Verification Complete", done: false, date: "Pending" },
];

const VerificationStatus = () => {
  return (
    <div className="w-full max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-token-3xl font-display font-bold text-foreground mb-token-2">Verification Status</h1>
        <p className="text-muted-foreground mb-token-8">Track the progress of your identity verification.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-accent/20 rounded-xl p-token-6 mb-token-8 flex items-center gap-token-4">
        <FiClock className="text-accent-foreground" style={{ fontSize: "var(--size-icon-xl)" }} />
        <div><h3 className="font-display text-token-lg font-semibold text-accent-foreground">Under Review</h3><p className="text-token-sm text-muted-foreground">Your documents are being reviewed by our verification team. This typically takes 24-48 hours.</p></div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border p-token-6 mb-token-8">
        <h2 className="font-display text-token-xl font-semibold text-foreground mb-token-6">Review Timeline</h2>
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-token-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{step.done ? <FiCheckCircle style={{ fontSize: "var(--size-icon-sm)" }} /> : <FiClock style={{ fontSize: "var(--size-icon-sm)" }} />}</div>
                {i < steps.length - 1 && <div className={`w-0.5 h-12 ${step.done ? "bg-primary" : "bg-border"}`} />}
              </div>
              <div className="pb-token-6"><h4 className={`text-token-sm font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</h4><p className="text-token-xs text-muted-foreground">{step.date}</p></div>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-token-6 mb-token-8">
        <div className="flex items-start gap-token-3"><FiRefreshCw className="text-primary flex-shrink-0 mt-1" style={{ fontSize: "var(--size-icon)" }} /><div><h3 className="font-display text-token-lg font-semibold text-foreground">6-Month Re-verification</h3><p className="text-token-sm text-muted-foreground mt-token-1">To maintain authenticity and prevent fake profiles, all users must re-verify every 6 months. You'll be notified before your verification expires.</p></div></div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-xl border border-border p-token-6">
        <h2 className="font-display text-token-xl font-semibold text-foreground mb-token-4">After Verification</h2>
        <ul className="space-y-3">
          {[{ icon: <FiShield />, text: "Verified badge on your profile" },{ icon: <FiCheckCircle />, text: "Higher trust score — more matches" },{ icon: <FiAlertCircle />, text: "Report fake profiles to protect the community" }].map((item, i) => (
            <li key={i} className="flex items-center gap-token-3 text-token-sm text-muted-foreground"><span className="text-primary" style={{ fontSize: "var(--size-icon)" }}>{item.icon}</span>{item.text}</li>
          ))}
        </ul>
        <div className="mt-token-6"><Button variant="outline" asChild><Link to="/search">Browse Profiles</Link></Button></div>
      </motion.div>
    </div>
  );
};

export default VerificationStatus;
