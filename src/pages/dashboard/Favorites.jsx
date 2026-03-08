import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiStar, FiMessageSquare, FiShield, FiMapPin } from "react-icons/fi";

const favorites = [
  { name: "Fatima A.", age: 25, city: "Karachi", cast: "Syed", verified: true, compatibility: 92 },
  { name: "Aisha R.", age: 24, city: "Rawalpindi", cast: "Arain", verified: true, compatibility: 88 },
  { name: "Sara K.", age: 26, city: "Lahore", cast: "Rajput", verified: false, compatibility: 85 },
];

const Favorites = () => (
  <div className="p-token-4 md:p-token-8 max-w-4xl space-y-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-token-2xl font-display font-bold text-foreground flex items-center gap-token-2"><FiStar className="text-accent-foreground" /> Favorites</h1>
      <p className="text-muted-foreground text-token-sm mt-token-1">Profiles you've saved.</p>
    </motion.div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-4">
      {favorites.map((f, i) => (
        <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className="hover:shadow-elevated transition-shadow"><CardContent className="p-token-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-xl font-bold mx-auto mb-token-3">{f.name.charAt(0)}</div>
            <p className="font-display text-token-lg font-semibold text-foreground flex items-center justify-center gap-token-1">{f.name}{f.verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}</p>
            <p className="text-token-sm text-muted-foreground">{f.age} yrs • {f.cast}</p>
            <p className="text-token-xs text-muted-foreground flex items-center justify-center gap-token-1 mt-token-1"><FiMapPin style={{ fontSize: "var(--text-xs)" }} /> {f.city}</p>
            <p className="text-token-sm font-bold text-primary mt-token-2">{f.compatibility}% match</p>
            <div className="flex gap-token-2 mt-token-4"><Button variant="hero" size="sm" className="flex-1"><FiMessageSquare className="mr-1" /> Message</Button><Button variant="outline" size="sm" className="flex-1">View</Button></div>
          </CardContent></Card>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Favorites;
