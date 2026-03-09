import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const registerSchema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters").max(100).required("Name is required"),
  email: yup.string().email("Please enter a valid email").max(255).required("Email is required"),
  gender: yup.string().min(1, "Please select your gender").required("Gender is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords don't match").required("Please confirm your password"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(registerSchema) });

  const onSubmit = async (data) => {
    const { error } = await signUp(data.email, data.password, {
      name: data.name,
      gender: data.gender,
    });
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Please check your email to verify your account." });
      navigate("/verify-email", { state: { email: data?.user?.email || data.email } });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title">Create Account</h1>
        <p className="page-subtitle">Begin your journey to a blessed marriage</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div><Label htmlFor="name">Full Name</Label><Input id="name" placeholder="Your full name" {...register("name")} className="mt-token-1" />{errors.name && <p className="form-error">{errors.name.message}</p>}</div>
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="your@email.com" {...register("email")} className="mt-token-1" />{errors.email && <p className="form-error">{errors.email.message}</p>}</div>
        <div>
          <Label>Gender</Label>
          <Controller name="gender" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="mt-token-1"><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent><SelectItem value="male">Brother (Male)</SelectItem><SelectItem value="female">Sister (Female)</SelectItem></SelectContent>
            </Select>
          )} />
          {errors.gender && <p className="form-error">{errors.gender.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-token-1">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters" {...register("password")} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
              {showPassword ? <FiEyeOff style={{ fontSize: "var(--size-icon)" }} /> : <FiEye style={{ fontSize: "var(--size-icon)" }} />}
            </button>
          </div>
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>
        <div><Label htmlFor="confirmPassword">Confirm Password</Label><Input id="confirmPassword" type="password" placeholder="Repeat password" {...register("confirmPassword")} className="mt-token-1" />{errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}</div>
        <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      <p className="auth-footer">Already have an account?{" "}<Link to="/login" className="link-primary">Sign In</Link></p>
    </motion.div>
  );
};

export default Register;
