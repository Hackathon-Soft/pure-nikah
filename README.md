# PureNikah — Islamic Matrimonial Platform

A full-stack Islamic matrimonial web application built with React, Vite, Tailwind CSS, and Lovable Cloud (Supabase).

**Live URL**: https://pure-nikah.lovable.app

---

## Tech Stack

- React 18 + Vite
- Tailwind CSS + shadcn/ui
- Supabase (Auth, Database, Edge Functions, RLS)
- React Query, Framer Motion, React Router

---

## Getting Started Locally

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for full database replication instructions.

---

## Admin Panel

### Access

The admin panel is available at `/admin` and is **only visible to users with the `admin` role**.

### How to access

1. Log in with an admin account (e.g., `mayoubkhan558@gmail.com`)
2. You'll see an **"Admin Panel"** link in the dashboard sidebar
3. Click it to navigate to `/admin`

### Assigning admin role

To make a user an admin, run this SQL in your Supabase SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_UUID_HERE', 'admin');
```

Find the user UUID in Authentication → Users in the Supabase dashboard.

### Admin Features

| Page | Route | Description |
|------|-------|-------------|
| Overview | `/admin` | Platform stats (users, verified, banned, reports, signups) |
| Users | `/admin/users` | Search, filter, verify, ban, delete users |
| Verification | `/admin/verification` | Review and approve/reject completed profiles |
| Reports | `/admin/reports` | Review, resolve, or dismiss user reports |

---

## User Roles

Roles are stored in a separate `user_roles` table (never on the profile). Available roles:

- `admin` — Full platform access
- `moderator` — Content moderation (future)
- `user` — Default role

Role checks use a `has_role()` security definer function to avoid RLS recursion.

---

## Authentication

- Email/password signup with **email verification required**
- Auto-confirm is **disabled** — users must verify their email before logging in
- Password reset via email with redirect to `/reset-password`

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profile data |
| `interests` | Interest requests between users |
| `favorites` | Favorited profiles |
| `conversations` | Chat conversations |
| `messages` | Messages within conversations |
| `notifications` | In-app notifications |
| `profile_views` | Who viewed whose profile |
| `blocked_users` | Blocked user relationships |
| `user_roles` | Role assignments (admin, moderator, user) |
| `reports` | Content moderation reports |

---

## Edge Functions

| Function | Purpose |
|----------|---------|
| `admin-api` | All admin operations (stats, user management, verification, reports) — validates admin role server-side |

---

## Deployment

- **Frontend**: Click "Publish" in Lovable, then "Update" for frontend changes
- **Backend**: Edge functions and database migrations deploy automatically

---

## Custom Domain

Navigate to Project → Settings → Domains in Lovable to connect your own domain.
