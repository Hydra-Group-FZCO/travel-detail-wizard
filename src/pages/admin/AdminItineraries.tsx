import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, MapPin, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminItineraries = () => {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from("itineraries").select("*").order("created_at", { ascending: false });
    setItineraries(data || []);
    setLoading(false);
  };

  const totalRevenue = itineraries.reduce((s, i) => s + (i.price_paid || 0), 0);
  const destinations = itineraries.reduce((acc: Record<string, number>, i: any) => {
    acc[i.destination] = (acc[i.destination] || 0) + 1;
    return acc;
  }, {});
  const topDest = Object.entries(destinations).sort((a, b) => (b[1] as number) - (a[1] as number))[0];

  const filtered = itineraries.filter(i =>
    !search || i.destination.toLowerCase().includes(search.toLowerCase()) || i.id.includes(search)
  );

  const exportCSV = () => {
    const headers = ["ID", "Destination", "Days", "Language", "Status", "Price", "Date"];
    const rows = filtered.map(i => [i.id, i.destination, i.num_days, i.language, i.status, i.price_paid || 0, new Date(i.created_at).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `itineraries-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  if (loading) return <div className="text-[hsl(220,10%,50%)]">Loading...</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><MapPin size={22} /> Itineraries</h1>
        <Button variant="outline" size="sm" onClick={exportCSV} className="border-[hsl(220,20%,25%)] text-[hsl(220,10%,60%)] hover:bg-[hsl(220,20%,14%)] hover:text-white">
          <Download size={14} className="mr-1" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Generated", value: itineraries.length },
          { label: "Revenue", value: `€${totalRevenue.toFixed(2)}` },
          { label: "Avg Price", value: `€${itineraries.length > 0 ? (totalRevenue / itineraries.length).toFixed(2) : "0"}` },
          { label: "Top Destination", value: topDest ? topDest[0] : "—" },
        ].map(s => (
          <div key={s.label} className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-4">
            <p className="text-xs text-[hsl(220,10%,45%)] uppercase tracking-wide">{s.label}</p>
            <p className="text-xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,40%)]" />
        <Input placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-[hsl(220,20%,12%)] border-[hsl(220,20%,20%)] text-[hsl(220,14%,85%)] placeholder:text-[hsl(220,10%,35%)]" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[hsl(220,20%,18%)]">
        <table className="w-full bg-[hsl(220,20%,12%)]">
          <thead>
            <tr className="border-b border-[hsl(220,20%,18%)] text-left">
              {["Destination", "Days", "Type", "Language", "Price", "Status", "Date", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-[hsl(220,10%,40%)]">No itineraries found</td></tr>
            ) : (
              filtered.map(i => (
                <tr key={i.id} className="border-b border-[hsl(220,20%,16%)] last:border-0 hover:bg-[hsl(220,20%,14%)] transition-colors">
                  <td className="px-4 py-2.5 text-sm font-medium text-white">{i.destination}</td>
                  <td className="px-4 py-2.5 text-sm text-[hsl(220,10%,60%)]">{i.num_days}d</td>
                  <td className="px-4 py-2.5 text-sm text-[hsl(220,10%,60%)]">{i.trip_type}</td>
                  <td className="px-4 py-2.5"><Badge variant="outline" className="text-[10px] border-[hsl(220,20%,25%)] text-[hsl(220,10%,60%)]">{i.language}</Badge></td>
                  <td className="px-4 py-2.5 text-sm font-medium text-white">€{(i.price_paid || 0).toFixed(2)}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      i.status === "completed" ? "bg-[hsl(142,71%,45%,0.15)] text-[hsl(142,71%,55%)]" : "bg-[hsl(38,92%,50%,0.15)] text-[hsl(38,92%,55%)]"
                    }`}>{i.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-[hsl(220,10%,50%)]">{new Date(i.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      {i.public_share_token && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-[hsl(220,10%,50%)] hover:text-white hover:bg-[hsl(220,20%,18%)]"
                          onClick={() => window.open(`/itinerary/${i.id}?token=${i.public_share_token}`, "_blank")} title="View">
                          <Eye size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminItineraries;
