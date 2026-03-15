import { useNavigate } from "react-router-dom";
import {
  Camera, User, MapPin, Bell, Package, Star, Award, Gift,
  Shield, HelpCircle, Info, LogOut, ChevronRight,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

const user = {
  firstName: "Koffi",
  lastName: "Mensah",
  phone: "+229 96 00 00 00",
  orders: 5,
  points: 250,
  level: "Bronze" as const,
};

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  detail?: string;
  onClick?: () => void;
}

const MenuItem = ({ icon: Icon, label, detail, onClick }: MenuItemProps) => (
  <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted/60">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
      <Icon size={18} style={{ color: "#FF6B00" }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
    </div>
    <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
  </button>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mx-4 mb-3">
    <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm divide-y divide-border">{children}</div>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const handleLogout = () => {
    localStorage.removeItem("gogaz_session");
    localStorage.removeItem("gogaz_user");
    navigate("/auth", { replace: true });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F5F5F5] pb-8">
        <div className="flex flex-col items-center px-6 pb-6 pt-12">
          <div className="relative mb-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white" style={{ backgroundColor: "#FF6B00" }}>
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full text-white shadow-md" style={{ backgroundColor: "#E65C00" }}>
              <Camera size={14} />
            </button>
          </div>
          <h1 className="text-xl font-bold text-foreground">{user.firstName} {user.lastName}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{user.phone}</p>
        </div>

        <div className="space-y-0">
          <SectionCard title="Mon compte">
            <MenuItem icon={User} label="Mes informations" />
            <MenuItem icon={MapPin} label="Mes adresses" />
            
          </SectionCard>

          <SectionCard title="Mes commandes">
            <MenuItem icon={Package} label="Historique commandes" detail={`${user.orders}`} />
            
          </SectionCard>


          <SectionCard title="Paramètres">
            <MenuItem icon={Shield} label="Sécurité" />
            <MenuItem icon={HelpCircle} label="Aide et support" />
            <MenuItem icon={Info} label="A propos de GoGaz" />
          </SectionCard>

          <div className="mx-4 mt-4">
            <button onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border py-3.5 shadow-sm active:opacity-80"
              style={{ borderColor: "#E74C3C", color: "#E74C3C" }}>
              <LogOut size={18} />
              <span className="text-sm font-semibold">Se déconnecter</span>
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
