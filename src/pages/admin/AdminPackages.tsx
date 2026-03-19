import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Package = Tables<"packages">;

type EditablePackage = Omit<Partial<Package>, 'price'> & { price?: number | string | null };
const emptyPkg: EditablePackage = { title: "", description: "", destination: "", price: "", currency: "GBP", duration: "", image_url: "", is_active: true };

const AdminPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditablePackage | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPackages = async () => {
    const { data } = await supabase.from("packages").select("*").order("created_at", { ascending: false });
    setPackages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleSave = async () => {
    if (!editing?.title?.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      title: editing.title.trim(),
      description: editing.description || null,
      destination: editing.destination || null,
      price: editing.price ? Number(editing.price) : null,
      currency: editing.currency || "GBP",
      duration: editing.duration || null,
      image_url: editing.image_url || null,
      is_active: editing.is_active ?? true,
    };

    if (editing.id) {
      const { error } = await supabase.from("packages").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Package updated");
    } else {
      const { error } = await supabase.from("packages").insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Package created");
    }
    setEditing(null);
    setSaving(false);
    fetchPackages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    await supabase.from("packages").delete().eq("id", id);
    toast.success("Package deleted");
    fetchPackages();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Packages</h1>
        <Button onClick={() => setEditing(emptyPkg)}><Plus size={16} className="mr-1" /> New Package</Button>
      </div>

      {editing && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">{editing.id ? "Edit" : "New"} Package</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X size={18} /></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Title *</Label><Input value={editing.title || ""} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} /></div>
            <div><Label>Destination</Label><Input value={editing.destination || ""} onChange={e => setEditing(p => ({ ...p, destination: e.target.value }))} /></div>
            <div><Label>Price</Label><Input type="number" value={editing.price?.toString() || ""} onChange={e => setEditing(p => ({ ...p, price: e.target.value as any }))} /></div>
            <div><Label>Duration</Label><Input value={editing.duration || ""} onChange={e => setEditing(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 3 days" /></div>
            <div className="md:col-span-2"><Label>Description</Label><Textarea value={editing.description || ""} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} /></div>
            <div><Label>Image URL</Label><Input value={editing.image_url || ""} onChange={e => setEditing(p => ({ ...p, image_url: e.target.value }))} /></div>
            <div className="flex items-center gap-2 pt-6">
              <Switch checked={editing.is_active ?? true} onCheckedChange={v => setEditing(p => ({ ...p, is_active: v }))} />
              <Label>Active</Label>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Package"}</Button>
        </div>
      )}

      <div className="space-y-3">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{pkg.title}</h3>
                {!pkg.is_active && <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Inactive</span>}
              </div>
              <p className="text-sm text-muted-foreground">{pkg.destination} · {pkg.duration} · {pkg.currency} {pkg.price}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(pkg)}><Pencil size={14} className="mr-1" /> Edit</Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(pkg.id)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
            </div>
          </div>
        ))}
        {packages.length === 0 && <p className="text-muted-foreground text-center py-8">No packages yet.</p>}
      </div>
    </div>
  );
};

export default AdminPackages;
