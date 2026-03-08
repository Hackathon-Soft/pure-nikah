import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiHeart, FiX, FiCheck, FiShield } from "react-icons/fi";

const received = [
  { name: "Fatima A.", age: 25, city: "Karachi", cast: "Syed", verified: true },
  { name: "Maryam S.", age: 27, city: "Multan", cast: "Sheikh", verified: false },
  { name: "Hina T.", age: 28, city: "Faisalabad", cast: "Arain", verified: true },
];
const sent = [
  { name: "Aisha R.", age: 24, city: "Rawalpindi", status: "accepted" },
  { name: "Sara K.", age: 26, city: "Lahore", status: "pending" },
];

const Interests = () => (
  <div className="p-token-4 md:p-token-8 max-w-4xl space-y-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-token-2xl font-display font-bold text-foreground">Interests</h1>
      <p className="text-muted-foreground text-token-sm mt-token-1">Manage your received and sent interests.</p>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <h2 className="font-display text-token-lg font-semibold text-foreground mb-token-4 flex items-center gap-token-2"><FiHeart className="text-destructive" /> Received ({received.length})</h2>
      <div className="space-y-3">
        {received.map((r) => (
          <Card key={r.name}><CardContent className="p-token-4 flex items-center gap-token-4 flex-wrap">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">{r.name.charAt(0)}</div>
            <div className="flex-1 min-w-0"><p className="text-token-sm font-medium text-foreground flex items-center gap-token-1">{r.name}{r.verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}</p><p className="text-token-xs text-muted-foreground">{r.age} yrs • {r.city} • {r.cast}</p></div>
            <div className="flex gap-token-2"><Button variant="hero" size="sm"><FiCheck className="mr-1" /> Accept</Button><Button variant="outline" size="sm"><FiX className="mr-1" /> Decline</Button></div>
          </CardContent></Card>
        ))}
      </div>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <h2 className="font-display text-token-lg font-semibold text-foreground mb-token-4">Sent ({sent.length})</h2>
      <div className="space-y-3">
        {sent.map((s) => (
          <Card key={s.name}><CardContent className="p-token-4 flex items-center gap-token-4">
            <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-accent-foreground font-bold flex-shrink-0">{s.name.charAt(0)}</div>
            <div className="flex-1 min-w-0"><p className="text-token-sm font-medium text-foreground">{s.name}</p><p className="text-token-xs text-muted-foreground">{s.age} yrs • {s.city}</p></div>
            <span className={`text-token-xs px-token-2 py-token-1 rounded-full font-medium ${s.status === "accepted" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"}`}>{s.status}</span>
          </CardContent></Card>
        ))}
      </div>
    </motion.div>
  </div>
);

export default Interests;
