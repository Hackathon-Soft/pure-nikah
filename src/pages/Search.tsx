import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search as SearchIcon, MapPin, BookOpen, Heart } from "lucide-react";
import { useState } from "react";

const mockProfiles = [
  { id: 1, name: "Ahmed K.", age: 28, location: "London, UK", education: "Masters", religiosity: "Practicing", sect: "Sunni" },
  { id: 2, name: "Fatima A.", age: 25, location: "Toronto, CA", education: "Bachelors", religiosity: "Very Practicing", sect: "Sunni" },
  { id: 3, name: "Yusuf M.", age: 31, location: "Dubai, UAE", education: "PhD", religiosity: "Practicing", sect: "Sunni" },
  { id: 4, name: "Aisha R.", age: 24, location: "New York, US", education: "Masters", religiosity: "Practicing", sect: "Sunni" },
  { id: 5, name: "Omar H.", age: 30, location: "Kuala Lumpur, MY", education: "Bachelors", religiosity: "Very Practicing", sect: "Sunni" },
  { id: 6, name: "Maryam S.", age: 27, location: "Istanbul, TR", education: "Masters", religiosity: "Practicing", sect: "Sunni" },
];

const SearchPage = () => {
  const [results] = useState(mockProfiles);

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-muted islamic-pattern">
        <div className="container mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Search Profiles</h1>
            <p className="text-muted-foreground mb-8">Find your compatible match using our advanced filters.</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border shadow-card p-6 mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs">Age Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Min" type="number" className="w-full" />
                  <Input placeholder="Max" type="number" className="w-full" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Country</Label>
                <Select>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="ae">UAE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Education</Label>
                <Select>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelors">Bachelors</SelectItem>
                    <SelectItem value="masters">Masters</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="hero" className="w-full">
                  <SearchIcon className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Card className="overflow-hidden hover:shadow-elevated transition-shadow">
                  <div className="h-32 bg-gradient-primary relative">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full bg-card border-4 border-card flex items-center justify-center">
                      <span className="text-2xl font-display font-bold text-primary">
                        {profile.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <CardContent className="pt-14 pb-6 text-center">
                    <h3 className="font-display text-lg font-semibold text-foreground">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">{profile.age} years old</p>
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" /> {profile.location}
                    </div>
                    <div className="flex justify-center gap-2 mt-3">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> {profile.religiosity}
                      </span>
                      <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full">
                        {profile.education}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="hero" size="sm" className="flex-1">
                        <Heart className="h-3 w-3 mr-1" /> Interest
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Profile
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
