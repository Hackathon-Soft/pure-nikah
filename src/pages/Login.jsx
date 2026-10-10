import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "You have been signed in successfully." });
      navigate("/dashboard");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="page-subtitle">Sign in to continue your journey</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="your@email.com" {...register("email")} className="mt-token-1" />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-token-1">
            <Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" {...register("password")} />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="password-toggle">
              {showPassword ? <FiEyeOff style={{ fontSize: "var(--size-icon)" }} /> : <FiEye style={{ fontSize: "var(--size-icon)" }} />}
            </button>
          </div>
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-token-xs link-primary">Forgot Password?</Link>
        </div>
        <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <p className="auth-footer">
        Don't have an account?{" "}
        <Link to="/register" className="link-primary">Register Now</Link>
      </p>
    </motion.div>
  );
};

export default Login;
