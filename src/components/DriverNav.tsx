import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, Clock, User } from "lucide-react";

const tabs = [
  { id: "home", icon: Home, label: "Accueil", path: "/driver/home" },
  { id: "orders", icon: Package, label: "Commandes", path: "/driver/delivery" },
  { id: "history", icon: Clock, label: "Historique", path: "/driver/history" },
  { id: "profile", icon: User, label: "Profil", path: "/driver/profile" },
];

const DriverNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path + "/");
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1"
            >
              <tab.icon
                size={24}
                className={isActive ? "text-primary" : "text-muted-foreground"}
              />
              <span
                className={`text-[11px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default DriverNav;
