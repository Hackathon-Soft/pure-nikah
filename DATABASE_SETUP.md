# Database Setup Guide — PureNikah

This guide explains how to replicate the PureNikah database schema in your own Supabase project.

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project ID**, **Anon Key**, and **Project URL** from Settings → API

---

## Step 2: Run Migrations

All database schema is stored in the `supabase/migrations/` folder. Each file is timestamped and must be run **in chronological order**.

### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_NEW_PROJECT_ID

# Push all migrations
supabase db push
```

### Option B: Manual via SQL Editor

1. Open your Supabase Dashboard → **SQL Editor**
2. Open each file in `supabase/migrations/` in order (sorted by timestamp)
3. Copy-paste and run each one sequentially

---

## Step 3: Deploy Edge Functions

```bash
# Deploy the admin API edge function
supabase functions deploy admin-api
```

Make sure to set the required secrets in your Supabase project:

```bash
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

---

## Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

---

## Step 5: Set Up Admin User

After creating your first user account, assign the admin role via SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UUID', 'admin');
```

You can find your user UUID in Authentication → Users in the Supabase dashboard.

---

## Step 6: Auth Configuration

- **Auto-confirm emails**: Disabled by default (users must verify email)
- To change: Go to Authentication → Settings → Email in your Supabase dashboard

---

## Database Tables Overview

| Table | Purpose |
|-------|---------|
| `profiles` | User profile data (name, city, education, religion, etc.) |
| `interests` | Interest requests between users |
| `favorites` | Users' favorited profiles |
| `conversations` | Chat conversations between two users |
| `messages` | Individual messages within conversations |
| `notifications` | In-app notifications |
| `profile_views` | Tracks who viewed whose profile |
| `blocked_users` | Blocked user relationships |
| `user_roles` | Admin/moderator/user role assignments |
| `reports` | Content moderation reports |

---

## Key Database Functions

- `has_role(user_id, role)` — Security definer function to check user roles (used in RLS policies)
- `handle_new_user()` — Trigger function that auto-creates a profile on signup
- `update_updated_at_column()` — Trigger function for auto-updating timestamps
