import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { CalendarDays, User, Heart, FileText, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const navItems = [
  { to: "/dashboard", icon: CalendarDays, label: "My Bookings", end: true },
  { to: "/dashboard/profile", icon: User, label: "My Profile", end: false },
  { to: "/dashboard/wishlist", icon: Heart, label: "My Wishlist", end: false },
  { to: "/dashboard/orders", icon: FileText, label: "My Orders", end: false },
];

const DashboardLayout = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Top Bar */}
      <header className="bg-card border-b border-border px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2">
            <Logo />
          </a>
          <span className="text-muted-foreground text-sm ml-2 hidden md:block">/ Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden md:block">{profile?.full_name}</span>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut size={16} className="mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)] hidden md:block p-4">
          <nav className="space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 pt-4 border-t border-border">
            <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Home size={18} /> Back to Website
            </a>
          </div>
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 flex justify-around py-2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1 text-xs font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label.replace("My ", "")}</span>
            </NavLink>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
