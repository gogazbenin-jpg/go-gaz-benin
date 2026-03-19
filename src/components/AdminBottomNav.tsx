import { useLocation, useNavigate } from "react-router-dom";
import { Package, TrendingUp, LogOut } from "lucide-react";

const tabs = [
  { label: "Commandes", icon: Package, path: "/admin/dashboard" },
  { label: "Finances", icon: TrendingUp, path: "/admin/finances" },
];

const AdminBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("gogaz_admin");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[hsl(0,0%,90%)] px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1"
            >
              <tab.icon
                className="h-5 w-5"
                style={{ color: active ? "#FF6B00" : "hsl(0,0%,60%)" }}
              />
              <span
                className="text-[11px] font-semibold"
                style={{ color: active ? "#FF6B00" : "hsl(0,0%,60%)" }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
        <button onClick={logout} className="flex flex-col items-center gap-0.5 px-3 py-1">
          <LogOut className="h-5 w-5 text-[hsl(0,0%,60%)]" />
          <span className="text-[11px] font-semibold text-[hsl(0,0%,60%)]">Quitter</span>
        </button>
      </div>
    </div>
  );
};

export default AdminBottomNav;
