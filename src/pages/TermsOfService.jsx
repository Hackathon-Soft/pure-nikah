import { motion } from "framer-motion";
import { FiFileText, FiUserCheck, FiAlertTriangle, FiShield, FiSlash, FiRefreshCw } from "react-icons/fi";

const sections = [
  { icon: <FiUserCheck style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Account & Eligibility", content: ["You must be at least 18 years old to create an account on PureNikah.","You must provide truthful, accurate, and complete information during registration.","Each person may only maintain one account. Duplicate accounts will be terminated.","You are responsible for maintaining the security of your account credentials.","PureNikah is intended solely for Muslims seeking marriage in accordance with Islamic values."] },
  { icon: <FiShield style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Verification Requirements", content: ["All users must complete identity verification (CNIC, selfie, and human review) to use the platform.","Verification must be renewed every 6 months to maintain active status.","Submitting false, forged, or someone else's identity documents is strictly prohibited and will result in permanent ban.","Our verification team reserves the right to reject submissions that do not meet our standards."] },
  { icon: <FiFileText style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Acceptable Use", content: ["Use PureNikah respectfully and in accordance with Islamic values and etiquette.","Do not upload inappropriate, offensive, or misleading photos or content.","Do not harass, threaten, or send unwanted messages to other users.","Do not use the platform for any purpose other than seeking a lawful marriage partner.","Do not share other users' private information, photos, or conversations outside the platform."] },
  { icon: <FiSlash style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Prohibited Activities", content: ["Creating fake profiles or impersonating another person.","Spamming, soliciting, or sending bulk messages to users.","Using automated bots, scrapers, or tools to access the platform.","Attempting to bypass verification, security measures, or rate limits.","Engaging in fraudulent, deceptive, or illegal activities.","Sharing explicit, vulgar, or un-Islamic content."] },
  { icon: <FiAlertTriangle style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Enforcement & Termination", content: ["We reserve the right to suspend or permanently ban accounts that violate these terms.","Reported accounts are reviewed by our moderation team within 24-48 hours.","Users found creating fake profiles or submitting false documents will be permanently banned.","We may take legal action in cases of identity fraud or serious violations.","You may appeal account decisions by contacting our support team."] },
  { icon: <FiRefreshCw style={{ fontSize: "var(--size-icon-lg)" }} />, title: "Changes to Terms", content: ["We may update these terms from time to time to reflect changes in our platform or policies.","Significant changes will be communicated via email and in-app notifications.","Continued use of PureNikah after changes constitutes acceptance of the updated terms.","We encourage you to review these terms periodically."] },
];

const TermsOfService = () => (
  <div className="w-full max-w-3xl">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-token-3xl font-display font-bold text-foreground mb-token-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-token-2">Last updated: March 8, 2026</p>
      <p className="text-muted-foreground text-token-sm mb-token-8">By using PureNikah, you agree to these terms. Please read them carefully before creating an account or using our platform.</p>
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
      <p className="text-token-sm text-muted-foreground"><strong className="text-foreground">Questions?</strong> Contact us at <a href="mailto:legal@purenikah.com" className="text-primary hover:underline">legal@purenikah.com</a> for any questions about these terms.</p>
    </motion.div>
  </div>
);

export default TermsOfService;
