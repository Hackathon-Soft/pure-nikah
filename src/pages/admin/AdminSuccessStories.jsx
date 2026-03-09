import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminSuccessStories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-success-stories"],
    queryFn: () => adminApi("list_success_stories"),
  });

  const approveMutation = useMutation({
    mutationFn: ({ storyId }) => adminApi("approve_story", { storyId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-success-stories"] });
      toast({ title: "Story approved!", description: "It's now live on the homepage." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ storyId }) => adminApi("delete_story", { storyId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-success-stories"] });
      toast({ title: "Story deleted." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const stories = data?.stories || [];
  const pending = stories.filter(s => !s.is_approved);
  const approved = stories.filter(s => s.is_approved);

  const StoryCard = ({ story, showApprove = false }) => (
    <Card className={showApprove ? "border-amber-200 bg-amber-50/30 dark:bg-amber-950/10" : ""}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-display font-semibold text-foreground">{story.couple_names}</p>
              {story.is_approved ? (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Live</Badge>
              ) : (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">Pending</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{story.location || "No location"}</p>
            <div className="flex gap-0.5 mb-3">
              {[...Array(story.rating || 5)].map((_, i) => (
                <FaStar key={i} className="text-accent text-xs" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">"{story.review}"</p>
            <p className="text-xs text-muted-foreground mt-3">
              Submitted: {new Date(story.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {showApprove && (
              <Button
                size="sm"
                onClick={() => approveMutation.mutate({ storyId: story.id })}
                disabled={approveMutation.isPending}
              >
                <FiCheckCircle className="mr-1" /> Approve
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Delete story">
                  <FiTrash2 className="text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Story</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the story from {story.couple_names}. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate({ storyId: story.id })}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Success Stories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pending.length} pending review • {approved.length} published
        </p>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : stories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-3">💍</div>
            <p className="text-lg font-medium text-foreground">No stories yet</p>
            <p className="text-sm text-muted-foreground">User-submitted success stories will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Pending Stories */}
          {pending.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Pending Review ({pending.length})
              </h2>
              {pending.map((story, i) => (
                <motion.div key={story.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <StoryCard story={story} showApprove />
                </motion.div>
              ))}
            </div>
          )}

          {/* Approved Stories */}
          {approved.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FiCheckCircle className="text-green-600" />
                Published ({approved.length})
              </h2>
              {approved.map((story, i) => (
                <motion.div key={story.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <StoryCard story={story} />
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminSuccessStories;
