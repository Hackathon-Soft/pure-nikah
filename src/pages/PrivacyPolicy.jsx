import { motion } from "framer-motion";
import { FiShield, FiLock, FiEye, FiDatabase, FiUsers, FiTrash2 } from "react-icons/fi";

const sections = [
  { icon: <FiDatabase style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Information We Collect", content: ["Personal information you provide during registration (name, email, phone number, gender, city).","Identity documents (CNIC, selfie) submitted for verification purposes only.","Profile information including religious preferences, education, lifestyle, and family background.","Usage data such as pages visited, search filters used, and interaction patterns.","Device information including browser type, IP address, and operating system."] },
  { icon: <FiLock style={{ fontSize: "var(--size-icon-lg)" }} />, title: "How We Use Your Information", content: ["To create and manage your account and profile on PureNikah.","To verify your identity and prevent fake accounts and spam.","To match you with compatible profiles based on your preferences.","To communicate important updates, notifications, and security alerts.","To improve our platform, features, and user experience."] },
  { icon: <FiShield style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Data Protection & Security", content: ["All personal data is encrypted in transit and at rest using industry-standard encryption.","CNIC and identity documents are stored securely and are never shared with other users.","We implement rate limiting, duplicate detection, and human review to prevent misuse.","Access to sensitive data is restricted to authorized verification team members only.","Regular security audits are conducted to ensure data integrity."] },
  { icon: <FiEye style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Your Privacy Controls", content: ["You control who can see your profile and photos through privacy settings.","Photos remain blurred until you accept a match interest request.","You can block and report users who violate community guidelines.","You can update, correct, or delete your personal information at any time.","You can request a complete export of your data."] },
  { icon: <FiUsers style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Information Sharing", content: ["We do not sell, rent, or trade your personal information to third parties.","Profile information is only visible to verified, registered users.","We may share anonymized, aggregated data for analytics and improvement purposes.","We may disclose information if required by law or to protect user safety."] },
  { icon: <FiTrash2 style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Data Retention & Deletion", content: ["Your data is retained as long as your account is active.","Verification documents are securely deleted after review and approval.","Upon account deletion, all personal data is permanently removed within 30 days.","Anonymized usage data may be retained for platform improvement."] },
];

const PrivacyPolicy = () => (
  <div className="w-full max-w-3xl">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-token-3xl font-display font-bold text-foreground mb-token-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-token-2">Last updated: March 8, 2026</p>
      <p className="text-muted-foreground text-token-sm mb-token-8">At PureNikah, your privacy is a trust (Amanah) we take seriously. This policy explains how we collect, use, protect, and handle your personal information.</p>
    </motion.div>
    <div className="space-y-6">
      {sections.map((section, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * (i + 1) }} className="bg-card rounded-xl border border-border p-token-6">
          <div className="flex items-center gap-token-3 mb-token-4"><div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">{section.icon}</div><h2 className="font-display text-token-xl font-semibold text-foreground">{section.title}</h2></div>
          <ul className="space-y-2">{section.content.map((item, j) => (<li key={j} className="flex items-start gap-token-2 text-token-sm text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />{item}</li>))}</ul>
        </motion.div>
      ))}
    </div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-muted rounded-xl p-token-6 mt-token-8">
      <p className="text-token-sm text-muted-foreground"><strong className="text-foreground">Questions?</strong> If you have any concerns about your privacy, contact us at <a href="mailto:privacy@purenikah.com" className="text-primary hover:underline">privacy@purenikah.com</a>. We are committed to resolving any issues promptly.</p>
    </motion.div>
  </div>
);

export default PrivacyPolicy;
