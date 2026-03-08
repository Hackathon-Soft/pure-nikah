import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FiSearch, FiMapPin, FiBookOpen, FiHeart, FiFilter, FiShield } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useState } from "react";

const mockProfiles = [
  { id: 1, name: "Ahmed K.", age: 28, location: "Lahore, Pakistan", city: "Lahore", education: "Masters", religiosity: "Practicing", sect: "Sunni", cast: "Rajput", gender: "male", verified: true, distance: "2 km" },
  { id: 2, name: "Fatima A.", age: 25, location: "Karachi, Pakistan", city: "Karachi", education: "Bachelors", religiosity: "Very Practicing", sect: "Sunni", cast: "Syed", gender: "female", verified: true, distance: "5 km" },
  { id: 3, name: "Yusuf M.", age: 31, location: "Islamabad, Pakistan", city: "Islamabad", education: "PhD", religiosity: "Practicing", sect: "Sunni", cast: "Mughal", gender: "male", verified: false, distance: "15 km" },
  { id: 4, name: "Aisha R.", age: 24, location: "Rawalpindi, Pakistan", city: "Rawalpindi", education: "Masters", religiosity: "Practicing", sect: "Sunni", cast: "Arain", gender: "female", verified: true, distance: "8 km" },
  { id: 5, name: "Omar H.", age: 30, location: "Faisalabad, Pakistan", city: "Faisalabad", education: "Bachelors", religiosity: "Very Practicing", sect: "Sunni", cast: "Jat", gender: "male", verified: true, distance: "25 km" },
  { id: 6, name: "Maryam S.", age: 27, location: "Multan, Pakistan", city: "Multan", education: "Masters", religiosity: "Practicing", sect: "Sunni", cast: "Sheikh", gender: "female", verified: false, distance: "50 km" },
];

