import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FiShield, FiCheckCircle, FiUser, FiMapPin, FiBookOpen, FiHeart as FiHeartIcon } from "react-icons/fi";

const ProfileView = () => {
  return (
    <div className="p-token-4 md:p-token-8 max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Header */}
        <Card>
          <CardContent className="p-token-6">
            <div className="flex flex-col sm:flex-row items-center gap-token-6">
              <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-token-3xl font-display font-bold">
                A
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-token-2">
                  <h1 className="font-display text-token-2xl font-bold text-foreground">Ahmed Khan</h1>
                  <span className="bg-primary/10 text-primary text-token-xs px-token-2 py-token-1 rounded-full flex items-center gap-token-1">
                    <FiShield style={{ fontSize: "var(--text-xs)" }} /> Verified
                  </span>
                </div>
                <p className="text-muted-foreground text-token-sm mt-token-1">28 years old • Male • Never Married</p>
                <p className="text-muted-foreground text-token-sm flex items-center justify-center sm:justify-start gap-token-1 mt-token-1">
                  <FiMapPin style={{ fontSize: "var(--text-xs)" }} /> Lahore, Pakistan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sections */}
      {[
        {
          title: "Basic Information",
          icon: FiUser,
          items: [
            ["Height", "5'10\""],
            ["Marital Status", "Never Married"],
            ["City", "Lahore"],
            ["Country", "Pakistan"],
          ],
        },
        {
          title: "Religious Information",
          icon: FiBookOpen,
          items: [
            ["Sect", "Sunni"],
            ["Prayer Level", "5 times daily"],
            ["Beard", "Yes"],
            ["Islamic Values", "Strong"],
          ],
        },
        {
          title: "Lifestyle",
          icon: FiCheckCircle,
          items: [
            ["Education", "Masters in Computer Science"],
            ["Profession", "Software Engineer"],
            ["Income", "Above Average"],
            ["Languages", "Urdu, English, Punjabi"],
          ],
        },
        {
          title: "Marriage Preferences",
          icon: FiHeartIcon,
          items: [
            ["Preferred Age", "22 - 28"],
            ["Preferred Location", "Punjab, Pakistan"],
            ["Preferred Cast", "Any"],
            ["Religious Expectations", "Practicing"],
          ],
        },
      ].map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
        >
          <Card>
            <CardContent className="p-token-6">
              <h2 className="font-display text-token-lg font-semibold text-foreground flex items-center gap-token-2 mb-token-4">
                <section.icon className="text-primary" style={{ fontSize: "var(--size-icon)" }} />
                {section.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-token-3">
                {section.items.map(([label, value]) => (
                  <div key={label}>
                    <p className="text-token-xs text-muted-foreground">{label}</p>
                    <p className="text-token-sm font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileView;
