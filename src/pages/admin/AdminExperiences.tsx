import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Ticket } from "lucide-react";

const statusColors: Record<string, string> = {
  Confirmed: "bg-[hsl(142,71%,45%,0.15)] text-[hsl(142,71%,55%)]",
  Cancelled: "bg-[hsl(0,84%,60%,0.15)] text-[hsl(0,84%,65%)]",
  Refunded: "bg-[hsl(38,92%,50%,0.15)] text-[hsl(38,92%,55%)]",
};

const AdminExperiences = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return;
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const totalRevenue = bookings.reduce((s, b) => s + (b.total_amount || 0), 0);
  const filtered = bookings.filter(b => {
    if (search && !b.experience_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = ["ID", "Experience", "Date", "Guests", "Amount", "Status", "Created"];
    const rows = filtered.map(b => [b.id, b.experience_name, b.booking_date, b.guests, b.total_amount || 0, b.status, new Date(b.created_at).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `experiences-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  if (loading) return <div className="text-[hsl(220,10%,50%)]">Loading...</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Ticket size={22} /> Experiences</h1>
        <Button variant="outline" size="sm" onClick={exportCSV} className="border-[hsl(220,20%,25%)] text-[hsl(220,10%,60%)] hover:bg-[hsl(220,20%,14%)] hover:text-white">
          <Download size={14} className="mr-1" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Booked", value: bookings.length },
          { label: "Revenue", value: `€${totalRevenue.toFixed(2)}` },
          { label: "Avg Booking Value", value: `€${bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(2) : "0"}` },
        ].map(s => (
          <div key={s.label} className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-4">
            <p className="text-xs text-[hsl(220,10%,45%)] uppercase tracking-wide">{s.label}</p>
            <p className="text-xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,40%)]" />
          <Input placeholder="Search experiences..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-[hsl(220,20%,12%)] border-[hsl(220,20%,20%)] text-[hsl(220,14%,85%)] placeholder:text-[hsl(220,10%,35%)]" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 bg-[hsl(220,20%,12%)] border-[hsl(220,20%,20%)] text-[hsl(220,14%,80%)]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[hsl(220,20%,18%)]">
        <table className="w-full bg-[hsl(220,20%,12%)]">
          <thead>
            <tr className="border-b border-[hsl(220,20%,18%)] text-left">
              {["Experience", "Date", "Guests", "Amount", "Status", "Created"].map(h => (
                <th key={h} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-[hsl(220,10%,40%)]">No bookings found</td></tr>
            ) : (
              filtered.map(b => (
                <tr key={b.id} className="border-b border-[hsl(220,20%,16%)] last:border-0 hover:bg-[hsl(220,20%,14%)] transition-colors">
                  <td className="px-4 py-2.5 text-sm font-medium text-white">{b.experience_name}</td>
                  <td className="px-4 py-2.5 text-sm text-[hsl(220,10%,60%)]">{new Date(b.booking_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5 text-sm text-[hsl(220,10%,60%)]">{b.guests}</td>
                  <td className="px-4 py-2.5 text-sm font-medium text-white">{b.total_amount ? `€${Number(b.total_amount).toFixed(2)}` : "–"}</td>
                  <td className="px-4 py-2.5">
                    <Select value={b.status} onValueChange={v => updateStatus(b.id, v)}>
                      <SelectTrigger className="w-28 h-7 text-[11px] bg-[hsl(220,20%,14%)] border-[hsl(220,20%,22%)] text-[hsl(220,14%,80%)]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-[hsl(220,10%,50%)]">{new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminExperiences;
