import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaHeart } from "react-icons/fa";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const schema = yup.object({
  email: yup.string().email("Please enter a valid email").max(255).required("Email is required"),
});

type FormData = {
  email: string;
};

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  const onSubmit = (_data: FormData) => {
    setSent(true);
    toast({ title: "Email sent", description: "Check your inbox for the reset link." });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-card rounded-2xl shadow-elevated border border-border p-token-8"
    >
      <div className="text-center mb-token-8">
        <h1 className="font-display text-token-2xl font-bold text-foreground">Forgot Password</h1>
        <p className="text-muted-foreground text-token-sm mt-token-1">
          Enter your email to receive a reset link
        </p>
      </div>

      {sent ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <FiMail className="text-primary" style={{ fontSize: "var(--size-icon-xl)" }} />
          </div>
          <p className="text-muted-foreground text-token-sm">
            We've sent a password reset link to your email. Please check your inbox and follow the instructions.
          </p>
          <Button variant="outline" asChild className="w-full">
            <Link to="/login">
              <FiArrowLeft className="mr-token-2" style={{ fontSize: "var(--size-icon)" }} />
              Back to Sign In
            </Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="your@email.com" {...register("email")} className="mt-token-1" />
            {errors.email && <p className="text-token-sm text-destructive mt-token-1">{errors.email.message}</p>}
          </div>
          <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>
            Send Reset Link
          </Button>
          <Link to="/login" className="flex items-center justify-center gap-token-2 text-token-sm text-muted-foreground hover:text-primary transition-colors">
            <FiArrowLeft style={{ fontSize: "var(--size-icon-sm)" }} /> Back to Sign In
          </Link>
        </form>
      )}
    </motion.div>
  );
};

export default ForgotPassword;
