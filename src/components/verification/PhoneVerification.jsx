import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FiPhone, FiCheckCircle, FiSend, FiShield, FiRefreshCw } from "react-icons/fi";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const PhoneVerification = () => {
  const { user, profile, fetchProfile } = useAuth();
  const [phone, setPhone] = useState(profile?.phone_number || "");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const isVerified = profile?.phone_verified && profile?.phone_number === phone;

  const handleSendOTP = async () => {
    if (!phone.trim()) return toast.error("Please enter your phone number");
    if (!phone.startsWith("+")) {
      return toast.error("Include country code (e.g. +923001234567)");
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { phoneNumber: phone.trim() },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      toast.success("OTP sent! Check your phone.");
      setStep("otp");
      setCountdown(60);
      setOtp("");
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) return toast.error("Enter the 6-digit code");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { otp: otp.trim(), phoneNumber: phone.trim() },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      toast.success("Phone number verified! 🎉");
      await fetchProfile(user.id);
      setStep("phone");
    } catch (err) {
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-token-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="card-section-title flex items-center gap-token-2">
            <FiPhone className="text-primary" /> Phone Verification
          </h2>
          {profile?.phone_verified ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <FiCheckCircle className="mr-1" /> Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-500/30">
              Not Verified
            </Badge>
          )}
        </div>

        <p className="text-token-xs text-muted-foreground">
          Verify your phone number to increase your trust score and unlock full platform features.
        </p>

        {profile?.phone_verified && profile?.phone_number && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <FiShield className="text-emerald-500 flex-shrink-0" />
            <span className="text-token-sm text-foreground font-medium">{profile.phone_number}</span>
          </div>
        )}

        {step === "phone" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="phone" className="text-token-sm">Phone Number</Label>
              <div className="flex gap-2 mt-token-1">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+923001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendOTP}
                  disabled={loading || !phone.trim()}
                  className="gap-2 shrink-0"
                >
                  {loading ? (
                    <FiRefreshCw className="animate-spin" />
                  ) : (
                    <><FiSend /> Send Code</>
                  )}
                </Button>
              </div>
              <p className="text-token-xs text-muted-foreground mt-1">
                Include country code — e.g. +92 for Pakistan, +44 for UK
              </p>
            </div>
          </div>
        )}

        {step === "otp" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-token-sm text-foreground">
              Code sent to <strong>{phone}</strong>. Valid for 10 minutes.
            </div>

            <div>
              <Label htmlFor="otp" className="text-token-sm">Enter 6-Digit Code</Label>
              <div className="flex gap-2 mt-token-1">
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 text-center text-xl tracking-widest font-mono"
                />
                <Button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  variant="hero"
                  className="shrink-0"
                >
                  {loading ? <FiRefreshCw className="animate-spin" /> : "Verify"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-token-xs">
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setStep("phone")}
              >
                ← Change number
              </button>
              {countdown > 0 ? (
                <span className="text-muted-foreground">Resend in {countdown}s</span>
              ) : (
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-primary hover:underline transition-colors"
                >
                  Resend code
                </button>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhoneVerification;
