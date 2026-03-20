import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface BookingRow {
  id: string;
  experience_name: string;
  booking_date: string;
  guests: number;
  status: string;
  total_amount: number | null;
  currency: string | null;
  user_id: string;
  created_at: string;
  profiles: { full_name: string; country: string | null } | null;
}

const statusColor: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Refunded: "bg-yellow-100 text-yellow-800",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*, profiles!bookings_user_id_fkey(full_name, country)")
      .order("created_at", { ascending: false }) as any;
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    toast.success(`Status changed to ${status}`);
  };

  const exportCSV = () => {
    const headers = ["ID", "Customer", "Experience", "Date", "Guests", "Status", "Amount", "Currency"];
    const rows = bookings.map(b => [
      b.id,
      b.profiles?.full_name || "N/A",
      b.experience_name,
      b.booking_date,
      b.guests,
      b.status,
      b.total_amount ?? "",
      b.currency ?? "",
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
        <Button variant="outline" onClick={exportCSV}><Download size={16} className="mr-1" /> Export CSV</Button>
      </div>

      {bookings.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-card rounded-xl border border-border">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Experience</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Guests</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Amount</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-sm text-foreground">{b.profiles?.full_name || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{b.experience_name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(b.booking_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{b.guests}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{b.total_amount ? `${b.currency} ${Number(b.total_amount).toFixed(2)}` : "–"}</td>
                  <td className="px-4 py-3">
                    <Select value={b.status} onValueChange={v => updateStatus(b.id, v)}>
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
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

export default AdminBookings;
