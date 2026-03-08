import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa";
import { FiMail, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      toast({ title: "Email resent", description: "Please check your inbox." });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted islamic-pattern px-token-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-elevated border border-border p-token-8 text-center"
      >
        <Link to="/" className="inline-flex items-center gap-token-2 mb-token-6">
          <FaHeart className="text-primary" style={{ fontSize: "var(--size-icon-xl)" }} />
          <span className="font-display text-token-2xl font-bold text-foreground">PureNikah</span>
        </Link>

        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-token-6">
          <FiMail className="text-primary" style={{ fontSize: "2rem" }} />
        </div>

        <h1 className="font-display text-token-2xl font-bold text-foreground mb-token-2">Verify Your Email</h1>
        <p className="text-muted-foreground text-token-sm mb-token-6">
          We've sent a verification email to your inbox. Please click the link to verify your account and continue.
        </p>

        <div className="bg-muted rounded-xl p-token-4 mb-token-6">
          <p className="text-token-xs text-muted-foreground">
            Didn't receive the email? Check your spam folder or click below to resend.
          </p>
        </div>

        <div className="space-y-3">
          <Button variant="hero" className="w-full" onClick={handleResend} disabled={resending}>
            <FiRefreshCw className={`mr-token-2 ${resending ? "animate-spin" : ""}`} style={{ fontSize: "var(--size-icon)" }} />
            {resending ? "Sending..." : "Resend Email"}
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/login">Back to Sign In</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
