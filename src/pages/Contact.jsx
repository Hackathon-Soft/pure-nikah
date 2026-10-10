import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const contactMethods = [
  { icon: FiMail, label: "Email", value: "support@purenikah.com", href: "mailto:support@purenikah.com" },
  { icon: FaWhatsapp, label: "WhatsApp", value: "+92 300 1234567", href: "https://wa.me/923001234567" },
  { icon: FiPhone, label: "Phone", value: "+92 300 1234567", href: "tel:+923001234567" },
  { icon: FiMapPin, label: "Address", value: "Karachi, Pakistan", href: null },
];

const topics = [
  "General Inquiry",
  "Account Issues",
  "Verification Help",
  "Report a Problem",
  "Partnership/Collaboration",
  "Feedback & Suggestions",
  "Other",
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.topic || !form.message) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      user_id: user?.id || null,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      topic: form.topic,
      message: form.message.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Unable to send message", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Message sent!", description: "We'll get back to you soon, InshaAllah." });
  };

  return (
    <div className="min-h-screen bg-muted islamic-pattern">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16 md:py-24">
        <div className="app-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-label">Get in Touch</span>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-4 mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have questions or need assistance? We're here to help you on your journey to finding a halal life partner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="app-container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Methods */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-xl font-display font-semibold text-foreground mb-6">Reach Out Directly</h2>
              <div className="space-y-4">
                {contactMethods.map((method) => (
                  <Card key={method.label}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <method.icon className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{method.label}</p>
                        {method.href ? (
                          <a href={method.href} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-primary transition-colors">
                            {method.value}
                          </a>
                        ) : (
                          <p className="font-medium text-foreground">{method.value}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-3">
                  <FiMessageCircle className="text-primary text-xl mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Quick Response</h3>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within 24-48 hours during business days. For urgent matters, please reach out via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-display font-semibold text-foreground mb-6">Send a Message</h2>
              
              {submitted ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <FiSend className="text-green-600 text-2xl" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-4">
                      Jazakallah for reaching out. We'll get back to you soon, InshaAllah.
                    </p>
                    <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", topic: "", message: "" }); }}>
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Your Name *</Label>
                          <Input
                            id="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="topic">Topic *</Label>
                        <Select value={form.topic} onValueChange={(val) => setForm({ ...form, topic: val })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {topics.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="How can we help you?"
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          rows={5}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <FiSend /> Send Message
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
