import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"bookings">;

const statusColor: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Refunded: "bg-yellow-100 text-yellow-800",
};

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("booking_date", { ascending: false })
      .then(({ data }) => {
        setBookings(data || []);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <div className="text-muted-foreground">Loading bookings...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <CalendarDays size={48} className="mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">No bookings yet. Start exploring experiences!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">{b.experience_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(b.booking_date).toLocaleDateString()} · {b.guests} guest{b.guests > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {b.total_amount && (
                  <span className="text-sm font-medium text-foreground">
                    {b.currency} {Number(b.total_amount).toFixed(2)}
                  </span>
                )}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[b.status] || ""}`}>
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
