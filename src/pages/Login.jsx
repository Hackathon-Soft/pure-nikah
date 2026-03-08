import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/hooks/use-toast";

const loginSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = (data) => {
    toast({ title: "Sign in", description: "Authentication requires backend. Connect Lovable Cloud to enable login." });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-card rounded-2xl shadow-elevated border border-border p-token-8">
      <div className="text-center mb-token-8">
        <h1 className="font-display text-token-2xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground text-token-sm mt-token-1">Sign in to continue your journey</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="your@email.com" {...register("email")} className="mt-token-1" />
          {errors.email && <p className="text-token-sm text-destructive mt-token-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-token-1">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password")} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <FiEyeOff style={{ fontSize: "var(--size-icon)" }} /> : <FiEye style={{ fontSize: "var(--size-icon)" }} />}
            </button>
          </div>
          {errors.password && <p className="text-token-sm text-destructive mt-token-1">{errors.password.message}</p>}
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-token-xs text-primary hover:underline">Forgot Password?</Link>
        </div>
        <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>Sign In</Button>
      </form>
      <p className="text-center text-token-sm text-muted-foreground mt-token-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-medium hover:underline">Register Now</Link>
      </p>
    </motion.div>
  );
};

export default Login;
