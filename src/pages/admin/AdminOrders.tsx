import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, ShoppingCart } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["hsl(207,94%,29%)", "hsl(45,98%,53%)", "hsl(142,71%,45%)", "hsl(207,70%,55%)"];

interface UnifiedOrder {
  id: string;
  date: string;
  type: string;
  name: string;
  amount: number;
  status: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    const [esimRes, itinRes, guideRes, bookRes] = await Promise.all([
      supabase.from("esim_orders").select("*").order("created_at", { ascending: false }),
      supabase.from("itineraries").select("*").order("created_at", { ascending: false }),
      supabase.from("travel_guides").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    ]);

    const unified: UnifiedOrder[] = [
      ...(esimRes.data || []).map(o => ({ id: o.id, date: o.created_at, type: "eSIM", name: o.package_code, amount: o.price_paid_eur, status: o.status })),
      ...(itinRes.data || []).map(o => ({ id: o.id, date: o.created_at, type: "Itinerary", name: o.destination, amount: o.price_paid || 0, status: o.status })),
      ...(guideRes.data || []).map(o => ({ id: o.id, date: o.created_at, type: "Guide", name: o.destination, amount: o.price_paid || 0, status: o.status })),
      ...(bookRes.data || []).map(o => ({ id: o.id, date: o.created_at, type: "Booking", name: o.experience_name, amount: o.total_amount || 0, status: o.status })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setOrders(unified);
    setLoading(false);
  };

  const filtered = orders.filter(o => {
    if (search && !o.name.toLowerCase().includes(search.toLowerCase()) && !o.id.includes(search)) return false;
    if (filterType !== "all" && o.type !== filterType) return false;
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    return true;
  });

  const totalRevenue = filtered.reduce((s, o) => s + o.amount, 0);

  const revenueByType = ["eSIM", "Itinerary", "Guide", "Booking"].map(type => ({
    name: type,
    value: orders.filter(o => o.type === type).reduce((s, o) => s + o.amount, 0),
  })).filter(d => d.value > 0);

  const exportCSV = () => {
    const headers = ["ID", "Date", "Type", "Product", "Amount", "Status"];
    const rows = filtered.map(o => [o.id, new Date(o.date).toLocaleDateString(), o.type, o.name, o.amount.toFixed(2), o.status]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  if (loading) return <div className="text-[hsl(220,10%,50%)]">Loading...</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShoppingCart size={22} /> Orders & Revenue
        </h1>
        <Button variant="outline" size="sm" onClick={exportCSV} className="border-[hsl(220,20%,25%)] text-[hsl(220,10%,60%)] hover:bg-[hsl(220,20%,14%)] hover:text-white">
          <Download size={14} className="mr-1" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-4">
          <p className="text-xs text-[hsl(220,10%,45%)] uppercase tracking-wide">Total Orders</p>
          <p className="text-2xl font-bold text-white mt-1">{filtered.length}</p>
        </div>
        <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-4">
          <p className="text-xs text-[hsl(220,10%,45%)] uppercase tracking-wide">Total Revenue</p>
          <p className="text-2xl font-bold text-white mt-1">€{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-4">
          <p className="text-xs text-[hsl(220,10%,45%)] uppercase tracking-wide">Avg Order Value</p>
          <p className="text-2xl font-bold text-white mt-1">€{filtered.length > 0 ? (totalRevenue / filtered.length).toFixed(2) : "0.00"}</p>
        </div>
      </div>

      {/* Revenue Pie + Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[hsl(220,10%,70%)] mb-3">Revenue Split</h3>
          {revenueByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={revenueByType} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {revenueByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `€${v.toFixed(2)}`} contentStyle={{ background: "hsl(220,20%,14%)", border: "1px solid hsl(220,20%,22%)", borderRadius: "8px", color: "white" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[hsl(220,10%,40%)] text-sm text-center py-12">No data</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {revenueByType.map((d, i) => (
              <span key={d.name} className="text-[10px] text-[hsl(220,10%,55%)] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-3">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,40%)]" />
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-[hsl(220,20%,12%)] border-[hsl(220,20%,20%)] text-[hsl(220,14%,85%)] placeholder:text-[hsl(220,10%,35%)]" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-36 bg-[hsl(220,20%,12%)] border-[hsl(220,20%,20%)] text-[hsl(220,14%,80%)]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="eSIM">eSIM</SelectItem>
                <SelectItem value="Itinerary">Itinerary</SelectItem>
                <SelectItem value="Guide">Guide</SelectItem>
                <SelectItem value="Booking">Booking</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36 bg-[hsl(220,20%,12%)] border-[hsl(220,20%,20%)] text-[hsl(220,14%,80%)]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-xl border border-[hsl(220,20%,18%)]">
            <table className="w-full bg-[hsl(220,20%,12%)]">
              <thead>
                <tr className="border-b border-[hsl(220,20%,18%)] text-left">
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">Date</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">Type</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">Product</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">Amount</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-[hsl(220,10%,40%)]">No orders found</td></tr>
                ) : (
                  filtered.slice(0, 50).map(o => (
                    <tr key={o.id} className="border-b border-[hsl(220,20%,16%)] last:border-0 hover:bg-[hsl(220,20%,14%)] transition-colors">
                      <td className="px-4 py-2.5 text-sm text-[hsl(220,10%,55%)]">{new Date(o.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2.5"><Badge variant="outline" className="text-[10px] border-[hsl(220,20%,25%)] text-[hsl(220,10%,60%)]">{o.type}</Badge></td>
                      <td className="px-4 py-2.5 text-sm text-white max-w-[250px] truncate">{o.name}</td>
                      <td className="px-4 py-2.5 text-sm font-medium text-white">€{o.amount.toFixed(2)}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          o.status === "completed" || o.status === "Confirmed" ? "bg-[hsl(142,71%,45%,0.15)] text-[hsl(142,71%,55%)]" :
                          o.status === "pending" ? "bg-[hsl(38,92%,50%,0.15)] text-[hsl(38,92%,55%)]" :
                          "bg-[hsl(220,20%,20%)] text-[hsl(220,10%,55%)]"
                        }`}>{o.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
