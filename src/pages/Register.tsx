import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaHeart } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/hooks/use-toast";

const registerSchema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters").max(100).required("Name is required"),
  email: yup.string().email("Please enter a valid email").max(255).required("Email is required"),
  gender: yup.string().min(1, "Please select your gender").required("Gender is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Passwords don't match")
    .required("Please confirm your password"),
});

type RegisterForm = yup.InferType<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: yupResolver(registerSchema) });

  const onSubmit = (data: RegisterForm) => {
    toast({
      title: "Registration",
      description: "Authentication requires Lovable Cloud. Connect it to enable registration.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-card rounded-2xl shadow-elevated border border-border p-token-8"
    >
      <div className="text-center mb-token-8">
        <h1 className="font-display text-token-2xl font-bold text-foreground">Create Account</h1>
        <p className="text-muted-foreground text-token-sm mt-token-1">Begin your journey to a blessed marriage</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Your full name" {...register("name")} className="mt-token-1" />
          {errors.name && <p className="text-token-sm text-destructive mt-token-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="your@email.com" {...register("email")} className="mt-token-1" />
          {errors.email && <p className="text-token-sm text-destructive mt-token-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label>Gender</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-token-1">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Brother (Male)</SelectItem>
                  <SelectItem value="female">Sister (Female)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && <p className="text-token-sm text-destructive mt-token-1">{errors.gender.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-token-1">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters" {...register("password")} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <FiEyeOff style={{ fontSize: "var(--size-icon)" }} /> : <FiEye style={{ fontSize: "var(--size-icon)" }} />}
            </button>
          </div>
          {errors.password && <p className="text-token-sm text-destructive mt-token-1">{errors.password.message}</p>}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" placeholder="Repeat password" {...register("confirmPassword")} className="mt-token-1" />
          {errors.confirmPassword && <p className="text-token-sm text-destructive mt-token-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-token-sm text-muted-foreground mt-token-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
      </p>
    </motion.div>
  );
};

export default Register;
