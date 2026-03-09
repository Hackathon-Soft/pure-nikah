import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FiInfo, FiAlertTriangle, FiShield, FiTool, FiX } from "react-icons/fi";
import { useState } from "react";

const typeStyles = {
  info: { icon: FiInfo, bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800", text: "text-blue-800 dark:text-blue-200" },
  warning: { icon: FiAlertTriangle, bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800", text: "text-amber-800 dark:text-amber-200" },
  safety: { icon: FiShield, bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800", text: "text-red-800 dark:text-red-200" },
  maintenance: { icon: FiTool, bg: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800", text: "text-purple-800 dark:text-purple-200" },
};

const NoticeBanner = () => {
  const [dismissed, setDismissed] = useState([]);

  const { data: notices = [] } = useQuery({
    queryKey: ["public-notices"],
    queryFn: async () => {
      const { data } = await supabase
        .from("public_notices")
        .select("*")
        .eq("is_active", true)
        .order("priority", { ascending: false });
      return (data || []).filter((n) => !n.expires_at || new Date(n.expires_at) > new Date());
    },
    staleTime: 60000,
  });

  const visible = notices.filter((n) => !dismissed.includes(n.id));

  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.map((notice) => {
        const style = typeStyles[notice.type] || typeStyles.info;
        const Icon = style.icon;
        return (
          <div key={notice.id} className={`flex items-start gap-3 p-3 rounded-lg border ${style.bg}`}>
            <Icon className={`flex-shrink-0 mt-0.5 h-4 w-4 ${style.text}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${style.text}`}>{notice.title}</p>
              <p className={`text-xs mt-0.5 ${style.text} opacity-80`}>{notice.content}</p>
            </div>
            <button onClick={() => setDismissed((prev) => [...prev, notice.id])} className={`flex-shrink-0 ${style.text} opacity-60 hover:opacity-100`}>
              <FiX className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NoticeBanner;
