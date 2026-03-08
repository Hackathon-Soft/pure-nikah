import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/admin/AdminRoute";

import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AdminLayout from "./components/admin/AdminLayout";

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

import DashboardHome from "./pages/dashboard/DashboardHome";
import ProfileView from "./pages/dashboard/ProfileView";
import CreateProfile from "./pages/dashboard/CreateProfile";
import Interests from "./pages/dashboard/Interests";
import Favorites from "./pages/dashboard/Favorites";
import Messages from "./pages/dashboard/Messages";
import Notifications from "./pages/dashboard/Notifications";
import Settings from "./pages/dashboard/Settings";
import WhoViewedMe from "./pages/dashboard/WhoViewedMe";
import Photos from "./pages/dashboard/Photos";
import BlockedUsers from "./pages/dashboard/BlockedUsers";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVerification from "./pages/admin/AdminVerification";
import AdminReports from "./pages/admin/AdminReports";

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

            {/* Dashboard with sidebar layout — PROTECTED */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<ProfileView />} />
              <Route path="create-profile" element={<CreateProfile />} />
              <Route path="edit-profile" element={<CreateProfile />} />
              <Route path="photos" element={<Photos />} />
              <Route path="preferences" element={<Settings />} />
              <Route path="search" element={<Search />} />
              <Route path="nearby" element={<Search />} />
              <Route path="interests" element={<Interests />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="messages" element={<Messages />} />
              <Route path="who-viewed-me" element={<WhoViewedMe />} />
              <Route path="verification" element={<Verification />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
              <Route path="blocked-users" element={<BlockedUsers />} />
            </Route>

            {/* Admin Panel — PROTECTED + ADMIN ROLE */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="verification" element={<AdminVerification />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
