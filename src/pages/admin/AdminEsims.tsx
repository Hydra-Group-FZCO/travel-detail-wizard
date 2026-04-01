import { useState, useEffect } from "react";
import { Wifi, RefreshCw, Pencil, Save, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type CachedPackage = {
  id: string;
  package_code: string;
  name: string;
  price_wholesale: number;
  price_retail_eur: number;
  data_gb: number | null;
  duration_days: number | null;
  location_code: string | null;
};

type EsimOrder = {
  id: string;
  user_id: string;
  package_code: string;
  order_no: string | null;
  iccid: string | null;
  status: string;
  price_paid_eur: number;
  created_at: string;
};

const AdminEsims = () => {
  const { toast } = useToast();
  const [packages, setPackages] = useState<CachedPackage[]>([]);
  const [orders, setOrders] = useState<EsimOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [pkgRes, ordRes] = await Promise.all([
      supabase.from("esim_packages_cache").select("*").order("name"),
      supabase.from("esim_orders").select("*").order("created_at", { ascending: false }),
    ]);
    setPackages(pkgRes.data || []);
    setOrders(ordRes.data || []);
    setLoading(false);
  };

  const syncPackages = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("esim-packages", {
        body: { locationCode: "" },
      });
      if (error) throw error;
      toast({ title: "Sync complete", description: `${data?.count || 0} packages synced` });
      await loadData();
    } catch (e: any) {
      toast({ title: "Sync failed", description: e.message, variant: "destructive" });
    }
    setSyncing(false);
  };

  const savePrice = async (id: string) => {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) {
      toast({ title: "Invalid price", variant: "destructive" });
      return;
    }
    const { error } = await supabase
      .from("esim_packages_cache")
      .update({ price_retail_eur: price })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Price updated" });
      setEditingId(null);
      await loadData();
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.price_paid_eur, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wifi size={24} className="text-primary" /> eSIM Management
        </h2>
        <Button onClick={syncPackages} disabled={syncing} variant="outline" size="sm">
          <RefreshCw size={14} className={`mr-1 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync from API"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Packages</p>
            <p className="text-2xl font-bold">{packages.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Revenue (USD)</p>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="packages">
        <TabsList>
          <TabsTrigger value="packages">Packages & Pricing</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Wholesale</TableHead>
                      <TableHead>Retail (USD)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium text-sm">{pkg.name}</TableCell>
                        <TableCell>{pkg.location_code || "–"}</TableCell>
                        <TableCell>{pkg.data_gb ? `${pkg.data_gb} GB` : "–"}</TableCell>
                        <TableCell>{pkg.duration_days ? `${pkg.duration_days}d` : "–"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {(pkg.price_wholesale / 10000).toFixed(4)}
                        </TableCell>
                        <TableCell>
                          {editingId === pkg.id ? (
                            <Input
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-24 h-8"
                              type="number"
                              step="0.01"
                            />
                          ) : (
                            <span className="font-semibold">${pkg.price_retail_eur.toFixed(2)}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === pkg.id ? (
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => savePrice(pkg.id)}>
                                <Save size={14} />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingId(null)}>
                                <X size={14} />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => { setEditingId(pkg.id); setEditPrice(pkg.price_retail_eur.toString()); }}
                            >
                              <Pencil size={14} />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Order No</TableHead>
                      <TableHead>ICCID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No orders yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium text-sm">{order.package_code}</TableCell>
                          <TableCell className="font-mono text-xs">{order.order_no || "–"}</TableCell>
                          <TableCell className="font-mono text-xs">{order.iccid || "–"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.status}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">${order.price_paid_eur.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button size="icon" variant="ghost" className="h-7 w-7" title="Re-send QR by email">
                              <Mail size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEsims;
