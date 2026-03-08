import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiMail, FiMessageCircle, FiHelpCircle, FiBook, FiSend } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const schema = yup.object({
  name: yup.string().min(2).max(100).required("Name is required"),
  email: yup.string().email("Please enter a valid email").max(255).required("Email is required"),
  topic: yup.string().min(1).required("Topic is required"),
  message: yup.string().min(10, "Message must be at least 10 characters").max(1000).required("Message is required"),
});

const faqs = [
  { q: "How do I verify my account?", a: "Go to Dashboard → Verification and upload your CNIC (front & back) plus a selfie. Our team reviews within 24-48 hours." },
  { q: "Why was my verification rejected?", a: "Common reasons: blurry photos, mismatched CNIC info, or unclear selfie. Re-submit with clear, high-quality images." },
  { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page, enter your email, and follow the reset link sent to your inbox." },
  { q: "Can I delete my account?", a: "Yes. Go to Dashboard → Settings → Account and click 'Delete Account'. All data is permanently removed within 30 days." },
  { q: "Why do I need to re-verify every 6 months?", a: "To maintain trust and prevent inactive or fake accounts. You'll receive a notification before expiry." },
];

const HelpCenter = () => {
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = (_data) => { setSent(true); toast({ title: "Message sent", description: "We'll get back to you within 24 hours." }); reset(); };

  return (
    <div className="w-full max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title mb-token-2">Help Center</h1>
        <p className="page-subtitle mb-token-8">Find answers to common questions or contact our support team.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-1 sm:grid-cols-3 gap-token-4 mb-token-8">
        {[{ icon: <FiHelpCircle style={{ fontSize: "var(--size-icon-lg)" }} />, label: "FAQs", desc: "Common questions" },{ icon: <FiMail style={{ fontSize: "var(--size-icon-lg)" }} />, label: "Email Us", desc: "support@purenikah.com" },{ icon: <FiMessageCircle style={{ fontSize: "var(--size-icon-lg)" }} />, label: "Response Time", desc: "Within 24 hours" }].map((item, i) => (
          <div key={i} className="card-base p-token-4 text-center"><div className="icon-box w-10 h-10 rounded-full mx-auto mb-token-2"><span className="text-primary">{item.icon}</span></div><h3 className="font-display text-token-sm font-semibold text-foreground">{item.label}</h3><p className="text-token-xs text-muted-foreground">{item.desc}</p></div>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-base p-token-6 mb-token-8">
        <div className="flex items-center gap-token-3 mb-token-4"><FiBook className="text-primary" style={{ fontSize: "var(--size-icon-lg)" }} /><h2 className="card-section-title text-token-xl">Frequently Asked Questions</h2></div>
        <div className="space-y-4">{faqs.map((faq, i) => (<div key={i} className="border-b border-border pb-token-4 last:border-0 last:pb-0"><h4 className="text-token-sm font-medium text-foreground mb-token-1">{faq.q}</h4><p className="text-token-sm text-muted-foreground">{faq.a}</p></div>))}</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-base p-token-6">
        <h2 className="card-section-title text-token-xl mb-token-4">Contact Support</h2>
        {sent ? (
          <div className="text-center py-token-8"><div className="icon-box w-16 h-16 rounded-full mx-auto mb-token-4"><FiSend className="text-primary" style={{ fontSize: "var(--size-icon-xl)" }} /></div><h3 className="card-section-title mb-token-2">Message Sent!</h3><p className="text-token-sm text-muted-foreground mb-token-4">We'll get back to you within 24 hours.</p><Button variant="outline" onClick={() => setSent(false)}>Send Another Message</Button></div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-4">
              <div><Label htmlFor="name">Name</Label><Input id="name" placeholder="Your name" {...register("name")} className="mt-token-1" />{errors.name && <p className="form-error">{errors.name.message}</p>}</div>
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="your@email.com" {...register("email")} className="mt-token-1" />{errors.email && <p className="form-error">{errors.email.message}</p>}</div>
            </div>
            <div><Label>Topic</Label><Controller name="topic" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger className="mt-token-1"><SelectValue placeholder="Select a topic" /></SelectTrigger><SelectContent><SelectItem value="verification">Verification Issue</SelectItem><SelectItem value="account">Account Problem</SelectItem><SelectItem value="report">Report a User</SelectItem><SelectItem value="billing">Billing / Payments</SelectItem><SelectItem value="bug">Bug Report</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select>)} />{errors.topic && <p className="form-error">{errors.topic.message}</p>}</div>
            <div><Label htmlFor="message">Message</Label><Textarea id="message" placeholder="Describe your issue or question..." rows={5} {...register("message")} className="mt-token-1" />{errors.message && <p className="form-error">{errors.message.message}</p>}</div>
            <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}><FiSend className="mr-token-2" style={{ fontSize: "var(--size-icon)" }} />Send Message</Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default HelpCenter;
