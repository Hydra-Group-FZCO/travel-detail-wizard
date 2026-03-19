import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Wishlist = Tables<"wishlists">;

const MyWishlist = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    if (!user) return;
    const { data } = await supabase.from("wishlists").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [user]);

  const removeItem = async (id: string) => {
    await supabase.from("wishlists").delete().eq("id", id);
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success("Removed from wishlist");
  };

  if (loading) return <div className="text-muted-foreground">Loading wishlist...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Heart size={48} className="mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Your wishlist is empty. Save experiences you love!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">{item.experience_name}</h3>
                {item.destination && <p className="text-sm text-muted-foreground">{item.destination}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive">
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
