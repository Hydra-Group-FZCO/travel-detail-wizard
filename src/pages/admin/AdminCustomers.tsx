import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface CustomerRow {
  user_id: string;
  full_name: string;
  country: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  email?: string;
  role?: string;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (!profiles) { setLoading(false); return; }

    const userIds = profiles.map(p => p.user_id);
    const { data: roles } = await supabase.from("user_roles").select("user_id, role").in("user_id", userIds);

    const roleMap: Record<string, string> = {};
    roles?.forEach(r => { roleMap[r.user_id] = r.role; });

    setCustomers(profiles.map(p => ({
      ...p,
      role: roleMap[p.user_id] || "customer",
    })));
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole as any })
      .eq("user_id", userId);
    if (error) { toast.error(error.message); return; }
    setCustomers(prev => prev.map(c => c.user_id === userId ? { ...c, role: newRole } : c));
    toast.success(`Role updated to ${newRole}`);
  };

  const toggleActive = async (userId: string, isActive: boolean) => {
    const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("user_id", userId);
    if (error) { toast.error(error.message); return; }
    setCustomers(prev => prev.map(c => c.user_id === userId ? { ...c, is_active: isActive } : c));
    toast.success(isActive ? "Account activated" : "Account deactivated");
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Customers</h1>
      {customers.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No customers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-card rounded-xl border border-border">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Country</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Phone</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Joined</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Role</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Active</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.user_id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{c.full_name || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.country || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Select value={c.role} onValueChange={v => updateRole(c.user_id, v)}>
                      <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Switch checked={c.is_active} onCheckedChange={v => toggleActive(c.user_id, v)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
