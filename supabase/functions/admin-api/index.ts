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
    const supabaseAnonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing env vars:", { url: !!supabaseUrl, serviceKey: !!supabaseServiceKey, anonKey: !!supabaseAnonKey });
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the calling user using their JWT
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error("Auth error:", userError?.message);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role client for admin operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user has admin role
    const { data: roleData, error: roleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      console.error("Role check failed:", roleError?.message, "user:", user.id);
      return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, ...params } = body;
    console.log("Admin action:", action, "by user:", user.id);

    let result;

    switch (action) {
      case "get_stats": {
        const [profiles, verified, banned, pendingReports, conversations, interests] = await Promise.all([
          adminClient.from("profiles").select("*", { count: "exact", head: true }),
          adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", true),
          adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("is_banned", true),
          adminClient.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
          adminClient.from("conversations").select("*", { count: "exact", head: true }),
          adminClient.from("interests").select("*", { count: "exact", head: true }),
        ]);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { count: recentSignups } = await adminClient
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", thirtyDaysAgo.toISOString());

        result = {
          totalProfiles: profiles.count || 0,
          verifiedProfiles: verified.count || 0,
          bannedUsers: banned.count || 0,
          pendingReports: pendingReports.count || 0,
          totalConversations: conversations.count || 0,
          totalInterests: interests.count || 0,
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

        // Get emails for listed users (batch)
        const usersWithEmail = [];
        for (const profile of data || []) {
          try {
            const { data: authData } = await adminClient.auth.admin.getUserById(profile.user_id);
            usersWithEmail.push({
              ...profile,
              email: authData?.user?.email || "N/A",
              last_sign_in: authData?.user?.last_sign_in_at,
            });
          } catch {
            usersWithEmail.push({ ...profile, email: "N/A", last_sign_in: null });
          }
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
        result = { success: true, message: banned ? "User banned" : "User unbanned" };
        break;
      }

      case "verify_user": {
        const { userId, verified } = params;
        const { error } = await adminClient
          .from("profiles")
          .update({ is_verified: verified })
          .eq("user_id", userId);
        if (error) throw error;
        result = { success: true, message: verified ? "User verified" : "Verification removed" };
        break;
      }

      case "delete_user": {
        const { userId } = params;
        // Delete profile first (cascade should handle it, but be safe)
        await adminClient.from("profiles").delete().eq("user_id", userId);
        const { error } = await adminClient.auth.admin.deleteUser(userId);
        if (error) throw error;
        result = { success: true, message: "User deleted" };
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
          try {
            const { data: authData } = await adminClient.auth.admin.getUserById(profile.user_id);
            withEmail.push({ ...profile, email: authData?.user?.email || "N/A" });
          } catch {
            withEmail.push({ ...profile, email: "N/A" });
          }
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

      case "get_user_detail": {
        const { userId } = params;
        const [profile, authData, roles, reportsAgainst] = await Promise.all([
          adminClient.from("profiles").select("*").eq("user_id", userId).single(),
          adminClient.auth.admin.getUserById(userId),
          adminClient.from("user_roles").select("role").eq("user_id", userId),
          adminClient.from("reports").select("*", { count: "exact", head: true }).eq("reported_user_id", userId),
        ]);
        result = {
          profile: profile.data,
          email: authData.data?.user?.email,
          last_sign_in: authData.data?.user?.last_sign_in_at,
          created_at: authData.data?.user?.created_at,
          roles: (roles.data || []).map((r: any) => r.role),
          reportsCount: reportsAgainst.count || 0,
        };
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
    console.error("Admin API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
