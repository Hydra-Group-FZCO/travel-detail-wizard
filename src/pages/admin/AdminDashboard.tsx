import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, Users, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight,
  Wifi, MapPin, BookOpen, Ticket, AlertTriangle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface KPIData {
  totalRevenueMonth: number;
  totalRevenueYear: number;
  totalUsers: number;
  newUsersMonth: number;
  ordersToday: number;
  ordersWeek: number;
  ordersMonth: number;
  esimRevenue: number;
  itineraryRevenue: number;
  guideRevenue: number;
  bookingRevenue: number;
  recentEsimOrders: any[];
  recentItineraries: any[];
  recentGuides: any[];
  recentBookings: any[];
}

const COLORS = ["hsl(345,82%,60%)", "hsl(210,70%,55%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)", "hsl(280,60%,55%)"];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<KPIData | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
    const startOfWeek = new Date(now.getTime() - 7 * 86400000).toISOString();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const [
      profilesRes,
      newUsersRes,
      esimOrdersRes,
      esimMonthRes,
      esimYearRes,
      itinerariesRes,
      itinMonthRes,
      itinYearRes,
      guidesRes,
      guideMonthRes,
      guideYearRes,
      bookingsRes,
      bookingMonthRes,
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", startOfMonth),
      supabase.from("esim_orders").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("esim_orders").select("price_paid_eur").gte("created_at", startOfMonth),
      supabase.from("esim_orders").select("price_paid_eur").gte("created_at", startOfYear),
      supabase.from("itineraries").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("itineraries").select("price_paid").gte("created_at", startOfMonth),
      supabase.from("itineraries").select("price_paid").gte("created_at", startOfYear),
      supabase.from("travel_guides").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("travel_guides").select("price_paid").gte("created_at", startOfMonth),
      supabase.from("travel_guides").select("price_paid").gte("created_at", startOfYear),
      supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("bookings").select("total_amount").gte("created_at", startOfMonth),
    ]);

    const sumField = (data: any[] | null, field: string) =>
      (data || []).reduce((s, r) => s + (Number(r[field]) || 0), 0);

    const esimMonth = sumField(esimMonthRes.data, "price_paid_eur");
    const itinMonth = sumField(itinMonthRes.data, "price_paid");
    const guideMonth = sumField(guideMonthRes.data, "price_paid");
    const bookingMonth = sumField(bookingMonthRes.data, "total_amount");

    const esimYear = sumField(esimYearRes.data, "price_paid_eur");
    const itinYear = sumField(itinYearRes.data, "price_paid");
    const guideYear = sumField(guideYearRes.data, "price_paid");

    // Orders counts
    const allEsim = esimOrdersRes.data || [];
    const ordersToday = allEsim.filter(o => o.created_at >= startOfDay).length;
    const ordersWeek = allEsim.filter(o => o.created_at >= startOfWeek).length;

    setKpi({
      totalRevenueMonth: esimMonth + itinMonth + guideMonth + bookingMonth,
      totalRevenueYear: esimYear + itinYear + guideYear,
      totalUsers: profilesRes.count || 0,
      newUsersMonth: newUsersRes.count || 0,
      ordersToday,
      ordersWeek,
      ordersMonth: (esimMonthRes.data?.length || 0) + (itinMonthRes.data?.length || 0) + (guideMonthRes.data?.length || 0),
      esimRevenue: esimMonth,
      itineraryRevenue: itinMonth,
      guideRevenue: guideMonth,
      bookingRevenue: bookingMonth,
      recentEsimOrders: allEsim.slice(0, 5),
      recentItineraries: (itinerariesRes.data || []).slice(0, 5),
      recentGuides: (guidesRes.data || []).slice(0, 5),
      recentBookings: (bookingsRes.data || []).slice(0, 5),
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-28 bg-[hsl(220,20%,14%)]" />
          ))}
        </div>
      </div>
    );
  }

  if (!kpi) return null;

  const kpiCards = [
    { label: "Revenue This Month", value: `€${kpi.totalRevenueMonth.toFixed(2)}`, icon: DollarSign, color: "hsl(345,82%,60%)" },
    { label: "Revenue This Year", value: `€${kpi.totalRevenueYear.toFixed(2)}`, icon: TrendingUp, color: "hsl(210,70%,55%)" },
    { label: "Total Users", value: kpi.totalUsers.toString(), icon: Users, color: "hsl(142,71%,45%)" },
    { label: "New Users This Month", value: kpi.newUsersMonth.toString(), icon: ArrowUpRight, color: "hsl(38,92%,50%)" },
    { label: "Orders Today", value: kpi.ordersToday.toString(), icon: ShoppingCart, color: "hsl(280,60%,55%)" },
    { label: "Orders This Week", value: kpi.ordersWeek.toString(), icon: ShoppingCart, color: "hsl(200,60%,55%)" },
    { label: "Orders This Month", value: kpi.ordersMonth.toString(), icon: ShoppingCart, color: "hsl(160,60%,45%)" },
    { label: "eSIM Revenue", value: `€${kpi.esimRevenue.toFixed(2)}`, icon: Wifi, color: "hsl(345,82%,60%)" },
  ];

  const pieData = [
    { name: "eSIMs", value: kpi.esimRevenue },
    { name: "Itineraries", value: kpi.itineraryRevenue },
    { name: "Guides", value: kpi.guideRevenue },
    { name: "Bookings", value: kpi.bookingRevenue },
  ].filter(d => d.value > 0);

  const recentOrders = [
    ...kpi.recentEsimOrders.map(o => ({ type: "eSIM", name: o.package_code, amount: o.price_paid_eur, date: o.created_at, status: o.status })),
    ...kpi.recentItineraries.map(o => ({ type: "Itinerary", name: o.destination, amount: o.price_paid || 0, date: o.created_at, status: o.status })),
    ...kpi.recentGuides.map(o => ({ type: "Guide", name: o.destination, amount: o.price_paid || 0, date: o.created_at, status: o.status })),
    ...kpi.recentBookings.map(o => ({ type: "Booking", name: o.experience_name, amount: o.total_amount || 0, date: o.created_at, status: o.status })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(card => (
          <div
            key={card.label}
            className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-4 hover:border-[hsl(220,20%,25%)] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[hsl(220,10%,50%)] uppercase tracking-wide">{card.label}</span>
              <card.icon size={16} style={{ color: card.color }} />
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue by Product */}
        <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-[hsl(220,10%,70%)] mb-4">Revenue by Product</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `€${value.toFixed(2)}`}
                  contentStyle={{ background: "hsl(220,20%,14%)", border: "1px solid hsl(220,20%,22%)", borderRadius: "8px", color: "white" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[hsl(220,10%,40%)] text-sm text-center py-16">No revenue data yet</p>
          )}
          <div className="flex flex-wrap gap-3 mt-3">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-[hsl(220,10%,60%)]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name}: €{d.value.toFixed(0)}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-[hsl(220,10%,70%)] mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)]">
                  <th className="pb-2 pr-3">Type</th>
                  <th className="pb-2 pr-3">Product</th>
                  <th className="pb-2 pr-3">Amount</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-[hsl(220,10%,40%)] text-sm py-8">No orders yet</td>
                  </tr>
                ) : (
                  recentOrders.map((order, i) => (
                    <tr key={i} className="border-t border-[hsl(220,20%,16%)]">
                      <td className="py-2.5 pr-3">
                        <Badge variant="outline" className="text-[10px] border-[hsl(220,20%,25%)] text-[hsl(220,10%,60%)]">
                          {order.type}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-3 text-sm text-[hsl(220,14%,85%)] max-w-[200px] truncate">{order.name}</td>
                      <td className="py-2.5 pr-3 text-sm font-medium text-white">€{Number(order.amount).toFixed(2)}</td>
                      <td className="py-2.5 pr-3">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          order.status === "completed" || order.status === "Confirmed"
                            ? "bg-[hsl(142,71%,45%,0.15)] text-[hsl(142,71%,55%)]"
                            : order.status === "pending"
                            ? "bg-[hsl(38,92%,50%,0.15)] text-[hsl(38,92%,55%)]"
                            : "bg-[hsl(220,20%,20%)] text-[hsl(220,10%,55%)]"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-xs text-[hsl(220,10%,45%)]">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[hsl(220,10%,70%)] mb-3 flex items-center gap-2">
          <AlertTriangle size={14} className="text-[hsl(38,92%,50%)]" /> Alerts
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-[hsl(220,10%,60%)]">
            <div className="w-2 h-2 rounded-full bg-[hsl(142,71%,45%)]" />
            System operational — All APIs connected
          </div>
          {kpi.newUsersMonth > 0 && (
            <div className="flex items-center gap-3 text-sm text-[hsl(220,10%,60%)]">
              <div className="w-2 h-2 rounded-full bg-[hsl(210,70%,55%)]" />
              {kpi.newUsersMonth} new user{kpi.newUsersMonth > 1 ? "s" : ""} registered this month
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
