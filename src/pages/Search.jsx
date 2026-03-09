import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FiSearch, FiMapPin, FiBookOpen, FiHeart, FiFilter, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useState, useMemo } from "react";
import { calculateCompatibility } from "@/lib/compatibility";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const cities = ["Any", "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];
const castes = ["Any", "Syed", "Rajput", "Mughal", "Arain", "Jat", "Sheikh", "Pathan", "Baloch", "Malik", "Other"];
const educationOptions = ["Any", "Matric", "Intermediate", "Bachelors", "Masters", "PhD", "Islamic Scholar"];
const sects = ["Any", "Sunni", "Shia", "Deobandi", "Barelvi", "Ahl-e-Hadith"];
const maritalOptions = ["Any", "Never Married", "Divorced", "Widowed"];

const SearchPage = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showFilters, setShowFilters] = useState(false);
  const [ageRange, setAgeRange] = useState([18, 45]);
  const [searchType, setSearchType] = useState("all");
  const [cityFilter, setCityFilter] = useState("any");
  const [searchText, setSearchText] = useState("");

  // Fetch profiles from database — exclude married users
  const { data: dbProfiles = [], isLoading } = useQuery({
    queryKey: ["search-profiles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("profile_completed", true)
        .or("is_married.is.null,is_married.eq.false");
      return data || [];
    },
  });

  // Filter out current user's profile
  const profiles = dbProfiles.filter(p => p.user_id !== user?.id);

  const myPreferences = profile ? {
    ageMin: profile.preferred_age_min || 18,
    ageMax: profile.preferred_age_max || 45,
    city: profile.city || "",
    sect: profile.sect || "",
    cast: profile.caste || "Any",
    education: profile.education || "",
    religiosity: profile.religious_practice || "",
    maritalStatus: profile.marital_status || "Any",
    preferVerified: true,
  } : {
    ageMin: 18, ageMax: 45, city: "", sect: "Sunni", cast: "Any",
    education: "Bachelors", religiosity: "Practicing", maritalStatus: "Any", preferVerified: true,
  };

  const filtered = profiles.filter((p) => {
    if (searchType === "male" && p.gender !== "male") return false;
    if (searchType === "female" && p.gender !== "female") return false;
    if (searchType === "widowed" && p.marital_status !== "widowed") return false;
    if (searchType === "divorced" && p.marital_status !== "divorced") return false;
    if (cityFilter !== "any" && p.city?.toLowerCase() !== cityFilter) return false;
    if (searchText && !p.first_name?.toLowerCase().includes(searchText.toLowerCase()) && !p.city?.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const withScores = useMemo(() => {
    return filtered
      .map((p) => ({
        ...p,
        compatibility: calculateCompatibility(myPreferences, {
          sect: p.sect, cast: p.caste, city: p.city, education: p.education,
          age: p.date_of_birth ? Math.floor((Date.now() - new Date(p.date_of_birth).getTime()) / 31557600000) : 25,
          maritalStatus: p.marital_status, religiosity: p.religious_practice,
        }),
      }))
      .sort((a, b) => b.compatibility - a.compatibility);
  }, [filtered, myPreferences]);

  const sendInterestMutation = useMutation({
    mutationFn: async (toUserId) => {
      const { error } = await supabase.from("interests").insert({
        from_user_id: user.id,
        to_user_id: toUserId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Interest sent!", description: "The user will be notified." });
      queryClient.invalidateQueries({ queryKey: ["interests-sent"] });
    },
    onError: (err) => {
      toast({ title: "Failed", description: err.message?.includes("duplicate") ? "You already sent an interest to this user." : err.message, variant: "destructive" });
    },
  });

  const getAge = (dob) => {
    if (!dob) return "N/A";
    return Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000);
  };

  return (
    <div className="min-h-screen bg-muted islamic-pattern">
      <div className="app-container py-token-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title mb-token-2">Search Proposals</h1>
          <p className="text-muted-foreground mb-token-6">Find proposals by location, cast, preferences, or custom filters.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-token-3 mb-token-6 flex-wrap">
          {[
            { label: "All Proposals", value: "all" },
            { label: "Grooms (Male)", value: "male" },
            { label: "Brides (Female)", value: "female" },
            { label: "🕊️ Widowed", value: "widowed" },
            { label: "💫 Divorced", value: "divorced" },
          ].map((tab) => (
            <button key={tab.value} onClick={() => setSearchType(tab.value)} className={searchType === tab.value ? "pill-active" : "pill-inactive"}>
              {tab.label}
            </button>
          ))}
          <button onClick={() => setShowFilters(!showFilters)} className="pill-inactive ml-auto flex items-center gap-token-2">
            <FiFilter style={{ fontSize: "var(--size-icon-sm)" }} />
            {showFilters ? "Hide" : "Show"} Filters
          </button>
        </motion.div>

        {(searchType === "widowed" || searchType === "divorced") && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-token-6">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-token-4 flex items-center gap-token-4 flex-wrap">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FiHeart className="text-primary" style={{ fontSize: "var(--size-icon)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-token-sm font-semibold text-foreground">
                    {searchType === "widowed" ? "Special Support for Widowed Members" : "Fresh Start for Divorced Members"}
                  </p>
                  <p className="text-token-xs text-muted-foreground">
                    {searchType === "widowed"
                      ? "We understand your journey. Enjoy free premium features, priority matching, and a free verified badge as our support."
                      : "Everyone deserves a second chance. Get 50% off premium, priority search placement, and free verification."}
                  </p>
                </div>
                <Button variant="hero" size="sm" asChild><Link to="/pricing">View Discounts</Link></Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card-base p-token-4 mb-token-6">
          <div className="flex flex-col sm:flex-row gap-token-3">
            <div className="flex-1 relative">
              <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ fontSize: "var(--size-icon)" }} />
              <Input placeholder="Search by city..." className="pl-10" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
            <Button variant="hero"><FiSearch className="mr-token-2" style={{ fontSize: "var(--size-icon)" }} /> Search</Button>
          </div>
        </motion.div>

        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="card-base p-token-6 mb-token-8">
            <h3 className="card-section-title mb-token-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-token-4">
              <div className="sm:col-span-2">
                <Label className="text-token-xs">Age Range: {ageRange[0]} - {ageRange[1]}</Label>
                <Slider min={18} max={60} step={1} value={ageRange} onValueChange={setAgeRange} className="mt-token-3" />
              </div>
              <div><Label className="text-token-xs">City</Label><Select value={cityFilter} onValueChange={setCityFilter}><SelectTrigger className="mt-token-1"><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{cities.map((c) => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div><Label className="text-token-xs">Sect / Maslak</Label><Select><SelectTrigger className="mt-token-1"><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{sects.map((s) => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}</SelectContent></Select></div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="text-center py-token-12"><p className="text-muted-foreground">Loading profiles...</p></div>
        ) : (
          <>
            <p className="text-token-sm text-muted-foreground mb-token-4">Showing {withScores.length} proposals — sorted by compatibility</p>

            {withScores.length === 0 ? (
              <div className="text-center py-token-12">
                <p className="text-token-lg font-display font-semibold text-foreground mb-token-2">No profiles found</p>
                <p className="text-token-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-token-6">
                {withScores.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                    <Card className="overflow-hidden hover:shadow-elevated transition-shadow">
                      <div className="h-32 bg-gradient-primary relative">
                        {p.is_verified && (
                          <div className="verified-badge absolute top-3 right-3">
                            <FiShield style={{ fontSize: "var(--text-xs)" }} /> Verified
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <CompatibilityBadge score={p.compatibility} preferences={myPreferences} candidate={p} size="sm" />
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[var(--size-avatar)] h-[var(--size-avatar)] rounded-full bg-card border-4 border-card flex items-center justify-center">
                          <span className="text-token-2xl font-display font-bold text-primary">{p.first_name?.charAt(0) || "?"}</span>
                        </div>
                      </div>
                      <CardContent className="px-token-4 pt-token-14 pb-token-6 text-center">
                        <h3 className="card-section-title">{p.first_name} {p.last_name?.charAt(0) || ""}.</h3>
                        <p className="text-token-sm text-muted-foreground">{getAge(p.date_of_birth)} years old • {p.caste || "N/A"}</p>
                        <div className="flex items-center justify-center gap-token-1 text-token-xs text-muted-foreground mt-token-1">
                          <FiMapPin style={{ fontSize: "var(--text-xs)" }} /> {p.city || "Unknown"}, {p.country || "Pakistan"}
                        </div>
                        <div className="flex justify-center gap-token-2 mt-token-3 flex-wrap">
                          {p.religious_practice && <span className="badge-primary flex items-center gap-token-1"><FiBookOpen style={{ fontSize: "var(--text-xs)" }} /> {p.religious_practice}</span>}
                          {p.education && <span className="badge-accent">{p.education}</span>}
                          {p.sect && <span className="badge-muted">{p.sect}</span>}
                        </div>
                        <div className="flex gap-token-2 mt-token-4">
                          {isAuthenticated ? (
                            <Button variant="hero" size="sm" className="flex-1" onClick={() => sendInterestMutation.mutate(p.user_id)}>
                              <FiHeart className="mr-token-1" style={{ fontSize: "var(--text-xs)" }} /> Interest
                            </Button>
                          ) : (
                            <Button variant="hero" size="sm" className="flex-1" asChild><Link to="/register">Sign Up</Link></Button>
                          )}
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link to={`/profile/${p.user_id}`}>View Profile</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
