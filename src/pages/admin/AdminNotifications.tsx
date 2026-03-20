import { Bell, ShoppingCart, UserPlus, AlertTriangle } from "lucide-react";

const mockNotifications = [
  { icon: ShoppingCart, text: "System ready – all product sections are live", time: "Just now", type: "info" },
  { icon: UserPlus, text: "Monitor new user registrations here", time: "–", type: "info" },
  { icon: AlertTriangle, text: "Payment failure alerts will appear here", time: "–", type: "warning" },
];

const AdminNotifications = () => {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Bell size={22} /> Notifications
      </h1>

      <div className="space-y-2">
        {mockNotifications.map((n, i) => (
          <div
            key={i}
            className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-4 flex items-start gap-3 hover:border-[hsl(220,20%,25%)] transition-colors"
          >
            <div className={`mt-0.5 p-2 rounded-lg ${
              n.type === "warning" ? "bg-[hsl(38,92%,50%,0.12)]" : "bg-[hsl(210,70%,55%,0.12)]"
            }`}>
              <n.icon size={16} className={
                n.type === "warning" ? "text-[hsl(38,92%,55%)]" : "text-[hsl(210,70%,60%)]"
              } />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[hsl(220,14%,85%)]">{n.text}</p>
              <p className="text-[10px] text-[hsl(220,10%,40%)] mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-6 text-center">
        <p className="text-sm text-[hsl(220,10%,45%)]">
          Real-time notifications will appear here as events occur across the platform.
        </p>
      </div>
    </div>
  );
};

export default AdminNotifications;
