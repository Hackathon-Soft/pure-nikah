import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiMapPin, FiRefreshCw, FiSearch } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getDisplayName } from "@/lib/displayName.js";

const NearbyMatches = () => {
  const { user, profile } = useAuth();
  const city = profile?.city?.trim();

  const { data: matches = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["nearby-matches", user?.id, city],
    enabled: Boolean(user?.id && city),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_profiles")
        .select("*")
        .eq("city", city)
        .eq("profile_completed", true)
        .eq("show_in_search", true)
        .eq("is_banned", false)
        .eq("is_married", false)
        .neq("user_id", user.id)
        .limit(24);
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="p-token-4 md:p-token-8 max-w-6xl mx-auto space-y-6">
      <div>
        <p className="section-label">Location-based discovery</p>
        <h1 className="page-title mt-2">Nearby Matches</h1>
        <p className="text-muted-foreground mt-1">
          Browse compatible profiles in your selected city. We only use your city—not your precise location.
        </p>
      </div>

      {!city ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <FiMapPin className="mx-auto text-primary text-4xl" />
            <h2 className="text-token-xl font-display font-semibold text-foreground">Add your city first</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Complete your profile location to see nearby proposals while keeping your exact address private.
            </p>
            <Button asChild><Link to="/dashboard/edit-profile">Complete profile</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline" className="gap-2"><FiMapPin /> {city}</Badge>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
              <FiRefreshCw className={isLoading ? "mr-2 animate-spin" : "mr-2"} /> Refresh
            </Button>
          </div>

          {isError ? (
            <Card><CardContent className="py-12 text-center text-destructive">Unable to load nearby profiles. Please try again.</CardContent></Card>
          ) : isLoading ? (
            <div className="py-16 text-center text-muted-foreground">Finding profiles near you…</div>
          ) : matches.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center space-y-3">
                <FiSearch className="mx-auto text-muted-foreground text-3xl" />
                <h2 className="text-token-xl font-display font-semibold text-foreground">No nearby matches yet</h2>
                <p className="text-muted-foreground">Try the full search to explore other cities and preferences.</p>
                <Button asChild variant="outline"><Link to="/dashboard/search">Open search</Link></Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match) => (
                <Card key={match.user_id} className="overflow-hidden">
                  <CardContent className="p-5 space-y-3">
                    <div>
                      <h2 className="font-display text-token-lg font-semibold text-foreground">
                        {getDisplayName(match)}
                      </h2>
                      <p className="text-token-sm text-muted-foreground flex items-center gap-1">
                        <FiMapPin /> {match.city}{match.state ? `, ${match.state}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {match.marital_status && <Badge variant="secondary">{match.marital_status.replace(/_/g, " ")}</Badge>}
                      {match.sect && <Badge variant="outline">{match.sect}</Badge>}
                      {match.is_verified && <Badge className="bg-emerald-600">Verified</Badge>}
                    </div>
                    <Button asChild className="w-full" variant="outline">
                      <Link to={`/profile/${match.user_id}`}>View profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NearbyMatches;