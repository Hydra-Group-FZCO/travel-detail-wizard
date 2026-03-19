import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Users, Eye, Sparkles } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Itinerary = Tables<"itineraries">;

const statusColor: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  generating: "bg-blue-100 text-blue-800",
  failed: "bg-red-100 text-red-800",
};

const MyItineraries = () => {
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("itineraries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItineraries(data || []);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">My Itineraries</h1>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Itineraries</h1>
        <Link to="/itinerary-generator">
          <Button variant="cta" size="sm">
            <Sparkles className="w-4 h-4 mr-1.5" /> New Itinerary
          </Button>
        </Link>
      </div>

      {itineraries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No itineraries yet</h3>
            <p className="text-muted-foreground mb-4">Create your first AI-powered travel itinerary</p>
            <Link to="/itinerary-generator">
              <Button variant="cta">Create Itinerary</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {itineraries.map((it) => (
            <Card key={it.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{it.destination}</h3>
                      <Badge className={statusColor[it.status] || "bg-muted text-muted-foreground"}>
                        {it.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {it.start_date} → {it.end_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {it.num_days} days
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {it.travelers_adults} adults{it.travelers_children > 0 ? `, ${it.travelers_children} children` : ""}
                      </span>
                      <span className="capitalize">{it.trip_type} · {it.budget_level}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {new Date(it.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {it.status === "completed" && (
                    <Link to={`/itinerary/${it.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItineraries;
