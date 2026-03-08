import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FiMail, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VerifyEmail = () => {
  const [resending, setResending] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const email = location.state?.email;

  const handleResend = async () => {
    if (!email) {
      toast({ title: "No email found", description: "Please register again.", variant: "destructive" });
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResending(false);
    if (error) {
      toast({ title: "Failed to resend", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email resent", description: "Please check your inbox." });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="auth-card text-center">
      <div className="icon-box w-20 h-20 rounded-full mx-auto mb-token-6"><FiMail className="text-primary" style={{ fontSize: "2rem" }} /></div>
      <h1 className="auth-title mb-token-2">Verify Your Email</h1>
      <p className="text-muted-foreground text-token-sm mb-token-6">
        We've sent a verification email{email ? <> to <strong>{email}</strong></> : " to your inbox"}. Please click the link to verify your account.
      </p>
      <div className="bg-muted rounded-xl p-token-4 mb-token-6"><p className="text-token-xs text-muted-foreground">Didn't receive the email? Check your spam folder or click below to resend.</p></div>
      <div className="space-y-3">
        <Button variant="hero" className="w-full" onClick={handleResend} disabled={resending}><FiRefreshCw className={`mr-token-2 ${resending ? "animate-spin" : ""}`} style={{ fontSize: "var(--size-icon)" }} />{resending ? "Sending..." : "Resend Email"}</Button>
        <Button variant="outline" asChild className="w-full"><Link to="/login">Back to Sign In</Link></Button>
      </div>
    </motion.div>
  );
};

export default VerifyEmail;
