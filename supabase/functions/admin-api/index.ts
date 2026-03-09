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
      console.error("Missing env vars:", { url: !!supabaseUrl, serviceKey: !!supabaseServiceKey });
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: roleData, error: roleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
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
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [profiles, verified, banned, pendingReports, conversations, interests, marriages, recentMarriagesRes, recentSignupsRes] = await Promise.all([
          adminClient.from("profiles").select("*", { count: "exact", head: true }),
          adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", true),
          adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("is_banned", true),
          adminClient.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
          adminClient.from("conversations").select("*", { count: "exact", head: true }),
          adminClient.from("interests").select("*", { count: "exact", head: true }),
          adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("is_married", true),
          adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("is_married", true).gte("updated_at", thirtyDaysAgo.toISOString()),
          adminClient.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo.toISOString()),
        ]);

        result = {
          totalProfiles: profiles.count || 0,
          verifiedProfiles: verified.count || 0,
          bannedUsers: banned.count || 0,
          pendingReports: pendingReports.count || 0,
          totalConversations: conversations.count || 0,
          totalInterests: interests.count || 0,
          recentSignups: recentSignupsRes.count || 0,
          totalMarriages: marriages.count || 0,
          recentMarriages: recentMarriagesRes.count || 0,
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
        if (filter === "married") query = query.eq("is_married", true);

        const { data, count, error } = await query;
        if (error) throw error;

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

      case "review_verification_request": {
        const { requestId, userId, approved, rejectionReason } = params;
        if (!requestId || !userId || typeof approved !== "boolean") {
          throw new Error("requestId, userId and approved are required");
        }

        const newStatus = approved ? "approved" : "rejected";

        const { error: requestError } = await adminClient
          .from("verification_requests")
          .update({
            status: newStatus,
            rejection_reason: approved ? null : (rejectionReason || null),
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.id,
          })
          .eq("id", requestId)
          .eq("user_id", userId);

        if (requestError) throw requestError;

        const { error: profileError } = await adminClient
          .from("profiles")
          .update({ is_verified: approved })
          .eq("user_id", userId);

        if (profileError) throw profileError;

        result = { success: true, message: approved ? "Verification approved" : "Verification rejected" };
        break;
      }

      case "mark_married": {
        const { userId, married } = params;
        const { error } = await adminClient
          .from("profiles")
          .update({ is_married: married })
          .eq("user_id", userId);
        if (error) throw error;
        result = { success: true, message: married ? "User marked as married — Mubarak!" : "Marriage status removed" };
        break;
      }

      case "delete_user": {
        const { userId } = params;
        await adminClient.from("profiles").delete().eq("user_id", userId);
        const { error } = await adminClient.auth.admin.deleteUser(userId);
        if (error) throw error;
        result = { success: true, message: "User deleted" };
        break;
      }

      case "list_verification_requests": {
        const { data: requestRows, error } = await adminClient
          .from("verification_requests")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const userIds = [...new Set((requestRows || []).map((row) => row.user_id))];

        const { data: profileRows } = userIds.length
          ? await adminClient
              .from("profiles")
              .select("user_id,first_name,last_name,city,gender,education,profession")
              .in("user_id", userIds)
          : { data: [] };

        const profileByUserId = new Map((profileRows || []).map((profile) => [profile.user_id, profile]));

        const requests = await Promise.all((requestRows || []).map(async (request) => {
          const profile = profileByUserId.get(request.user_id) || {};

          let email = "N/A";
          try {
            const { data: authData } = await adminClient.auth.admin.getUserById(request.user_id);
            email = authData?.user?.email || "N/A";
          } catch {
            email = "N/A";
          }

          const [frontRes, backRes, selfieRes] = await Promise.all([
            adminClient.storage.from("verification-docs").createSignedUrl(request.cnic_front_path, 3600),
            adminClient.storage.from("verification-docs").createSignedUrl(request.cnic_back_path, 3600),
            adminClient.storage.from("verification-docs").createSignedUrl(request.selfie_path, 3600),
          ]);

          return {
            ...request,
            ...profile,
            email,
            cnic_front_url: frontRes.data?.signedUrl || null,
            cnic_back_url: backRes.data?.signedUrl || null,
            selfie_url: selfieRes.data?.signedUrl || null,
          };
        }));

        result = { requests };
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

      // Success Stories Management
      case "list_success_stories": {
        const { data, error } = await adminClient
          .from("success_stories")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        result = { stories: data || [] };
        break;
      }

      case "approve_story": {
        const { storyId } = params;
        const { error } = await adminClient
          .from("success_stories")
          .update({ is_approved: true })
          .eq("id", storyId);
        if (error) throw error;
        result = { success: true, message: "Story approved and is now live!" };
        break;
      }

      case "delete_story": {
        const { storyId } = params;
        const { error } = await adminClient
          .from("success_stories")
          .delete()
          .eq("id", storyId);
        if (error) throw error;
        result = { success: true, message: "Story deleted" };
        break;
      }

      case "get_analytics": {
        const [
          totalProfilesRes,
          verifiedRes,
          unverifiedRes,
          pendingVerifRes,
          rejectedVerifRes,
          totalInterestsRes,
          profilesData,
          monthlyData,
        ] = await Promise.all([
          adminClient.from("profiles").select("*", { count: "exact", head: true }),
          adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", true),
          adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", false),
          adminClient.from("verification_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
          adminClient.from("verification_requests").select("*", { count: "exact", head: true }).eq("status", "rejected"),
          adminClient.from("interests").select("*", { count: "exact", head: true }),
          adminClient.from("profiles").select("gender, city, sect, marital_status, created_at"),
          // Active users (updated in last 30 days)
          adminClient.from("profiles").select("*", { count: "exact", head: true })
            .gte("updated_at", new Date(Date.now() - 30 * 86400000).toISOString()),
        ]);

        const profiles = profilesData.data || [];

        // Gender distribution
        const genderMap: Record<string, number> = {};
        profiles.forEach((p: any) => {
          const g = p.gender === "male" ? "Male" : p.gender === "female" ? "Female" : "Other";
          genderMap[g] = (genderMap[g] || 0) + 1;
        });
        const genderDistribution = Object.entries(genderMap).map(([name, value]) => ({ name, value }));

        // Top cities
        const cityMap: Record<string, number> = {};
        profiles.forEach((p: any) => {
          if (p.city) cityMap[p.city] = (cityMap[p.city] || 0) + 1;
        });
        const topCities = Object.entries(cityMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, count]) => ({ name, count }));

        // Sect distribution
        const sectMap: Record<string, number> = {};
        profiles.forEach((p: any) => {
          if (p.sect) sectMap[p.sect] = (sectMap[p.sect] || 0) + 1;
        });
        const sectDistribution = Object.entries(sectMap).map(([name, value]) => ({ name, value }));

        // Marital status
        const maritalMap: Record<string, number> = {};
        profiles.forEach((p: any) => {
          const ms = p.marital_status || "Unknown";
          const label = ms.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
          maritalMap[label] = (maritalMap[label] || 0) + 1;
        });
        const maritalDistribution = Object.entries(maritalMap).map(([name, count]) => ({ name, count }));

        // Monthly signups (last 6 months)
        const monthlySignups: { month: string; count: number }[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const monthName = d.toLocaleString("default", { month: "short", year: "2-digit" });
          const start = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
          const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString();
          const count = profiles.filter((p: any) => p.created_at >= start && p.created_at <= end).length;
          monthlySignups.push({ month: monthName, count });
        }

        result = {
          totalProfiles: totalProfilesRes.count || 0,
          activeUsers: monthlyData.count || 0,
          totalInterests: totalInterestsRes.count || 0,
          avgCompatibility: 72, // placeholder
          genderDistribution,
          topCities,
          sectDistribution,
          maritalDistribution,
          monthlySignups,
          verificationStats: {
            verified: verifiedRes.count || 0,
            unverified: unverifiedRes.count || 0,
            pending: pendingVerifRes.count || 0,
            rejected: rejectedVerifRes.count || 0,
          },
        };
        break;
      }

      case "list_flagged_messages": {
        const { status: flagStatus } = params;
        let query = adminClient
          .from("flagged_messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (flagStatus && flagStatus !== "all") {
          query = query.eq("status", flagStatus);
        }

        const { data: flaggedRows, error } = await query;
        if (error) throw error;

        // Enrich with sender profile info
        const messages = await Promise.all((flaggedRows || []).map(async (flag) => {
          const { data: profile } = await adminClient
            .from("profiles")
            .select("first_name, last_name, is_verified")
            .eq("user_id", flag.sender_id)
            .single();
          
          return {
            ...flag,
            sender_name: profile ? `${profile.first_name} ${profile.last_name}` : "Unknown",
            sender_verified: profile?.is_verified || false,
          };
        }));

        result = { messages };
        break;
      }

      case "resolve_flagged_message": {
        const { flagId, action, adminNotes, userId } = params;
        if (!flagId || !action) {
          throw new Error("flagId and action are required");
        }

        // Update the flagged message status
        const { error: flagError } = await adminClient
          .from("flagged_messages")
          .update({
            status: "resolved",
            admin_notes: adminNotes || `Action: ${action}`,
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", flagId);

        if (flagError) throw flagError;

        // Take action on user if needed
        if (action === "warn" && userId) {
          // Create a notification for the user
          await adminClient.from("notifications").insert({
            user_id: userId,
            type: "warning",
            title: "Message Policy Warning",
            message: "One of your messages was flagged for violating our community guidelines. Please keep conversations respectful and appropriate.",
          });
        } else if (action === "ban" && userId) {
          // Ban the user
          await adminClient
            .from("profiles")
            .update({ is_banned: true })
            .eq("user_id", userId);
        }

        result = { success: true, action };
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
