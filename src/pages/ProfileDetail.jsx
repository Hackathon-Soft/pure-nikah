import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiShield, FiUser, FiMapPin, FiBookOpen, FiHeart, FiMessageSquare,
  FiStar, FiCamera, FiFlag, FiBriefcase, FiClock, FiCheckCircle,
  FiCalendar, FiGlobe, FiHome, FiUsers, FiLock, FiArrowLeft, FiEye,
} from "react-icons/fi";
import { mockProfilesDB } from "@/lib/mockProfiles";
import { calculateCompatibility } from "@/lib/compatibility";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";

// Simulated auth — replace with real auth later
const useAuth = () => {
  // Check a simple flag for demo purposes
  const isLoggedIn = localStorage.getItem("purenikah_demo_auth") === "true";
  return { isLoggedIn };
};

const myPreferences = {
  ageMin: 22, ageMax: 30, city: "Lahore", sect: "Sunni", cast: "Any",
  education: "Bachelors", religiosity: "Practicing", maritalStatus: "Any", preferVerified: true,
};

const InfoRow = ({ icon: Icon, label, value, blurred }) => (
  <div className="flex items-start gap-token-3">
    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
      <Icon className="text-primary" style={{ fontSize: "var(--text-sm)" }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-token-xs text-muted-foreground">{label}</p>
      {blurred ? (
        <p className="text-token-sm font-medium text-muted-foreground/40 blur-sm select-none">Hidden</p>
      ) : (
        <p className="text-token-sm font-medium text-foreground">{value}</p>
      )}
    </div>
  </div>
);

// ─── Quick View (Guest / Not Logged In) ───
const QuickView = ({ profile, score }) => {
  const tier = score >= 75 ? "Great" : score >= 60 ? "Good" : "Fair";
  return (
    <div className="min-h-screen bg-muted islamic-pattern">
      <div className="app-container py-token-10 max-w-3xl">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-token-6">
          <Link to="/search" className="inline-flex items-center gap-token-2 text-token-sm text-muted-foreground hover:text-foreground transition-colors">
            <FiArrowLeft /> Back to Search
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-token-6">
              <div className="flex flex-col sm:flex-row items-center gap-token-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-4xl font-display font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  {profile.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                      <FiCheckCircle className="text-primary-foreground" style={{ fontSize: "10px" }} />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-token-2 flex-wrap">
                    <h1 className="font-display text-token-2xl font-bold text-foreground">{profile.name}</h1>
                    {profile.verified && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        <FiShield className="mr-1" style={{ fontSize: "var(--text-xs)" }} /> Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-token-sm mt-token-1">
                    {profile.age} years • {profile.gender} • {profile.maritalStatus}
                  </p>
                  <p className="text-muted-foreground text-token-sm flex items-center justify-center sm:justify-start gap-token-1 mt-token-1">
                    <FiMapPin style={{ fontSize: "var(--text-xs)" }} /> {profile.city}, {profile.country}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Info — limited */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-token-6">
          <Card>
            <CardContent className="p-token-6">
              <h2 className="card-section-title mb-token-4">Quick Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-4">
                <InfoRow icon={FiCalendar} label="Age" value={`${profile.age} years`} />
                <InfoRow icon={FiHeart} label="Marital Status" value={profile.maritalStatus} />
                <InfoRow icon={FiMapPin} label="City" value={profile.city} />
                <InfoRow icon={FiBookOpen} label="Sect" value={profile.sect} />
                <InfoRow icon={FiBriefcase} label="Education" value={profile.education} />
                <InfoRow icon={FiBookOpen} label="Religiosity" value={profile.religiosity} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blurred / Locked Sections */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-token-6">
          <Card className="relative overflow-hidden">
            <CardContent className="p-token-6">
              <h2 className="card-section-title mb-token-4 flex items-center gap-token-2">
                <FiUser className="text-primary" /> Detailed Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-4">
                <InfoRow icon={FiBriefcase} label="Profession" value="" blurred />
                <InfoRow icon={FiBriefcase} label="Income" value="" blurred />
                <InfoRow icon={FiGlobe} label="Languages" value="" blurred />
                <InfoRow icon={FiUser} label="Height" value="" blurred />
                <InfoRow icon={FiUsers} label="Family Type" value="" blurred />
                <InfoRow icon={FiHome} label="Family Values" value="" blurred />
              </div>
            </CardContent>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/95 to-card/60 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-token-3">
                <FiLock className="text-primary" style={{ fontSize: "var(--size-icon-lg)" }} />
              </div>
              <h3 className="font-display text-token-lg font-bold text-foreground mb-token-1">Login to See Full Profile</h3>
              <p className="text-token-sm text-muted-foreground mb-token-4 text-center max-w-xs">
                Create a free account to view complete profiles, send interests, and message.
              </p>
              <div className="flex gap-token-3">
                <Button variant="hero" asChild><Link to="/register">Register Free</Link></Button>
                <Button variant="outline" asChild><Link to="/login">Login</Link></Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Blurred Photos */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-token-6">
          <Card className="relative overflow-hidden">
            <CardContent className="p-token-6">
              <h2 className="card-section-title flex items-center gap-token-2 mb-token-4">
                <FiCamera className="text-primary" /> Photos
              </h2>
              <div className="grid grid-cols-3 gap-token-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-xl bg-muted blur-md" />
                ))}
              </div>
            </CardContent>
            <div className="absolute inset-0 flex items-center justify-center bg-card/50">
              <div className="text-center">
                <FiLock className="text-muted-foreground mx-auto mb-token-2" style={{ fontSize: "var(--size-icon-lg)" }} />
                <p className="text-token-sm text-muted-foreground">Login to view photos</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Full View (Logged In) ───
const FullView = ({ profile, score }) => {
  const candidateData = {
    age: profile.age, city: profile.city, sect: profile.sect?.split(" ")[0],
    cast: profile.cast, education: profile.education?.split(" ")[0],
    religiosity: profile.religiosity, maritalStatus: profile.maritalStatus,
    verified: profile.verified,
  };

  const sections = {
    basic: [
      { icon: FiCalendar, label: "Age", value: `${profile.age} years` },
      { icon: FiUser, label: "Gender", value: profile.gender },
      { icon: FiHeart, label: "Marital Status", value: profile.maritalStatus },
      { icon: FiMapPin, label: "Location", value: `${profile.city}, ${profile.country}` },
      { icon: FiGlobe, label: "Nationality", value: "Pakistani" },
      { icon: FiUsers, label: "Cast / Tribe", value: profile.cast },
      { icon: FiUser, label: "Height", value: profile.height },
      { icon: FiUser, label: "Body Type", value: profile.bodyType },
      { icon: FiUser, label: "Complexion", value: profile.complexion },
    ],
    religious: [
      { icon: FiBookOpen, label: "Sect", value: profile.sect },
      { icon: FiBookOpen, label: "Prayer Level", value: profile.prayerLevel },
      { icon: FiBookOpen, label: "Quran Recitation", value: profile.quranRecitation },
      { icon: FiBookOpen, label: "Beard / Hijab", value: profile.beard },
      { icon: FiBookOpen, label: "Islamic Values", value: profile.islamicValues },
      { icon: FiBookOpen, label: "Fasting", value: profile.fasting },
    ],
    career: [
      { icon: FiBriefcase, label: "Education", value: profile.education },
      { icon: FiBriefcase, label: "University", value: profile.university },
      { icon: FiBriefcase, label: "Profession", value: profile.profession },
      { icon: FiBriefcase, label: "Income", value: profile.income },
      { icon: FiGlobe, label: "Languages", value: profile.languages },
    ],
    family: [
      { icon: FiUsers, label: "Father's Occupation", value: profile.fatherOccupation },
      { icon: FiUsers, label: "Mother's Occupation", value: profile.motherOccupation },
      { icon: FiUsers, label: "Brothers", value: profile.brothers },
      { icon: FiUsers, label: "Sisters", value: profile.sisters },
      { icon: FiHome, label: "Family Type", value: profile.familyType },
      { icon: FiHome, label: "Family Values", value: profile.familyValues },
    ],
    preferences: [
      { icon: FiHeart, label: "Preferred Age", value: profile.prefAge },
      { icon: FiMapPin, label: "Preferred Location", value: profile.prefLocation },
      { icon: FiUsers, label: "Preferred Cast", value: profile.prefCast },
      { icon: FiBookOpen, label: "Religious Expectation", value: profile.prefReligious },
      { icon: FiBriefcase, label: "Education Preference", value: profile.prefEducation },
      { icon: FiHeart, label: "Marital Status Pref.", value: profile.prefMarital },
    ],
  };

  return (
    <div className="min-h-screen bg-muted islamic-pattern">
      <div className="app-container py-token-10 max-w-4xl">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-token-6">
          <Link to="/search" className="inline-flex items-center gap-token-2 text-token-sm text-muted-foreground hover:text-foreground transition-colors">
            <FiArrowLeft /> Back to Search
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-token-6">
              <div className="flex flex-col sm:flex-row gap-token-6">
                <div className="relative mx-auto sm:mx-0">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-4xl font-display font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  {profile.verified && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                      <FiCheckCircle className="text-primary-foreground" style={{ fontSize: "var(--text-xs)" }} />
                    </div>
                  )}
                </div>

                {/* Compatibility */}
                <div className="mx-auto sm:mx-0">
                  <CompatibilityBadge
                    score={score}
                    preferences={myPreferences}
                    candidate={candidateData}
                    size="lg"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-token-2 flex-wrap">
                    <h1 className="font-display text-token-2xl font-bold text-foreground">{profile.name}</h1>
                    {profile.verified && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        <FiShield className="mr-1" style={{ fontSize: "var(--text-xs)" }} /> Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-token-sm mt-token-1">
                    {profile.age} years • {profile.gender} • {profile.maritalStatus}
                  </p>
                  <p className="text-muted-foreground text-token-sm flex items-center justify-center sm:justify-start gap-token-1 mt-token-1">
                    <FiMapPin style={{ fontSize: "var(--text-xs)" }} /> {profile.city}, {profile.country}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-token-3 mt-token-2 text-token-xs text-muted-foreground">
                    <span className="flex items-center gap-token-1"><FiClock style={{ fontSize: "var(--text-xs)" }} /> Active {profile.lastActive}</span>
                    <span>• Since {profile.memberSince}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-token-3 mt-token-4 flex-wrap">
                    <Button variant="hero" size="sm"><FiHeart className="mr-1" /> Send Interest</Button>
                    <Button variant="outline" size="sm"><FiMessageSquare className="mr-1" /> Message</Button>
                    <Button variant="outline" size="sm"><FiStar className="mr-1" /> Favorite</Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground"><FiFlag className="mr-1" /> Report</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Photos */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-token-6">
          <Card>
            <CardContent className="p-token-6">
              <h2 className="card-section-title flex items-center gap-token-2 mb-token-4">
                <FiCamera className="text-primary" style={{ fontSize: "var(--size-icon)" }} /> Photos
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-token-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-xl bg-muted flex items-center justify-center border border-border">
                    <FiCamera className="text-muted-foreground" style={{ fontSize: "var(--size-icon-lg)" }} />
                  </div>
                ))}
              </div>
              <p className="text-token-xs text-muted-foreground mt-token-3 text-center">
                Photos are blurred until interest is accepted
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bio */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-token-6">
          <Card>
            <CardContent className="p-token-6">
              <h2 className="card-section-title mb-token-3">About {profile.name.split(" ")[0]}</h2>
              <p className="text-token-sm text-muted-foreground leading-token-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabbed Detail Sections */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-token-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full grid grid-cols-3 sm:grid-cols-5 mb-token-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="religious">Religious</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            {Object.entries(sections).map(([key, items]) => (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardContent className="p-token-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-4">
                      {items.map(({ icon: Icon, label, value }) => (
                        <InfoRow key={label} icon={Icon} label={label} value={value} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Main Page Component ───
const ProfileDetail = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const profile = mockProfilesDB[Number(id)];

  if (!profile) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-token-2xl font-bold text-foreground mb-token-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-token-4">This profile doesn't exist or has been removed.</p>
          <Button variant="hero" asChild><Link to="/search">Back to Search</Link></Button>
        </div>
      </div>
    );
  }

  const candidateData = {
    age: profile.age, city: profile.city, sect: profile.sect?.split(" ")[0],
    cast: profile.cast, education: profile.education?.split(" ")[0],
    religiosity: profile.religiosity, maritalStatus: profile.maritalStatus,
    verified: profile.verified,
  };
  const score = calculateCompatibility(myPreferences, candidateData);

  if (isLoggedIn) {
    return <FullView profile={profile} score={score} />;
  }
  return <QuickView profile={profile} score={score} />;
};

export default ProfileDetail;
