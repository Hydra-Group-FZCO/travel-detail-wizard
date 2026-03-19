import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

type Order = Tables<"orders">;

const MyOrders = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [user]);

  const downloadInvoice = (order: Order) => {
    // Generate a simple text invoice and download
    const content = `
INVOICE
=======
Invoice #: ${order.invoice_number}
Date: ${new Date(order.created_at).toLocaleDateString()}
Customer: ${profile?.full_name || "N/A"}

Amount: ${order.currency} ${Number(order.amount).toFixed(2)}
Status: ${order.status}

Digital Moonkey Travel
Company No. 15082705
    `.trim();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.invoice_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-muted-foreground">Loading orders...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <FileText size={48} className="mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">Invoice #{o.invoice_number}</h3>
                <p className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">{o.currency} {Number(o.amount).toFixed(2)}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  o.status === "Paid" ? "bg-green-100 text-green-800" :
                  o.status === "Refunded" ? "bg-yellow-100 text-yellow-800" : "bg-muted text-muted-foreground"
                }`}>{o.status}</span>
                <Button variant="outline" size="sm" onClick={() => downloadInvoice(o)}>
                  <Download size={14} className="mr-1" /> Invoice
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
