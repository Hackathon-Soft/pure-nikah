import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiRefreshCw, FiShield, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const VerificationReVerify = () => {
  return (
    <div className="min-h-screen bg-muted islamic-pattern flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            {/* Re-verify Icon */}
            <div className="relative mx-auto w-20 h-20">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                <FiRefreshCw className="text-amber-600 text-3xl" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <FiCalendar className="text-white text-sm" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Time to Re-verify
              </h1>
              <p className="text-muted-foreground text-sm">
                Your verification has expired after 6 months. Please complete the verification process again to maintain your verified status.
              </p>
            </div>

            {/* Alert Box */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="flex items-start gap-3 text-left">
                <FiAlertCircle className="text-amber-600 text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Why re-verification?</p>
                  <p className="text-xs text-muted-foreground">
                    Periodic re-verification helps maintain the trust and authenticity of our community. It ensures all profiles are current and genuine.
                  </p>
                </div>
              </div>
            </div>

            {/* What you'll need */}
            <div className="bg-muted rounded-xl p-4 text-left">
              <p className="text-sm font-medium text-foreground mb-2">What you'll need:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <FiShield className="text-primary" /> Valid CNIC (front & back)
                </li>
                <li className="flex items-center gap-2">
                  <FiShield className="text-primary" /> A clear selfie matching your CNIC
                </li>
                <li className="flex items-center gap-2">
                  <FiShield className="text-primary" /> 5 minutes of your time
                </li>
              </ul>
            </div>

            {/* Benefits reminder */}
            <div className="bg-primary/5 rounded-xl p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Keep your verified badge:</p>
              <p className="text-xs">
                Verified profiles receive 3x more interest and appear higher in search results.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/dashboard/verification">
                  <FiRefreshCw className="mr-2" /> Start Re-verification
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/dashboard">
                  Remind Me Later
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Without re-verification, your verified badge will be removed and you may lose access to certain features.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerificationReVerify;
