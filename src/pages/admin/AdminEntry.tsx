import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminEntry = () => {
  const { session, roles, loading, user, signOut } = useAuth();
  if (loading) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/auth?admin=1" replace />;
  if (roles.includes("admin")) return <Navigate to="/admin/claims" replace />;
  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <main className="mx-auto max-w-md space-y-5">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Admin login</p>
        <h1 className="font-serif text-4xl">Akun ini bukan admin</h1>
        <p className="text-sm text-muted-foreground">
          Kamu sedang login sebagai {user?.email}. Keluar dulu, lalu masuk dengan email admin chairunisatijje@gmail.com.
        </p>
        <Button
          onClick={async () => {
            await signOut();
            toast.success("Sudah logout");
            window.location.href = "/auth?admin=1";
          }}
          className="rounded-full bg-gradient-brand px-6 text-primary-foreground shadow-brand"
        >
          Logout & masuk admin
        </Button>
      </main>
    </div>
  );
};

export default AdminEntry;