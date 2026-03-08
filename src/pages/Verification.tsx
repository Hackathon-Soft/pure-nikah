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
import { useState } from "react";
import {
  FiShield,
  FiUpload,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiUser,
  FiCamera,
} from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";

const verificationSchema = z.object({
  cnicNumber: z
    .string()
    .regex(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in format: 12345-1234567-1"),
  fullName: z.string().min(3, "Full name as per CNIC").max(100),
  fatherName: z.string().min(3, "Father name as per CNIC").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(10, "Provide full address as per CNIC").max(300),
  phoneNumber: z
    .string()
    .regex(/^(\+92|0)\d{10}$/, "Enter valid Pakistani phone number"),
});

type VerificationForm = z.infer<typeof verificationSchema>;

type VerificationStatus = "not_submitted" | "pending" | "verified" | "rejected" | "expired";

const statusConfig: Record<VerificationStatus, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  not_submitted: {
    icon: <FiShield style={{ fontSize: "var(--size-icon-xl)" }} />,
    label: "Not Verified",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  pending: {
    icon: <FiClock style={{ fontSize: "var(--size-icon-xl)" }} />,
    label: "Under Review",
    color: "text-accent-foreground",
    bg: "bg-accent/20",
  },
  verified: {
    icon: <FiCheckCircle style={{ fontSize: "var(--size-icon-xl)" }} />,
    label: "Verified",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  rejected: {
    icon: <FiAlertCircle style={{ fontSize: "var(--size-icon-xl)" }} />,
    label: "Rejected",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  expired: {
    icon: <FiClock style={{ fontSize: "var(--size-icon-xl)" }} />,
    label: "Expired – Re-verify",
    color: "text-accent-foreground",
    bg: "bg-accent/20",
  },
};

const Verification = () => {
  const [status, setStatus] = useState<VerificationStatus>("not_submitted");
  const [cnicFront, setCnicFront] = useState<File | null>(null);
  const [cnicBack, setCnicBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerificationForm>({ resolver: zodResolver(verificationSchema) });

  const onSubmit = (_data: VerificationForm) => {
    if (!cnicFront || !cnicBack) {
      toast({ title: "Missing documents", description: "Please upload both sides of your CNIC.", variant: "destructive" });
      return;
    }
    if (!selfie) {
      toast({ title: "Selfie required", description: "Please upload a selfie holding your CNIC.", variant: "destructive" });
      return;
    }
    setStatus("pending");
    toast({ title: "Submitted", description: "Your verification is under review. We'll notify you within 24-48 hours." });
  };

  const sConfig = statusConfig[status];
  const canSubmit = status === "not_submitted" || status === "rejected" || status === "expired";

  return (
    <>
      <Navbar />
      <main className="pt-navbar min-h-screen bg-muted islamic-pattern">
        <div className="container mx-auto px-token-4 py-token-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-token-3xl font-display font-bold text-foreground mb-token-2">
              Identity Verification
            </h1>
            <p className="text-muted-foreground mb-token-8">
              Verify your identity to build trust and prevent spam. Verification is reviewed by our team and expires every 6 months.
            </p>
          </motion.div>

          {/* Status Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${sConfig.bg} rounded-xl p-token-6 mb-token-8 flex items-center gap-token-4`}
          >
            <div className={sConfig.color}>{sConfig.icon}</div>
            <div>
              <h3 className={`font-display text-token-lg font-semibold ${sConfig.color}`}>
                {sConfig.label}
              </h3>
              <p className="text-token-sm text-muted-foreground mt-token-1">
                {status === "not_submitted" && "Submit your documents to get verified."}
                {status === "pending" && "Our team is reviewing your documents. This usually takes 24-48 hours."}
                {status === "verified" && "Your profile is verified. Next renewal is due in 6 months."}
                {status === "rejected" && "Your verification was rejected. Please re-submit with correct documents."}
                {status === "expired" && "Your verification has expired. Please re-verify to maintain your verified status."}
              </p>
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-xl border border-border p-token-6 mb-token-8"
          >
            <h2 className="font-display text-token-xl font-semibold text-foreground mb-token-4">
              How Verification Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-token-4">
              {[
                { icon: <HiOutlineIdentification style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Submit CNIC", desc: "Upload front & back of your CNIC/ID card" },
                { icon: <FiCamera style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Take Selfie", desc: "Selfie holding your CNIC for verification" },
                { icon: <FiUser style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Human Review", desc: "Our team verifies within 24-48 hours" },
              ].map((step, i) => (
                <div key={i} className="text-center p-token-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-token-3 text-primary">
                    {step.icon}
                  </div>
                  <h4 className="font-display text-token-sm font-semibold text-foreground">{step.title}</h4>
                  <p className="text-token-xs text-muted-foreground mt-token-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Verification Form */}
          {canSubmit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border shadow-card p-token-6"
            >
              <h2 className="font-display text-token-xl font-semibold text-foreground mb-token-6">
                Submit Your Documents
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* CNIC Number */}
                <div>
                  <Label htmlFor="cnicNumber">CNIC Number</Label>
                  <Input
                    id="cnicNumber"
                    placeholder="12345-1234567-1"
                    {...register("cnicNumber")}
                    className="mt-token-1"
                  />
                  {errors.cnicNumber && (
                    <p className="text-token-sm text-destructive mt-token-1">{errors.cnicNumber.message}</p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName">Full Name (as per CNIC)</Label>
                  <Input id="fullName" placeholder="Muhammad Ahmed Khan" {...register("fullName")} className="mt-token-1" />
                  {errors.fullName && <p className="text-token-sm text-destructive mt-token-1">{errors.fullName.message}</p>}
                </div>

                {/* Father Name */}
                <div>
                  <Label htmlFor="fatherName">Father's Name (as per CNIC)</Label>
                  <Input id="fatherName" placeholder="Muhammad Khan" {...register("fatherName")} className="mt-token-1" />
                  {errors.fatherName && <p className="text-token-sm text-destructive mt-token-1">{errors.fatherName.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-4">
                  {/* Date of Birth */}
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="mt-token-1" />
                    {errors.dateOfBirth && <p className="text-token-sm text-destructive mt-token-1">{errors.dateOfBirth.message}</p>}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" placeholder="+923001234567" {...register("phoneNumber")} className="mt-token-1" />
                    {errors.phoneNumber && <p className="text-token-sm text-destructive mt-token-1">{errors.phoneNumber.message}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address">Address (as per CNIC)</Label>
                  <Input id="address" placeholder="House #, Street, City, Province" {...register("address")} className="mt-token-1" />
                  {errors.address && <p className="text-token-sm text-destructive mt-token-1">{errors.address.message}</p>}
                </div>

                {/* Document Uploads */}
                <div className="border-t border-border pt-token-5">
                  <h3 className="font-display text-token-lg font-semibold text-foreground mb-token-4">
                    Document Uploads
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-4 mb-token-4">
                    {/* CNIC Front */}
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-token-6 cursor-pointer transition-colors ${cnicFront ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      <FiUpload className="text-muted-foreground mb-token-2" style={{ fontSize: "var(--size-icon-lg)" }} />
                      <span className="text-token-sm font-medium text-foreground">
                        {cnicFront ? cnicFront.name : "CNIC Front"}
                      </span>
                      <span className="text-token-xs text-muted-foreground mt-token-1">
                        JPG, PNG (max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setCnicFront(e.target.files?.[0] || null)}
                      />
                    </label>

                    {/* CNIC Back */}
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-token-6 cursor-pointer transition-colors ${cnicBack ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      <FiUpload className="text-muted-foreground mb-token-2" style={{ fontSize: "var(--size-icon-lg)" }} />
                      <span className="text-token-sm font-medium text-foreground">
                        {cnicBack ? cnicBack.name : "CNIC Back"}
                      </span>
                      <span className="text-token-xs text-muted-foreground mt-token-1">
                        JPG, PNG (max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setCnicBack(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  {/* Selfie */}
                  <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-token-6 cursor-pointer transition-colors ${selfie ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <FiCamera className="text-muted-foreground mb-token-2" style={{ fontSize: "var(--size-icon-lg)" }} />
                    <span className="text-token-sm font-medium text-foreground">
                      {selfie ? selfie.name : "Selfie holding your CNIC"}
                    </span>
                    <span className="text-token-xs text-muted-foreground mt-token-1">
                      Take a clear selfie while holding your CNIC next to your face
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setSelfie(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                {/* Info notice */}
                <div className="bg-muted rounded-xl p-token-4 flex gap-token-3">
                  <FiShield className="text-primary flex-shrink-0 mt-0.5" style={{ fontSize: "var(--size-icon)" }} />
                  <div>
                    <p className="text-token-xs text-muted-foreground">
                      <strong className="text-foreground">Privacy:</strong> Your documents are encrypted and only used for verification. They are never shared with other users. Verification expires every 6 months to keep profiles authentic.
                    </p>
                  </div>
                </div>

                <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>
                  <FiShield className="mr-token-2" style={{ fontSize: "var(--size-icon)" }} />
                  Submit for Verification
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
