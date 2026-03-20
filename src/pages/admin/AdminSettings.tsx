import { Settings, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SecretField = ({ label, hint }: { label: string; hint: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Label className="text-[hsl(220,10%,60%)] text-xs">{label}</Label>
      <div className="relative mt-1">
        <Input
          type={show ? "text" : "password"}
          value="••••••••••••••••"
          readOnly
          className="bg-[hsl(220,20%,14%)] border-[hsl(220,20%,22%)] text-[hsl(220,14%,70%)] pr-10"
        />
        <button
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,45%)] hover:text-white"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      <p className="text-[10px] text-[hsl(220,10%,35%)] mt-1">{hint}</p>
    </div>
  );
};

const StatusDot = ({ ok, label }: { ok: boolean; label: string }) => (
  <div className="flex items-center gap-2 text-sm text-[hsl(220,10%,60%)]">
    <div className={`w-2.5 h-2.5 rounded-full ${ok ? "bg-[hsl(142,71%,45%)]" : "bg-[hsl(0,84%,60%)]"}`} />
    {label}
  </div>
);

const AdminSettings = () => {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Settings size={22} /> Settings
      </h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)]">
          <TabsTrigger value="general" className="data-[state=active]:bg-[hsl(220,20%,18%)] data-[state=active]:text-white text-[hsl(220,10%,50%)]">General</TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-[hsl(220,20%,18%)] data-[state=active]:text-white text-[hsl(220,10%,50%)]">Pricing</TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-[hsl(220,20%,18%)] data-[state=active]:text-white text-[hsl(220,10%,50%)]">API Keys</TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-[hsl(220,20%,18%)] data-[state=active]:text-white text-[hsl(220,10%,50%)]">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-6 space-y-4">
            <div>
              <Label className="text-[hsl(220,10%,60%)] text-xs">Site Name</Label>
              <Input defaultValue="Digital Moonkey Travel" className="mt-1 bg-[hsl(220,20%,14%)] border-[hsl(220,20%,22%)] text-white" />
            </div>
            <div>
              <Label className="text-[hsl(220,10%,60%)] text-xs">Contact Email</Label>
              <Input defaultValue="info@digitalmoonkey.travel" className="mt-1 bg-[hsl(220,20%,14%)] border-[hsl(220,20%,22%)] text-white" />
            </div>
            <div>
              <Label className="text-[hsl(220,10%,60%)] text-xs">Default Currency</Label>
              <Input defaultValue="EUR" className="mt-1 bg-[hsl(220,20%,14%)] border-[hsl(220,20%,22%)] text-white w-24" readOnly />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="mt-4">
          <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[hsl(220,10%,60%)] text-xs">eSIM Markup %</Label>
                <Input defaultValue="80" className="mt-1 bg-[hsl(220,20%,14%)] border-[hsl(220,20%,22%)] text-white w-24" />
              </div>
              <div>
                <Label className="text-[hsl(220,10%,60%)] text-xs">Itinerary Price (€)</Label>
                <Input defaultValue="15" className="mt-1 bg-[hsl(220,20%,14%)] border-[hsl(220,20%,22%)] text-white w-24" />
              </div>
              <div>
                <Label className="text-[hsl(220,10%,60%)] text-xs">Guide Essential (€)</Label>
                <Input defaultValue="9" className="mt-1 bg-[hsl(220,20%,14%)] border-[hsl(220,20%,22%)] text-white w-24" />
              </div>
              <div>
                <Label className="text-[hsl(220,10%,60%)] text-xs">Guide Complete (€)</Label>
                <Input defaultValue="15" className="mt-1 bg-[hsl(220,20%,14%)] border-[hsl(220,20%,22%)] text-white w-24" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api" className="mt-4">
          <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-6 space-y-4">
            <SecretField label="eSIM Access Code" hint="RT-AccessCode for eSIM Access API v1" />
            <SecretField label="eSIM Secret Key" hint="RT-SecretKey for eSIM Access API v1" />
            <SecretField label="Lovable AI Key" hint="AI model access key" />
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-6 space-y-3">
            <h3 className="text-sm font-semibold text-[hsl(220,10%,70%)] mb-3">Integration Status</h3>
            <StatusDot ok={true} label="eSIM Access API — Connected" />
            <StatusDot ok={true} label="Lovable AI — Connected" />
            <StatusDot ok={true} label="Travelpayouts — Script loaded" />
            <StatusDot ok={false} label="Stripe — Not configured" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
