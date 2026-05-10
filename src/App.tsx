import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import DataDiri from "./pages/test/DataDiri.tsx";
import Words from "./pages/test/Words.tsx";
import Share from "./pages/test/Share.tsx";
import Result from "./pages/test/Result.tsx";
import Profile from "./pages/test/Profile.tsx";
import Story from "./pages/test/Story.tsx";
import Peer from "./pages/test/Peer.tsx";
import ClientSelf from "./pages/test/ClientSelf.tsx";
import { LangProvider } from "./lib/lang.tsx";
import { AuthProvider } from "./hooks/useAuth.tsx";
import Auth from "./pages/Auth.tsx";
import CoachLanding from "./pages/coach/CoachLanding.tsx";
import CoachDashboard from "./pages/coach/CoachDashboard.tsx";
import CoachRedeem from "./pages/coach/CoachRedeem.tsx";
import CoachClaim from "./pages/coach/CoachClaim.tsx";
import MenteeDetail from "./pages/coach/MenteeDetail.tsx";
import Pricing from "./pages/Pricing.tsx";
import Science from "./pages/Science.tsx";
import AdminClaims from "./pages/admin/AdminClaims.tsx";
import AdminEntry from "./pages/admin/AdminEntry.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LangProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/test" element={<Words />} />
              <Route path="/test/data" element={<DataDiri />} />
              <Route path="/test/share" element={<Share />} />
              <Route path="/test/result" element={<Result />} />
              <Route path="/test/profile" element={<Profile />} />
              <Route path="/test/story" element={<Story />} />
              <Route path="/peer/:code" element={<Peer />} />
              <Route path="/client/:code" element={<ClientSelf />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/coach" element={<CoachLanding />} />
              <Route path="/coach/redeem" element={<CoachRedeem />} />
              <Route path="/coach/claim" element={<CoachClaim />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/science" element={<Science />} />
              <Route path="/coach/dashboard" element={<ProtectedRoute requireRole="coach"><CoachDashboard /></ProtectedRoute>} />
              <Route path="/coach/mentee/:id" element={<ProtectedRoute requireRole="coach"><MenteeDetail /></ProtectedRoute>} />
              <Route path="/admin/claims" element={<ProtectedRoute requireRole="admin"><AdminClaims /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminEntry />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LangProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
