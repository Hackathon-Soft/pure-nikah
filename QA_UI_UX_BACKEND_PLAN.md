# PureNikah QA, UI/UX Findings, and Supabase Backend Plan

Date: 2026-10-10
Branch: dev
Repository: ayoubkhan558/pure-nikah

## QA scope

Checked the public home page, search page, login page, signup page, responsive search layout, frontend build, automated tests, lint, dependency installation, and the Supabase project connection.

## Test results

- Production build: PASS.
- Automated tests: PASS, 1 test passed.
- Browser smoke test: PASS for home, search, login, and signup routes.
- Browser console errors: none observed in the local smoke test.
- Failed browser requests: none observed in the local smoke test.
- Login validation: PASS for required email/password and invalid email/password.
- Signup validation: PASS for required name/email/gender/password/confirmation.
- ESLint: PASS with 0 errors and 7 existing Fast Refresh warnings in shared UI primitives.
- Clean `npm ci --ignore-scripts --no-audit`: PASS after synchronizing package-lock.json.
- npm audit currently reports dependency vulnerabilities and should be handled in a separate dependency-upgrade pass.
- Production build warning: large JavaScript chunks. The largest generated chunk is about 1.09 MB before gzip.

## Findings

### High priority functional issues

1. Public search currently cannot show profiles to logged-out visitors.
   - `src/pages/Search.jsx` is publicly routable and advertises search.
   - The `profiles` migration only allows SELECT to authenticated users.
   - The current logged-out search experience shows `Showing 0 proposals` and `No profiles found`.
   - Choose one behavior: require login before opening search, or expose a safe public profile projection that hides private columns.

2. The search query filters on a column that is not in the migration schema.
   - `src/pages/Search.jsx` calls `.or("is_married.is.null,is_married.eq.false")`.
   - `profiles` does not define `is_married`.
   - The query error is ignored, so the UI can silently fall back to an empty profile list.
   - Fix by removing the filter, adding the intended column, or filtering with the existing `marital_status` field.

3. The home-page State links are wired as City filters.
   - `BrowseBySection.jsx` creates `?state=Punjab` and similar links.
   - `Search.jsx` converts `state` into `filters.city`.
   - `profiles` has no state/province column, so State links can return no matches or incorrectly filter by city.
   - Add a `state` column and a real state filter, or remove the State category.

4. The photo-only filter is counted but never applied.
   - `withPhotoOnly` contributes to the active filter count.
   - The profile filtering logic does not check `filters.withPhotoOnly`.
   - Users can enable the filter and still see profiles without photos.

5. Caste values are inconsistent.
   - Home browse list uses `Jatt`.
   - Search options use `Jat`.
   - Profile forms also use `Jatt`.
   - Pick one canonical value and normalize old data during migration.

6. The live Supabase project was initially empty and has now been provisioned.
   - Connected project: `nikah's Project`.
   - This issue was resolved during implementation.
   - The project now has the complete application schema, RLS enabled on all application tables, storage buckets, and the `public_profiles` discovery view.
   - The project now has active `admin-api`, `moderate-message`, `send-otp`, and `verify-otp` Edge Functions.

7. Verification backend resources are missing from the current migration set.
   - `Verification.jsx` expects the `verification_requests` table.
   - It uploads to the `verification-docs` storage bucket.
   - The repository migrations do not create the verification request table or bucket policies.
   - Verification will fail after a user reaches the verification screen unless these resources are added.

8. Signup data is only partially persisted.
   - Signup sends `name` and `gender` to Supabase Auth metadata.
   - Registration type, registered-by name, and relation are stored in localStorage.
   - The codebase does not currently show a reliable step that copies those localStorage values into `profiles`.
   - Family registration details can be lost or become stale on another device.

### Security and privacy issues

9. The current profiles SELECT policy exposes every profile column to every authenticated user.
   - The table contains sensitive fields such as income range, phone information, family background, and verification flags.
   - Use a `public_profiles` view or explicit column selection for discovery.
   - Restrict sensitive fields to the owner, approved matches, wali participants, and authorized moderators.

10. Verification documents must remain private.
    - Use a private `verification-docs` bucket.
    - Allow users to upload only to their own folder.
    - Allow moderators to access documents through a protected Edge Function or tightly scoped policy.
    - Never expose document paths through the public profile query.

11. The special benefits for widowed and divorced members are currently promises, not enforced entitlements.
    - The UI advertises free verification/free premium for widowed members and discounts for divorced members.
    - Add a server-side eligibility/benefits model before displaying these as guaranteed benefits.
    - Do not expose marital status as a public label unless the member chooses to show it.

### UI/UX and accessibility issues

12. Mobile search input text is visually clipped.
    - At 390px width, the placeholder ends abruptly around `profes...`.
    - Use a shorter mobile placeholder such as `Search name, city, caste...` or responsive placeholder text.

13. Search has an ambiguous empty state for logged-out visitors.
    - `No profiles found` looks like a data problem instead of an authentication requirement.
    - Show a clear `Sign in to browse profiles` CTA when the visitor is logged out.
    - Show `No matches yet` only after an authenticated query succeeds.

14. Search filter buttons should expose state to assistive technology.
    - Add `aria-pressed` to the proposal-type buttons.
    - Add `aria-expanded` and `aria-controls` to the Show/Hide Filters button.
    - Add labels to icon-only buttons, including password visibility toggles and carousel controls.

