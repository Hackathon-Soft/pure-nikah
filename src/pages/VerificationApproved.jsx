import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiShield, FiSearch, FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  "Verified badge on your profile",
  "Higher visibility in search results",
  "Access to verified-only profiles",
  "Increased trust from potential matches",
];

const VerificationApproved = () => {
  return (
    <div className="min-h-screen bg-muted islamic-pattern flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            {/* Success Icon */}
            <div className="relative mx-auto w-24 h-24">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center"
              >
                <FiCheckCircle className="text-green-600 text-5xl" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center"
              >
                <FiShield className="text-primary-foreground text-lg" />
              </motion.div>
            </div>

            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-display font-bold text-foreground mb-2"
              >
                Verification Approved!
              </motion.h1>
              <p className="text-muted-foreground text-sm">
                Alhamdulillah! Your identity has been verified. You now have access to all verified features.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 text-left">
              <p className="text-sm font-medium text-foreground mb-3">What you've unlocked:</p>
              <ul className="space-y-2">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FiCheckCircle className="text-green-600 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/5 rounded-xl p-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Note:</strong> Your verification is valid for 6 months. We'll remind you when it's time to re-verify.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/search">
                  <FiSearch className="mr-2" /> Start Searching
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard">
                  Go to Dashboard <FiArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerificationApproved;
