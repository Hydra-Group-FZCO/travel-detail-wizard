import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Users } from "lucide-react";
import { toast } from "sonner";

interface CustomerRow {
  user_id: string;
  full_name: string;
  country: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  role?: string;
}

const AdminUsers = () => {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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
    const { error } = await supabase.from("user_roles").update({ role: newRole as any }).eq("user_id", userId);
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

  const exportCSV = () => {
    const headers = ["Name", "Country", "Phone", "Joined", "Role", "Active"];
    const rows = filteredCustomers.map(c => [c.full_name, c.country || "", c.phone || "", new Date(c.created_at).toLocaleDateString(), c.role, c.is_active ? "Yes" : "No"]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const countries = [...new Set(customers.map(c => c.country).filter(Boolean))] as string[];

  const filteredCustomers = customers.filter(c => {
    if (search && !c.full_name.toLowerCase().includes(search.toLowerCase()) && !c.user_id.includes(search)) return false;
    if (filterCountry !== "all" && c.country !== filterCountry) return false;
    if (filterStatus === "active" && !c.is_active) return false;
    if (filterStatus === "suspended" && c.is_active) return false;
    return true;
  });

  if (loading) return <div className="text-[hsl(220,10%,50%)]">Loading...</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users size={22} /> Users
          <Badge variant="outline" className="ml-2 text-xs border-[hsl(220,20%,25%)] text-[hsl(220,10%,55%)]">{filteredCustomers.length}</Badge>
        </h1>
        <Button variant="outline" size="sm" onClick={exportCSV} className="border-[hsl(220,20%,25%)] text-[hsl(220,10%,60%)] hover:bg-[hsl(220,20%,14%)] hover:text-white">
          <Download size={14} className="mr-1" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,40%)]" />
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-[hsl(220,20%,12%)] border-[hsl(220,20%,20%)] text-[hsl(220,14%,85%)] placeholder:text-[hsl(220,10%,35%)]"
          />
        </div>
        <Select value={filterCountry} onValueChange={setFilterCountry}>
          <SelectTrigger className="w-40 bg-[hsl(220,20%,12%)] border-[hsl(220,20%,20%)] text-[hsl(220,14%,80%)]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 bg-[hsl(220,20%,12%)] border-[hsl(220,20%,20%)] text-[hsl(220,14%,80%)]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[hsl(220,20%,18%)]">
        <table className="w-full bg-[hsl(220,20%,12%)]">
          <thead>
            <tr className="border-b border-[hsl(220,20%,18%)] text-left">
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">Name</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">Country</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">Phone</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">Joined</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">Role</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c.user_id} className="border-b border-[hsl(220,20%,16%)] last:border-0 hover:bg-[hsl(220,20%,14%)] transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-white">{c.full_name || "—"}</td>
                <td className="px-4 py-3 text-sm text-[hsl(220,10%,60%)]">{c.country || "—"}</td>
                <td className="px-4 py-3 text-sm text-[hsl(220,10%,60%)]">{c.phone || "—"}</td>
                <td className="px-4 py-3 text-sm text-[hsl(220,10%,50%)]">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Select value={c.role} onValueChange={v => updateRole(c.user_id, v)}>
                    <SelectTrigger className="w-28 h-7 text-[11px] bg-[hsl(220,20%,14%)] border-[hsl(220,20%,22%)] text-[hsl(220,14%,80%)]">
                      <SelectValue />
                    </SelectTrigger>
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
            {filteredCustomers.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-[hsl(220,10%,40%)]">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
