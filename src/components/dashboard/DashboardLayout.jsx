import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { FiBell, FiLogOut, FiSend, FiCheckCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MarriedRestrictionScreen = ({ user, onSignOut }) => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ couple_names: "", location: "", review: "" });
  const { toast } = useToast();

  useEffect(() => {
    const fetchStory = async () => {
      const { data } = await supabase
        .from("success_stories")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setStory(data);
      setLoading(false);
    };
    if (user?.id) fetchStory();
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.couple_names.trim() || !form.review.trim()) {
      toast({ title: "Please fill in couple names and your story", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("success_stories").insert({
      user_id: user.id,
      couple_names: form.couple_names.trim(),
      location: form.location.trim() || null,
      review: form.review.trim(),
      rating: 5,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Jazakallah! Your story has been submitted for review." });
      const { data } = await supabase.from("success_stories").select("*").eq("user_id", user.id).maybeSingle();
      setStory(data);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted islamic-pattern flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted islamic-pattern flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-6">
        {/* Mubarak Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto text-4xl">
            💍
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Mubarak! Profile Closed
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your profile has been marked as <span className="font-semibold text-primary">Married via PureNikah</span> by the administrator. Alhamdulillah! Your account is now closed as you have found your life partner.
            </p>
          </div>
        </div>

        {/* Story Section */}
        {story ? (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            {story.is_approved ? (
              <>
                <div className="flex items-center gap-2 text-green-600">
                  <FiCheckCircle className="text-lg" />
                  <span className="font-medium">Your story is live!</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your success story is now visible on the homepage, inspiring other Muslims to find their halal match. Jazakallah khair!
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-amber-600">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="font-medium">Story under review</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your story has been submitted and is awaiting approval. Once approved, it will appear on the homepage.
                </p>
                <div className="bg-muted rounded-lg p-4 text-sm">
                  <p className="font-medium text-foreground mb-1">{story.couple_names}</p>
                  <p className="text-muted-foreground italic">"{story.review}"</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="text-center pb-2">
              <h2 className="font-display font-semibold text-foreground">Share Your Success Story</h2>
              <p className="text-xs text-muted-foreground">Inspire others by sharing your journey to finding halal love</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="couple_names">Couple Names *</Label>
                <Input
                  id="couple_names"
                  placeholder="e.g. Ahmed & Fatima"
                  value={form.couple_names}
                  onChange={(e) => setForm({ ...form, couple_names: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Karachi, Pakistan"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="review">Your Story *</Label>
                <Textarea
                  id="review"
                  placeholder="Share how PureNikah helped you find your spouse..."
                  value={form.review}
                  onChange={(e) => setForm({ ...form, review: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FiSend /> Submit Story
                </span>
              )}
            </Button>
          </form>
        )}

        {/* Support & Sign Out */}
        <div className="space-y-3">
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm text-muted-foreground text-center">
            <p>If you believe this is a mistake, please contact our support team at <span className="text-primary font-medium">support@purenikah.com</span></p>
          </div>
          <Button variant="outline" onClick={onSignOut} className="w-full">
            <FiLogOut className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (profile?.is_married) {
    return <MarriedRestrictionScreen user={user} onSignOut={handleSignOut} />;
  }

  const initial = profile?.first_name?.charAt(0)?.toUpperCase() || "U";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-navbar flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-lg px-token-4 sticky top-0 z-sticky">
            <div className="flex items-center gap-token-3">
              <SidebarTrigger className="text-muted-foreground" />
              <span className="text-token-sm text-muted-foreground hidden sm:inline">Dashboard</span>
            </div>
            <div className="flex items-center gap-token-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard/notifications">
                  <FiBell style={{ fontSize: "var(--size-icon)" }} />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
                <FiLogOut style={{ fontSize: "var(--size-icon)" }} />
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-xs font-bold">
                {initial}
              </div>
            </div>
          </header>

          <main className="flex-1 bg-muted islamic-pattern">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
