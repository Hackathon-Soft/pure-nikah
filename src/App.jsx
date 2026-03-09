import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/admin/AdminRoute";
import { lazy, Suspense } from "react";

// Layouts — loaded eagerly (small, always needed)
import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AdminLayout from "./components/admin/AdminLayout";

// Public pages — eager (landing / SEO critical)
import Index from "./pages/Index";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Verification from "./pages/Verification";
import VerificationStatus from "./pages/VerificationStatus";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import HelpCenter from "./pages/HelpCenter";
import NotFound from "./pages/NotFound";
import ProfileDetail from "./pages/ProfileDetail";
import Contact from "./pages/Contact";

// Verification status pages
import VerificationPending from "./pages/VerificationPending";
import VerificationApproved from "./pages/VerificationApproved";
import VerificationRejected from "./pages/VerificationRejected";
import VerificationReVerify from "./pages/VerificationReVerify";

// Dashboard pages — lazy loaded
const DashboardHome     = lazy(() => import("./pages/dashboard/DashboardHome"));
const ProfileView       = lazy(() => import("./pages/dashboard/ProfileView"));
const CreateProfile     = lazy(() => import("./pages/dashboard/CreateProfile"));
const Interests         = lazy(() => import("./pages/dashboard/Interests"));
const Favorites         = lazy(() => import("./pages/dashboard/Favorites"));
const Messages          = lazy(() => import("./pages/dashboard/Messages"));
const Notifications     = lazy(() => import("./pages/dashboard/Notifications"));
const Settings          = lazy(() => import("./pages/dashboard/Settings"));
const WhoViewedMe       = lazy(() => import("./pages/dashboard/WhoViewedMe"));
const Photos            = lazy(() => import("./pages/dashboard/Photos"));
const BlockedUsers      = lazy(() => import("./pages/dashboard/BlockedUsers"));

// Admin pages — lazy loaded
const AdminDashboard      = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers          = lazy(() => import("./pages/admin/AdminUsers"));
const AdminVerification   = lazy(() => import("./pages/admin/AdminVerification"));
const AdminReports        = lazy(() => import("./pages/admin/AdminReports"));
const AdminSettings       = lazy(() => import("./pages/admin/AdminSettings"));
const AdminSuccessStories = lazy(() => import("./pages/admin/AdminSuccessStories"));
const AdminAnalytics     = lazy(() => import("./pages/admin/AdminAnalytics"));

// Fallback spinner shown while lazy chunks load
const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[60vh]">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public pages with Navbar + Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile/:id" element={<ProfileDetail />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Auth pages with minimal layout */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/help" element={<HelpCenter />} />
            </Route>

            {/* Verification status screens (standalone) */}
            <Route path="/verification/pending" element={<VerificationPending />} />
            <Route path="/verification/approved" element={<VerificationApproved />} />
            <Route path="/verification/rejected" element={<VerificationRejected />} />
            <Route path="/verification/re-verify" element={<VerificationReVerify />} />

            {/* Dashboard with sidebar layout — PROTECTED + LAZY */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Suspense fallback={<PageLoader />}><DashboardHome /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={<PageLoader />}><ProfileView /></Suspense>} />
              <Route path="create-profile" element={<Suspense fallback={<PageLoader />}><CreateProfile /></Suspense>} />
              <Route path="edit-profile" element={<Suspense fallback={<PageLoader />}><CreateProfile /></Suspense>} />
              <Route path="photos" element={<Suspense fallback={<PageLoader />}><Photos /></Suspense>} />
              <Route path="preferences" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
              <Route path="search" element={<Suspense fallback={<PageLoader />}><Search /></Suspense>} />
              <Route path="nearby" element={<Suspense fallback={<PageLoader />}><Search /></Suspense>} />
              <Route path="interests" element={<Suspense fallback={<PageLoader />}><Interests /></Suspense>} />
              <Route path="favorites" element={<Suspense fallback={<PageLoader />}><Favorites /></Suspense>} />
              <Route path="messages" element={<Suspense fallback={<PageLoader />}><Messages /></Suspense>} />
              <Route path="who-viewed-me" element={<Suspense fallback={<PageLoader />}><WhoViewedMe /></Suspense>} />
              <Route path="verification" element={<Suspense fallback={<PageLoader />}><Verification /></Suspense>} />
              <Route path="notifications" element={<Suspense fallback={<PageLoader />}><Notifications /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
              <Route path="blocked-users" element={<Suspense fallback={<PageLoader />}><BlockedUsers /></Suspense>} />
            </Route>

            {/* Admin Panel — PROTECTED + ADMIN ROLE + LAZY */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
              <Route path="users" element={<Suspense fallback={<PageLoader />}><AdminUsers /></Suspense>} />
              <Route path="verification" element={<Suspense fallback={<PageLoader />}><AdminVerification /></Suspense>} />
              <Route path="success-stories" element={<Suspense fallback={<PageLoader />}><AdminSuccessStories /></Suspense>} />
              <Route path="reports" element={<Suspense fallback={<PageLoader />}><AdminReports /></Suspense>} />
              <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AdminAnalytics /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<PageLoader />}><AdminSettings /></Suspense>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
