import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Eye, Sparkles } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Guide = Tables<"travel_guides">;

const statusColor: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  generating: "bg-blue-100 text-blue-800",
  failed: "bg-red-100 text-red-800",
};

const depthLabel: Record<string, string> = {
  essential: "Essential",
  complete: "Complete",
  ultimate: "Ultimate",
};

const MyGuides = () => {
  const { user } = useAuth();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("travel_guides")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setGuides(data || []);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">My Travel Guides</h1>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Travel Guides</h1>
        <Link to="/travel-guides">
          <Button variant="cta" size="sm">
            <Sparkles className="w-4 h-4 mr-1.5" /> New Guide
          </Button>
        </Link>
      </div>

      {guides.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No guides yet</h3>
            <p className="text-muted-foreground mb-4">Generate your first AI travel guide</p>
            <Link to="/travel-guides">
              <Button variant="cta">Create Guide</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {guides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{guide.destination}</h3>
                      <Badge className={statusColor[guide.status] || "bg-muted text-muted-foreground"}>
                        {guide.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {depthLabel[guide.depth] || guide.depth}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {guide.season && guide.season !== "unknown" && (
                        <span className="capitalize">{guide.season}</span>
                      )}
                      {guide.word_count && guide.word_count > 0 && (
                        <span>{guide.word_count.toLocaleString()} words</span>
                      )}
                      <span>Language: {guide.language.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {new Date(guide.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {guide.status === "completed" && (
                    <Link to={`/travel-guides/view/${guide.id}`}>
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

export default MyGuides;
