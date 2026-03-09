import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FiSearch, FiSlash, FiCheckCircle, FiTrash2, FiChevronLeft, FiChevronRight, FiHeart, FiUserCheck } from "react-icons/fi";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 15;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, search, filter],
    queryFn: () => adminApi("list_users", { page, perPage, search: search || undefined, filter: filter || undefined }),
  });

  const banMutation = useMutation({
    mutationFn: ({ userId, banned }) => adminApi("ban_user", { userId, banned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "User updated" });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ userId, verified }) => adminApi("verify_user", { userId, verified }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Verification updated" });
    },
  });

  const marriedMutation = useMutation({
    mutationFn: ({ userId, married }) => adminApi("mark_married", { userId, married }),
    onSuccess: (_, { married }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({
        title: married ? "💍 Marked as Married — Mubarak!" : "Marriage status removed",
        description: married ? "Profile is now closed and removed from search." : "Profile has been reinstated.",
      });
    },
    onError: (err) => {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    },
  });

  const inPersonMutation = useMutation({
    mutationFn: ({ userId, inPersonVerified }) => adminApi("in_person_verify_user", { userId, inPersonVerified }),
    onSuccess: (_, { inPersonVerified }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: inPersonVerified ? "In-person verified ✓" : "In-person verification removed" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ userId }) => adminApi("delete_user", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "User deleted" });
    },
  });

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / perPage);

  const filters = [
    { label: "All", value: "" },
    { label: "Verified", value: "verified" },
    { label: "Unverified", value: "unverified" },
    { label: "Banned", value: "banned" },
    { label: "💍 Married", value: "married" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} total users</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilter(f.value); setPage(1); }}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">City</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Joined</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No users found.</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className={`border-b hover:bg-muted/30 transition-colors ${u.is_married ? "bg-rose-50/50 dark:bg-rose-950/10" : ""}`}>
                    <td className="p-3 font-medium">
                      {u.first_name} {u.last_name}
                      {u.is_married && <span className="ml-1 text-rose-500" title="Married via Platform">💍</span>}
                    </td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3 text-muted-foreground">{u.city || "—"}</td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {u.is_married && (
                          <Badge className="bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300">
                            💍 Married
                          </Badge>
                        )}
                        {u.is_verified && !u.is_married && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Verified</Badge>}
                        {u.in_person_verified && <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">In-Person ✓</Badge>}
                        {u.is_banned && <Badge variant="destructive">Banned</Badge>}
                        {!u.is_verified && !u.is_banned && !u.is_married && <Badge variant="secondary">Unverified</Badge>}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Mark Married */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost" size="icon"
                              title={u.is_married ? "Remove married status" : "Mark as married via platform"}
                            >
                              <FiHeart className={u.is_married ? "text-rose-500 fill-rose-500" : "text-muted-foreground"} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {u.is_married ? "Remove Married Status?" : `Mark ${u.first_name} as Married?`}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {u.is_married
                                  ? `This will reinstate ${u.first_name}'s profile and make it visible in search again.`
                                  : `This will mark ${u.first_name} ${u.last_name} as married via PureNikah. Their profile will be removed from search and their dashboard access will be restricted. Alhamdulillah!`
                                }
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => marriedMutation.mutate({ userId: u.user_id, married: !u.is_married })}
                                className={u.is_married ? "" : "bg-rose-500 hover:bg-rose-600"}
                              >
                                {u.is_married ? "Remove Status" : "💍 Confirm Nikah"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="ghost" size="icon"
                          title={u.is_verified ? "Remove verification" : "Verify user"}
                          onClick={() => verifyMutation.mutate({ userId: u.user_id, verified: !u.is_verified })}
                        >
                          <FiCheckCircle className={u.is_verified ? "text-green-600" : "text-muted-foreground"} />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          title={u.in_person_verified ? "Remove in-person verification" : "Mark as in-person verified"}
                          onClick={() => inPersonMutation.mutate({ userId: u.user_id, inPersonVerified: !u.in_person_verified })}
                        >
                          <FiUserCheck className={u.in_person_verified ? "text-blue-600" : "text-muted-foreground"} />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          title={u.is_banned ? "Unban user" : "Ban user"}
                          onClick={() => banMutation.mutate({ userId: u.user_id, banned: !u.is_banned })}
                        >
                          <FiSlash className={u.is_banned ? "text-destructive" : "text-muted-foreground"} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Delete user">
                              <FiTrash2 className="text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {u.first_name} {u.last_name}'s account. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteMutation.mutate({ userId: u.user_id })}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <FiChevronLeft className="mr-1" /> Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next <FiChevronRight className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
