import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FiShield, FiUpload, FiCheckCircle, FiClock, FiAlertCircle, FiUser, FiCamera, FiRefreshCw } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";
import { runtimeConfig } from "@/lib/runtimeConfig";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const verificationSchema = yup.object({
  cnicNumber: yup.string().matches(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in format: 12345-1234567-1").required("CNIC number is required"),
  fullName: yup.string().trim().min(3, "Full name as per CNIC").max(100).required("Full name is required"),
  fatherName: yup.string().trim().min(3, "Father name as per CNIC").max(100).required("Father name is required"),
  dateOfBirth: yup.string().min(1, "Date of birth is required").required("Date of birth is required"),
  address: yup.string().trim().min(10, "Provide full address as per CNIC").max(300).required("Address is required"),
  phoneNumber: yup.string().matches(/^(\+92|0)\d{10}$/, "Enter valid Pakistani phone number").required("Phone number is required"),
});

const statusConfig = {
  not_submitted: { icon: <FiShield style={{ fontSize: "var(--size-icon-xl)" }} />, label: "Not Verified", color: "text-muted-foreground", bg: "bg-muted" },
  pending: { icon: <FiClock style={{ fontSize: "var(--size-icon-xl)" }} />, label: "Under Review", color: "text-accent-foreground", bg: "bg-accent/20" },
  verified: { icon: <FiCheckCircle style={{ fontSize: "var(--size-icon-xl)" }} />, label: "Verified", color: "text-primary", bg: "bg-primary/10" },
  rejected: { icon: <FiAlertCircle style={{ fontSize: "var(--size-icon-xl)" }} />, label: "Rejected", color: "text-destructive", bg: "bg-destructive/10" },
  expired: { icon: <FiClock style={{ fontSize: "var(--size-icon-xl)" }} />, label: "Expired – Re-verify", color: "text-accent-foreground", bg: "bg-accent/20" },
};

const normalizeVerificationStatus = (dbStatus) => {
  if (dbStatus === "approved") return "verified";
  if (dbStatus === "pending") return "pending";
  if (dbStatus === "rejected") return "rejected";
  if (dbStatus === "expired") return "expired";
  return "not_submitted";
};

const sanitizeFilename = (name) => name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();

const Verification = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState("not_submitted");
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const { toast } = useToast();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(verificationSchema),
  });

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("verification_requests")
        .select("status,rejection_reason")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setStatus(normalizeVerificationStatus(data.status));
        setRejectionReason(data.rejection_reason || "");
      }
    };

    fetchVerificationStatus();
  }, [user]);

  const validateFile = (file, label) => {
    if (!file) return false;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({ title: "Invalid file type", description: `${label} must be JPG, PNG, or WEBP.`, variant: "destructive" });
      return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({ title: "File too large", description: `${label} must be 5MB or smaller.`, variant: "destructive" });
      return false;
    }
    return true;
  };

  const uploadVerificationFile = async (file, kind) => {
    const safeName = sanitizeFilename(file.name);
    const path = `${user.id}/${Date.now()}-${kind}-${safeName}`;

    const { error } = await supabase.storage
      .from("verification-docs")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) throw error;
    return path;
  };

  const scanCnic = async () => {
    if (!cnicFront) {
      toast({ title: "Choose the CNIC front first", description: "Upload a clear image before scanning.", variant: "destructive" });
      return;
    }
    if (!runtimeConfig.cnicOcrEnabled) {
      toast({ title: "CNIC scanning is not configured", description: "Set VITE_CNIC_OCR_ENABLED=true and configure the OCR function secret.", variant: "destructive" });
      return;
    }
    try {
      setOcrLoading(true);
      const bytes = new Uint8Array(await cnicFront.arrayBuffer());
      let binary = "";
      bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
      const base64 = btoa(binary);
      const { data, error } = await supabase.functions.invoke("extract-document-text", {
        body: { base64, mimeType: cnicFront.type },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message || "OCR failed");
      setExtractedText(data.text || "");
      if (data.extracted?.cnicNumber) setValue("cnicNumber", data.extracted.cnicNumber, { shouldValidate: true });
      toast.success(data.extracted?.cnicNumber ? "CNIC number detected. Review it before submitting." : "Text extracted. Review the fields before submitting.");
    } catch (error) {
      toast({ title: "Unable to scan document", description: error.message, variant: "destructive" });
    } finally {
      setOcrLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    if (!user) {
      toast({ title: "Please log in", description: "You must be logged in to submit verification.", variant: "destructive" });
      return;
    }

    if (!cnicFront || !cnicBack) {
      toast({ title: "Missing documents", description: "Please upload both sides of your CNIC.", variant: "destructive" });
      return;
    }

    if (!selfie) {
      toast({ title: "Selfie required", description: "Please upload a selfie holding your CNIC.", variant: "destructive" });
      return;
    }

    if (!validateFile(cnicFront, "CNIC front") || !validateFile(cnicBack, "CNIC back") || !validateFile(selfie, "Selfie")) {
      return;
    }

    try {
      setIsUploading(true);

      const { data: latestRequest } = await supabase
        .from("verification_requests")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const [cnicFrontPath, cnicBackPath, selfiePath] = await Promise.all([
        uploadVerificationFile(cnicFront, "cnic-front"),
        uploadVerificationFile(cnicBack, "cnic-back"),
        uploadVerificationFile(selfie, "selfie"),
      ]);

      const payload = {
        user_id: user.id,
        cnic_number: formData.cnicNumber,
        full_name: formData.fullName,
        father_name: formData.fatherName,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        phone_number: formData.phoneNumber,
        cnic_front_path: cnicFrontPath,
        cnic_back_path: cnicBackPath,
        selfie_path: selfiePath,
        status: "pending",
        rejection_reason: null,
        reviewed_at: null,
        reviewed_by: null,
      };

      const mutation = latestRequest?.id
        ? supabase.from("verification_requests").update(payload).eq("id", latestRequest.id)
        : supabase.from("verification_requests").insert(payload);

      const { error } = await mutation;
      if (error) throw error;

      setStatus("pending");
      setRejectionReason("");
      toast({ title: "Submitted", description: "Your verification is under review. We'll notify you within 24-48 hours." });
    } catch (error) {
      const duplicateIdentity = error.code === "23505";
      toast({
        title: duplicateIdentity ? "Identity already registered" : "Submission failed",
        description: duplicateIdentity
          ? "This CNIC or phone number is already linked to an account or active verification request."
          : (error.message || "Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const sConfig = statusConfig[status];
  const canSubmit = status === "not_submitted" || status === "rejected" || status === "expired";

  return (
    <div className="w-full max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title mb-token-2">Identity Verification</h1>
        <p className="text-muted-foreground mb-token-8">Verify your identity to build trust and prevent spam. Verification is reviewed by our team and expires every 6 months.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`${sConfig.bg} rounded-xl p-token-6 mb-token-8 flex items-center gap-token-4`}>
        <div className={sConfig.color}>{sConfig.icon}</div>
        <div>
          <h3 className={`card-section-title ${sConfig.color}`}>{sConfig.label}</h3>
          <p className="text-token-sm text-muted-foreground mt-token-1">
            {status === "not_submitted" && "Submit your documents to get verified."}
            {status === "pending" && "Our team is reviewing your documents. This usually takes 24-48 hours."}
            {status === "verified" && "Your profile is verified. Next renewal is due in 6 months."}
            {status === "rejected" && "Your verification was rejected. Please re-submit with correct documents."}
            {status === "expired" && "Your verification has expired. Please re-verify to maintain your verified status."}
          </p>
          {status === "rejected" && rejectionReason && (
            <p className="text-token-xs text-destructive mt-token-2">Reason: {rejectionReason}</p>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-base p-token-6 mb-token-8">
        <h2 className="card-section-title text-token-xl mb-token-4">How Verification Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-token-4">
          {[
            { icon: <HiOutlineIdentification style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Submit CNIC", desc: "Upload front & back of your CNIC/ID card" },
            { icon: <FiCamera style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Take Selfie", desc: "Selfie holding your CNIC for verification" },
            { icon: <FiUser style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Human Review", desc: "Our team verifies within 24-48 hours" },
          ].map((step, i) => (
            <div key={i} className="text-center p-token-4">
              <div className="icon-box w-12 h-12 rounded-full mx-auto mb-token-3"><span className="text-primary">{step.icon}</span></div>
              <h4 className="font-display text-token-sm font-semibold text-foreground">{step.title}</h4>
              <p className="text-token-xs text-muted-foreground mt-token-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {canSubmit && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-base p-token-6">
          <h2 className="card-section-title text-token-xl mb-token-6">Submit Your Documents</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div><Label htmlFor="cnicNumber">CNIC Number</Label><Input id="cnicNumber" placeholder="12345-1234567-1" {...register("cnicNumber")} className="mt-token-1" />{errors.cnicNumber && <p className="form-error">{errors.cnicNumber.message}</p>}</div>
            <div><Label htmlFor="fullName">Full Name (as per CNIC)</Label><Input id="fullName" placeholder="Muhammad Ahmed Khan" {...register("fullName")} className="mt-token-1" />{errors.fullName && <p className="form-error">{errors.fullName.message}</p>}</div>
            <div><Label htmlFor="fatherName">Father's Name (as per CNIC)</Label><Input id="fatherName" placeholder="Muhammad Khan" {...register("fatherName")} className="mt-token-1" />{errors.fatherName && <p className="form-error">{errors.fatherName.message}</p>}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-4">
              <div><Label htmlFor="dateOfBirth">Date of Birth</Label><Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="mt-token-1" />{errors.dateOfBirth && <p className="form-error">{errors.dateOfBirth.message}</p>}</div>
              <div><Label htmlFor="phoneNumber">Phone Number</Label><Input id="phoneNumber" placeholder="+923001234567" {...register("phoneNumber")} className="mt-token-1" />{errors.phoneNumber && <p className="form-error">{errors.phoneNumber.message}</p>}</div>
            </div>
            <div><Label htmlFor="address">Address (as per CNIC)</Label><Input id="address" placeholder="House #, Street, City, Province" {...register("address")} className="mt-token-1" />{errors.address && <p className="form-error">{errors.address.message}</p>}</div>

            <div className="border-t border-border pt-token-5">
              <h3 className="card-section-title mb-token-4">Document Uploads</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-4 mb-token-4">
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-token-6 cursor-pointer transition-colors ${cnicFront ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <FiUpload className="text-muted-foreground mb-token-2" style={{ fontSize: "var(--size-icon-lg)" }} /><span className="text-token-sm font-medium text-foreground">{cnicFront ? cnicFront.name : "CNIC Front"}</span><span className="text-token-xs text-muted-foreground mt-token-1">JPG, PNG, WEBP (max 5MB)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setCnicFront(e.target.files?.[0] || null)} />
                </label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-token-6 cursor-pointer transition-colors ${cnicBack ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <FiUpload className="text-muted-foreground mb-token-2" style={{ fontSize: "var(--size-icon-lg)" }} /><span className="text-token-sm font-medium text-foreground">{cnicBack ? cnicBack.name : "CNIC Back"}</span><span className="text-token-xs text-muted-foreground mt-token-1">JPG, PNG, WEBP (max 5MB)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setCnicBack(e.target.files?.[0] || null)} />
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-token-4">
                <Button type="button" variant="outline" onClick={scanCnic} disabled={!cnicFront || ocrLoading}>
                  <FiRefreshCw className={ocrLoading ? "mr-2 animate-spin" : "mr-2"} />
                  {ocrLoading ? "Scanning…" : "Scan CNIC & extract text"}
                </Button>
                <span className="text-token-xs text-muted-foreground">Text is extracted for review; it is never accepted as proof automatically.</span>
              </div>
              {extractedText && (
                <div className="mb-token-4 rounded-lg border border-border bg-muted p-3">
                  <p className="text-token-xs font-semibold text-foreground mb-1">Extracted text preview</p>
                  <p className="text-token-xs text-muted-foreground whitespace-pre-wrap break-words max-h-28 overflow-auto">{extractedText}</p>
                </div>
              )}
              <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-token-6 cursor-pointer transition-colors ${selfie ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                <FiCamera className="text-muted-foreground mb-token-2" style={{ fontSize: "var(--size-icon-lg)" }} /><span className="text-token-sm font-medium text-foreground">{selfie ? selfie.name : "Selfie holding your CNIC"}</span><span className="text-token-xs text-muted-foreground mt-token-1">Take a clear selfie while holding your CNIC next to your face</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelfie(e.target.files?.[0] || null)} />
              </label>
            </div>

            <div className="bg-muted rounded-xl p-token-4 flex gap-token-3">
              <FiShield className="text-primary flex-shrink-0 mt-0.5" style={{ fontSize: "var(--size-icon)" }} />
              <div><p className="text-token-xs text-muted-foreground"><strong className="text-foreground">Privacy:</strong> Your documents are encrypted and only used for verification. They are never shared with other users. Verification expires every 6 months to keep profiles authentic.</p></div>
            </div>

            <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting || isUploading}>
              <FiShield className="mr-token-2" style={{ fontSize: "var(--size-icon)" }} />
              {isUploading ? "Uploading documents..." : "Submit for Verification"}
            </Button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Verification;
