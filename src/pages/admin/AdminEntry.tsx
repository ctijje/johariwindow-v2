import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AdminEntry = () => {
  const { session, roles, loading } = useAuth();
  if (loading) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/auth?admin=1" replace />;
  if (roles.includes("admin")) return <Navigate to="/admin/claims" replace />;
  return <Navigate to="/" replace />;
};

export default AdminEntry;