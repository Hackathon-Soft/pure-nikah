import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiCamera, FiUpload, FiTrash2, FiStar, FiShield, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PhotoAccessRequests } from "@/components/photos/PhotoPrivacy";
import { toast } from "sonner";

const MAX_PHOTOS = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const safeFilename = (name) => name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();

const Photos = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["my-photos", user?.id], enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profile_photos").select("*").eq("user_id", user.id).order("is_primary", { ascending: false }).order("created_at", { ascending: true });
      if (error) throw error;
      return Promise.all((data || []).map(async (photo) => {
        const { data: signed } = await supabase.storage.from("profile-photos").createSignedUrl(photo.storage_path, 3600);
        return { ...photo, url: signed?.signedUrl || "" };
      }));
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Use a JPG, PNG, or WEBP image.");
      if (file.size > MAX_FILE_SIZE) throw new Error("Images must be 5MB or smaller.");
      if (photos.length >= MAX_PHOTOS) throw new Error(`You can upload up to ${MAX_PHOTOS} photos.`);
      const storagePath = `${user.id}/${Date.now()}-${safeFilename(file.name)}`;
      const { error: uploadError } = await supabase.storage.from("profile-photos").upload(storagePath, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { error: insertError } = await supabase.from("profile_photos").insert({ user_id: user.id, storage_path: storagePath, is_primary: photos.length === 0, privacy: "blur_until_accepted" });
      if (insertError) { await supabase.storage.from("profile-photos").remove([storagePath]); throw insertError; }
      await supabase.from("profiles").update({ has_photo: true }).eq("user_id", user.id);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["my-photos", user.id] }); toast.success("Photo uploaded."); },
    onError: (error) => toast.error(error.message || "Photo upload failed."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (photo) => {
      const { error: storageError } = await supabase.storage.from("profile-photos").remove([photo.storage_path]);
      if (storageError) throw storageError;
      const { error } = await supabase.from("profile_photos").delete().eq("id", photo.id).eq("user_id", user.id);
      if (error) throw error;
      if (photos.length === 1) await supabase.from("profiles").update({ has_photo: false }).eq("user_id", user.id);
      else if (photo.is_primary) {
        const replacement = photos.find((candidate) => candidate.id !== photo.id);
        if (replacement) await supabase.from("profile_photos").update({ is_primary: true }).eq("id", replacement.id);
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["my-photos", user.id] }); toast.success("Photo deleted."); },
    onError: (error) => toast.error(error.message || "Photo deletion failed."),
  });

  const primaryMutation = useMutation({
    mutationFn: async (photoId) => {
      const { error: clearError } = await supabase.from("profile_photos").update({ is_primary: false }).eq("user_id", user.id);
      if (clearError) throw clearError;
      const { error } = await supabase.from("profile_photos").update({ is_primary: true }).eq("id", photoId).eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["my-photos", user.id] }); toast.success("Primary photo updated."); },
    onError: (error) => toast.error(error.message || "Could not update primary photo."),
  });

  const handleUpload = (event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) uploadMutation.mutate(file); };

  return (
    <div className="p-token-4 md:p-token-8 max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title flex items-center gap-token-2"><FiCamera className="text-primary" /> My Photos</h1>
        <p className="page-subtitle">Upload up to 6 photos. Your primary photo is shown in search results.</p>
      </motion.div>
      <Card><CardContent className="p-token-4"><PhotoAccessRequests /></CardContent></Card>
      <Card className="border-accent bg-accent/10"><CardContent className="p-token-4 flex gap-token-3"><FiShield className="text-accent-foreground flex-shrink-0 mt-0.5" style={{ fontSize: "var(--size-icon)" }} /><div><h3 className="text-token-sm font-semibold text-foreground mb-token-1">Photo Guidelines</h3><ul className="text-token-xs text-muted-foreground space-y-1"><li>• Use recent, clear photos showing your face.</li><li>• Photos must be modest and appropriate for the platform.</li><li>• Group photos, celebrity photos, and inappropriate content are not allowed.</li><li>• Photos are private by default and access is controlled by your privacy setting.</li></ul></div></CardContent></Card>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-token-4">
        {isLoading ? <div className="col-span-full empty-state"><FiRefreshCw className="animate-spin mx-auto" /><p className="text-body-muted mt-2">Loading photos...</p></div> : <>
          {photos.map((photo) => <Card key={photo.id} className={`overflow-hidden ${photo.is_primary ? "ring-2 ring-primary" : ""}`}><CardContent className="p-0"><div className="aspect-square bg-muted relative group">{photo.url ? <img src={photo.url} alt="Profile upload" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FiCamera className="text-muted-foreground" size={32} /></div>}<div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-token-2">{!photo.is_primary && <Button variant="secondary" size="sm" className="text-token-xs" onClick={() => primaryMutation.mutate(photo.id)}><FiStar className="mr-1" /> Primary</Button>}<Button variant="destructive" size="sm" className="text-token-xs" onClick={() => deleteMutation.mutate(photo)}><FiTrash2 className="mr-1" /> Delete</Button></div></div>{photo.is_primary && <div className="bg-primary text-primary-foreground text-center py-token-1 text-token-xs font-medium">Primary Photo</div>}</CardContent></Card>)}
          {photos.length < MAX_PHOTOS && <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"><FiUpload className="text-muted-foreground mb-token-2" style={{ fontSize: "var(--size-icon-lg)" }} /><span className="text-token-xs font-medium text-muted-foreground">{uploadMutation.isPending ? "Uploading..." : "Upload Photo"}</span><span className="text-token-xs text-muted-foreground/60 mt-token-1">JPG, PNG, WEBP · 5MB max</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} disabled={uploadMutation.isPending} className="hidden" /></label>}
        </>}
      </div>
      <Card className="bg-muted border-dashed"><CardContent className="p-token-4 flex gap-token-3"><FiAlertCircle className="text-muted-foreground flex-shrink-0 mt-0.5" style={{ fontSize: "var(--size-icon)" }} /><p className="text-token-sm text-muted-foreground"><strong className="text-foreground">Privacy:</strong> Photos use private storage and signed URLs. You can control access from your profile privacy settings.</p></CardContent></Card>
    </div>
  );
};

export default Photos;
