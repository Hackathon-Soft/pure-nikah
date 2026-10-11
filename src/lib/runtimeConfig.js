// Development switches are deliberately restricted to Vite development builds.
// They cannot disable verification in a production bundle.
export const runtimeConfig = {
  devSkipEmailVerification:
    import.meta.env.DEV && import.meta.env.VITE_DEV_SKIP_EMAIL_VERIFICATION === "true",
  devSkipPhoneVerification:
    import.meta.env.DEV && import.meta.env.VITE_DEV_SKIP_PHONE_VERIFICATION === "true",
  cnicOcrEnabled: import.meta.env.VITE_CNIC_OCR_ENABLED === "true",
};