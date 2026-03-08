import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiHeart, FiX, FiCheck, FiShield, FiMapPin, FiMessageSquare, FiClock, FiUser } from "react-icons/fi";

const received = [
  { name: "Fatima A.", age: 25, city: "Karachi", cast: "Syed", verified: true, time: "2 hours ago", compatibility: 91 },
  { name: "Maryam S.", age: 27, city: "Multan", cast: "Sheikh", verified: false, time: "1 day ago", compatibility: 84 },
  { name: "Hina T.", age: 28, city: "Faisalabad", cast: "Arain", verified: true, time: "3 days ago", compatibility: 78 },
];

const sent = [
  { name: "Aisha R.", age: 24, city: "Rawalpindi", cast: "Rajput", verified: true, status: "accepted", time: "5 days ago" },
  { name: "Sara K.", age: 26, city: "Lahore", cast: "Malik", verified: false, status: "pending", time: "1 week ago" },
  { name: "Zainab M.", age: 23, city: "Islamabad", cast: "Syed", verified: true, status: "declined", time: "2 weeks ago" },
];

const mutual = [
  { name: "Aisha R.", age: 24, city: "Rawalpindi", cast: "Rajput", verified: true, matchedOn: "3 days ago", compatibility: 88 },
];

const statusStyle = {
  accepted: "bg-primary/10 text-primary",
  pending: "bg-accent/20 text-accent-foreground",
  declined: "bg-destructive/10 text-destructive",
};

const InterestCard = ({ person, actions, badge }) => (
  <Card className="hover:shadow-card transition-shadow">
    <CardContent className="p-token-4 flex items-center gap-token-4 flex-wrap">
      <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-lg font-bold flex-shrink-0">
        {person.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-token-sm font-semibold text-foreground flex items-center gap-token-1 flex-wrap">
          {person.name}
          {person.verified && <FiShield className="text-primary" style={{ fontSize: "var(--text-xs)" }} />}
          {person.compatibility && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-token-xs ml-token-1">
              {person.compatibility}% match
            </Badge>
          )}
        </p>
        <p className="text-token-xs text-muted-foreground">{person.age} yrs • {person.cast}</p>
        <p className="text-token-xs text-muted-foreground flex items-center gap-token-1 mt-0.5">
          <FiMapPin style={{ fontSize: "10px" }} /> {person.city}
        </p>
      </div>
      <div className="flex flex-col items-end gap-token-2">
        {badge}
        <p className="text-token-xs text-muted-foreground flex items-center gap-token-1">
          <FiClock style={{ fontSize: "10px" }} /> {person.time || person.matchedOn}
        </p>
        <div className="flex gap-token-2">{actions}</div>
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ icon: Icon, title, desc }) => (
  <div className="text-center py-token-12">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-token-4">
      <Icon className="text-muted-foreground" style={{ fontSize: "var(--size-icon-lg)" }} />
    </div>
    <h3 className="font-display text-token-lg font-semibold text-foreground mb-token-1">{title}</h3>
    <p className="text-token-sm text-muted-foreground">{desc}</p>
  </div>
);

const Interests = () => (
  <div className="p-token-4 md:p-token-8 max-w-4xl space-y-6">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="page-title flex items-center gap-token-2">
        <FiHeart className="text-destructive" /> Interests
      </h1>
      <p className="page-subtitle">Manage your received, sent, and mutual interests.</p>
    </motion.div>

    {/* Stats */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-3 gap-token-4">
      {[
        { label: "Received", value: received.length, color: "text-destructive" },
        { label: "Sent", value: sent.length, color: "text-primary" },
        { label: "Mutual", value: mutual.length, color: "text-accent-foreground" },
      ].map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-token-4 text-center">
            <p className={`text-token-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-token-xs text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </motion.div>

    {/* Tabs */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-token-4">
          <TabsTrigger value="received">Received ({received.length})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger>
          <TabsTrigger value="mutual">Mutual ({mutual.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-3">
          {received.length === 0 ? (
            <EmptyState icon={FiHeart} title="No interests yet" desc="When someone sends you an interest, it will appear here." />
          ) : (
            received.map((r) => (
              <InterestCard
                key={r.name}
                person={r}
                actions={
                  <>
                    <Button variant="hero" size="sm"><FiCheck className="mr-1" /> Accept</Button>
                    <Button variant="outline" size="sm"><FiX className="mr-1" /> Decline</Button>
                  </>
                }
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-3">
          {sent.length === 0 ? (
            <EmptyState icon={FiHeart} title="No sent interests" desc="Search for profiles and send interests to get started." />
          ) : (
            sent.map((s) => (
              <InterestCard
                key={s.name}
                person={s}
                badge={
                  <span className={`text-token-xs px-token-2 py-0.5 rounded-full font-medium capitalize ${statusStyle[s.status]}`}>
                    {s.status}
                  </span>
                }
                actions={
                  s.status === "pending" && (
                    <Button variant="outline" size="sm"><FiX className="mr-1" /> Withdraw</Button>
                  )
                }
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="mutual" className="space-y-3">
          {mutual.length === 0 ? (
            <EmptyState icon={FiHeart} title="No mutual interests" desc="When both you and someone else accept each other's interest, it becomes mutual." />
          ) : (
            mutual.map((m) => (
              <InterestCard
                key={m.name}
                person={m}
                actions={
                  <Button variant="hero" size="sm"><FiMessageSquare className="mr-1" /> Message</Button>
                }
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  </div>
);

export default Interests;