const cities = ["Any", "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];
const castes = ["Any", "Syed", "Rajput", "Mughal", "Arain", "Jat", "Sheikh", "Pathan", "Baloch", "Malik", "Other"];
const educationOptions = ["Any", "Matric", "Intermediate", "Bachelors", "Masters", "PhD", "Islamic Scholar"];
const sects = ["Any", "Sunni", "Shia", "Deobandi", "Barelvi", "Ahl-e-Hadith"];
const maritalOptions = ["Any", "Never Married", "Divorced", "Widowed"];

const SearchPage = () => {
  const [results] = useState(mockProfiles);
  const [showFilters, setShowFilters] = useState(false);
  const [ageRange, setAgeRange] = useState([18, 45]);
  const [searchType, setSearchType] = useState("all");

  const filtered = results.filter((p) => {
    if (searchType === "male" && p.gender !== "male") return false;
    if (searchType === "female" && p.gender !== "female") return false;
    if (p.age < ageRange[0] || p.age > ageRange[1]) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-muted islamic-pattern">
      <div className="app-container py-token-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title mb-token-2">Search Proposals</h1>
          <p className="text-muted-foreground mb-token-6">Find nearby proposals by location, cast, preferences, or custom filters.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-token-3 mb-token-6 flex-wrap">
          {[
            { label: "All Proposals", value: "all" },
            { label: "Grooms (Male)", value: "male" },
            { label: "Brides (Female)", value: "female" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSearchType(tab.value)}
              className={searchType === tab.value ? "pill-active" : "pill-inactive"}
            >
              {tab.label}
            </button>
          ))}
          <button onClick={() => setShowFilters(!showFilters)} className="pill-inactive ml-auto flex items-center gap-token-2">
            <FiFilter style={{ fontSize: "var(--size-icon-sm)" }} />
            {showFilters ? "Hide" : "Show"} Filters
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card-base p-token-4 mb-token-6">
          <div className="flex flex-col sm:flex-row gap-token-3">
            <div className="flex-1 relative">
              <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "var(--size-icon)" }} />
              <Input placeholder="Search by city, area, or nearby..." className="pl-10" />
            </div>
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "var(--size-icon)" }} />
              <Input placeholder="Search by name or keyword..." className="pl-10" />
            </div>
            <Button variant="hero"><FiSearch className="mr-token-2" style={{ fontSize: "var(--size-icon)" }} /> Search</Button>
          </div>
        </motion.div>

        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="card-base p-token-6 mb-token-8">
            <h3 className="card-section-title mb-token-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-token-4">
              <div className="sm:col-span-2">
                <Label className="text-token-xs">Age Range: {ageRange[0]} - {ageRange[1]}</Label>
                <Slider min={18} max={60} step={1} value={ageRange} onValueChange={setAgeRange} className="mt-token-3" />
              </div>
              <div><Label className="text-token-xs">City</Label><Select><SelectTrigger className="mt-token-1"><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{cities.map((c) => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-token-xs">Cast / Biradari</Label><Select><SelectTrigger className="mt-token-1"><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{castes.map((c) => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-token-xs">Education</Label><Select><SelectTrigger className="mt-token-1"><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{educationOptions.map((e) => <SelectItem key={e} value={e.toLowerCase()}>{e}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-token-xs">Sect / Maslak</Label><Select><SelectTrigger className="mt-token-1"><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{sects.map((s) => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-token-xs">Marital Status</Label><Select><SelectTrigger className="mt-token-1"><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{maritalOptions.map((m) => <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-token-xs">Min Height (ft)</Label><Input type="number" placeholder="e.g. 5.4" className="mt-token-1" /></div>
            </div>
            <div className="flex gap-token-3 mt-token-6">
              <Button variant="hero"><FiSearch className="mr-token-2" style={{ fontSize: "var(--size-icon)" }} /> Apply Filters</Button>
              <Button variant="outline">Clear All</Button>
            </div>
          </motion.div>
        )}

        <p className="text-token-sm text-muted-foreground mb-token-4">Showing {filtered.length} proposals</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-token-6">
          {filtered.map((profile, i) => (
            <motion.div key={profile.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="overflow-hidden hover:shadow-elevated transition-shadow">
                <div className="h-32 bg-gradient-primary relative">
                  {profile.verified && (
                    <div className="verified-badge absolute top-3 right-3">
                      <FiShield style={{ fontSize: "var(--text-xs)" }} /> Verified
                    </div>
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[var(--size-avatar)] h-[var(--size-avatar)] rounded-full bg-card border-4 border-card flex items-center justify-center">
                    <span className="text-token-2xl font-display font-bold text-primary">{profile.name.charAt(0)}</span>
                  </div>
                </div>
                <CardContent className="px-token-4 pt-token-14 pb-token-6 text-center">
                  <h3 className="card-section-title">{profile.name}</h3>
                  <p className="text-token-sm text-muted-foreground">{profile.age} years old • {profile.cast}</p>
                  <div className="flex items-center justify-center gap-token-1 text-token-xs text-muted-foreground mt-token-1">
                    <FiMapPin style={{ fontSize: "var(--text-xs)" }} /> {profile.location}
                    <span className="ml-token-2 link-primary text-token-xs">{profile.distance} away</span>
                  </div>
                  <div className="flex justify-center gap-token-2 mt-token-3 flex-wrap">
                    <span className="badge-primary flex items-center gap-token-1">
                      <FiBookOpen style={{ fontSize: "var(--text-xs)" }} /> {profile.religiosity}
                    </span>
                    <span className="badge-accent">{profile.education}</span>
                    <span className="badge-muted">{profile.sect}</span>
                  </div>
                  <div className="flex gap-token-2 mt-token-4">
                    <Button variant="hero" size="sm" className="flex-1"><FiHeart className="mr-token-1" style={{ fontSize: "var(--text-xs)" }} /> Interest</Button>
                    <Button variant="outline" size="sm" className="flex-1">View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
