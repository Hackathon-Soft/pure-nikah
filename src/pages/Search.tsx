import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  FiSearch,
  FiMapPin,
  FiBookOpen,
  FiHeart,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import { useState } from "react";

const mockProfiles = [
  { id: 1, name: "Ahmed K.", age: 28, location: "Lahore", distance: "2 km", education: "Masters", religiosity: "Practicing", sect: "Sunni", caste: "Rajput", verified: true, gender: "male" },
  { id: 2, name: "Fatima A.", age: 25, location: "Lahore", distance: "5 km", education: "Bachelors", religiosity: "Very Practicing", sect: "Sunni", caste: "Syed", verified: true, gender: "female" },
  { id: 3, name: "Yusuf M.", age: 31, location: "Karachi", distance: "850 km", education: "PhD", religiosity: "Practicing", sect: "Sunni", caste: "Mughal", verified: true, gender: "male" },
  { id: 4, name: "Aisha R.", age: 24, location: "Islamabad", distance: "280 km", education: "Masters", religiosity: "Practicing", sect: "Sunni", caste: "Arain", verified: false, gender: "female" },
  { id: 5, name: "Omar H.", age: 30, location: "Multan", distance: "320 km", education: "Bachelors", religiosity: "Very Practicing", sect: "Sunni", caste: "Jat", verified: true, gender: "male" },
  { id: 6, name: "Maryam S.", age: 27, location: "Faisalabad", distance: "180 km", education: "Masters", religiosity: "Practicing", sect: "Sunni", caste: "Sheikh", verified: true, gender: "female" },
  { id: 7, name: "Bilal T.", age: 29, location: "Rawalpindi", distance: "270 km", education: "Bachelors", religiosity: "Moderate", sect: "Sunni", caste: "Awan", verified: true, gender: "male" },
  { id: 8, name: "Zainab K.", age: 23, location: "Lahore", distance: "8 km", education: "Bachelors", religiosity: "Very Practicing", sect: "Sunni", caste: "Butt", verified: true, gender: "female" },
  { id: 9, name: "Hassan A.", age: 33, location: "Peshawar", distance: "460 km", education: "MBBS", religiosity: "Practicing", sect: "Sunni", caste: "Pathan", verified: true, gender: "male" },
];

const castes = ["Any", "Syed", "Rajput", "Mughal", "Arain", "Jat", "Sheikh", "Awan", "Butt", "Pathan", "Gujjar", "Malik"];
const cities = ["Any", "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot"];
const educations = ["Any", "Matric", "Intermediate", "Bachelors", "Masters", "PhD", "MBBS", "Engineering", "Hafiz-e-Quran"];
const sects = ["Any", "Sunni", "Shia", "Deobandi", "Barelvi", "Ahl-e-Hadith"];
const religiosityLevels = ["Any", "Very Practicing", "Practicing", "Moderate"];
const maritalStatuses = ["Any", "Never Married", "Divorced", "Widowed"];

