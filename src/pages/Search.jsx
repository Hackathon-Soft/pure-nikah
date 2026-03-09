import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  FiSearch, FiMapPin, FiBookOpen, FiHeart, FiFilter, FiShield,
  FiX, FiChevronDown, FiChevronUp, FiRefreshCw,
} from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { calculateCompatibility } from "@/lib/compatibility";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ProtectedContent } from "@/components/protection/ContentProtection";
import { getDisplayName } from "@/lib/displayName";

const cities = ["Any", "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Bahawalpur"];
const countries = ["Any", "Pakistan", "UK", "USA", "Canada", "UAE", "Saudi Arabia", "Australia", "Germany"];
const castes = ["Any", "Syed", "Rajput", "Mughal", "Arain", "Jat", "Sheikh", "Pathan", "Baloch", "Malik", "Other"];
const educationOptions = ["Any", "Matric", "Intermediate", "Bachelors", "Masters", "PhD", "Islamic Scholar"];
const sects = ["Any", "Sunni", "Shia", "Deobandi", "Barelvi", "Ahl-e-Hadith"];
const maritalOptions = ["Any", "Never Married", "Divorced", "Widowed", "Separated"];
const religiosityOptions = ["Any", "Very Practicing", "Practicing", "Moderate", "Liberal"];
const languageOptions = ["Any", "Urdu", "English", "Punjabi", "Pashto", "Sindhi", "Balochi", "Arabic"];
const heightOptions = ["Any", "Below 5'0\"", "5'0\" - 5'4\"", "5'5\" - 5'8\"", "5'9\" - 6'0\"", "Above 6'0\""];

const defaultFilters = {
  searchType: "all",
  searchText: "",
  ageRange: [18, 55],
  city: "any",
  country: "any",
  sect: "any",
  caste: "any",
  education: "any",
  maritalStatus: "any",
  religiosity: "any",
  language: "any",
  height: "any",
  willingToRelocate: false,
  verifiedOnly: false,
  inPersonVerifiedOnly: false,
  withPhotoOnly: false,
};

