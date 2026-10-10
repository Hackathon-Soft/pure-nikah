import { FiPhone } from "react-icons/fi";
import PhoneVerification from "@/components/verification/PhoneVerification";

const PhoneVerificationPage = () => (
  <div className="p-token-4 md:p-token-8 max-w-2xl mx-auto space-y-6">
    <div>
      <p className="section-label">Account security</p>
      <h1 className="page-title mt-2 flex items-center gap-2"><FiPhone className="text-primary" /> Phone verification</h1>
      <p className="text-muted-foreground mt-1">
        Verify your phone number to strengthen your account and unlock trusted matchmaking features.
      </p>
    </div>
    <PhoneVerification />
  </div>
);

export default PhoneVerificationPage;