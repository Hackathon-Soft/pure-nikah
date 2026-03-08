import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaHeart } from "react-icons/fa";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = (data: ForgotForm) => {
    setSent(true);
    toast({ title: "Reset link sent", description: "Check your email for the password reset link." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted islamic-pattern px-token-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-elevated border border-border p-token-8"
      >
        <div className="text-center mb-token-8">
          <Link to="/" className="inline-flex items-center gap-token-2 mb-token-4">
            <FaHeart className="text-primary" style={{ fontSize: "var(--size-icon-xl)" }} />
            <span className="font-display text-token-2xl font-bold text-foreground">PureNikah</span>
          </Link>
          <h1 className="font-display text-token-2xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground text-token-sm mt-token-1">
            {sent ? "We've sent you a reset link" : "Enter your email to receive a reset link"}
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-token-4">
              <FiMail className="text-primary" style={{ fontSize: "var(--size-icon-xl)" }} />
            </div>
            <p className="text-muted-foreground text-token-sm mb-token-6">
              Check your inbox and follow the link to reset your password. If you don't see it, check your spam folder.
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link to="/login">
                <FiArrowLeft className="mr-token-2" /> Back to Sign In
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" {...register("email")} className="mt-token-1" />
                {errors.email && <p className="text-token-sm text-destructive mt-token-1">{errors.email.message}</p>}
              </div>
              <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>
                Send Reset Link
              </Button>
            </form>
            <p className="text-center text-token-sm text-muted-foreground mt-token-6">
              Remember your password?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
