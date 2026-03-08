import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

const schema = yup.object({
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords don't match").required("Please confirm your password"),
});

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = () => { setDone(true); };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="auth-card">
      <div className="auth-header"><h1 className="auth-title">Set New Password</h1></div>
      {done ? (
        <div className="text-center space-y-4">
          <div className="icon-box w-16 h-16 rounded-full mx-auto"><FiCheckCircle className="text-primary" style={{ fontSize: "var(--size-icon-xl)" }} /></div>
          <p className="text-muted-foreground text-token-sm">Password updated successfully!</p>
          <Button variant="hero" asChild className="w-full"><Link to="/login">Sign In</Link></Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><Label htmlFor="password">New Password</Label><div className="relative mt-token-1"><Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters" {...register("password")} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">{showPassword ? <FiEyeOff style={{ fontSize: "var(--size-icon)" }} /> : <FiEye style={{ fontSize: "var(--size-icon)" }} />}</button></div>{errors.password && <p className="form-error">{errors.password.message}</p>}</div>
          <div><Label htmlFor="confirmPassword">Confirm Password</Label><Input id="confirmPassword" type="password" placeholder="Repeat password" {...register("confirmPassword")} className="mt-token-1" />{errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}</div>
          <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>Update Password</Button>
        </form>
      )}
    </motion.div>
  );
};

export default ResetPassword;