const SearchPage = () => {
  const [results] = useState(mockProfiles);
  const [showFilters, setShowFilters] = useState(true);
  const [ageRange, setAgeRange] = useState([18, 45]);
  const [searchGender, setSearchGender] = useState("female");

  return (
    <>
      <Navbar />
      <main className="pt-navbar min-h-screen bg-muted islamic-pattern">
        <div className="container mx-auto px-token-4 py-token-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-token-6"
          >
            <div>
              <h1 className="text-token-3xl font-display font-bold text-foreground">Search Proposals</h1>
              <p className="text-muted-foreground mt-token-1">Find your perfect match by location, caste, or custom preferences.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="mt-token-3 sm:mt-0"
            >
              {showFilters ? <FiX className="mr-token-2" /> : <FiFilter className="mr-token-2" />}
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </motion.div>

          {/* Quick Search Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex flex-wrap gap-token-2 mb-token-6"
          >
            <Button
              variant={searchGender === "female" ? "hero" : "outline"}
              size="sm"
              onClick={() => setSearchGender("female")}
            >
              Search Brides
            </Button>
            <Button
              variant={searchGender === "male" ? "hero" : "outline"}
              size="sm"
              onClick={() => setSearchGender("male")}
            >
              Search Grooms
            </Button>
            <Button variant="outline" size="sm">
              <FiMapPin className="mr-token-1" /> Near Me
            </Button>
            <Button variant="outline" size="sm">
              Newly Joined
            </Button>
            <Button variant="outline" size="sm">
              <GoShieldCheck className="mr-token-1" /> Verified Only
            </Button>
          </motion.div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card rounded-2xl border border-border shadow-card p-token-6 mb-token-8"
            >
              <h3 className="font-display text-token-base font-semibold text-foreground mb-token-4">Advanced Filters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-token-4">
                {/* Age Range */}
                <div className="sm:col-span-2">
                  <Label className="text-token-xs mb-token-2 block">
                    Age Range: {ageRange[0]} - {ageRange[1]} years
                  </Label>
                  <Slider
                    value={ageRange}
                    onValueChange={setAgeRange}
                    min={18}
                    max={60}
                    step={1}
                    className="mt-token-3"
                  />
                </div>

                {/* City */}
                <div>
                  <Label className="text-token-xs">City</Label>
                  <Select>
                    <SelectTrigger className="mt-token-1"><SelectValue placeholder="Any City" /></SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Caste */}
                <div>
                  <Label className="text-token-xs">Caste / Biradari</Label>
                  <Select>
                    <SelectTrigger className="mt-token-1"><SelectValue placeholder="Any Caste" /></SelectTrigger>
                    <SelectContent>
                      {castes.map((c) => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sect */}
                <div>
                  <Label className="text-token-xs">Sect / Maslak</Label>
                  <Select>
                    <SelectTrigger className="mt-token-1"><SelectValue placeholder="Any Sect" /></SelectTrigger>
                    <SelectContent>
                      {sects.map((s) => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Education */}
                <div>
                  <Label className="text-token-xs">Education</Label>
                  <Select>
                    <SelectTrigger className="mt-token-1"><SelectValue placeholder="Any Education" /></SelectTrigger>
                    <SelectContent>
                      {educations.map((e) => <SelectItem key={e} value={e.toLowerCase()}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Religiosity */}
                <div>
                  <Label className="text-token-xs">Religiosity Level</Label>
                  <Select>
                    <SelectTrigger className="mt-token-1"><SelectValue placeholder="Any Level" /></SelectTrigger>
                    <SelectContent>
                      {religiosityLevels.map((r) => <SelectItem key={r} value={r.toLowerCase()}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Marital Status */}
                <div>
                  <Label className="text-token-xs">Marital Status</Label>
                  <Select>
                    <SelectTrigger className="mt-token-1"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      {maritalStatuses.map((m) => <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-token-3 mt-token-6">
                <Button variant="hero">
                  <FiSearch className="mr-token-2" /> Apply Filters
                </Button>
                <Button variant="outline">Reset All</Button>
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <p className="text-token-sm text-muted-foreground mb-token-4">
            Showing <span className="font-semibold text-foreground">{results.length}</span> profiles
          </p>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-token-6">
            {results.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Card className="overflow-hidden hover:shadow-elevated transition-shadow">
                  <div className="h-28 bg-gradient-primary relative">
                    {profile.verified && (
                      <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-primary text-token-xs px-token-2 py-token-1 rounded-full flex items-center gap-token-1 font-medium">
                        <GoShieldCheck style={{ fontSize: "var(--text-xs)" }} /> Verified
                      </div>
                    )}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full bg-card border-4 border-card flex items-center justify-center">
                      <span className="text-token-xl font-display font-bold text-primary">
                        {profile.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <CardContent className="pt-token-12 pb-token-6 text-center">
                    <h3 className="font-display text-token-base font-semibold text-foreground">{profile.name}</h3>
                    <p className="text-token-sm text-muted-foreground">{profile.age} years old</p>
                    <div className="flex items-center justify-center gap-token-1 text-token-xs text-muted-foreground mt-token-1">
                      <FiMapPin style={{ fontSize: "var(--text-xs)" }} /> {profile.location}
                      <span className="text-primary font-medium">· {profile.distance}</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-token-1 mt-token-3">
                      <span className="text-token-xs bg-primary/10 text-primary px-token-2 py-0.5 rounded-full">
                        {profile.religiosity}
                      </span>
                      <span className="text-token-xs bg-accent/20 text-accent-foreground px-token-2 py-0.5 rounded-full">
                        {profile.education}
                      </span>
                      <span className="text-token-xs bg-secondary/20 text-secondary-foreground px-token-2 py-0.5 rounded-full">
                        {profile.caste}
                      </span>
                      <span className="text-token-xs bg-muted text-muted-foreground px-token-2 py-0.5 rounded-full">
                        {profile.sect}
                      </span>
                    </div>
                    <div className="flex gap-token-2 mt-token-4">
                      <Button variant="hero" size="sm" className="flex-1">
                        <FiHeart className="mr-token-1" /> Interest
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SearchPage;
