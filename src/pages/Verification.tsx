import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  FiUpload,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiShield,
  FiCamera,
} from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";

const verifySchema = z.object({
  cnicNumber: z
    .string()
    .regex(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in format XXXXX-XXXXXXX-X"),
  fullName: z.string().min(3, "Full name as on CNIC").max(100),
  fatherName: z.string().min(3, "Father's name as on CNIC").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  city: z.string().min(2, "City is required").max(50),
});

type VerifyForm = z.infer<typeof verifySchema>;

type VerificationStatus = "unverified" | "pending" | "verified" | "rejected" | "expired";

const statusConfig: Record<VerificationStatus, { icon: typeof FiCheck; color: string; bg: string; label: string; description: string }> = {
  unverified: {
    icon: FiAlertCircle,
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: "Not Verified",
    description: "Submit your documents to get verified and access all features.",
  },
  pending: {
    icon: FiClock,
    color: "text-accent",
    bg: "bg-accent/10",
    label: "Under Review",
    description: "Your documents are being reviewed by our team. This usually takes 24-48 hours.",
  },
  verified: {
    icon: GoShieldCheck,
    color: "text-primary",
    bg: "bg-primary/10",
    label: "Verified",
    description: "Your identity is verified. Re-verification is required every 6 months.",
  },
  rejected: {
    icon: FiAlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    label: "Rejected",
    description: "Your verification was rejected. Please re-submit with correct documents.",
  },
  expired: {
    icon: FiClock,
    color: "text-accent",
    bg: "bg-accent/10",
    label: "Expired — Re-verify",
    description: "Your verification has expired. Please re-submit your documents to continue using the platform.",
  },
};

const Verification = () => {
  const [status] = useState<VerificationStatus>("unverified");
  const [cnicFront, setCnicFront] = useState<File | null>(null);
  const [cnicBack, setCnicBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyForm>({ resolver: zodResolver(verifySchema) });

  const onSubmit = (data: VerifyForm) => {
    if (!cnicFront || !cnicBack) {
      toast({ title: "Missing documents", description: "Please upload both sides of your CNIC.", variant: "destructive" });
      return;
    }
    if (!selfie) {
      toast({ title: "Missing selfie", description: "Please upload a selfie holding your CNIC.", variant: "destructive" });
      return;
    }
    toast({ title: "Documents submitted", description: "Your verification is under review. We'll notify you within 24-48 hours." });
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  const FileUploadBox = ({
    label,
    file,
    onFileChange,
    inputRef,
    icon: Icon,
  }: {
    label: string;
    file: File | null;
    onFileChange: (f: File | null) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    icon: typeof FiUpload;
  }) => (
    <div
      onClick={() => inputRef.current?.click()}
      className="border-2 border-dashed border-border rounded-xl p-token-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />
      <Icon className="mx-auto mb-token-2 text-muted-foreground" style={{ fontSize: "var(--size-icon-xl)" }} />
      {file ? (
        <p className="text-token-sm font-medium text-primary">{file.name}</p>
      ) : (
        <p className="text-token-sm text-muted-foreground">{label}</p>
      )}
      <p className="text-token-xs text-muted-foreground mt-token-1">JPG, PNG — Max 5MB</p>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="pt-navbar min-h-screen bg-muted islamic-pattern">
        <div className="container mx-auto px-token-4 py-token-10 max-w-3xl">
          {/* Status Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${currentStatus.bg} rounded-2xl p-token-6 mb-token-8 flex items-start gap-token-4`}
          >
            <div className={`w-12 h-12 rounded-full ${currentStatus.bg} flex items-center justify-center flex-shrink-0`}>
              <StatusIcon className={currentStatus.color} style={{ fontSize: "var(--size-icon-lg)" }} />
            </div>
            <div>
              <h2 className={`font-display text-token-lg font-bold ${currentStatus.color}`}>
                {currentStatus.label}
              </h2>
              <p className="text-token-sm text-muted-foreground mt-token-1">{currentStatus.description}</p>
            </div>
          </motion.div>

          {/* Verification Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-card p-token-6 mb-token-6"
          >
            <div className="flex items-center gap-token-3 mb-token-4">
              <FiShield className="text-primary" style={{ fontSize: "var(--size-icon-lg)" }} />
              <div>
                <h3 className="font-display text-token-lg font-semibold text-foreground">Why Verification?</h3>
              </div>
            </div>
            <ul className="space-y-2 text-token-sm text-muted-foreground">
              <li className="flex items-start gap-token-2">
                <FiCheck className="text-primary flex-shrink-0 mt-0.5" style={{ fontSize: "var(--size-icon)" }} />
                Prevents spam, fake, and duplicate accounts
              </li>
              <li className="flex items-start gap-token-2">
                <FiCheck className="text-primary flex-shrink-0 mt-0.5" style={{ fontSize: "var(--size-icon)" }} />
                Every account is manually reviewed by our team
              </li>
              <li className="flex items-start gap-token-2">
                <FiCheck className="text-primary flex-shrink-0 mt-0.5" style={{ fontSize: "var(--size-icon)" }} />
                Re-verification every 6 months to keep the community safe
              </li>
              <li className="flex items-start gap-token-2">
                <FiCheck className="text-primary flex-shrink-0 mt-0.5" style={{ fontSize: "var(--size-icon)" }} />
                Your CNIC data is encrypted and never shared
              </li>
            </ul>
          </motion.div>

          {/* Verification Form */}
          {(status === "unverified" || status === "rejected" || status === "expired") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border shadow-card p-token-8"
            >
              <h3 className="font-display text-token-xl font-bold text-foreground mb-token-6">
                Submit Verification Documents
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* CNIC Number */}
                <div>
                  <Label htmlFor="cnicNumber">CNIC Number</Label>
                  <Input
                    id="cnicNumber"
                    placeholder="XXXXX-XXXXXXX-X"
                    {...register("cnicNumber")}
                    className="mt-token-1"
                  />
                  {errors.cnicNumber && <p className="text-token-sm text-destructive mt-token-1">{errors.cnicNumber.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-token-4">
                  <div>
                    <Label htmlFor="fullName">Full Name (as on CNIC)</Label>
                    <Input id="fullName" placeholder="Muhammad Ahmed" {...register("fullName")} className="mt-token-1" />
                    {errors.fullName && <p className="text-token-sm text-destructive mt-token-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input id="fatherName" placeholder="Muhammad Ali" {...register("fatherName")} className="mt-token-1" />
                    {errors.fatherName && <p className="text-token-sm text-destructive mt-token-1">{errors.fatherName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-token-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="mt-token-1" />
                    {errors.dateOfBirth && <p className="text-token-sm text-destructive mt-token-1">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Lahore" {...register("city")} className="mt-token-1" />
                    {errors.city && <p className="text-token-sm text-destructive mt-token-1">{errors.city.message}</p>}
                  </div>
                </div>

                {/* File Uploads */}
                <div>
                  <Label className="mb-token-3 block">Upload Documents</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-token-4">
                    <FileUploadBox
                      label="CNIC Front"
                      file={cnicFront}
                      onFileChange={setCnicFront}
                      inputRef={frontRef as React.RefObject<HTMLInputElement>}
                      icon={FiUpload}
                    />
                    <FileUploadBox
                      label="CNIC Back"
                      file={cnicBack}
                      onFileChange={setCnicBack}
                      inputRef={backRef as React.RefObject<HTMLInputElement>}
                      icon={FiUpload}
                    />
                    <FileUploadBox
                      label="Selfie with CNIC"
                      file={selfie}
                      onFileChange={setSelfie}
                      inputRef={selfieRef as React.RefObject<HTMLInputElement>}
                      icon={FiCamera}
                    />
                  </div>
                </div>

                <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>
                  <FiShield className="mr-token-2" /> Submit for Verification
                </Button>
              </form>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Verification;
