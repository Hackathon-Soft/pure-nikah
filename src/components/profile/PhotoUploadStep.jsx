import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FiCamera, FiUpload, FiX, FiEye, FiEyeOff, FiLock } from "react-icons/fi";

const PhotoUploadStep = () => {
  const { control, setValue } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) { const url = URL.createObjectURL(file); setPreviewUrl(url); setValue("profilePhoto", url); }
  };
  const handleAdditionalPhotosChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = [];
      Array.from(files).forEach((file) => { newPreviews.push(URL.createObjectURL(file)); });
      setAdditionalPreviews([...additionalPreviews, ...newPreviews]);
      setValue("additionalPhotos", [...additionalPreviews, ...newPreviews]);
    }
  };
  const removeAdditionalPhoto = (index) => { const updated = additionalPreviews.filter((_, i) => i !== index); setAdditionalPreviews(updated); setValue("additionalPhotos", updated); };
  const removeProfilePhoto = () => { setPreviewUrl(null); setValue("profilePhoto", ""); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-token-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><FiCamera className="text-primary" /></div>
        <div>
          <h2 className="font-display text-token-lg font-semibold text-foreground">Photo Upload</h2>
          <p className="text-token-sm text-muted-foreground">Add photos to your profile</p>
        </div>
      </div>
      <div className="space-y-4">
        <FormLabel>Profile Photo</FormLabel>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="relative">
            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="Profile preview" className="w-32 h-32 rounded-full object-cover border-4 border-primary/20" />
                <button type="button" onClick={removeProfilePhoto} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors"><FiX size={16} /></button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center"><FiCamera className="text-muted-foreground mb-1" size={24} /><span className="text-token-xs text-muted-foreground">No photo</span></div>
            )}
          </div>
          <div className="flex-1">
            <input type="file" accept="image/*" onChange={handleProfilePhotoChange} className="hidden" id="profile-photo-input" />
            <label htmlFor="profile-photo-input"><Button type="button" variant="outline" asChild className="gap-2"><span><FiUpload /> Upload Profile Photo</span></Button></label>
            <p className="text-token-xs text-muted-foreground mt-2">This will be your main profile picture. Use a clear, recent photo.</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <FormLabel>Additional Photos (Optional)</FormLabel>
        <p className="text-token-sm text-muted-foreground">Add up to 5 additional photos to your gallery</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {additionalPreviews.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <img src={url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
              <button type="button" onClick={() => removeAdditionalPhoto(index)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors"><FiX size={12} /></button>
            </div>
          ))}
          {additionalPreviews.length < 5 && (
            <label htmlFor="additional-photos-input" className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"><FiUpload className="text-muted-foreground mb-1" /><span className="text-token-xs text-muted-foreground">Add</span></label>
          )}
        </div>
        <input type="file" accept="image/*" multiple onChange={handleAdditionalPhotosChange} className="hidden" id="additional-photos-input" />
      </div>
      <FormField control={control} name="photoPrivacy" render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel>Photo Privacy Settings</FormLabel>
          <FormDescription>Choose who can see your photos</FormDescription>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3">
              <div className="flex items-start space-x-3 rounded-lg border p-token-4 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="public" id="public" className="mt-1" />
                <div className="flex-1"><Label htmlFor="public" className="flex items-center gap-2 cursor-pointer"><FiEye className="text-primary" />Public</Label><p className="text-token-xs text-muted-foreground mt-1">All verified users can see your photos</p></div>
              </div>
              <div className="flex items-start space-x-3 rounded-lg border p-token-4 hover:bg-muted/50 transition-colors border-primary/50 bg-primary/5">
                <RadioGroupItem value="blur_until_accepted" id="blur" className="mt-1" />
                <div className="flex-1"><Label htmlFor="blur" className="flex items-center gap-2 cursor-pointer"><FiEyeOff className="text-primary" />Blur Until Accepted<span className="text-token-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Recommended</span></Label><p className="text-token-xs text-muted-foreground mt-1">Photos are blurred until you accept someone's interest</p></div>
              </div>
              <div className="flex items-start space-x-3 rounded-lg border p-token-4 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="private" id="private" className="mt-1" />
                <div className="flex-1"><Label htmlFor="private" className="flex items-center gap-2 cursor-pointer"><FiLock className="text-primary" />Private</Label><p className="text-token-xs text-muted-foreground mt-1">Only you can see your photos. Share manually with matches.</p></div>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <div className="bg-muted/50 rounded-lg p-token-4 mt-4">
        <p className="text-token-sm text-muted-foreground"><span className="font-medium text-foreground">Photo Guidelines:</span><br />• Use recent, clear photos showing your face<br />• Modest dress following Islamic guidelines<br />• No group photos as profile picture<br />• Avoid heavy filters or editing</p>
      </div>
    </div>
  );
};

export default PhotoUploadStep;