const SearchPage = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(() => {
    const initial = { ...defaultFilters };
    // Parse URL params from "Browse profiles by" section
    const urlMarital = searchParams.get("marital_status");
    const urlCaste = searchParams.get("caste");
    const urlSect = searchParams.get("sect");
    const urlState = searchParams.get("state");
    const urlCity = searchParams.get("city");
    if (urlMarital) { initial.maritalStatus = urlMarital.toLowerCase(); initial.searchType = "all"; }
    if (urlCaste) initial.caste = urlCaste.toLowerCase();
    if (urlSect) initial.sect = urlSect.toLowerCase();
    if (urlCity) initial.city = urlCity.toLowerCase();
    if (urlState) initial.city = urlState.toLowerCase();
    const hasUrlFilter = urlMarital || urlCaste || urlSect || urlState || urlCity;
    if (hasUrlFilter) initial.searchText = "";
    return initial;
  });

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const resetFilters = () => setFilters({ ...defaultFilters });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.city !== "any") count++;
    if (filters.country !== "any") count++;
    if (filters.sect !== "any") count++;
    if (filters.caste !== "any") count++;
    if (filters.education !== "any") count++;
    if (filters.maritalStatus !== "any") count++;
    if (filters.religiosity !== "any") count++;
    if (filters.language !== "any") count++;
    if (filters.height !== "any") count++;
    if (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 55) count++;
    if (filters.willingToRelocate) count++;
    if (filters.verifiedOnly) count++;
    if (filters.inPersonVerifiedOnly) count++;
    if (filters.withPhotoOnly) count++;
    return count;
  }, [filters]);

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

  const profiles = dbProfiles.filter((p) => p.user_id !== user?.id);

  const myPreferences = profile
    ? {
        ageMin: profile.preferred_age_min || 18,
        ageMax: profile.preferred_age_max || 45,
        city: profile.city || "",
        sect: profile.sect || "",
        cast: profile.caste || "Any",
        education: profile.education || "",
        religiosity: profile.religious_practice || "",
        maritalStatus: profile.marital_status || "Any",
        preferVerified: true,
      }
    : {
        ageMin: 18, ageMax: 45, city: "", sect: "Sunni", cast: "Any",
        education: "Bachelors", religiosity: "Practicing", maritalStatus: "Any", preferVerified: true,
      };

  const getAge = (dob) => {
    if (!dob) return null;
    return Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000);
  };

  const matchesHeight = (profileHeight, filterHeight) => {
    if (filterHeight === "any" || !profileHeight) return true;
    // Simple string matching for height ranges
    const h = profileHeight.toLowerCase();
    if (filterHeight.includes("Below 5'0")) return h.includes("4'") || h.includes("4ft");
    if (filterHeight.includes("5'0\" - 5'4")) return h.includes("5'0") || h.includes("5'1") || h.includes("5'2") || h.includes("5'3") || h.includes("5'4") || h.includes("5ft");
    if (filterHeight.includes("5'5\" - 5'8")) return h.includes("5'5") || h.includes("5'6") || h.includes("5'7") || h.includes("5'8");
    if (filterHeight.includes("5'9\" - 6'0")) return h.includes("5'9") || h.includes("5'10") || h.includes("5'11") || h.includes("6'0");
    if (filterHeight.includes("Above 6'0")) return h.includes("6'1") || h.includes("6'2") || h.includes("6'3") || h.includes("6'4") || h.includes("6'5") || h.includes("6'6");
    return true;
  };

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const age = getAge(p.date_of_birth);
      // Gender / type
      if (filters.searchType === "male" && p.gender !== "male") return false;
      if (filters.searchType === "female" && p.gender !== "female") return false;
      if (filters.searchType === "widowed" && p.marital_status !== "widowed") return false;
      if (filters.searchType === "divorced" && p.marital_status !== "divorced") return false;
      // Text search
      if (filters.searchText) {
        const q = filters.searchText.toLowerCase();
        const match = [p.first_name, p.last_name, p.city, p.caste, p.profession, p.sect]
          .filter(Boolean).some((v) => v.toLowerCase().includes(q));
        if (!match) return false;
      }
      // Age
      if (age !== null && (age < filters.ageRange[0] || age > filters.ageRange[1])) return false;
      // City
      if (filters.city !== "any" && p.city?.toLowerCase() !== filters.city) return false;
      // Country
      if (filters.country !== "any" && p.country?.toLowerCase() !== filters.country) return false;
      // Sect
      if (filters.sect !== "any" && p.sect?.toLowerCase() !== filters.sect) return false;
      // Caste
      if (filters.caste !== "any" && p.caste?.toLowerCase() !== filters.caste) return false;
      // Education
      if (filters.education !== "any" && p.education?.toLowerCase() !== filters.education) return false;
      // Marital
      if (filters.maritalStatus !== "any" && p.marital_status?.toLowerCase().replace(/_/g, " ") !== filters.maritalStatus) return false;
      // Religiosity
      if (filters.religiosity !== "any" && p.religious_practice?.toLowerCase() !== filters.religiosity) return false;
      // Language
      if (filters.language !== "any") {
        const langs = (p.languages || []).map((l) => l.toLowerCase());
        if (!langs.includes(filters.language)) return false;
      }
      // Height
      if (!matchesHeight(p.height, filters.height)) return false;
      // Willing to relocate
      if (filters.willingToRelocate && !p.willing_to_relocate) return false;
      // Verified only
      if (filters.verifiedOnly && !p.is_verified) return false;
      // In-person verified
      if (filters.inPersonVerifiedOnly && !p.in_person_verified) return false;
      return true;
    });
  }, [profiles, filters]);

  const withScores = useMemo(() => {
    return filtered
      .map((p) => ({
        ...p,
        compatibility: calculateCompatibility(myPreferences, {
          sect: p.sect, cast: p.caste, city: p.city, education: p.education,
          age: getAge(p.date_of_birth) || 25,
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
      toast({ title: "Failed", description: err.message?.includes("duplicate") ? "You already sent an interest." : err.message, variant: "destructive" });
    },
  });

  const FilterSelect = ({ label, value, onChange, options }) => (
    <div>
      <Label className="text-token-xs text-muted-foreground mb-1 block">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-token-1">
          <SelectValue placeholder="Any" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o.toLowerCase()}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="search-page">
      <div className="app-container py-token-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title mb-token-2">Search Proposals</h1>
          <p className="text-body-muted mb-token-6">Find your ideal match using powerful filters and preferences.</p>
        </motion.div>

        {/* Type tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-token-3 mb-token-6 flex-wrap">
          {[
            { label: "All Proposals", value: "all" },
            { label: "Grooms (Male)", value: "male" },
            { label: "Brides (Female)", value: "female" },
            { label: "🕊️ Widowed", value: "widowed" },
            { label: "💫 Divorced", value: "divorced" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateFilter("searchType", tab.value)}
              className={filters.searchType === tab.value ? "pill-active" : "pill-inactive"}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`pill-inactive ml-auto flex items-center gap-token-2 ${activeFilterCount > 0 ? "ring-2 ring-primary/30" : ""}`}
          >
            <FiFilter style={{ fontSize: "var(--size-icon-sm)" }} />
            {showFilters ? "Hide" : "Show"} Filters
            {activeFilterCount > 0 && (
              <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 ml-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </button>
        </motion.div>

        {/* Special banners */}
        {(filters.searchType === "widowed" || filters.searchType === "divorced") && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-token-6">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="info-banner">
                <div className="info-banner-icon">
                  <FiHeart className="text-primary" style={{ fontSize: "var(--size-icon)" }} />
                </div>
                <div className="info-banner-content">
                  <p className="info-banner-title">
                    {filters.searchType === "widowed" ? "Special Support for Widowed Members" : "Fresh Start for Divorced Members"}
                  </p>
                  <p className="info-banner-text">
                    {filters.searchType === "widowed"
                      ? "We understand your journey. Enjoy free premium features, priority matching, and a free verified badge."
                      : "Everyone deserves a second chance. Get 50% off premium, priority search placement, and free verification."}
                  </p>
                </div>
                <Button variant="hero" size="sm" asChild><Link to="/pricing">View Discounts</Link></Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="search-bar">
          <div className="search-bar-inner">
            <div className="search-input-wrapper">
              <HiOutlineLocationMarker className="search-input-icon" style={{ fontSize: "var(--size-icon)" }} />
              <Input
                placeholder="Search by name, city, caste, profession..."
                className="pl-10"
                value={filters.searchText}
                onChange={(e) => updateFilter("searchText", e.target.value)}
              />
            </div>
            <Button variant="hero">
              <FiSearch className="mr-token-2" style={{ fontSize: "var(--size-icon)" }} /> Search
            </Button>
          </div>
        </motion.div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 mb-token-4 mt-token-3">
            {filters.city !== "any" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                City: {filters.city} <button onClick={() => updateFilter("city", "any")}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {filters.country !== "any" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Country: {filters.country} <button onClick={() => updateFilter("country", "any")}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {filters.sect !== "any" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Sect: {filters.sect} <button onClick={() => updateFilter("sect", "any")}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {filters.caste !== "any" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Caste: {filters.caste} <button onClick={() => updateFilter("caste", "any")}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {filters.education !== "any" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Education: {filters.education} <button onClick={() => updateFilter("education", "any")}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {filters.maritalStatus !== "any" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Marital: {filters.maritalStatus} <button onClick={() => updateFilter("maritalStatus", "any")}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {filters.religiosity !== "any" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Religiosity: {filters.religiosity} <button onClick={() => updateFilter("religiosity", "any")}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {filters.language !== "any" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Language: {filters.language} <button onClick={() => updateFilter("language", "any")}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {filters.height !== "any" && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Height: {filters.height} <button onClick={() => updateFilter("height", "any")}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {(filters.ageRange[0] !== 18 || filters.ageRange[1] !== 55) && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Age: {filters.ageRange[0]}-{filters.ageRange[1]} <button onClick={() => updateFilter("ageRange", [18, 55])}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {filters.verifiedOnly && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Verified Only <button onClick={() => updateFilter("verifiedOnly", false)}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {filters.inPersonVerifiedOnly && (
              <Badge variant="secondary" className="gap-1 pr-1">
                In-Person Verified <button onClick={() => updateFilter("inPersonVerifiedOnly", false)}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            {filters.willingToRelocate && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Willing to Relocate <button onClick={() => updateFilter("willingToRelocate", false)}><FiX className="w-3 h-3" /></button>
              </Badge>
            )}
            <button onClick={resetFilters} className="text-token-xs text-primary hover:underline flex items-center gap-1">
              <FiRefreshCw className="w-3 h-3" /> Clear all
            </button>
          </motion.div>
        )}

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="mb-token-6">
                <CardContent className="p-token-6">
                  <div className="flex items-center justify-between mb-token-5">
                    <h3 className="card-section-title">Advanced Filters</h3>
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                      <FiRefreshCw className="mr-1 w-3 h-3" /> Reset All
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Age Range - spans 2 cols */}
                    <div className="sm:col-span-2">
                      <Label className="text-token-xs text-muted-foreground">
                        Age Range: <span className="font-semibold text-foreground">{filters.ageRange[0]} – {filters.ageRange[1]}</span>
                      </Label>
                      <Slider
                        min={18} max={60} step={1}
                        value={filters.ageRange}
                        onValueChange={(v) => updateFilter("ageRange", v)}
                        className="mt-token-3"
                      />
                    </div>

                    <FilterSelect label="Country" value={filters.country} onChange={(v) => updateFilter("country", v)} options={countries} />
                    <FilterSelect label="City" value={filters.city} onChange={(v) => updateFilter("city", v)} options={cities} />
                    <FilterSelect label="Sect / Maslak" value={filters.sect} onChange={(v) => updateFilter("sect", v)} options={sects} />
                    <FilterSelect label="Caste / Tribe" value={filters.caste} onChange={(v) => updateFilter("caste", v)} options={castes} />
                    <FilterSelect label="Education" value={filters.education} onChange={(v) => updateFilter("education", v)} options={educationOptions} />
                    <FilterSelect label="Marital Status" value={filters.maritalStatus} onChange={(v) => updateFilter("maritalStatus", v)} options={maritalOptions} />
                    <FilterSelect label="Religiosity Level" value={filters.religiosity} onChange={(v) => updateFilter("religiosity", v)} options={religiosityOptions} />
                    <FilterSelect label="Language" value={filters.language} onChange={(v) => updateFilter("language", v)} options={languageOptions} />
                    <FilterSelect label="Height" value={filters.height} onChange={(v) => updateFilter("height", v)} options={heightOptions} />
                  </div>

                  {/* Toggle Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-token-5 pt-token-5 border-t border-border">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-token-xs text-muted-foreground">Verified Only</Label>
                      <Switch checked={filters.verifiedOnly} onCheckedChange={(v) => updateFilter("verifiedOnly", v)} />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-token-xs text-muted-foreground">In-Person Verified</Label>
                      <Switch checked={filters.inPersonVerifiedOnly} onCheckedChange={(v) => updateFilter("inPersonVerifiedOnly", v)} />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-token-xs text-muted-foreground">Willing to Relocate</Label>
                      <Switch checked={filters.willingToRelocate} onCheckedChange={(v) => updateFilter("willingToRelocate", v)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {isLoading ? (
          <div className="empty-state"><p className="text-body-muted">Loading profiles...</p></div>
        ) : (
          <>
            <p className="text-body-muted mb-token-4">Showing {withScores.length} proposals — sorted by compatibility</p>

            {withScores.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-title">No profiles found</p>
                <p className="empty-state-text">Try adjusting your filters or check back later.</p>
                {activeFilterCount > 0 && (
                  <Button variant="outline" size="sm" onClick={resetFilters} className="mt-token-3">
                    <FiRefreshCw className="mr-1" /> Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <ProtectedContent className="grid-3col">
                {withScores.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(0.05 * i, 0.5) }}>
                    <Card className="card-profile">
                      <div className="card-profile-header">
                        <div className="absolute top-3 right-3 flex gap-1">
                          {p.is_verified && (
                            <div className="verified-badge">
                              <FiShield style={{ fontSize: "var(--text-xs)" }} /> Verified
                            </div>
                          )}
                          {p.in_person_verified && (
                            <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] dark:bg-blue-900/30 dark:text-blue-300">
                              In-Person ✓
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-3 left-3">
                          <CompatibilityBadge score={p.compatibility} preferences={myPreferences} candidate={p} size="sm" />
                        </div>
                        <div className="card-profile-avatar">
                          <span className="card-profile-avatar-text">{p.first_name?.charAt(0) || "?"}</span>
                        </div>
                      </div>
                      <CardContent className="px-token-4 pt-token-14 pb-token-6 text-center">
                        <h3 className="card-section-title">{p.first_name} {p.last_name?.charAt(0) || ""}.</h3>
                        <p className="text-body-muted">{getAge(p.date_of_birth) || "N/A"} years old • {p.caste || "N/A"}</p>
                        <div className="flex items-center justify-center gap-token-1 text-body-muted-xs mt-token-1">
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
              </ProtectedContent>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
