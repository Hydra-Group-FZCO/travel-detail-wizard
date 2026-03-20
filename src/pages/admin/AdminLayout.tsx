import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart3, Users, ShoppingCart, Wifi, MapPin, BookOpen,
  Ticket, Globe, Settings, Bell, LogOut, Home, ChevronLeft,
  ChevronRight, Shield, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const navSections = [
  {
    label: "Main",
    items: [
      { to: "/admin", icon: BarChart3, label: "Dashboard", end: true },
      { to: "/admin/users", icon: Users, label: "Users", end: false },
      { to: "/admin/orders", icon: ShoppingCart, label: "Orders & Revenue", end: false },
    ],
  },
  {
    label: "Products",
    items: [
      { to: "/admin/esims", icon: Wifi, label: "eSIMs", end: false },
      { to: "/admin/itineraries", icon: MapPin, label: "Itineraries", end: false },
      { to: "/admin/guides", icon: BookOpen, label: "Travel Guides", end: false },
      { to: "/admin/experiences", icon: Ticket, label: "Experiences", end: false },
      { to: "/admin/evisas", icon: Globe, label: "eVisas / ESTA", end: false },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/settings", icon: Settings, label: "Settings", end: false },
      { to: "/admin/notifications", icon: Bell, label: "Notifications", end: false },
    ],
  },
];

const allNavItems = navSections.flatMap(s => s.items);

const AdminLayout = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Breadcrumb
  const currentItem = allNavItems.find(item =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to) && item.to !== "/admin"
  ) || allNavItems[0];

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-[hsl(220,14%,90%)]">
      {/* Top Bar */}
      <header className="bg-[hsl(220,20%,10%)] border-b border-[hsl(220,20%,16%)] px-4 md:px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[hsl(45,98%,53%)]" />
            <span className="font-bold text-sm tracking-wide text-white">DMT Admin</span>
          </div>
          <span className="text-[hsl(220,10%,40%)] text-xs hidden md:block">/ {currentItem.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center relative">
            <Search size={14} className="absolute left-3 text-[hsl(220,10%,40%)]" />
            <Input
              placeholder="Search..."
              className="w-56 h-8 pl-9 text-xs bg-[hsl(210,35%,14%)] border-[hsl(210,30%,20%)] text-[hsl(210,25%,80%)] placeholder:text-[hsl(210,15%,35%)] focus:border-[hsl(207,94%,40%)]"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-[hsl(220,10%,50%)] hover:text-white hover:bg-[hsl(220,20%,14%)]"
            onClick={() => navigate("/admin/notifications")}
          >
            <Bell size={16} />
          </Button>
          <span className="text-xs text-[hsl(220,10%,50%)] hidden md:block">{profile?.full_name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-[hsl(220,10%,50%)] hover:text-white hover:bg-[hsl(220,20%,14%)] h-8 text-xs"
          >
            <LogOut size={14} className="mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Dark Sidebar */}
        <aside
          className={`${
            collapsed ? "w-16" : "w-60"
          } bg-[hsl(220,20%,10%)] border-r border-[hsl(220,20%,16%)] min-h-[calc(100vh-3.5rem)] hidden md:flex flex-col transition-all duration-200`}
        >
          <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
            {navSections.map(section => (
              <div key={section.label}>
                {!collapsed && (
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(220,10%,35%)] px-3 mb-2">
                    {section.label}
                  </div>
                )}
                <div className="space-y-0.5">
                  {section.items.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-[hsl(207,94%,29%,0.15)] text-[hsl(207,85%,50%)]"
                            : "text-[hsl(220,10%,55%)] hover:bg-[hsl(220,20%,14%)] hover:text-[hsl(220,14%,85%)]"
                        } ${collapsed ? "justify-center px-0" : ""}`
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon size={18} className="shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="p-3 border-t border-[hsl(220,20%,16%)] space-y-1">
            <a
              href="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[hsl(220,10%,55%)] hover:bg-[hsl(220,20%,14%)] hover:text-[hsl(220,14%,85%)] transition-colors ${
                collapsed ? "justify-center px-0" : ""
              }`}
              title={collapsed ? "Back to Website" : undefined}
            >
              <Home size={18} className="shrink-0" />
              {!collapsed && <span>Back to Website</span>}
            </a>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[hsl(220,10%,45%)] hover:bg-[hsl(220,20%,14%)] hover:text-[hsl(220,14%,85%)] transition-colors w-full ${
                collapsed ? "justify-center px-0" : ""
              }`}
            >
              {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} className="shrink-0" /><span>Collapse</span></>}
            </button>
          </div>
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[hsl(220,20%,10%)] border-t border-[hsl(220,20%,16%)] z-50 flex justify-around py-1.5 px-1">
          {[allNavItems[0], allNavItems[1], allNavItems[2], allNavItems[3], allNavItems[8]].map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium rounded-lg ${
                  isActive ? "text-[hsl(345,82%,65%)]" : "text-[hsl(220,10%,50%)]"
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label.split(" ")[0]}</span>
            </NavLink>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-auto min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
