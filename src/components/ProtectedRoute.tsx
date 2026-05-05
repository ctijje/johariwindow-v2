import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type Props = { children: ReactNode; requireRole?: "coach" | "team_lead" };

export const ProtectedRoute = ({ children, requireRole }: Props) => {
  const { session, roles, loading } = useAuth();
  if (loading) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/auth" replace />;
  if (requireRole && !roles.includes(requireRole)) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};