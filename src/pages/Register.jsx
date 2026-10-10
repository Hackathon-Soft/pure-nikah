import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiEye, FiEyeOff, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const registerSchema = yup.object({
  registrationType: yup.string().required(),
  registeredByName: yup.string().when("registrationType", {
    is: (val) => val !== "self",
    then: (schema) => schema.min(2, "Your name is required").required("Your name is required"),
    otherwise: (schema) => schema.optional(),
  }),
  registeredByRelation: yup.string().when("registrationType", {
    is: (val) => val !== "self",
    then: (schema) => schema.required("Your relation is required"),
    otherwise: (schema) => schema.optional(),
  }),
  name: yup.string().min(2, "Name must be at least 2 characters").max(100).required("Name is required"),
  email: yup.string().email("Please enter a valid email").max(255).required("Email is required"),
  gender: yup.string().min(1, "Please select gender").required("Gender is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords don't match").required("Please confirm your password"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { registrationType: "self" },
  });

  const registrationType = watch("registrationType");

  const onSubmit = async (data) => {
    const { error } = await signUp(data.email, data.password, {
      name: data.name,
      gender: data.gender,
      registration_type: data.registrationType,
      registered_by_name: data.registeredByName || null,
      registered_by_relation: data.registeredByRelation || null,
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
        {/* Registration Type */}
        <div>
          <Label className="flex items-center gap-token-1"><FiUsers className="text-primary" style={{ fontSize: "var(--text-sm)" }} /> Registering for</Label>
          <Controller name="registrationType" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="mt-token-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="self">Myself</SelectItem>
                <SelectItem value="son">My Son</SelectItem>
                <SelectItem value="daughter">My Daughter</SelectItem>
                <SelectItem value="brother">My Brother</SelectItem>
                <SelectItem value="sister">My Sister</SelectItem>
                <SelectItem value="friend">My Friend</SelectItem>
                <SelectItem value="relative">My Relative</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>

        {/* Family registrant details */}
        {registrationType !== "self" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 p-token-4 bg-muted rounded-lg border border-border">
            <p className="text-token-xs text-muted-foreground">You are registering on behalf of your <strong>{registrationType}</strong>. Please provide your details below.</p>
            <div>
              <Label htmlFor="registeredByName">Your Name</Label>
              <Input id="registeredByName" placeholder="Your full name" {...register("registeredByName")} className="mt-token-1" />
              {errors.registeredByName && <p className="form-error">{errors.registeredByName.message}</p>}
            </div>
            <div>
              <Label>Your Relation</Label>
              <Controller name="registeredByRelation" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-token-1"><SelectValue placeholder="Select relation" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="brother">Brother</SelectItem>
                    <SelectItem value="sister">Sister</SelectItem>
                    <SelectItem value="uncle">Uncle</SelectItem>
                    <SelectItem value="aunt">Aunt</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )} />
              {errors.registeredByRelation && <p className="form-error">{errors.registeredByRelation.message}</p>}
            </div>
          </motion.div>
        )}

        <div>
          <Label htmlFor="name">{registrationType === "self" ? "Full Name" : `${registrationType.charAt(0).toUpperCase() + registrationType.slice(1)}'s Full Name`}</Label>
          <Input id="name" autoComplete="name" placeholder={registrationType === "self" ? "Your full name" : `Your ${registrationType}'s full name`} {...register("name")} className="mt-token-1" />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="your@email.com" {...register("email")} className="mt-token-1" />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
        <div>
          <Label>{registrationType === "self" ? "Gender" : `${registrationType.charAt(0).toUpperCase() + registrationType.slice(1)}'s Gender`}</Label>
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
            <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Min 8 characters" {...register("password")} />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="password-toggle">
              {showPassword ? <FiEyeOff style={{ fontSize: "var(--size-icon)" }} /> : <FiEye style={{ fontSize: "var(--size-icon)" }} />}
            </button>
          </div>
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat password" {...register("confirmPassword")} className="mt-token-1" />
          {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
        </div>
        <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      <p className="auth-footer">Already have an account?{" "}<Link to="/login" className="link-primary">Sign In</Link></p>
    </motion.div>
  );
};

export default Register;
