import { useState, useEffect } from "react";
import { Wifi, QrCode, RefreshCw, ChevronDown, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type EsimOrder = {
  id: string;
  package_code: string;
  order_no: string | null;
  iccid: string | null;
  qr_code_url: string | null;
  activation_code: string | null;
  status: string;
  price_paid_eur: number;
  created_at: string;
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  expired: "bg-muted text-muted-foreground",
  "not_installed": "bg-blue-100 text-blue-800 border-blue-200",
};

const MyEsims = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<EsimOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("esim_orders")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">My eSIMs</h2>
        {[1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wifi size={24} className="text-primary" />
          My eSIMs
        </h2>
        <Button variant="outline" size="sm" onClick={loadOrders}>
          <RefreshCw size={14} className="mr-1" /> Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Smartphone size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No eSIMs yet</h3>
            <p className="text-muted-foreground mb-4">Browse our store to get your first eSIM</p>
            <Button asChild>
              <a href="/esims">Browse eSIMs</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{order.package_code}</CardTitle>
                  <Badge variant="outline" className={statusColors[order.status] || ""}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>${order.price_paid_eur.toFixed(2)} USD</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  {order.iccid && <span className="font-mono text-xs">ICCID: {order.iccid}</span>}
                </div>

                <div className="flex gap-2">
                  {order.qr_code_url && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <QrCode size={14} className="mr-1" /> Show QR Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>eSIM QR Code</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                          <img src={order.qr_code_url} alt="eSIM QR Code" className="w-64 h-64" />
                          {order.activation_code && (
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-1">Activation Code</p>
                              <code className="text-sm bg-muted px-3 py-1.5 rounded font-mono">
                                {order.activation_code}
                              </code>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {order.status === "active" && order.iccid && (
                    <Button variant="outline" size="sm">
                      <RefreshCw size={14} className="mr-1" /> Top Up
                    </Button>
                  )}
                </div>

                {/* Installation instructions */}
                <Accordion type="single" collapsible className="mt-2">
                  <AccordionItem value="instructions" className="border-none">
                    <AccordionTrigger className="text-sm py-2 hover:no-underline">
                      Installation Instructions
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">📱 iOS (iPhone)</h4>
                          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                            <li>Go to Settings → Cellular → Add eSIM</li>
                            <li>Tap "Use QR Code"</li>
                            <li>Scan the QR code above</li>
                            <li>Confirm the new plan and label it (e.g., "Travel")</li>
                            <li>Enable Data Roaming under Cellular Data Options</li>
                          </ol>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">🤖 Android</h4>
                          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                            <li>Go to Settings → Network & Internet → SIMs</li>
                            <li>Tap "+" or "Add eSIM"</li>
                            <li>Scan the QR code above</li>
                            <li>Follow the on-screen instructions</li>
                            <li>Enable Data Roaming in the SIM settings</li>
                          </ol>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEsims;
