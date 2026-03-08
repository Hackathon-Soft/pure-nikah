import { supabase } from "@/integrations/supabase/client";

export const adminApi = async (action, params = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const { data, error } = await supabase.functions.invoke("admin-api", {
    body: { action, ...params },
  });

  if (error) throw new Error(error.message || "Admin API error");
  if (data?.error) throw new Error(data.error);
  return data;
};
