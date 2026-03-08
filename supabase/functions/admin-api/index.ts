import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    // Verify the calling user is admin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role client for admin operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user has admin role
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, ...params } = await req.json();

    let result;

    switch (action) {
      case "get_stats": {
        const [users, profiles, verified, banned, pendingReports, conversations] = await Promise.all([
          adminClient.auth.admin.listUsers({ perPage: 1 }),
          adminClient.from("profiles").select("*", { count: "exact", head: true }),
          adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", true),
          adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("is_banned", true),
          adminClient.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
          adminClient.from("conversations").select("*", { count: "exact", head: true }),
        ]);

        // Get recent signups (last 30 days) via profiles created_at
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { count: recentSignups } = await adminClient
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", thirtyDaysAgo.toISOString());

        result = {
          totalUsers: users.data?.users?.length || profiles.count || 0,
          totalProfiles: profiles.count || 0,
          verifiedProfiles: verified.count || 0,
          bannedUsers: banned.count || 0,
          pendingReports: pendingReports.count || 0,
          totalConversations: conversations.count || 0,
          recentSignups: recentSignups || 0,
        };
        break;
      }

      case "list_users": {
        const { page = 1, perPage = 20, search, filter } = params;
        let query = adminClient
          .from("profiles")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range((page - 1) * perPage, page * perPage - 1);

        if (search) {
          query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,city.ilike.%${search}%`);
        }
        if (filter === "verified") query = query.eq("is_verified", true);
        if (filter === "banned") query = query.eq("is_banned", true);
        if (filter === "unverified") query = query.eq("is_verified", false);

        const { data, count, error } = await query;
        if (error) throw error;

        // Get emails for listed users
        const userIds = (data || []).map((p: any) => p.user_id);
        const usersWithEmail = [];
        for (const profile of data || []) {
          const { data: authUser } = await adminClient.auth.admin.getUserById(profile.user_id);
          usersWithEmail.push({
            ...profile,
            email: authUser?.user?.email || "N/A",
            last_sign_in: authUser?.user?.last_sign_in_at,
          });
        }

        result = { users: usersWithEmail, total: count };
        break;
      }

      case "ban_user": {
        const { userId, banned } = params;
        const { error } = await adminClient
          .from("profiles")
          .update({ is_banned: banned })
          .eq("user_id", userId);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "verify_user": {
        const { userId, verified } = params;
        const { error } = await adminClient
          .from("profiles")
          .update({ is_verified: verified })
          .eq("user_id", userId);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "delete_user": {
        const { userId } = params;
        const { error } = await adminClient.auth.admin.deleteUser(userId);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "list_verification_requests": {
        const { data, error } = await adminClient
          .from("profiles")
          .select("*")
          .eq("is_verified", false)
          .eq("profile_completed", true)
          .order("created_at", { ascending: false });
        if (error) throw error;

        const withEmail = [];
        for (const profile of data || []) {
          const { data: authUser } = await adminClient.auth.admin.getUserById(profile.user_id);
          withEmail.push({ ...profile, email: authUser?.user?.email || "N/A" });
        }
        result = { requests: withEmail };
        break;
      }

      case "list_reports": {
        const { status: reportStatus } = params;
        let query = adminClient
          .from("reports")
          .select("*")
          .order("created_at", { ascending: false });

        if (reportStatus) query = query.eq("status", reportStatus);

        const { data, error } = await query;
        if (error) throw error;

        // Enrich with user info
        const enriched = [];
        for (const report of data || []) {
          const [reporter, reported] = await Promise.all([
            adminClient.from("profiles").select("first_name, last_name").eq("user_id", report.reporter_id).single(),
            adminClient.from("profiles").select("first_name, last_name").eq("user_id", report.reported_user_id).single(),
          ]);
          enriched.push({
            ...report,
            reporter_name: reporter.data ? `${reporter.data.first_name} ${reporter.data.last_name}` : "Unknown",
            reported_name: reported.data ? `${reported.data.first_name} ${reported.data.last_name}` : "Unknown",
          });
        }
        result = { reports: enriched };
        break;
      }

      case "resolve_report": {
        const { reportId, status: newStatus, admin_notes } = params;
        const { error } = await adminClient
          .from("reports")
          .update({ status: newStatus, admin_notes, resolved_by: user.id })
          .eq("id", reportId);
        if (error) throw error;
        result = { success: true };
        break;
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
