import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONSULTANCY_PLANS } from "@/lib/consultancyPlans";
import { CONSULTANCY_CHECKOUT_STORAGE_KEY } from "@/lib/consultancyCheckoutStorage";

const TravelConsultancy = () => {
  const navigate = useNavigate();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [destination, setDestination] = useState<"Aruba" | "Canada" | "United Kingdom">("Aruba");
  const travelers = adults + children;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Travel Assistant</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          Book a real specialist who walks you through the paperwork and steps you need before you travel—visas, authorisations,
          forms, and deadlines—so nothing is left to guesswork. Pick how soon you need to be ready, then pay securely by card.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4 w-full">
        <h2 className="text-base font-semibold">Who is traveling</h2>
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Destination</span>
          <Select value={destination} onValueChange={(v: "Aruba" | "Canada" | "United Kingdom") => setDestination(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aruba">Aruba</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground min-w-16">Adults</span>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setAdults(Math.max(1, adults - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{adults}</span>
              <Button variant="outline" size="icon" onClick={() => setAdults(adults + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground min-w-16">Children</span>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setChildren(Math.max(0, children - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{children}</span>
              <Button variant="outline" size="icon" onClick={() => setChildren(children + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Pricing is multiplied by total travelers ({travelers}).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONSULTANCY_PLANS.map((plan) => (
          <Card key={plan.id} className="border-border">
            <CardContent className="p-5 space-y-3">
              <Badge variant="secondary">{plan.title}</Badge>
              <div className="text-sm text-muted-foreground">${plan.priceUsd} USD per traveler</div>
              <div className="text-2xl font-semibold">${plan.priceUsd * travelers} USD</div>
              <Button
                className="w-full"
                onClick={() => {
                  sessionStorage.setItem(
                    CONSULTANCY_CHECKOUT_STORAGE_KEY,
                    JSON.stringify({ plan: plan.id, adults, children, destination })
                  );
                  navigate("/dashboard/consultancy-payment");
                }}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TravelConsultancy;
