import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiXCircle, FiAlertTriangle, FiRefreshCw, FiMail } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const commonReasons = [
  "Document image was unclear or blurry",
  "Name on document doesn't match profile",
  "Document appears to be expired",
  "Selfie doesn't match the document photo",
  "Information is partially obscured",
];

const VerificationRejected = () => {
  return (
    <div className="min-h-screen bg-muted islamic-pattern flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            {/* Rejection Icon */}
            <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <FiXCircle className="text-destructive text-4xl" />
            </div>

            <div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Verification Unsuccessful
              </h1>
              <p className="text-muted-foreground text-sm">
                Unfortunately, we couldn't verify your identity with the documents provided. Please review the issues and try again.
              </p>
            </div>

            {/* Possible Reasons */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 mb-3">
                <FiAlertTriangle className="text-amber-600" />
                <p className="text-sm font-medium text-foreground">Common reasons for rejection:</p>
              </div>
              <ul className="space-y-1">
                {commonReasons.map((reason) => (
                  <li key={reason} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips for Resubmission */}
            <div className="bg-muted rounded-xl p-4 text-left">
              <p className="text-sm font-medium text-foreground mb-2">Tips for successful verification:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Ensure good lighting when taking photos</li>
                <li>• Make sure all text on documents is clearly readable</li>
                <li>• Use a valid, non-expired CNIC</li>
                <li>• Face the camera directly for your selfie</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/dashboard/verification">
                  <FiRefreshCw className="mr-2" /> Try Again
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="mailto:support@purenikah.com">
                  <FiMail className="mr-2" /> Contact Support
                </a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              If you believe this was a mistake, please contact our support team with your verification details.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerificationRejected;
