import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiClock, FiCheckCircle, FiShield, FiArrowLeft } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { icon: FiCheckCircle, label: "Documents Submitted", done: true },
  { icon: FiClock, label: "Under Review", active: true },
  { icon: FiShield, label: "Verified", done: false },
];

const VerificationPending = () => {
  return (
    <div className="min-h-screen bg-muted islamic-pattern flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            {/* Animated Clock Icon */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-30" />
              <div className="relative w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                <FiClock className="text-amber-600 text-3xl" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Verification in Progress
              </h1>
              <p className="text-muted-foreground text-sm">
                Your documents have been submitted and are currently under review by our team.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 py-4">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className={`flex flex-col items-center ${step.active ? "text-amber-600" : step.done ? "text-green-600" : "text-muted-foreground"}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.active ? "bg-amber-100" : step.done ? "bg-green-100" : "bg-muted"}`}>
                      <step.icon className="text-lg" />
                    </div>
                    <span className="text-xs mt-1 font-medium">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 ${step.done ? "bg-green-300" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-muted rounded-xl p-4 text-left space-y-2">
              <p className="text-sm font-medium text-foreground">What happens next?</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Our team will review your documents within 24-48 hours</li>
                <li>• You'll receive a notification once verification is complete</li>
                <li>• You can continue browsing profiles while waiting</li>
              </ul>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>Submitted documents are handled securely and only used for identity verification.</p>
            </div>

            <Button variant="outline" asChild className="w-full">
              <Link to="/dashboard">
                <FiArrowLeft className="mr-2" /> Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerificationPending;
