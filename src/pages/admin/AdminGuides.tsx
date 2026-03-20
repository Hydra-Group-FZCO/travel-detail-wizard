import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, BookOpen, Eye } from "lucide-react";

const AdminGuides = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from("travel_guides").select("*").order("created_at", { ascending: false });
    setGuides(data || []);
    setLoading(false);
  };

  const totalRevenue = guides.reduce((s: number, g: any) => s + (g.price_paid || 0), 0);
  const destinations = guides.reduce((acc: Record<string, number>, g: any) => { acc[g.destination] = (acc[g.destination] || 0) + 1; return acc; }, {});
  const topDest = Object.entries(destinations).sort((a, b) => (b[1] as number) - (a[1] as number))[0];

  const filtered = guides.filter(g => !search || g.destination.toLowerCase().includes(search.toLowerCase()));

  const exportCSV = () => {
    const headers = ["ID", "Destination", "Depth", "Language", "Status", "Price", "Date"];
    const rows = filtered.map(g => [g.id, g.destination, g.depth, g.language, g.status, g.price_paid || 0, new Date(g.created_at).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `guides-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  if (loading) return <div className="text-[hsl(220,10%,50%)]">Loading...</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><BookOpen size={22} /> Travel Guides</h1>
        <Button variant="outline" size="sm" onClick={exportCSV} className="border-[hsl(220,20%,25%)] text-[hsl(220,10%,60%)] hover:bg-[hsl(220,20%,14%)] hover:text-white">
          <Download size={14} className="mr-1" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Sold", value: guides.length },
          { label: "Revenue", value: `€${totalRevenue.toFixed(2)}` },
          { label: "Top Destination", value: topDest ? topDest[0] : "—" },
          { label: "Avg Price", value: `€${guides.length > 0 ? (totalRevenue / guides.length).toFixed(2) : "0"}` },
        ].map(s => (
          <div key={s.label} className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-4">
            <p className="text-xs text-[hsl(220,10%,45%)] uppercase tracking-wide">{s.label}</p>
            <p className="text-xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,40%)]" />
        <Input placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-[hsl(220,20%,12%)] border-[hsl(220,20%,20%)] text-[hsl(220,14%,85%)] placeholder:text-[hsl(220,10%,35%)]" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-[hsl(220,20%,18%)]">
        <table className="w-full bg-[hsl(220,20%,12%)]">
          <thead>
            <tr className="border-b border-[hsl(220,20%,18%)] text-left">
              {["Destination", "Depth", "Language", "Words", "Price", "Status", "Date", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-[hsl(220,10%,40%)]">No guides found</td></tr>
            ) : (
              filtered.map(g => (
                <tr key={g.id} className="border-b border-[hsl(220,20%,16%)] last:border-0 hover:bg-[hsl(220,20%,14%)] transition-colors">
                  <td className="px-4 py-2.5 text-sm font-medium text-white">{g.destination}</td>
                  <td className="px-4 py-2.5"><Badge variant="outline" className="text-[10px] border-[hsl(220,20%,25%)] text-[hsl(220,10%,60%)] capitalize">{g.depth}</Badge></td>
                  <td className="px-4 py-2.5"><Badge variant="outline" className="text-[10px] border-[hsl(220,20%,25%)] text-[hsl(220,10%,60%)]">{g.language}</Badge></td>
                  <td className="px-4 py-2.5 text-sm text-[hsl(220,10%,60%)]">{g.word_count || "—"}</td>
                  <td className="px-4 py-2.5 text-sm font-medium text-white">€{(g.price_paid || 0).toFixed(2)}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      g.status === "completed" ? "bg-[hsl(142,71%,45%,0.15)] text-[hsl(142,71%,55%)]" : "bg-[hsl(38,92%,50%,0.15)] text-[hsl(38,92%,55%)]"
                    }`}>{g.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-[hsl(220,10%,50%)]">{new Date(g.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5">
                    {g.public_share_token && (
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-[hsl(220,10%,50%)] hover:text-white hover:bg-[hsl(220,20%,18%)]"
                        onClick={() => window.open(`/travel-guides/view/${g.id}?token=${g.public_share_token}`, "_blank")} title="View">
                        <Eye size={14} />
                      </Button>
                    )}
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

export default AdminGuides;