15. Auth inputs should use browser autofill semantics.
    - Add `autoComplete="email"`, `current-password`, `new-password`, and `name` where appropriate.
    - This improves mobile signup and login completion.

16. The Search button does not need to be a separate submit action unless the app intends to defer filtering.
    - Current filtering is state-driven as the user types.
    - Either make the button a real form submit with clear behavior or remove the redundant action.

### Marital-status wording and behavior

Canonical display labels should be:

- Never married
- Divorced members
- Widowed members
- Separated members

Canonical database values should be:

- `never_married`
- `divorced`
- `widowed`
- `separated`

Current behavior is uneven:

- Home Browse by Marital Status includes all four statuses.
- Search has dedicated proposal tabs only for Widowed and Divorced.
- Separated is available through the filter dropdown but not as a dedicated tab.
- The banners use `Special Support for Widowed Members` and `Fresh Start for Divorced Members`.

Recommended UX:

- Keep the respectful banner copy, but do not make marital status public by default.
- Make all four statuses available through one consistent filter system.
- Use `Widowed members` and `Divorced members` in sentence case; avoid duplicated wording such as `Divorced Members members`.
- Clearly label support/discount eligibility and enforce it in the backend rather than only in UI copy.

## Supabase implementation plan

### Phase 1: Foundation

- Apply the repository schema through Supabase migrations.
- Preserve the `profiles.user_id` foreign key to `auth.users`.
- Add updated-at triggers and indexes.
- Add safe enums/check constraints for gender, marital status, interest status, verification status, and notice type.
- Keep email verification enabled.
- Keep service-role operations inside Edge Functions only.

### Phase 2: Core data model

Tables:

- `profiles`: public-safe profile data and owner-only private fields.
- `user_roles`: admin, moderator, and user roles.
- `interests`: interest requests and acceptance state.
- `favorites`: saved profiles.
- `conversations`: mutual conversations.
- `messages`: messages with realtime support.
- `notifications`: user notifications.
- `profile_views`: view tracking.
- `blocked_users`: block relationships.
- `reports`: moderation reports.
- `flagged_messages`: automated moderation queue.
- `platform_settings`: admin-controlled limits.
- `hidden_from_users`: per-user discovery exclusions.
- `success_stories`: approved public testimonials.
- `public_notices`: public safety and maintenance notices.
- `photo_access_requests`: private/blurred photo access workflow.
- `wali_participants`: guardian participation in conversations.
- `verification_requests`: CNIC/selfie review workflow.
- `phone_otps`: short-lived OTP hashes and attempt counters.

### Phase 3: Security model

- Create a `public_profiles` view that excludes phone, income, family, verification, and moderation fields.
- Use owner-only policies for private profile fields.
- Require mutual interest acceptance before messaging.
- Restrict report and moderation data to the reporter and moderators/admins.
- Add policies for hidden profiles, blocked users, photo access requests, and wali participants.
- Add rate limits for signup, OTP, profile views, interests, favorites, and messages.
- Run Supabase security and performance advisors after every DDL batch.

### Phase 4: Storage and verification

- Create a private `verification-docs` bucket.
- Create a private or controlled `profile-photos` bucket.
- Add folder-based policies using the authenticated user ID.
- Deploy verification review endpoints and signed URL access.
- Store only file paths and review metadata in the database.
- Never make CNIC/selfie files public.

### Phase 5: Edge Functions

Deploy and test:

- `admin-api`: server-side admin authorization and moderation actions.
- `moderate-message`: message screening and flag creation.
- `send-otp`: OTP generation, hashing, expiry, cooldown, and SMS provider integration.
- `verify-otp`: OTP validation, attempt limit, and profile update.
- A verification review function for signed document access and moderator actions.
- A benefits/eligibility function for widowed and divorced support rules.

### Phase 6: Demo data and acceptance tests

- Create synthetic demo accounts only; do not use real CNIC, phone, or personal data.
- Seed profiles for Never married, Divorced, Widowed, and Separated categories.
- Seed cities, castes, sects, and realistic but clearly fictional profile content.
- Test email signup and email verification.
- Test login, logout, password reset, and protected routes.
- Test profile creation and edit.
- Test search, each marital-status filter, caste/state/city filters, photo-only filter, and hidden profiles.
- Test interest send/accept/reject, messaging, blocking, reporting, notifications, and wali access.
- Test moderator verification review and private storage access.

## Recommended execution order

1. Fix the frontend query and filter mismatches.
2. Apply the complete Supabase schema and RLS policies.
3. Add missing tables, storage buckets, and Edge Functions.
4. Generate updated Supabase TypeScript types.
5. Seed synthetic demo profiles.
6. Run the login/signup/profile/search acceptance tests.
7. Fix lint and lockfile drift.
8. Re-run build, tests, lint, security advisors, and performance advisors.

## Implementation status

- Supabase connection: complete.
- Core migrations: applied.
- Missing backend resources: applied.
- Security/performance hardening migration: applied.
- Edge Functions: deployed with JWT verification enabled.
- Generated Supabase TypeScript types: updated.
- Frontend search/auth/accessibility fixes: applied.
- Dependency lockfile: synchronized.
- Remaining non-blocking items: dependency vulnerability upgrades, shared UI Fast Refresh warnings, and photo-manager UI replacement of its remaining placeholder grid.
