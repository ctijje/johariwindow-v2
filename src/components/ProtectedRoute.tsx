import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type Props = { children: ReactNode; requireRole?: "coach" | "admin" };

export const ProtectedRoute = ({ children, requireRole }: Props) => {
  const { session, roles, loading } = useAuth();
  if (loading) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/auth" replace />;
  if (requireRole && !roles.includes(requireRole)) {
    if (requireRole === "coach") return <Navigate to="/coach/redeem" replace />;
    if (requireRole === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};