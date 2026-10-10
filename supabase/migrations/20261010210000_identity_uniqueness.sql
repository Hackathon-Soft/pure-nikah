-- Prevent the same phone number or identity document from being reused by
-- multiple active accounts/verification requests.
CREATE UNIQUE INDEX IF NOT EXISTS ux_profiles_phone_number_present
  ON public.profiles (lower(trim(phone_number)))
  WHERE phone_number IS NOT NULL AND trim(phone_number) <> '';

CREATE UNIQUE INDEX IF NOT EXISTS ux_verification_requests_cnic_active
  ON public.verification_requests (regexp_replace(cnic_number, '[^0-9]', '', 'g'))
  WHERE status IN ('pending', 'approved');

CREATE INDEX IF NOT EXISTS idx_verification_requests_phone
  ON public.verification_requests (phone_number);