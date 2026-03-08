import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiCamera, FiUpload, FiTrash2, FiStar, FiShield, FiAlertCircle } from "react-icons/fi";
import { useState } from "react";

const initialPhotos = [
  { id: 1, isPrimary: true, uploaded: true },
  { id: 2, isPrimary: false, uploaded: true },
  { id: 3, isPrimary: false, uploaded: false },
  { id: 4, isPrimary: false, uploaded: false },
  { id: 5, isPrimary: false, uploaded: false },
  { id: 6, isPrimary: false, uploaded: false },
];

const Photos = () => {
  const [photos] = useState(initialPhotos);

  return (
    <div className="p-token-4 md:p-token-8 max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title flex items-center gap-token-2">
          <FiCamera className="text-primary" /> My Photos
        </h1>
        <p className="page-subtitle">Upload up to 6 photos. Your primary photo is shown in search results.</p>
      </motion.div>

      {/* Guidelines */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="border-accent bg-accent/10">
          <CardContent className="p-token-4 flex gap-token-3">
            <FiShield className="text-accent-foreground flex-shrink-0 mt-0.5" style={{ fontSize: "var(--size-icon)" }} />
            <div>
              <h3 className="text-token-sm font-semibold text-foreground mb-token-1">Photo Guidelines</h3>
              <ul className="text-token-xs text-muted-foreground space-y-1">
                <li>• Photos must be decent and appropriate as per Islamic values</li>
                <li>• Clear face photo required as primary — no filters or heavy editing</li>
                <li>• Group photos, celebrity photos, or inappropriate content will be removed</li>
                <li>• Photos are blurred for non-matched users to protect your privacy</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Photo Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-token-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.03 }}
            >
              <Card className={`overflow-hidden ${photo.isPrimary ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted flex flex-col items-center justify-center relative group">
                    {photo.uploaded ? (
                      <>
                        <FiCamera className="text-muted-foreground" style={{ fontSize: "var(--size-icon-xl)" }} />
                        <span className="text-token-xs text-muted-foreground mt-token-2">Photo {photo.id}</span>
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-token-3">
                          {!photo.isPrimary && (
                            <Button variant="secondary" size="sm" className="text-token-xs">
                              <FiStar className="mr-1" /> Set Primary
                            </Button>
                          )}
                          <Button variant="destructive" size="sm" className="text-token-xs">
                            <FiTrash2 className="mr-1" /> Delete
                          </Button>
                        </div>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-muted/80 transition-colors">
                        <FiUpload className="text-muted-foreground mb-token-2" style={{ fontSize: "var(--size-icon-lg)" }} />
                        <span className="text-token-xs font-medium text-muted-foreground">Upload Photo</span>
                        <span className="text-token-xs text-muted-foreground/60 mt-token-1">JPG, PNG (max 5MB)</span>
                        <input type="file" accept="image/*" className="hidden" />
                      </label>
                    )}
                  </div>
                  {photo.isPrimary && (
                    <div className="bg-primary text-primary-foreground text-center py-token-1">
                      <span className="text-token-xs font-medium flex items-center justify-center gap-token-1">
                        <FiStar style={{ fontSize: "10px" }} /> Primary Photo
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Privacy Note */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-muted border-dashed">
          <CardContent className="p-token-4 flex gap-token-3">
            <FiAlertCircle className="text-muted-foreground flex-shrink-0 mt-0.5" style={{ fontSize: "var(--size-icon)" }} />
            <div>
              <p className="text-token-sm text-muted-foreground">
                <strong className="text-foreground">Privacy:</strong> Your photos are only shown to verified users. 
                Non-matched users see blurred versions. You can control visibility in{" "}
                <a href="/dashboard/settings" className="link-primary">Settings</a>.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Photos;
