import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  FiShield, FiUser, FiMapPin, FiBookOpen, FiHeart, FiMessageSquare,
  FiStar, FiEdit, FiCamera, FiFlag, FiBriefcase, FiClock, FiCheckCircle,
  FiCalendar, FiGlobe, FiHome, FiUsers,
} from "react-icons/fi";
import { calculateCompatibility } from "@/lib/compatibility";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";

const profile = {
  name: "Ahmed Khan",
  age: 28,
  gender: "Male",
  maritalStatus: "Never Married",
  city: "Lahore",
  country: "Pakistan",
  verified: true,
  memberSince: "Jan 2024",
  lastActive: "2 hours ago",
  bio: "Alhamdulillah, a practicing Muslim looking for a pious life partner. I value Islamic principles in daily life and seek someone who shares the same commitment to deen. I believe in maintaining a balance between career growth and spiritual development.",
  photos: [null, null, null, null],
};

const sections = {
  basic: [
    { icon: FiCalendar, label: "Age", value: "28 years" },
    { icon: FiUser, label: "Gender", value: "Male" },
    { icon: FiHeart, label: "Marital Status", value: "Never Married" },
    { icon: FiMapPin, label: "Location", value: "Lahore, Pakistan" },
    { icon: FiGlobe, label: "Nationality", value: "Pakistani" },
    { icon: FiUsers, label: "Cast / Tribe", value: "Rajput" },
    { icon: FiHome, label: "Residency", value: "Own house" },
    { icon: FiUser, label: "Height", value: "5'10\"" },
    { icon: FiUser, label: "Body Type", value: "Athletic" },
    { icon: FiUser, label: "Complexion", value: "Fair" },
  ],
  religious: [
    { icon: FiBookOpen, label: "Sect", value: "Sunni (Hanafi)" },
    { icon: FiBookOpen, label: "Prayer Level", value: "5 times daily" },
    { icon: FiBookOpen, label: "Quran Recitation", value: "Regular" },
    { icon: FiBookOpen, label: "Beard", value: "Yes" },
    { icon: FiBookOpen, label: "Islamic Values", value: "Very Strong" },
    { icon: FiBookOpen, label: "Fasting", value: "All Ramadan + Sunnah fasts" },
  ],
  career: [
    { icon: FiBriefcase, label: "Education", value: "Masters in Computer Science" },
    { icon: FiBriefcase, label: "University", value: "LUMS, Lahore" },
    { icon: FiBriefcase, label: "Profession", value: "Senior Software Engineer" },
    { icon: FiBriefcase, label: "Income", value: "Above Average" },
    { icon: FiGlobe, label: "Languages", value: "Urdu, English, Punjabi" },
  ],
  family: [
    { icon: FiUsers, label: "Father's Occupation", value: "Businessman" },
    { icon: FiUsers, label: "Mother's Occupation", value: "Homemaker" },
    { icon: FiUsers, label: "Brothers", value: "2 (1 married)" },
    { icon: FiUsers, label: "Sisters", value: "1 (married)" },
    { icon: FiHome, label: "Family Type", value: "Joint Family" },
    { icon: FiHome, label: "Family Values", value: "Conservative, religious" },
  ],
  preferences: [
    { icon: FiHeart, label: "Preferred Age", value: "22 - 28 years" },
    { icon: FiMapPin, label: "Preferred Location", value: "Punjab, Pakistan" },
    { icon: FiUsers, label: "Preferred Cast", value: "Any" },
    { icon: FiBookOpen, label: "Religious Expectation", value: "Practicing Muslim" },
    { icon: FiBriefcase, label: "Education Preference", value: "Graduate or above" },
    { icon: FiHeart, label: "Marital Status Preference", value: "Never Married" },
  ],
};

const InfoGrid = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-4">
    {items.map(({ icon: Icon, label, value }) => (
      <div key={label} className="flex items-start gap-token-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <Icon className="text-primary" style={{ fontSize: "var(--text-sm)" }} />
        </div>
        <div>
          <p className="text-token-xs text-muted-foreground">{label}</p>
          <p className="text-token-sm font-medium text-foreground">{value}</p>
        </div>
      </div>
    ))}
  </div>
);

const myPreferences = {
  ageMin: 22, ageMax: 30, city: "Lahore", sect: "Sunni", cast: "Any",
  education: "Bachelors", religiosity: "Practicing", maritalStatus: "Any", preferVerified: true,
};

const candidateData = {
  age: profile.age, city: profile.city, sect: "Sunni", cast: "Rajput",
  education: "Masters", religiosity: "Practicing", maritalStatus: profile.maritalStatus,
  verified: profile.verified,
};

const compatibilityScore = calculateCompatibility(myPreferences, candidateData);

const ProfileView = () => {
  return (
    <div className="p-token-4 md:p-token-8 max-w-4xl space-y-6">
      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-token-6">
            <div className="flex flex-col sm:flex-row gap-token-6">
              {/* Avatar */}
              <div className="relative mx-auto sm:mx-0">
                <div className="w-28 h-28 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-4xl font-display font-bold">
                  A
                </div>
                {profile.verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                    <FiCheckCircle className="text-primary-foreground" style={{ fontSize: "var(--text-xs)" }} />
                  </div>
                )}
              </div>

              {/* Compatibility Badge */}
              <div className="mx-auto sm:mx-0">
                <CompatibilityBadge
                  score={compatibilityScore}
                  preferences={myPreferences}
                  candidate={candidateData}
                  size="lg"
                />
              </div>

              {/* Info */}
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
                  <span>• Member since {profile.memberSince}</span>
                </div>

                {/* Action Buttons */}
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

      {/* Photo Gallery */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardContent className="p-token-6">
            <h2 className="card-section-title flex items-center gap-token-2 mb-token-4">
              <FiCamera className="text-primary" style={{ fontSize: "var(--size-icon)" }} /> Photos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-token-3">
              {profile.photos.map((_, i) => (
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-token-6">
            <h2 className="card-section-title mb-token-3">About Me</h2>
            <p className="text-token-sm text-muted-foreground leading-token-relaxed">{profile.bio}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabbed Sections */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
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
                  <InfoGrid items={items} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Edit Profile CTA (for own profile) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-muted border-dashed">
          <CardContent className="p-token-6 text-center">
            <p className="text-token-sm text-muted-foreground mb-token-3">
              This is how others see your profile. Want to make changes?
            </p>
            <Button variant="outline" asChild>
              <Link to="/dashboard/edit-profile"><FiEdit className="mr-token-1" /> Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileView;
